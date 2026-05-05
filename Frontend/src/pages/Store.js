import React, { useState, useEffect, useContext } from "react";
import AddStore from "../components/AddStore";
import API_URL from "../config";
import AuthContext from "../AuthContext";
import styles from "./Store.module.css";
import { MagneticButton } from "../components/MagneticButton";
import { motion } from "framer-motion";
import { Store as StoreIcon, MapPin, Plus } from "lucide-react";

function Store() {
  const [showModal, setShowModal] = useState(false);
  const [stores, setAllStores] = useState([]);

  const authContext = useContext(AuthContext);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = () => {
    fetch(`${API_URL}/api/store/get/${authContext.user}`)
      .then((r) => r.json())
      .then((d) => setAllStores(d))
      .catch(console.error);
  };

  const modalSetting = () => setShowModal((p) => !p);

  return (
    <div className={styles.container}>
      {/* Page Header */}
      <div className={styles.header}>
        <div>
          <p className="label-cap" style={{ marginBottom: "0.25rem" }}>Locations</p>
          <h1 className={styles.title}>Manage Stores</h1>
        </div>
        <MagneticButton variant="primary" size="sm" onClick={modalSetting}>
          <Plus size={14} strokeWidth={2} />
          Add Store
        </MagneticButton>
      </div>

      {showModal && <AddStore />}

      <div className={styles.grid}>
        {stores.map((element, i) => (
          <motion.div
            key={element._id}
            className={styles.card}
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.07, duration: 0.4, ease: [0.4, 0, 0.2, 1] }}
          >
            <div className={styles.imageContainer}>
              <div className={styles.badge}>Active</div>
              <img
                alt="store"
                className={styles.image}
                src={element.image || "https://images.unsplash.com/photo-1534452203294-4698ad29451b?auto=format&fit=crop&q=80&w=800"}
              />
            </div>
            <div className={styles.content}>
              <div style={{ display: "flex", alignItems: "center", gap: "8px", marginBottom: "0.5rem" }}>
                <StoreIcon size={15} strokeWidth={1.5} color="var(--primary)" />
                <h3 className={styles.storeName}>{element.name}</h3>
              </div>
              <div className={styles.locationInfo}>
                <MapPin size={13} strokeWidth={1.5} color="rgba(65,72,75,0.45)" />
                <span>{element.address}, {element.city}</span>
              </div>
            </div>
          </motion.div>
        ))}
        {stores.length === 0 && (
          <div style={{ gridColumn: "1/-1", textAlign: "center", padding: "4rem", color: "var(--on-surface-variant)", opacity: 0.55 }}>
            <StoreIcon size={40} strokeWidth={1} style={{ marginBottom: "1rem", display: "block", margin: "0 auto 1rem" }} />
            <p style={{ margin: 0, fontSize: "0.9375rem" }}>No stores added yet.</p>
          </div>
        )}
      </div>
    </div>
  );
}

export default Store;
