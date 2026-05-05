import pymongo
import json
from datetime import datetime

# ── Configuration ─────────────────────────────────────────────────────────────
MONGO_URI = "mongodb://localhost:27017/"
DB_NAME   = "Finrise"

# ── Static Demo Dataset (mirrors seed_data.json) ─────────────────────────────
STATIC_PRODUCTS = [
    {"_id": "p1", "name": "iPhone 15 Pro",        "stock": 60,  "manufacturer": "Apple"},
    {"_id": "p2", "name": "MacBook Pro M3",        "stock": 35,  "manufacturer": "Apple"},
    {"_id": "p3", "name": "Galaxy S24 Ultra",      "stock": 80,  "manufacturer": "Samsung"},
    {"_id": "p4", "name": "Sony WH-1000XM5",       "stock": 150, "manufacturer": "Sony"},
    {"_id": "p5", "name": "Logitech MX Master 3S", "stock": 200, "manufacturer": "Logitech"},
    {"_id": "p6", "name": "iPad Air",              "stock": 75,  "manufacturer": "Apple"},
    {"_id": "p7", "name": "Kindle Paperwhite",     "stock": 120, "manufacturer": "Amazon"},
    {"_id": "p8", "name": "Nintendo Switch OLED",  "stock": 55,  "manufacturer": "Nintendo"},
    {"_id": "p9", "name": "Keychron K2",           "stock": 180, "manufacturer": "Keychron"},
]
STATIC_SALES = [
    {"ProductID": "p1", "StockSold": 3,  "TotalSaleAmount": 3600,  "SaleDate": "2026-01-10"},
    {"ProductID": "p2", "StockSold": 3,  "TotalSaleAmount": 10500, "SaleDate": "2026-01-15"},
    {"ProductID": "p3", "StockSold": 7,  "TotalSaleAmount": 9100,  "SaleDate": "2026-02-08"},
    {"ProductID": "p4", "StockSold": 13, "TotalSaleAmount": 4550,  "SaleDate": "2026-02-14"},
    {"ProductID": "p5", "StockSold": 30, "TotalSaleAmount": 3000,  "SaleDate": "2026-03-01"},
    {"ProductID": "p6", "StockSold": 9,  "TotalSaleAmount": 5400,  "SaleDate": "2026-03-15"},
    {"ProductID": "p7", "StockSold": 8,  "TotalSaleAmount": 1120,  "SaleDate": "2026-04-01"},
    {"ProductID": "p8", "StockSold": 13, "TotalSaleAmount": 4550,  "SaleDate": "2026-04-10"},
    {"ProductID": "p9", "StockSold": 27, "TotalSaleAmount": 2700,  "SaleDate": "2026-04-23"},
]
STATIC_PURCHASES = [
    {"ProductID": "p1", "TotalPurchaseAmount": 1680},
    {"ProductID": "p2", "TotalPurchaseAmount": 5600},
    {"ProductID": "p3", "TotalPurchaseAmount": 10000},
    {"ProductID": "p4", "TotalPurchaseAmount": 46000},
    {"ProductID": "p5", "TotalPurchaseAmount": 21000},
    {"ProductID": "p6", "TotalPurchaseAmount": 45000},
    {"ProductID": "p7", "TotalPurchaseAmount": 15000},
    {"ProductID": "p8", "TotalPurchaseAmount": 24000},
    {"ProductID": "p9", "TotalPurchaseAmount": 17500},
]


