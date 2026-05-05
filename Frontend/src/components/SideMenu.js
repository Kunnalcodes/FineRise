import React from "react";
import { Link, useLocation } from "react-router-dom";
import { motion } from "framer-motion";
import {
  LayoutDashboard,
  Package,
  ShoppingCart,
  TrendingUp,
  Store,
  Zap,
  User,
} from "lucide-react";

const navItems = [
  { to: "/", label: "Dashboard", Icon: LayoutDashboard },
  { to: "/inventory", label: "Inventory", Icon: Package },
  { to: "/purchase-details", label: "Purchases", Icon: ShoppingCart },
  { to: "/sales", label: "Sales", Icon: TrendingUp },
  { to: "/manage-store", label: "Manage Store", Icon: Store },
  { to: "/ai-insights", label: "AI Insights", Icon: Zap, highlight: true },
];

function SideMenu() {
  const location = useLocation();
  const localStorageData = JSON.parse(localStorage.getItem("user") || "{}");

  return (
    <div
      style={{
        width: "100%",
        height: "100%",
        display: "flex",
        flexDirection: "column",
        background: "rgba(255,255,255,0.72)",
        backdropFilter: "blur(18px)",
        WebkitBackdropFilter: "blur(18px)",
        borderRight: "1px solid rgba(255,255,255,0.5)",
        fontFamily: "Inter, sans-serif",
      }}
    >
      {/* Logo */}
      <div
        style={{
          padding: "1.25rem 1.25rem 1rem",
          borderBottom: "1px solid rgba(26,64,77,0.06)",
        }}
      >
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
            <LayoutDashboard size={16} color="#f4fbf5" strokeWidth={1.5} />
          </div>
          <span
            style={{
              fontSize: "1.0625rem",
              fontWeight: 700,
              color: "#1a404d",
              letterSpacing: "-0.02em",
            }}
          >
            FineRise
          </span>
        </div>
      </div>

      {/* Navigation */}
      <nav style={{ flex: 1, padding: "0.75rem 0.75rem", display: "flex", flexDirection: "column", gap: "2px" }}>
        <p
          style={{
            fontSize: "0.625rem",
            fontWeight: 600,
            letterSpacing: "0.08em",
            textTransform: "uppercase",
            color: "rgba(65,72,75,0.45)",
            padding: "0.5rem 0.625rem 0.375rem",
          }}
        >
          Main Menu
        </p>
        {navItems.map(({ to, label, Icon, highlight }) => {
          const isActive =
            to === "/" ? location.pathname === "/" : location.pathname === to;

          return (
            <Link key={to} to={to} style={{ textDecoration: "none" }}>
              <motion.div
                whileHover={{ x: 3 }}
                transition={{ duration: 0.2 }}
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: "10px",
                  padding: "0.625rem 0.75rem",
                  borderRadius: "10px",
                  background: isActive
                    ? highlight
                      ? "linear-gradient(135deg, rgba(26,64,77,0.12) 0%, rgba(51,103,99,0.12) 100%)"
                      : "rgba(26,64,77,0.08)"
                    : "transparent",
                  transition: "background 0.2s ease",
                  cursor: "pointer",
                }}
              >
                <div
                  style={{
                    width: 30,
                    height: 30,
                    borderRadius: 8,
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    background: isActive
                      ? highlight
                        ? "linear-gradient(135deg, #1a404d 0%, #335765 100%)"
                        : "rgba(26,64,77,0.12)"
                      : "transparent",
                    flexShrink: 0,
                    transition: "background 0.2s ease",
                  }}
                >
                  <Icon
                    size={15}
                    strokeWidth={isActive ? 2 : 1.5}
                    color={
                      isActive
                        ? highlight
                          ? "#f4fbf5"
                          : "#1a404d"
                        : "rgba(65,72,75,0.6)"
                    }
                  />
                </div>
                <span
                  style={{
                    fontSize: "0.8125rem",
                    fontWeight: isActive ? 600 : 500,
                    color: isActive
                      ? highlight
                        ? "#1a404d"
                        : "#1a404d"
                      : "rgba(65,72,75,0.7)",
                    transition: "color 0.2s",
                    letterSpacing: "-0.01em",
                  }}
                >
                  {label}
                </span>
                {highlight && (
                  <span
                    style={{
                      marginLeft: "auto",
                      fontSize: "0.5625rem",
                      fontWeight: 700,
                      letterSpacing: "0.06em",
                      textTransform: "uppercase",
                      background: "linear-gradient(135deg, #1a404d 0%, #336763 100%)",
                      color: "#f4fbf5",
                      padding: "2px 7px",
                      borderRadius: 999,
                    }}
                  >
                    AI
                  </span>
                )}
              </motion.div>
            </Link>
          );
        })}
      </nav>

      {/* User profile strip */}
      <div
        style={{
          borderTop: "1px solid rgba(26,64,77,0.06)",
          padding: "1rem 1.25rem",
          display: "flex",
          alignItems: "center",
          gap: "10px",
          background: "rgba(244,251,245,0.6)",
        }}
      >
        {localStorageData.imageUrl ? (
          <img
            src={localStorageData.imageUrl}
            alt="Profile"
            style={{
              width: 34,
              height: 34,
              borderRadius: "50%",
              objectFit: "cover",
              border: "2px solid rgba(26,64,77,0.12)",
              flexShrink: 0,
            }}
          />
        ) : (
          <div
            style={{
              width: 34,
              height: 34,
              borderRadius: "50%",
              background: "rgba(26,64,77,0.1)",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              flexShrink: 0,
            }}
          >
            <User size={16} color="#1a404d" strokeWidth={1.5} />
          </div>
        )}
        <div style={{ overflow: "hidden" }}>
          <p
            style={{
              margin: 0,
              fontSize: "0.8125rem",
              fontWeight: 600,
              color: "#1a404d",
              whiteSpace: "nowrap",
              overflow: "hidden",
              textOverflow: "ellipsis",
              letterSpacing: "-0.01em",
            }}
          >
            {localStorageData.firstName
              ? `${localStorageData.firstName} ${localStorageData.lastName || ""}`
              : "FineRise User"}
          </p>
          <p
            style={{
              margin: 0,
              fontSize: "0.6875rem",
              color: "rgba(65,72,75,0.5)",
              whiteSpace: "nowrap",
              overflow: "hidden",
              textOverflow: "ellipsis",
            }}
          >
            {localStorageData.email || "admin@finerise.com"}
          </p>
        </div>
      </div>
    </div>
  );
}

export default SideMenu;
