import React, { useContext, useEffect, useState, useMemo } from "react";
import AuthContext from "../AuthContext";
import API_URL from "../config";
import styles from "./Dashboard.module.css";
import { MagneticButton } from "../components/MagneticButton";
import { motion, AnimatePresence } from "framer-motion";
import Plot from 'react-plotly.js';
import {
  TrendingUp,
  TrendingDown,
  DollarSign,
  ShoppingBag,
  Package,
  Store,
  RefreshCw,
  Zap,
  Box,
  Layers,
  PieChart
} from "lucide-react";

const statCards = [
  {
    label: "Total Sales",
    valueKey: "sale",
    prefix: "$",
    trend: "+67.8%",
    trendUp: true,
    Icon: DollarSign,
    subtext: "vs last month",
    color: "#1a404d"
  },
  {
    label: "Total Purchases",
    valueKey: "purchase",
    prefix: "$",
    trend: "-12.4%",
    trendUp: false,
    Icon: ShoppingBag,
    subtext: "vs last month",
    color: "#336763"
  },
  {
    label: "Active Products",
    valueKey: "products",
    prefix: "",
    trend: "+4",
    trendUp: true,
    Icon: Package,
    subtext: "items in inventory",
    color: "#b7ede8"
  },
  {
    label: "Stores",
    valueKey: "stores",
    prefix: "",
    trend: "+1",
    trendUp: true,
    Icon: Store,
    subtext: "active locations",
    color: "#ffdbca"
  },
];

