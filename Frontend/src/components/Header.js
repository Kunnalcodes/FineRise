import { useState, useContext } from "react";
import { Link, useNavigate } from "react-router-dom";
import AuthContext from "../AuthContext";
import { motion, AnimatePresence } from "framer-motion";
import { BarChart2, Bell, Menu, X, LogOut, User, ChevronDown } from "lucide-react";

export default function Header() {
  const authContext = useContext(AuthContext);
  const navigate = useNavigate();
  const localStorageData = JSON.parse(localStorage.getItem("user") || "{}");
  const [mobileOpen, setMobileOpen] = useState(false);
  const [profileOpen, setProfileOpen] = useState(false);

  const mobileNav = [
    { name: "Dashboard", href: "/" },
    { name: "Inventory", href: "/inventory" },
    { name: "Purchases", href: "/purchase-details" },
    { name: "Sales", href: "/sales" },
    { name: "Manage Store", href: "/manage-store" },
    { name: "AI Insights", href: "/ai-insights" },
  ];

  const handleSignOut = () => {
    authContext.signout();
    navigate("/login");
  };

  return (
    <header
      style={{
        position: "sticky",
        top: 0,
        zIndex: 50,
        height: 64,
        background: "rgba(255,255,255,0.82)",
        backdropFilter: "blur(20px)",
        WebkitBackdropFilter: "blur(20px)",
        borderBottom: "1px solid rgba(26,64,77,0.07)",
        display: "flex",
        alignItems: "center",
        padding: "0 1.5rem",
        justifyContent: "space-between",
        fontFamily: "Inter, sans-serif",
        boxShadow: "0 1px 0 rgba(26,64,77,0.04)",
      }}
    >
      {/* Left: Logo */}
      <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
        <div
          style={{
            width: 34,
            height: 34,
            borderRadius: 10,
            background: "linear-gradient(135deg, #1a404d 0%, #335765 100%)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            flexShrink: 0,
          }}
        >
          <BarChart2 size={17} color="#f4fbf5" strokeWidth={1.5} />
        </div>
        <span
          style={{
            fontSize: "1.0625rem",
            fontWeight: 800,
            color: "#1a404d",
            letterSpacing: "-0.025em",
          }}
        >
          FineRise
        </span>
      </div>

      {/* Right: Actions */}
      <div style={{ display: "flex", alignItems: "center", gap: "0.75rem" }}>
        {/* Notification Bell */}
        <motion.button
          whileHover={{ scale: 1.08 }}
          whileTap={{ scale: 0.95 }}
          aria-label="Notifications"
          style={{
            width: 36,
            height: 36,
            borderRadius: 10,
            background: "rgba(26,64,77,0.06)",
            border: "none",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            cursor: "pointer",
            color: "#41484b",
          }}
        >
          <Bell size={16} strokeWidth={1.5} />
        </motion.button>

        {/* Profile dropdown */}
        <div style={{ position: "relative" }}>
          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={() => setProfileOpen((p) => !p)}
            style={{
              display: "flex",
              alignItems: "center",
              gap: "8px",
              padding: "5px 12px 5px 5px",
              background: "rgba(26,64,77,0.05)",
              border: "1px solid rgba(26,64,77,0.08)",
              borderRadius: 10,
              cursor: "pointer",
            }}
          >
            {localStorageData.imageUrl ? (
              <img
                src={localStorageData.imageUrl}
                alt="Profile"
                style={{ width: 26, height: 26, borderRadius: "50%", objectFit: "cover" }}
              />
            ) : (
              <div style={{ width: 26, height: 26, borderRadius: "50%", background: "rgba(26,64,77,0.12)", display: "flex", alignItems: "center", justifyContent: "center" }}>
                <User size={13} color="#1a404d" strokeWidth={1.5} />
              </div>
            )}
            <span style={{ fontSize: "0.8125rem", fontWeight: 600, color: "#1a404d", letterSpacing: "-0.01em" }}>
              {localStorageData.firstName || "User"}
            </span>
            <ChevronDown size={13} strokeWidth={2} color="#41484b" style={{ transition: "transform 0.2s", transform: profileOpen ? "rotate(180deg)" : "rotate(0deg)" }} />
          </motion.button>

          <AnimatePresence>
            {profileOpen && (
              <motion.div
                initial={{ opacity: 0, y: -6, scale: 0.97 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, y: -6, scale: 0.97 }}
                transition={{ duration: 0.18 }}
                style={{
                  position: "absolute",
                  right: 0,
                  top: "calc(100% + 8px)",
                  background: "rgba(255,255,255,0.95)",
                  backdropFilter: "blur(16px)",
                  border: "1px solid rgba(26,64,77,0.1)",
                  borderRadius: 12,
                  boxShadow: "0 16px 40px rgba(22,29,26,0.12)",
                  minWidth: 180,
                  overflow: "hidden",
                  zIndex: 100,
                }}
              >
                <div style={{ padding: "0.75rem 1rem", borderBottom: "1px solid rgba(26,64,77,0.06)" }}>
                  <p style={{ margin: 0, fontSize: "0.8125rem", fontWeight: 600, color: "#1a404d" }}>
                    {localStorageData.firstName} {localStorageData.lastName}
                  </p>
                  <p style={{ margin: 0, fontSize: "0.75rem", color: "#41484b", opacity: 0.65 }}>
                    {localStorageData.email}
                  </p>
                </div>
                <button
                  onClick={handleSignOut}
                  style={{
                    width: "100%",
                    display: "flex",
                    alignItems: "center",
                    gap: "8px",
                    padding: "0.75rem 1rem",
                    background: "transparent",
                    border: "none",
                    cursor: "pointer",
                    fontSize: "0.8125rem",
                    color: "#56321d",
                    fontWeight: 500,
                    fontFamily: "Inter, sans-serif",
                    textAlign: "left",
                    transition: "background 0.15s",
                  }}
                  onMouseEnter={(e) => e.currentTarget.style.background = "rgba(86,50,29,0.06)"}
                  onMouseLeave={(e) => e.currentTarget.style.background = "transparent"}
                >
                  <LogOut size={14} strokeWidth={1.5} />
                  Sign out
                </button>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* Mobile hamburger */}
        <motion.button
          whileTap={{ scale: 0.95 }}
          onClick={() => setMobileOpen((p) => !p)}
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            width: 36,
            height: 36,
            borderRadius: 10,
            background: "rgba(26,64,77,0.06)",
            border: "none",
            cursor: "pointer",
            color: "#41484b",
          }}
          className="lg:hidden"
        >
          {mobileOpen ? <X size={16} strokeWidth={2} /> : <Menu size={16} strokeWidth={1.5} />}
        </motion.button>
      </div>

      {/* Mobile nav drawer */}
      <AnimatePresence>
        {mobileOpen && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.2 }}
            style={{
              position: "absolute",
              top: 64,
              left: 0,
              right: 0,
              background: "rgba(255,255,255,0.96)",
              backdropFilter: "blur(20px)",
              borderBottom: "1px solid rgba(26,64,77,0.08)",
              padding: "0.75rem",
              zIndex: 49,
              display: "flex",
              flexDirection: "column",
              gap: "2px",
            }}
          >
            {mobileNav.map((item) => (
              <Link
                key={item.name}
                to={item.href}
                onClick={() => setMobileOpen(false)}
                style={{
                  padding: "0.625rem 0.875rem",
                  borderRadius: 8,
                  fontSize: "0.875rem",
                  fontWeight: 500,
                  color: "#1a404d",
                  textDecoration: "none",
                  transition: "background 0.15s",
                  display: "block",
                }}
                onMouseEnter={(e) => e.currentTarget.style.background = "rgba(26,64,77,0.06)"}
                onMouseLeave={(e) => e.currentTarget.style.background = "transparent"}
              >
                {item.name}
              </Link>
            ))}
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
}
