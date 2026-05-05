import React, { useState, useEffect, useContext } from "react";
import AddProduct from "../components/AddProduct";
import UpdateProduct from "../components/UpdateProduct";
import AuthContext from "../AuthContext";
import API_URL from "../config";
import styles from "./Inventory.module.css";
import { MagneticButton } from "../components/MagneticButton";
import { SlideToConfirm } from "../components/SlideToConfirm";
import { motion } from "framer-motion";
import { Package, Store, Award, AlertTriangle, Search, Plus, Edit3, Trash2 } from "lucide-react";

function Inventory() {
  const [showProductModal, setShowProductModal] = useState(false);
  const [showUpdateModal, setShowUpdateModal] = useState(false);
  const [updateProduct, setUpdateProduct] = useState([]);
  const [products, setAllProducts] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [updatePage, setUpdatePage] = useState(true);
  const [stores, setAllStores] = useState([]);
  const [pendingDeleteId, setPendingDeleteId] = useState(null);

  const authContext = useContext(AuthContext);

  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadData = async () => {
      setLoading(true);
      setError(null);
      try {
        await Promise.all([fetchProductsData(), fetchSalesData()]);
      } catch (err) {
        setError("Failed to connect to the backend server. Please ensure it's running.");
      } finally {
        setLoading(false);
      }
    };
    loadData();
  }, [updatePage]);

  const fetchProductsData = async () => {
    const r = await fetch(`${API_URL}/api/product/get/${authContext.user}`);
    if (!r.ok) throw new Error("Fetch failed");
    const d = await r.json();
    setAllProducts(d);
  };

  const fetchSearchData = async () => {
    if (!searchTerm.trim()) {
      fetchProductsData();
      return;
    }
    try {
      const r = await fetch(`${API_URL}/api/product/search?searchTerm=${searchTerm}&userId=${authContext.user}`);
      const d = await r.json();
      setAllProducts(d);
    } catch (err) {
      console.error(err);
    }
  };

  const fetchSalesData = async () => {
    const r = await fetch(`${API_URL}/api/store/get/${authContext.user}`);
    if (!r.ok) throw new Error("Fetch failed");
    const d = await r.json();
    setAllStores(d);
  };

  const addProductModalSetting = () => setShowProductModal((p) => !p);
  const updateProductModalSetting = (data) => {
    setUpdateProduct(data);
    setShowUpdateModal((p) => !p);
  };

  const deleteItem = async (id) => {
    fetch(`${API_URL}/api/product/delete/${id}`)
      .then((r) => r.json())
      .then(() => setUpdatePage((p) => !p));
    setPendingDeleteId(null);
  };

  const handlePageUpdate = () => setUpdatePage((p) => !p);

  const handleSearchTerm = (e) => {
    setSearchTerm(e.target.value);
  };

  // Run search when searchTerm changes
  useEffect(() => {
    const delayDebounceFn = setTimeout(() => {
      fetchSearchData();
    }, 300);
    return () => clearTimeout(delayDebounceFn);
  }, [searchTerm]);

  const summaryItems = [
    { label: "Total Products", value: products.length, subtext: "Items registered", Icon: Package, color: "var(--primary)" },
    { label: "Active Stores", value: stores.length, subtext: "Global footprint", Icon: Store, color: "var(--secondary)" },
    { label: "Total Stock Units", value: products.reduce((acc, curr) => acc + (curr.stock || 0), 0), subtext: "Physical assets", Icon: Award, color: "var(--tertiary-container)" },
    { label: "Low Stock", value: products.filter(p => p.stock < 10).length, subtext: "Below threshold (10)", Icon: AlertTriangle, color: "var(--tertiary)" },
  ];

  const rowVariants = {
    hidden: { opacity: 0, y: 6 },
    visible: (i) => ({
      opacity: 1, y: 0,
      transition: { delay: i * 0.04, duration: 0.3, ease: [0.4, 0, 0.2, 1] },
    }),
  };

  return (
    <div className={styles.container}>
      {/* Page Header */}
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-end", flexWrap: "wrap", gap: "1rem" }}>
        <div>
          <p className="label-cap" style={{ marginBottom: "0.25rem" }}>Inventory</p>
          <h1 style={{ fontSize: "1.75rem", fontWeight: 800, color: "var(--on-surface)", letterSpacing: "-0.03em", margin: 0 }}>
            Products
          </h1>
        </div>
        <MagneticButton variant="primary" size="sm" onClick={addProductModalSetting}>
          <Plus size={14} strokeWidth={2} />
          Add Product
        </MagneticButton>
      </div>

      {/* Summary Cards */}
      <div className={styles.summaryCard}>
        <span className={styles.summaryTitle}>Overall Inventory Summary</span>
        <div className={styles.summaryGrid}>
          {summaryItems.map(({ label, value, subtext, Icon, color }, i) => (
            <motion.div
              key={label}
              className={styles.summaryItem}
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.07, duration: 0.38 }}
            >
              <div style={{ display: "flex", alignItems: "center", gap: "8px", marginBottom: "0.5rem" }}>
                <Icon size={15} strokeWidth={1.5} color={color} />
                <span className={styles.itemLabel} style={{ color }}>{label}</span>
              </div>
              <span className={styles.itemValue}>{value}</span>
              <span className={styles.itemSubtext}>{subtext}</span>
            </motion.div>
          ))}
        </div>
      </div>

      {showProductModal && (
        <AddProduct addProductModalSetting={addProductModalSetting} handlePageUpdate={handlePageUpdate} />
      )}
      {showUpdateModal && (
        <UpdateProduct updateProductData={updateProduct} updateModalSetting={updateProductModalSetting} handlePageUpdate={handlePageUpdate} />
      )}

      {/* Table Section */}
      <div className={styles.tableSection}>
        <div className={styles.tableHeader}>
          <div style={{ display: "flex", alignItems: "center", gap: "1rem", flexWrap: "wrap" }}>
            <h2 className={styles.tableTitle}>Products List</h2>
            <div className={styles.searchWrapper}>
              <Search size={14} strokeWidth={1.5} color="rgba(65,72,75,0.45)" />
              <input
                className={styles.searchInput}
                type="text"
                placeholder="Search products..."
                value={searchTerm}
                onChange={handleSearchTerm}
              />
            </div>
          </div>
        </div>

        <div className={styles.tableWrapper}>
          {loading && (
            <div style={{ padding: "4rem", textAlign: "center" }}>
              <div className="loader" style={{ margin: "0 auto 1rem" }} />
              <p style={{ fontSize: "0.875rem", color: "var(--on-surface-variant)" }}>Loading inventory...</p>
            </div>
          )}
          {error && !loading && (
            <div style={{ padding: "3rem", textAlign: "center", background: "rgba(185,28,28,0.05)", borderRadius: "12px", margin: "1rem" }}>
              <AlertTriangle size={32} color="var(--tertiary)" style={{ marginBottom: "1rem" }} />
              <p style={{ color: "var(--tertiary)", fontWeight: 600, margin: 0 }}>{error}</p>
              <MagneticButton variant="secondary" size="sm" onClick={() => setUpdatePage(!updatePage)} style={{ marginTop: "1rem" }}>
                Retry Connection
              </MagneticButton>
            </div>
          )}
          <table className={styles.table} style={{ opacity: (loading || error) ? 0.3 : 1 }}>
            <thead>
              <tr>
                <th>Product Name</th>
                <th>Manufacturer</th>
                <th>Stock Level</th>
                <th>Description</th>
                <th>Status</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {products.map((element, i) => (
                <motion.tr
                  key={element._id}
                  custom={i}
                  initial="hidden"
                  animate="visible"
                  variants={rowVariants}
                >
                  <td style={{ fontWeight: 600 }}>{element.name}</td>
                  <td>{element.manufacturer}</td>
                  <td>{element.stock || 0}</td>
                  <td style={{ maxWidth: "220px", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
                    {element.description}
                  </td>
                  <td>
                    <span className={`${styles.status} ${element.stock > 0 ? styles.inStock : styles.outOfStock}`}>
                      {element.stock > 0 ? "In Stock" : "Out of Stock"}
                    </span>
                  </td>
                  <td>
                    <div className={styles.actions}>
                      <span className={styles.editBtn} onClick={() => updateProductModalSetting(element)}>
                        <Edit3 size={12} strokeWidth={1.5} style={{ display: "inline", marginRight: 3 }} />
                        Edit
                      </span>
                      {pendingDeleteId === element._id ? (
                        <SlideToConfirm
                          text="Slide to delete"
                          successText="Deleted!"
                          width={170}
                          height={34}
                          onConfirm={() => deleteItem(element._id)}
                        />
                      ) : (
                        <span className={styles.deleteBtn} onClick={() => setPendingDeleteId(element._id)}>
                          <Trash2 size={12} strokeWidth={1.5} style={{ display: "inline", marginRight: 3 }} />
                          Delete
                        </span>
                      )}
                    </div>
                  </td>
                </motion.tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

export default Inventory;