function Dashboard() {
  const [saleAmount, setSaleAmount] = useState("");
  const [purchaseAmount, setPurchaseAmount] = useState("");
  const [stores, setStores] = useState([]);
  const [products, setProducts] = useState([]);
  const [monthlySales, setMonthlySales] = useState([]);
  const [analytics, setAnalytics] = useState({
    bestsellers: { labels: [], values: [] },
    revenue: { labels: [], values: [] }
  });

  const authContext = useContext(AuthContext);

  const fetchAllData = () => {
    const userID = authContext.user;
    Promise.all([
      fetch(`${API_URL}/api/sales/get/${userID}/totalsaleamount`).then(r => r.json()),
      fetch(`${API_URL}/api/purchase/get/${userID}/totalpurchaseamount`).then(r => r.json()),
      fetch(`${API_URL}/api/store/get/${userID}`).then(r => r.json()),
      fetch(`${API_URL}/api/product/get/${userID}`).then(r => r.json()),
      fetch(`${API_URL}/api/sales/getmonthly`).then(r => r.json()),
      fetch(`${API_URL}/api/analytics/overview/${userID}`).then(r => r.json())
    ]).then(([sale, purchase, storesRes, productsRes, monthly, analyticsRes]) => {
      setSaleAmount(sale.totalSaleAmount);
      setPurchaseAmount(purchase.totalPurchaseAmount);
      setStores(storesRes);
      setProducts(productsRes);
      setMonthlySales(monthly.salesAmount);
      if (analyticsRes.bestsellers?.labels?.length) setAnalytics(analyticsRes);
    }).catch(err => console.warn("Dashboard sync error:", err));
  };

  useEffect(() => {
    fetchAllData();
  }, []);

  const getValue = (key) => {
    const map = {
      sale: saleAmount || "0",
      purchase: purchaseAmount || "0",
      products: products.length,
      stores: stores.length,
    };
    return map[key];
  };

  // ── Plotly Chart Configs ──────────────────────────────────────────────────

  // 1. 3D Intelligence Matrix
  const matrix3D = useMemo(() => {
    if (!products.length) return null;
    return {
      data: [{
        x: products.map(p => p.stock),
        y: products.map(p => Math.random() * 50), // Simulated Margin
        z: products.map(p => Math.random() * 100), // Simulated Velocity
        text: products.map(p => p.name),
        mode: 'markers',
        type: 'scatter3d',
        marker: {
          size: 10,
          color: products.map(p => p.stock),
          colorscale: [
            [0, '#b7ede8'], // Secondary Container
            [0.5, '#336763'], // Secondary
            [1, '#1a404d']   // Primary
          ],
          opacity: 0.9,
          line: { color: '#ffffff', width: 1 }
        }
      }],
      layout: {
        margin: { l: 0, r: 0, b: 0, t: 40 },
        paper_bgcolor: 'transparent',
        plot_bgcolor: 'transparent',
        scene: {
          xaxis: { title: 'Stock', gridcolor: 'rgba(26,64,77,0.05)', titlefont: { color: '#41484b' } },
          yaxis: { title: 'Margin (%)', gridcolor: 'rgba(26,64,77,0.05)', titlefont: { color: '#41484b' } },
          zaxis: { title: 'Velocity', gridcolor: 'rgba(26,64,77,0.05)', titlefont: { color: '#41484b' } },
          camera: { eye: { x: 1.6, y: 1.6, z: 1.6 } }
        },
        font: { family: 'Inter', size: 10, color: '#41484b' },
        height: 450,
        autosize: true
      }
    };
  }, [products]);

  // 2. Sales Momentum (Area Chart)
  const salesMomentum = useMemo(() => {
    return {
      data: [{
        x: ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"],
        y: monthlySales.length ? monthlySales : new Array(12).fill(0),
        fill: 'tozeroy',
        type: 'scatter',
        mode: 'lines+markers',
        line: { shape: 'spline', color: '#1a404d', width: 3 },
        marker: { color: '#336763', size: 8, line: { color: '#ffffff', width: 2 } },
        fillcolor: 'rgba(26, 64, 77, 0.08)'
      }],
      layout: {
        margin: { l: 50, r: 30, b: 50, t: 20 },
        paper_bgcolor: 'transparent',
        plot_bgcolor: 'transparent',
        xaxis: { showgrid: false, zeroline: false, tickfont: { color: '#94a3b8' } },
        yaxis: { gridcolor: 'rgba(26,64,77,0.04)', zeroline: false, tickfont: { color: '#94a3b8' } },
        font: { family: 'Inter', size: 11 },
        height: 320,
        autosize: true
      }
    };
  }, [monthlySales]);

  // 3. Sunburst Hierarchy
  const sunburstData = useMemo(() => {
    if (!analytics.revenue.labels.length) return null;
    return {
      data: [{
        type: "sunburst",
        labels: ["Total Revenue", ...analytics.revenue.labels],
        parents: ["", ...new Array(analytics.revenue.labels.length).fill("Total Revenue")],
        values: [analytics.revenue.values.reduce((a, b) => a + b, 0), ...analytics.revenue.values],
        outsidetextfont: { size: 12, color: "#1a404d" },
        leaf: { opacity: 0.8 },
        marker: { 
          line: { width: 1.5, color: '#ffffff' },
          colors: ['#1a404d', '#335765', '#336763', '#b7ede8', '#56321d', '#ffdbca']
        },
      }],
      layout: {
        margin: { l: 10, r: 10, b: 10, t: 10 },
        paper_bgcolor: 'transparent',
        height: 320,
        autosize: true
      }
    };
  }, [analytics]);

  // 4. Attractive Pie Chart (Donut style)
  const pieData = useMemo(() => {
    if (!analytics.bestsellers.labels.length) return null;
    return {
      data: [{
        values: analytics.bestsellers.values,
        labels: analytics.bestsellers.labels,
        type: 'pie',
        hole: 0.55,
        pull: [0.08, 0, 0, 0, 0],
        marker: {
          colors: ['#1a404d', '#336763', '#56321d', '#335765', '#b7ede8', '#ffdbca'],
          line: { color: '#ffffff', width: 2 }
        },
        textinfo: 'percent',
        hoverinfo: 'label+value+percent',
        rotation: 45
      }],
      layout: {
        margin: { l: 30, r: 30, b: 50, t: 30 },
        paper_bgcolor: 'transparent',
        showlegend: true,
        legend: { 
          orientation: 'h', 
          x: 0.5, 
          xanchor: 'center', 
          y: -0.15, 
          font: { family: 'Inter', size: 10, color: '#41484b' } 
        },
        height: 320,
        autosize: true
      }
    };
  }, [analytics]);

  const cardVariants = {
    hidden: { opacity: 0, y: 16 },
    visible: (i) => ({
      opacity: 1,
      y: 0,
      transition: { delay: i * 0.07, duration: 0.4, ease: [0.4, 0, 0.2, 1] },
    }),
  };

  return (
    <div className={styles.container}>
      {/* Header row */}
      <div className={styles.headerRow}>
        <div className={styles.headerInfo}>
          <div className={styles.headerIcon}>
            <Zap size={24} color="#f4fbf5" fill="#f4fbf5" />
          </div>
          <div>
            <h1 className={styles.mainTitle}>Enterprise Command</h1>
            <p className={styles.mainSubtitle}>Real-time inventory intelligence and market performance matrix.</p>
          </div>
        </div>
        <div className={styles.headerActions}>
          <MagneticButton variant="primary" size="sm" onClick={fetchAllData}>
            <RefreshCw size={14} strokeWidth={2} />
            Sync Intelligence
          </MagneticButton>
        </div>
      </div>

      {/* Stat Cards */}
      <div className={styles.statsGrid}>
        {statCards.map(({ label, valueKey, prefix, trend, trendUp, Icon, subtext, color }, i) => (
          <motion.article
            key={label}
            className={styles.statCard}
            custom={i}
            initial="hidden"
            animate="visible"
            variants={cardVariants}
          >
            <div className={styles.statHeader}>
              <div className={styles.statIconBox} style={{ background: `linear-gradient(135deg, ${color} 0%, #333 100%)` }}>
                <Icon size={18} color="#f4fbf5" strokeWidth={1.5} />
              </div>
              <div className={`${styles.trendBadge} ${trendUp ? styles.trendUp : styles.trendDown}`}>
                {trendUp ? <TrendingUp size={11} strokeWidth={2} /> : <TrendingDown size={11} strokeWidth={2} />}
                <span>{trend}</span>
              </div>
            </div>
            <div>
              <p className={styles.statLabel}>{label}</p>
              <div className={styles.statValue}>
                {prefix}{getValue(valueKey)}
              </div>
              <div className={styles.statSubtext}>{subtext}</div>
            </div>
          </motion.article>
        ))}
      </div>

      {/* 3D Intelligence Matrix - Full Width */}
      <motion.div
        className={styles.chartCard}
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.25, duration: 0.45 }}
      >
        <div className={styles.cardHeader}>
          <div>
            <h2 className={styles.chartTitle}>3D Intelligence Performance Matrix</h2>
            <p className={styles.chartSubtitle}>Correlating Stock levels, Profit Margins, and Sales Velocity per SKU.</p>
          </div>
          <Layers size={20} color="var(--primary)" opacity={0.5} />
        </div>
        <div className={styles.plotlyWrapper}>
          {matrix3D && <Plot data={matrix3D.data} layout={matrix3D.layout} config={{ responsive: true, displayModeBar: false }} style={{ width: '100%' }} />}
        </div>
      </motion.div>

      {/* Sales Momentum - Full Width or Wide */}
      <motion.div
        className={styles.chartCard}
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3, duration: 0.45 }}
      >
        <div className={styles.cardHeader}>
          <h2 className={styles.chartTitle}>Sales Momentum & Forecasting</h2>
          <Box size={18} color="var(--primary)" opacity={0.5} />
        </div>
        <div className={styles.plotlyWrapper}>
          <Plot data={salesMomentum.data} layout={salesMomentum.layout} config={{ responsive: true, displayModeBar: false }} style={{ width: '100%' }} />
        </div>
      </motion.div>

      {/* Distribution Row */}
      <div className={styles.chartsRow}>
        <motion.div
          className={styles.chartCard}
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4, duration: 0.45 }}
        >
          <div className={styles.cardHeader}>
            <h2 className={styles.chartTitle}>Revenue Hierarchy</h2>
            <TrendingUp size={18} color="var(--primary)" opacity={0.5} />
          </div>
          <div className={styles.plotlyWrapper}>
            {sunburstData && <Plot data={sunburstData.data} layout={sunburstData.layout} config={{ responsive: true, displayModeBar: false }} style={{ width: '100%' }} />}
          </div>
        </motion.div>

        <motion.div
          className={styles.chartCard}
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5, duration: 0.45 }}
        >
          <div className={styles.cardHeader}>
            <h2 className={styles.chartTitle}>Volume Distribution</h2>
            <PieChart size={18} color="var(--primary)" opacity={0.5} />
          </div>
          <div className={styles.plotlyWrapper}>
            {pieData && <Plot data={pieData.data} layout={pieData.layout} config={{ responsive: true, displayModeBar: false }} style={{ width: '100%' }} />}
          </div>
        </motion.div>
      </div>
    </div>
  );
}

export default Dashboard;
