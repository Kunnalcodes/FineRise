import React, { useState, useEffect, useContext } from "react";
import AddPurchaseDetails from "../components/AddPurchaseDetails";
import API_URL from "../config";
import AuthContext from "../AuthContext";
import styles from "./PurchaseDetails.module.css";
import { MagneticButton } from "../components/MagneticButton";
import { motion } from "framer-motion";
import { ShoppingCart, Plus, Trash2 } from "lucide-react";

function PurchaseDetails() {
  const [showPurchaseModal, setPurchaseModal] = useState(false);
  const [purchase, setAllPurchaseData] = useState([]);
  const [products, setAllProducts] = useState([]);
  const [updatePage, setUpdatePage] = useState(true);

  const authContext = useContext(AuthContext);

  useEffect(() => {
    fetchPurchaseData();
    fetchProductsData();
  }, [updatePage]);

  const fetchPurchaseData = () => {
    fetch(`${API_URL}/api/purchase/get/${authContext.user}`)
      .then((r) => r.json())
      .then((d) => setAllPurchaseData(d))
      .catch(console.error);
  };

  const deletePurchase = (id) => {
    if (!window.confirm("Are you sure? This will also revert the stock level for this product.")) return;
    fetch(`${API_URL}/api/purchase/delete/${id}`, { method: "DELETE" })
      .then(() => handlePageUpdate())
      .catch(console.error);
  };

  const fetchProductsData = () => {
    fetch(`${API_URL}/api/product/get/${authContext.user}`)
      .then((r) => r.json())
      .then((d) => setAllProducts(d))
      .catch(console.error);
  };

  const addSaleModalSetting = () => setPurchaseModal((p) => !p);
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
      {showPurchaseModal && (
        <AddPurchaseDetails
          addSaleModalSetting={addSaleModalSetting}
          products={products}
          handlePageUpdate={handlePageUpdate}
          authContext={authContext}
        />
      )}

      {/* Page Header */}
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-end", flexWrap: "wrap", gap: "1rem" }}>
        <div>
          <p className="label-cap" style={{ marginBottom: "0.25rem" }}>Procurement</p>
          <h1 style={{ fontSize: "1.75rem", fontWeight: 800, color: "var(--on-surface)", letterSpacing: "-0.03em", margin: 0 }}>
            Purchase Details
          </h1>
        </div>
        <MagneticButton variant="primary" size="sm" onClick={addSaleModalSetting}>
          <Plus size={14} strokeWidth={2} />
          New Purchase
        </MagneticButton>
      </div>

      <div className={styles.tableSection}>
        <div className={styles.tableHeader}>
          <h2 className={styles.tableTitle}>
            <ShoppingCart size={18} strokeWidth={1.5} style={{ display: "inline", marginRight: 8, verticalAlign: "middle", color: "var(--tertiary-container)" }} />
            Purchase Records
          </h2>
          <span style={{ fontSize: "0.75rem", color: "var(--on-surface-variant)", background: "rgba(26,64,77,0.06)", padding: "4px 12px", borderRadius: 999 }}>
            {purchase.length} records
          </span>
        </div>

        <div className={styles.tableWrapper}>
          <table className={styles.table}>
            <thead>
              <tr>
                <th>Product Name</th>
                <th>Quantity</th>
                <th>Date</th>
                <th>Total Amount</th>
                <th style={{ textAlign: "right" }}>Actions</th>
              </tr>
            </thead>
            <tbody>
              {purchase.map((element, i) => (
                <motion.tr
                  key={element._id}
                  custom={i}
                  initial="hidden"
                  animate="visible"
                  variants={rowVariants}
                >
                  <td style={{ fontWeight: 600 }}>{element.ProductID?.name || "Unknown Product"}</td>
                  <td>{element.QuantityPurchased} units</td>
                  <td className={styles.date}>
                    {new Date(element.PurchaseDate).toLocaleDateString() === new Date().toLocaleDateString()
                      ? "Today"
                      : new Date(element.PurchaseDate).toLocaleDateString()}
                  </td>
                  <td className={styles.amount}>${element.TotalPurchaseAmount}</td>
                  <td style={{ textAlign: "right" }}>
                    <button 
                      onClick={() => deletePurchase(element._id)}
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
              {purchase.length === 0 && (
                <tr>
                  <td colSpan={4} style={{ textAlign: "center", padding: "3rem", color: "var(--on-surface-variant)", opacity: 0.6 }}>
                    No purchase records found.
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

export default PurchaseDetails;