class FineRiseBI:
    def __init__(self):
        try:
            client = pymongo.MongoClient(MONGO_URI, serverSelectionTimeoutMS=2000)
            db = client[DB_NAME]
            client.server_info()  # Force connection check
            self.products  = list(db.products.find())
            self.sales     = list(db.sales.find())
            self.purchases = list(db.purchases.find())
            if not self.products:
                raise ValueError("Empty DB")
            print("(+) Live MongoDB data loaded –", len(self.products), "products found.")
        except Exception as e:
            print(f"(!) MongoDB unavailable ({e}). Using static demo dataset.")
            self.products  = STATIC_PRODUCTS
            self.sales     = STATIC_SALES
            self.purchases = STATIC_PURCHASES

    # ── Helper ──────────────────────────────────────────────────────────────
    def _pid(self, doc):
        return str(doc.get("ProductID") or doc.get("_id"))

    # ── Metric Functions ────────────────────────────────────────────────────
    def calc_turnover(self):
        out = []
        for p in self.products:
            pid  = str(p["_id"])
            sold = sum(s["StockSold"] for s in self.sales if self._pid(s) == pid)
            avg  = (p["stock"] + p["stock"] + sold) / 2
            out.append({"name": p["name"], "turnover": round(sold / max(avg, 1), 2), "sold": sold})
        return out

    def calc_dio(self):
        return [{"name": r["name"], "days": round(365 / max(r["turnover"], 0.1))}
                for r in self.calc_turnover()]

    def calc_sales_velocity(self):
        return [{"name": r["name"], "velocity": round(r["sold"] / 4, 2)}
                for r in self.calc_turnover()]

    def calc_product_mix(self):
        total = sum(s["TotalSaleAmount"] for s in self.sales) or 1
        out = []
        for p in self.products:
            pid = str(p["_id"])
            rev = sum(s["TotalSaleAmount"] for s in self.sales if self._pid(s) == pid)
            out.append({"name": p["name"], "share": round(rev / total * 100, 1), "rev": rev})
        return sorted(out, key=lambda x: x["rev"], reverse=True)

    def calc_profit_margins(self):
        out = []
        for p in self.products:
            pid     = str(p["_id"])
            revenue = sum(s["TotalSaleAmount"] for s in self.sales if self._pid(s) == pid)
            cost    = sum(s["TotalPurchaseAmount"] for s in self.purchases if self._pid(s) == pid)
            margin  = round((revenue - cost) / max(revenue, 1) * 100, 1)
            out.append({"name": p["name"], "margin": margin})
        return out

    def calc_carrying_cost(self, rate_per_unit=2):
        return [{"name": p["name"], "cost": p["stock"] * rate_per_unit} for p in self.products]

    def calc_stockout_risk(self):
        out = []
        for p in self.products:
            if p["stock"] == 0:   status = "CRITICAL"
            elif p["stock"] < 20: status = "WARNING"
            else:                 status = "HEALTHY"
            out.append({"name": p["name"], "stock": p["stock"], "status": status})
        return out

    def calc_valuation(self):
        rev_per_unit = {}
        for p in self.products:
            pid  = str(p["_id"])
            sold = sum(s["StockSold"] for s in self.sales if self._pid(s) == pid) or 1
            rev  = sum(s["TotalSaleAmount"] for s in self.sales if self._pid(s) == pid)
            rev_per_unit[pid] = rev / sold
        return sum(p["stock"] * rev_per_unit.get(str(p["_id"]), 100) for p in self.products)

    def calc_monthly_sales(self):
        monthly = [0] * 12
        for s in self.sales:
            try:
                month = int(s["SaleDate"].split("-")[1]) - 1
                monthly[month] += s["TotalSaleAmount"]
            except:
                pass
        return monthly

    # ── Plot Functions ───────────────────────────────────────────────────────
    def plot_bestsellers(self):
        try:
            import matplotlib.pyplot as plt
            data = sorted(self.calc_turnover(), key=lambda x: x["sold"], reverse=True)[:7]
            names  = [d["name"] for d in data]
            values = [d["sold"] for d in data]
            colors = ["#1a404d","#335765","#336763","#b7ede8","#56321d","#4e8098","#2d6a6a"][:len(names)]
            fig, ax = plt.subplots(figsize=(10, 5))
            bars = ax.barh(names[::-1], values[::-1], color=colors[::-1], edgecolor="none", height=0.6)
            for bar, val in zip(bars, values[::-1]):
                ax.text(bar.get_width() + 0.3, bar.get_y() + bar.get_height()/2,
                        f"{val} units", va="center", fontsize=9, color="#333")
            ax.set_title("Bestselling Products by Units Sold", fontsize=14, fontweight="bold", pad=12)
            ax.set_xlabel("Units Sold")
            ax.spines[["top","right","left"]].set_visible(False)
            ax.tick_params(left=False)
            plt.tight_layout()
            plt.show()
        except ImportError:
            print("Install matplotlib: pip install matplotlib")

    def plot_revenue_mix(self):
        try:
            import matplotlib.pyplot as plt
            data   = self.calc_product_mix()[:6]
            labels = [d["name"] for d in data]
            sizes  = [d["rev"] for d in data]
            colors = ["#1a404d","#335765","#336763","#b7ede8","#56321d","#ffdbca"]
            fig, ax = plt.subplots(figsize=(8, 7))
            wedges, texts, autotexts = ax.pie(
                sizes, labels=None, autopct="%1.1f%%",
                colors=colors[:len(labels)], startangle=140,
                wedgeprops={"edgecolor": "white", "linewidth": 2}
            )
            ax.legend(wedges, labels, loc="lower center", ncol=2, fontsize=9, frameon=False)
            ax.set_title("Revenue Contribution by Product", fontsize=14, fontweight="bold")
            plt.tight_layout()
            plt.show()
        except ImportError:
            print("Install matplotlib: pip install matplotlib")

    def plot_monthly_sales(self):
        try:
            import matplotlib.pyplot as plt
            months = ["Jan","Feb","Mar","Apr","May","Jun","Jul","Aug","Sep","Oct","Nov","Dec"]
            values = self.calc_monthly_sales()
            fig, ax = plt.subplots(figsize=(11, 5))
            ax.fill_between(months, values, alpha=0.15, color="#336763")
            ax.plot(months, values, marker="o", color="#1a404d", linewidth=2.5, markersize=7)
            for i, v in enumerate(values):
                if v > 0:
                    ax.annotate(f"${v:,}", (months[i], v), textcoords="offset points",
                                xytext=(0, 8), ha="center", fontsize=8)
            ax.set_title("Monthly Sales Performance", fontsize=14, fontweight="bold", pad=12)
            ax.set_ylabel("Revenue ($)")
            ax.spines[["top","right"]].set_visible(False)
            ax.grid(axis="y", alpha=0.3, linestyle="--")
            plt.tight_layout()
            plt.show()
        except ImportError:
            print("Install matplotlib: pip install matplotlib")

    def plot_turnover_dio(self):
        try:
            import matplotlib.pyplot as plt
            import numpy as np
            data  = self.calc_turnover()[:7]
            names = [d["name"] for d in data]
            turns = [d["turnover"] for d in data]
            dio   = [round(365 / max(t, 0.1)) for t in turns]
            x   = np.arange(len(names))
            w   = 0.38
            fig, ax = plt.subplots(figsize=(11, 5))
            ax.bar(x - w/2, turns, w, label="Turnover Rate (×)", color="#1a404d", edgecolor="none")
            ax.bar(x + w/2, [d/30 for d in dio], w, label="DIO (months)", color="#336763", edgecolor="none")
            ax.set_xticks(x)
            ax.set_xticklabels(names, rotation=25, ha="right", fontsize=9)
            ax.set_title("Inventory Turnover vs DIO", fontsize=14, fontweight="bold")
            ax.legend(fontsize=9)
            ax.spines[["top","right"]].set_visible(False)
            plt.tight_layout()
            plt.show()
        except ImportError:
            print("Install matplotlib: pip install matplotlib")

    def plot_scatter_correlation(self):
        try:
            import matplotlib.pyplot as plt
            turns  = self.calc_turnover()
            margins = self.calc_profit_margins()
            
            x = [d["turnover"] for d in turns]
            y = [next(m["margin"] for m in margins if m["name"] == d["name"]) for d in turns]
            names = [d["name"] for d in turns]

            fig, ax = plt.subplots(figsize=(10, 6))
            scatter = ax.scatter(x, y, s=100, alpha=0.6, c="#1a404d", edgecolors="#fff", linewidth=1.5)
            
            for i, txt in enumerate(names):
                ax.annotate(txt, (x[i], y[i]), xytext=(5, 5), textcoords="offset points", fontsize=8)

            ax.set_title("Correlation: Turnover vs. Profit Margin", fontsize=14, fontweight="bold")
            ax.set_xlabel("Turnover Rate (x)")
            ax.set_ylabel("Profit Margin (%)")
            ax.grid(True, alpha=0.2)
            plt.tight_layout()
            plt.show()
        except ImportError:
            print("Install matplotlib: pip install matplotlib")

    def plot_3d_performance(self):
        try:
            import matplotlib.pyplot as plt
            from mpl_toolkits.mplot3d import Axes3D
            
            turns = self.calc_turnover()
            margins = self.calc_profit_margins()
            stock = self.calc_stockout_risk()
            
            x = [d["turnover"] for d in turns]
            y = [next(m["margin"] for m in margins if m["name"] == d["name"]) for d in turns]
            z = [next(s["stock"] for s in stock if s["name"] == d["name"]) for d in turns]
            names = [d["name"] for d in turns]

            fig = plt.figure(figsize=(12, 8))
            ax = fig.add_subplot(111, projection='3d')
            
            # Color by stock level (risk)
            colors = ["#b91c1c" if val < 20 else "#1a404d" for val in z]
            
            ax.scatter(x, y, z, s=120, c=colors, alpha=0.7, edgecolors="#fff")
            
            for i, txt in enumerate(names):
                ax.text(x[i], y[i], z[i], txt, fontsize=8)

            ax.set_title("3D Performance: Turnover vs. Margin vs. Stock Level", fontsize=14, fontweight="bold")
            ax.set_xlabel("Turnover Rate")
            ax.set_ylabel("Margin (%)")
            ax.set_zlabel("Stock Units")
            plt.tight_layout()
            plt.show()
        except ImportError:
            print("Install matplotlib/mpl_toolkits")

    # ── Menu ────────────────────────────────────────────────────────────────
    def menu(self):
        print("\n" + "="*62)
        print("   FINERISE INVENTORY INTELLIGENCE  2026")
        print("="*62)
        print("  DATA ANALYSIS")
        print("  1.  Inventory Turnover Ratio")
        print("  2.  Days Inventory Outstanding (DIO)")
        print("  3.  Sales Velocity (units/week)")
        print("  4.  Product Mix Concentration")
        print("  5.  Profit Margin Analysis")
        print("  6.  Carrying Cost Estimation")
        print("  7.  Stockout Risk Assessment")
        print("  8.  Total Inventory Valuation")
        print("  9.  Monthly Sales Breakdown")
        print("-"*62)
        print("  GRAPH PLOTS (requires matplotlib)")
        print("  10. Plot – Bestselling Products (Bar)")
        print("  11. Plot – Revenue Mix (Pie / Donut)")
        print("  12. Plot – Monthly Sales (Area Line)")
        print("  13. Plot – Turnover vs DIO (Grouped Bar)")
        print("  14. Plot – Run ALL basic graphs")
        print("  16. Plot – Turnover/Margin Scatter")
        print("  17. Plot – 3D Performance Matrix")
        print("-"*62)
        print("  15. Full Intelligence Report (all text)")
        print("  0.  Exit")
        print("="*62)

    def run_report(self):
        print("\n" + "="*62)
        print("   FULL INTELLIGENCE REPORT")
        print("="*62)

        print("\n[1] Turnover Ratio (target > 4×)")
        for r in self.calc_turnover(): print(f"  {r['name']:<26}: {r['turnover']}×")

        print("\n[2] Days Inventory Outstanding")
        for r in self.calc_dio():      print(f"  {r['name']:<26}: {r['days']} days")

        print("\n[3] Sales Velocity (units/week)")
        for r in self.calc_sales_velocity(): print(f"  {r['name']:<26}: {r['velocity']}")

        print("\n[4] Product Mix (% of revenue)")
        for r in self.calc_product_mix(): print(f"  {r['name']:<26}: {r['share']}%")

        print("\n[5] Profit Margins")
        for r in self.calc_profit_margins(): print(f"  {r['name']:<26}: {r['margin']}%")

        print("\n[6] Carrying Costs ($2/unit/yr)")
        for r in self.calc_carrying_cost(): print(f"  {r['name']:<26}: ${r['cost']}")

        print("\n[7] Stockout Risk")
        for r in self.calc_stockout_risk(): print(f"  {r['name']:<26}: {r['stock']} units [{r['status']}]")

        print(f"\n[8] Total Inventory Valuation: ${self.calc_valuation():,.2f}")

        print("\n[9] Monthly Sales ($)")
        months = ["Jan","Feb","Mar","Apr","May","Jun","Jul","Aug","Sep","Oct","Nov","Dec"]
        for m, v in zip(months, self.calc_monthly_sales()):
            if v > 0: print(f"  {m}: ${v:,}")
        print("="*62)

    def run(self):
        while True:
            self.menu()
            try:
                choice = int(input("\nENTER YOUR CHOICE: ").strip())
            except ValueError:
                print("--- INVALID CHOICE ---"); continue

            match choice:
                case 1:  [print(f"  {r['name']:<26}: {r['turnover']}×") for r in self.calc_turnover()]
                case 2:  [print(f"  {r['name']:<26}: {r['days']} days") for r in self.calc_dio()]
                case 3:  [print(f"  {r['name']:<26}: {r['velocity']} u/wk") for r in self.calc_sales_velocity()]
                case 4:  [print(f"  {r['name']:<26}: {r['share']}%") for r in self.calc_product_mix()]
                case 5:  [print(f"  {r['name']:<26}: {r['margin']}%") for r in self.calc_profit_margins()]
                case 6:  [print(f"  {r['name']:<26}: ${r['cost']}") for r in self.calc_carrying_cost()]
                case 7:  [print(f"  {r['name']:<26}: {r['stock']} [{r['status']}]") for r in self.calc_stockout_risk()]
                case 8:  print(f"  Total Valuation: ${self.calc_valuation():,.2f}")
                case 9:
                    months = ["Jan","Feb","Mar","Apr","May","Jun","Jul","Aug","Sep","Oct","Nov","Dec"]
                    [print(f"  {m}: ${v:,}") for m, v in zip(months, self.calc_monthly_sales()) if v > 0]
                case 10: self.plot_bestsellers()
                case 11: self.plot_revenue_mix()
                case 12: self.plot_monthly_sales()
                case 13: self.plot_turnover_dio()
                case 14:
                    self.plot_bestsellers()
                    self.plot_revenue_mix()
                    self.plot_monthly_sales()
                    self.plot_turnover_dio()
                case 16: self.plot_scatter_correlation()
                case 17: self.plot_3d_performance()
                case 15: self.run_report()
                case 0:  print("Exiting FineRise BI..."); break
                case _:  print("--- INVALID CHOICE ---")


if __name__ == "__main__":
    bi = FineRiseBI()
    bi.run()
