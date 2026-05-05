import React, { useState, useRef } from "react";
import { motion, useAnimation, useMotionValue, useTransform } from "framer-motion";
import { ArrowRight, Check } from "lucide-react";

/**
 * SlideToConfirm – lightswind-inspired slide confirmation widget
 * Adapted for plain React (no TypeScript)
 */
export function SlideToConfirm({
  text = "Slide to confirm",
  successText = "Confirmed!",
  onConfirm,
  width = 300,
  height = 52,
  className = "",
}) {
  const [state, setState] = useState("idle"); // idle | loading | success
  const trackWidth = width - height;
  const thumbSize = height - 8;

  const x = useMotionValue(0);
  const controls = useAnimation();
  const textOpacity = useTransform(x, [0, trackWidth * 0.5], [1, 0]);
  const bgWidth = useTransform(x, [0, trackWidth], [height, width]);

  const handleDragEnd = async () => {
    if (state !== "idle") return;
    if (x.get() >= trackWidth * 0.9) {
      controls.start({ x: trackWidth, transition: { type: "spring", stiffness: 400, damping: 30 } });
      setState("loading");
      try {
        await (onConfirm ? onConfirm() : Promise.resolve());
        setState("success");
      } catch {
        setState("idle");
        controls.start({ x: 0, transition: { type: "spring", stiffness: 400, damping: 30 } });
      }
    } else {
      controls.start({ x: 0, transition: { type: "spring", stiffness: 400, damping: 30 } });
    }
  };

  const handleReset = () => {
    if (state === "success") {
      setState("idle");
      x.set(0);
      controls.start({ x: 0 });
    }
  };

  return (
    <div
      onClick={handleReset}
      className={className}
      style={{
        position: "relative",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        overflow: "hidden",
        borderRadius: 999,
        background: "rgba(26,64,77,0.07)",
        border: state === "success" ? "1.5px solid rgba(51,103,99,0.5)" : "1.5px solid rgba(26,64,77,0.15)",
        userSelect: "none",
        width,
        height,
        cursor: state === "success" ? "pointer" : "default",
        transition: "border-color 0.3s ease",
      }}
    >
      {/* Fill track */}
      <motion.div
        style={{
          position: "absolute",
          left: 0,
          top: 0,
          height: "100%",
          borderRadius: 999,
          width: state === "success" ? width : bgWidth,
          backgroundColor: state === "success" ? "#336763" : "#1a404d",
          opacity: state === "success" ? 0.15 : 0.08,
        }}
        animate={{ width: state === "success" ? width : undefined }}
        transition={{ duration: 0.3 }}
      />

      {/* Idle text */}
      <motion.span
        style={{
          position: "absolute",
          fontWeight: 500,
          fontSize: "0.875rem",
          color: "#41484b",
          zIndex: 0,
          opacity: state === "idle" ? textOpacity : 0,
          fontFamily: "Inter, sans-serif",
          letterSpacing: "0.01em",
        }}
      >
        {text}
      </motion.span>

      {/* Success text */}
      <motion.span
        style={{
          position: "absolute",
          fontWeight: 600,
          fontSize: "0.875rem",
          color: "#336763",
          zIndex: 0,
          fontFamily: "Inter, sans-serif",
        }}
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: state === "success" ? 1 : 0, y: state === "success" ? 0 : 10 }}
        transition={{ duration: 0.3, delay: 0.1 }}
      >
        {successText}
      </motion.span>

      {/* Draggable thumb */}
      <motion.div
        drag={state === "idle" ? "x" : false}
        dragConstraints={{ left: 0, right: trackWidth }}
        dragElastic={0.05}
        dragMomentum={false}
        onDragEnd={handleDragEnd}
        style={{
          position: "absolute",
          left: 4,
          zIndex: 10,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          borderRadius: 999,
          background: state === "success" ? "#336763" : "#ffffff",
          boxShadow: "0 2px 12px rgba(26,64,77,0.2)",
          cursor: state === "idle" ? "grab" : "default",
          width: thumbSize,
          height: thumbSize,
          x,
        }}
        initial={false}
        whileTap={{ scale: state === "idle" ? 0.95 : 1 }}
        animate={state === "success" ? { x: trackWidth, backgroundColor: "#336763", color: "white" } : controls}
      >
        {/* Arrow icon (idle) */}
        <motion.div
          animate={{ scale: state === "idle" ? 1 : 0, opacity: state === "idle" ? 1 : 0 }}
          transition={{ duration: 0.2 }}
          style={{ position: "absolute", display: "flex" }}
        >
          <ArrowRight size={18} color="#1a404d" strokeWidth={2} />
        </motion.div>

        {/* Spinner (loading) */}
        <motion.div
          animate={{ scale: state === "loading" ? 1 : 0, opacity: state === "loading" ? 1 : 0 }}
          transition={{ duration: 0.2 }}
          style={{ position: "absolute", display: "flex", alignItems: "center", justifyContent: "center", width: "100%", height: "100%" }}
        >
          <div style={{ position: "relative", width: 20, height: 20 }}>
            {[...Array(12)].map((_, i) => (
              <motion.span
                key={i}
                style={{
                  position: "absolute",
                  left: "9px",
                  top: 0,
                  height: "5.5px",
                  width: "1.8px",
                  borderRadius: 999,
                  background: "#1a404d",
                  rotate: i * 30,
                  transformOrigin: "center 10px",
                }}
                animate={{ opacity: [0.15, 1, 0.15] }}
                transition={{ duration: 1.1, repeat: Infinity, delay: i * 0.091, ease: "linear" }}
              />
            ))}
          </div>
        </motion.div>

        {/* Check (success) */}
        <motion.div
          animate={{ scale: state === "success" ? 1 : 0, opacity: state === "success" ? 1 : 0 }}
          transition={{ type: "spring", stiffness: 300, damping: 20 }}
          style={{ position: "absolute", color: "white", display: "flex" }}
        >
          <Check size={18} strokeWidth={2.5} />
        </motion.div>
      </motion.div>
    </div>
  );
}

export default SlideToConfirm;
