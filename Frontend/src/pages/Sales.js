import React, { useState, useEffect, useContext } from "react";
import AddSale from "../components/AddSale";
import AuthContext from "../AuthContext";
import styles from "./Sales.module.css";
import { MagneticButton } from "../components/MagneticButton";
import { motion } from "framer-motion";
import { TrendingUp, Plus, Trash2 } from "lucide-react";

function Sales() {
  const [showSaleModal, setShowSaleModal] = useState(false);
  const [sales, setAllSalesData] = useState([]);
  const [products, setAllProducts] = useState([]);
  const [stores, setAllStores] = useState([]);
  const [updatePage, setUpdatePage] = useState(true);

  const authContext = useContext(AuthContext);

  useEffect(() => {
    fetchSalesData();
    fetchProductsData();
    fetchStoresData();
  }, [updatePage]);

  const deleteSale = (id) => {
    if (!window.confirm("Are you sure? This will restore the stock level for this product.")) return;
    fetch(`http://localhost:4000/api/sales/delete/${id}`, { method: "DELETE" })
      .then(() => handlePageUpdate())
      .catch(console.error);
  };

  const fetchSalesData = () => {
    fetch(`http://localhost:4000/api/sales/get/${authContext.user}`)
      .then((r) => r.json())
      .then((d) => setAllSalesData(d))
      .catch(console.error);
  };

  const fetchProductsData = () => {
    fetch(`http://localhost:4000/api/product/get/${authContext.user}`)
      .then((r) => r.json())
      .then((d) => setAllProducts(d))
      .catch(console.error);
  };

  const fetchStoresData = () => {
    fetch(`http://localhost:4000/api/store/get/${authContext.user}`)
      .then((r) => r.json())
      .then((d) => setAllStores(d))
      .catch(console.error);
  };

  const addSaleModalSetting = () => setShowSaleModal((p) => !p);
  const handlePageUpdate = () => setUpdatePage((p) => !p);

  const rowVariants = {
    hidden: { opacity: 0, y: 6 },
    visible: (i) => ({
      opacity: 1, y: 0,
      transition: { delay: i * 0.04, duration: 0.3, ease: [0.4, 0, 0.2, 1] },
    }),
  };

  return (
    <div className={styles.container}>
      {showSaleModal && (
        <AddSale
          addSaleModalSetting={addSaleModalSetting}
          products={products}
          stores={stores}
          handlePageUpdate={handlePageUpdate}
          authContext={authContext}
        />
      )}

      {/* Page Header */}
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-end", flexWrap: "wrap", gap: "1rem" }}>
        <div>
          <p className="label-cap" style={{ marginBottom: "0.25rem" }}>Revenue</p>
          <h1 style={{ fontSize: "1.75rem", fontWeight: 800, color: "var(--on-surface)", letterSpacing: "-0.03em", margin: 0 }}>
            Sales Report
          </h1>
        </div>
        <MagneticButton variant="primary" size="sm" onClick={addSaleModalSetting}>
          <Plus size={14} strokeWidth={2} />
          Register Sale
        </MagneticButton>
      </div>

      <div className={styles.tableSection}>
        <div className={styles.tableHeader}>
          <h2 className={styles.tableTitle}>
            <TrendingUp size={18} strokeWidth={1.5} style={{ display: "inline", marginRight: 8, verticalAlign: "middle", color: "var(--secondary)" }} />
            Transaction History
          </h2>
          <span style={{ fontSize: "0.75rem", color: "var(--on-surface-variant)", background: "rgba(26,64,77,0.06)", padding: "4px 12px", borderRadius: 999 }}>
            {sales.length} records
          </span>
        </div>

        <div className={styles.tableWrapper}>
          <table className={styles.table}>
            <thead>
              <tr>
                <th>Product Name</th>
                <th>Store</th>
                <th>Stock Sold</th>
                <th>Sale Date</th>
                <th>Total Amount</th>
                <th style={{ textAlign: "right" }}>Actions</th>
              </tr>
            </thead>
            <tbody>
              {sales.map((element, i) => (
                <motion.tr
                  key={element._id}
                  custom={i}
                  initial="hidden"
                  animate="visible"
                  variants={rowVariants}
                >
                  <td style={{ fontWeight: 600 }}>{element.ProductID?.name || "Unknown Product"}</td>
                  <td>
                    <span className={styles.storeBadge}>
                      {element.StoreID?.name || "Global Store"}
                    </span>
                  </td>
                  <td>{element.StockSold} units</td>
                  <td className={styles.date}>{element.SaleDate}</td>
                  <td className={styles.amount}>+${element.TotalSaleAmount}</td>
                  <td style={{ textAlign: "right" }}>
                    <button 
                      onClick={() => deleteSale(element._id)}
                      style={{ 
                        padding: "6px", borderRadius: "8px", border: "none", background: "rgba(185,28,28,0.06)", 
                        color: "#b91c1c", cursor: "pointer", transition: "all 0.2s" 
                      }}
                      onMouseEnter={e => e.target.style.background = "rgba(185,28,28,0.12)"}
                      onMouseLeave={e => e.target.style.background = "rgba(185,28,28,0.06)"}
                    >
                      <Trash2 size={14} />
                    </button>
                  </td>
                </motion.tr>
              ))}
              {sales.length === 0 && (
                <tr>
                  <td colSpan={6} style={{ textAlign: "center", padding: "3rem", color: "var(--on-surface-variant)", opacity: 0.6 }}>
                    No sales records found.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

export default Sales;
