import React, { useRef, useState } from "react";
import { motion, useSpring, useTransform } from "framer-motion";

/**
 * MagneticButton – lightswind-inspired magnetic hover button
 * Adapted for plain React (no TypeScript / Tailwind cn utility)
 */
export function MagneticButton({
  children,
  strength = 0.4,
  radius = 80,
  variant = "primary",
  size = "md",
  onClick,
  className = "",
  type = "button",
  disabled = false,
}) {
  const buttonRef = useRef(null);
  const [isHovered, setIsHovered] = useState(false);

  const springConfig = { stiffness: 200, damping: 18, mass: 0.6 };
  const rawX = useSpring(0, springConfig);
  const rawY = useSpring(0, springConfig);
  const textX = useTransform(rawX, (v) => v * 0.4);
  const textY = useTransform(rawY, (v) => v * 0.4);

  const handleMouseMove = (e) => {
    const rect = buttonRef.current?.getBoundingClientRect();
    if (!rect) return;
    const centerX = rect.left + rect.width / 2;
    const centerY = rect.top + rect.height / 2;
    const distX = e.clientX - centerX;
    const distY = e.clientY - centerY;
    const dist = Math.sqrt(distX ** 2 + distY ** 2);
    if (dist < radius) {
      rawX.set(distX * strength);
      rawY.set(distY * strength);
      setIsHovered(true);
    } else {
      rawX.set(0);
      rawY.set(0);
      setIsHovered(false);
    }
  };

  const handleMouseLeave = () => {
    rawX.set(0);
    rawY.set(0);
    setIsHovered(false);
  };

  // Variant styles mapped to FineRise design tokens
  const variantStyles = {
    primary: {
      background: "linear-gradient(135deg, #1a404d 0%, #335765 100%)",
      color: "#ffffff",
      boxShadow: "0 8px 24px rgba(26,64,77,0.35)",
    },
    secondary: {
      background: "rgba(255,255,255,0.85)",
      color: "#1a404d",
      border: "1.5px solid rgba(26,64,77,0.15)",
      boxShadow: "0 4px 12px rgba(26,64,77,0.08)",
    },
    outline: {
      background: "transparent",
      color: "#1a404d",
      border: "2px solid #1a404d",
    },
    ghost: {
      background: "transparent",
      color: "#335765",
    },
    danger: {
      background: "linear-gradient(135deg, #7f1d1d 0%, #b91c1c 100%)",
      color: "#ffffff",
      boxShadow: "0 8px 24px rgba(185,28,28,0.3)",
    },
  };

  const sizeStyles = {
    sm: { height: "36px", padding: "0 18px", fontSize: "0.8125rem", borderRadius: "999px" },
    md: { height: "44px", padding: "0 28px", fontSize: "0.9375rem", borderRadius: "999px" },
    lg: { height: "52px", padding: "0 40px", fontSize: "1.0625rem", borderRadius: "999px" },
  };

  const vs = variantStyles[variant] || variantStyles.primary;
  const ss = sizeStyles[size] || sizeStyles.md;

  return (
    <div
      ref={buttonRef}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      style={{ display: "inline-flex", padding: radius * 0.1 }}
    >
      <motion.button
        type={type}
        onClick={!disabled ? onClick : undefined}
        disabled={disabled}
        style={{
          x: rawX,
          y: rawY,
          ...vs,
          ...ss,
          display: "inline-flex",
          alignItems: "center",
          justifyContent: "center",
          fontWeight: 600,
          letterSpacing: "-0.01em",
          fontFamily: "Inter, sans-serif",
          cursor: disabled ? "not-allowed" : "pointer",
          border: vs.border || "none",
          outline: "none",
          position: "relative",
          overflow: "hidden",
          opacity: disabled ? 0.6 : 1,
          transition: "background 0.2s ease",
        }}
        animate={{ scale: isHovered && !disabled ? 1.04 : 1 }}
        transition={{ type: "spring", stiffness: 300, damping: 20 }}
        className={className}
        whileTap={!disabled ? { scale: 0.97 } : {}}
      >
        {/* Inner glow overlay */}
        <motion.span
          animate={{ opacity: isHovered && !disabled ? 1 : 0 }}
          transition={{ duration: 0.25 }}
          style={{
            pointerEvents: "none",
            position: "absolute",
            inset: 0,
            borderRadius: "inherit",
            background: "rgba(255,255,255,0.12)",
          }}
        />
        {/* Text with parallax */}
        <motion.span
          style={{
            x: textX,
            y: textY,
            position: "relative",
            zIndex: 10,
            display: "flex",
            alignItems: "center",
            gap: "8px",
          }}
        >
          {children}
        </motion.span>
      </motion.button>
    </div>
  );
}

export default MagneticButton;
