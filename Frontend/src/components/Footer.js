import React from "react";
import { motion } from "framer-motion";
import BeamCircle from "./BeamCircle";
import { 
  MailIcon, 
  PhoneIcon, 
  MapPinIcon, 
  CodeIcon, 
  BirdIcon, 
  BriefcaseIcon, 
  CameraIcon,
  ArrowRightIcon,
  ZapIcon,
  BarChart2
} from "lucide-react";

function Footer() {
  const year = new Date().getFullYear();

  // Mapping icons to the names found in the installed lucide-react version
  const socialLinks = [
    { Icon: CodeIcon, label: "GitHub" },
    { Icon: BirdIcon, label: "Twitter" },
    { Icon: BriefcaseIcon, label: "LinkedIn" },
    { Icon: CameraIcon, label: "Instagram" },
    { Icon: MailIcon, label: "Email" },
  ];

  return (
    <footer
      style={{
        background: "linear-gradient(135deg, #0d2630 0%, #1a404d 60%, #1c3d49 100%)",
        color: "#c8dde1",
        fontFamily: "Inter, sans-serif",
        padding: "3rem 2rem 1.5rem",
        marginTop: "auto",
        position: "relative",
        overflow: "hidden",
      }}
    >
      {/* Subtle background pattern */}
      <div
        style={{
          position: "absolute",
          inset: 0,
          backgroundImage:
            "radial-gradient(circle at 20% 50%, rgba(51,103,99,0.15) 0%, transparent 60%), radial-gradient(circle at 80% 20%, rgba(51,87,101,0.1) 0%, transparent 50%)",
          pointerEvents: "none",
        }}
      />

      <div style={{ maxWidth: "1200px", margin: "0 auto", position: "relative", zIndex: 1 }}>
        {/* Top section */}
        <div
          style={{
            display: "flex",
            flexWrap: "wrap",
            gap: "2rem",
            justifyContent: "space-between",
            alignItems: "flex-start",
            marginBottom: "2.5rem",
          }}
        >
          {/* Brand column */}
          <div style={{ flex: "1 1 220px", maxWidth: "280px" }}>
            <div style={{ display: "flex", alignItems: "center", gap: "10px", marginBottom: "1rem" }}>
              <div
                style={{
                  width: 36,
                  height: 36,
                  borderRadius: 10,
                  background: "linear-gradient(135deg, #335765 0%, #336763 100%)",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                }}
              >
                <BarChart2 size={18} color="#f4fbf5" strokeWidth={1.5} />
              </div>
              <span
                style={{
                  fontSize: "1.25rem",
                  fontWeight: 700,
                  color: "#f4fbf5",
                  letterSpacing: "-0.02em",
                }}
              >
                FineRise
              </span>
            </div>
            <p
              style={{
                fontSize: "0.8125rem",
                lineHeight: 1.7,
                color: "rgba(200,221,225,0.7)",
                maxWidth: "220px",
              }}
            >
              The authoritative lens through which a business views its physical world. Editorial-grade inventory intelligence.
            </p>
            {/* Social links */}
            <div style={{ display: "flex", gap: "12px", marginTop: "1.25rem" }}>
              {socialLinks.map(({ Icon, label }) => (
                <motion.button
                  key={label}
                  aria-label={label}
                  whileHover={{ scale: 1.15, y: -2 }}
                  whileTap={{ scale: 0.95 }}
                  style={{
                    width: 34,
                    height: 34,
                    borderRadius: 8,
                    background: "rgba(255,255,255,0.07)",
                    border: "1px solid rgba(255,255,255,0.1)",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    cursor: "pointer",
                    color: "#c8dde1",
                    transition: "background 0.2s ease",
                  }}
                >
                  <Icon size={15} strokeWidth={1.5} />
                </motion.button>
              ))}
            </div>
          </div>

          {/* BeamCircle orb */}
          <div style={{ flex: "0 0 auto", display: "flex", alignItems: "center", justifyContent: "center" }}>
            <BeamCircle size={240} />
          </div>

          {/* Links columns */}
          <div style={{ display: "flex", gap: "3rem", flex: "1 1 200px", justifyContent: "flex-end", flexWrap: "wrap" }}>
            {[
              {
                title: "Product",
                links: ["Dashboard", "Inventory", "Sales", "AI Insights", "Manage Stores"],
              },
              {
                title: "System",
                links: ["Purchase Details", "Reports", "Forecasting", "Settings"],
              },
            ].map((col) => (
              <div key={col.title}>
                <p
                  style={{
                    fontSize: "0.6875rem",
                    fontWeight: 600,
                    letterSpacing: "0.08em",
                    textTransform: "uppercase",
                    color: "rgba(200,221,225,0.5)",
                    marginBottom: "1rem",
                  }}
                >
                  {col.title}
                </p>
                <ul style={{ listStyle: "none", padding: 0, margin: 0, display: "flex", flexDirection: "column", gap: "0.6rem" }}>
                  {col.links.map((link) => (
                    <li key={link}>
                      <motion.span
                        whileHover={{ x: 4, color: "#f4fbf5" }}
                        transition={{ duration: 0.2 }}
                        style={{
                          fontSize: "0.8125rem",
                          color: "rgba(200,221,225,0.65)",
                          cursor: "pointer",
                          display: "block",
                          transition: "color 0.2s",
                        }}
                      >
                        {link}
                      </motion.span>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>

        {/* Divider */}
        <div
          style={{
            height: "1px",
            background: "linear-gradient(to right, transparent, rgba(200,221,225,0.15), transparent)",
            marginBottom: "1.25rem",
          }}
        />

        {/* Bottom row */}
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            flexWrap: "wrap",
            gap: "0.5rem",
          }}
        >
          <p style={{ fontSize: "0.75rem", color: "rgba(200,221,225,0.4)" }}>
            © {year} FineRise. Architectural Inventory Intelligence.
          </p>
          <div style={{ display: "flex", gap: "1.5rem" }}>
            {["Privacy", "Terms", "Status"].map((item) => (
              <motion.span
                key={item}
                whileHover={{ color: "#f4fbf5" }}
                style={{
                  fontSize: "0.75rem",
                  color: "rgba(200,221,225,0.4)",
                  cursor: "pointer",
                  transition: "color 0.2s",
                }}
              >
                {item}
              </motion.span>
            ))}
          </div>
        </div>
      </div>
    </footer>
  );
}

export default Footer;
