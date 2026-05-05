import React, { useMemo } from "react";
import { motion } from "framer-motion";
import { Zap, MessageSquare, Briefcase, Cloud, Sun, BarChart2, Package, TrendingUp, ShieldCheck } from "lucide-react";

const defaultOrbits = [
  {
    id: 1,
    radiusFactor: 0.18,
    speed: 7,
    icon: <Zap size={10} color="#f59e0b" strokeWidth={1.5} />,
    iconSize: 22,
    orbitColor: "rgba(245,158,11,0.3)",
    orbitThickness: 1.5,
  },
  {
    id: 2,
    radiusFactor: 0.36,
    speed: 13,
    icon: <Package size={11} color="#336763" strokeWidth={1.5} />,
    iconSize: 26,
    orbitColor: "rgba(51,103,99,0.25)",
    orbitThickness: 1.5,
  },
  {
    id: 3,
    radiusFactor: 0.54,
    speed: 9,
    icon: <TrendingUp size={13} color="#335765" strokeWidth={1.5} />,
    iconSize: 30,
    orbitColor: "rgba(51,87,101,0.2)",
    orbitThickness: 2,
  },
  {
    id: 4,
    radiusFactor: 0.72,
    speed: 16,
    icon: <ShieldCheck size={14} color="#9ca3af" strokeWidth={1.5} />,
    iconSize: 34,
    orbitColor: "rgba(156,163,175,0.2)",
    orbitThickness: 1,
  },
];

const rotationTransition = (duration) => ({
  repeat: Infinity,
  duration,
  ease: "linear",
});

function BeamCircle({ size = 280, orbits: customOrbits, centerIcon }) {
  const orbitsData = useMemo(() => customOrbits || defaultOrbits, [customOrbits]);
  const halfSize = size / 2;

  const CenterIcon = useMemo(
    () => (
      <motion.div
        style={{
          width: halfSize * 0.22,
          height: halfSize * 0.22,
          borderRadius: "50%",
          background: "linear-gradient(135deg, #1a404d 0%, #335765 100%)",
          display: "grid",
          placeContent: "center",
          boxShadow: "0 8px 24px rgba(26,64,77,0.4)",
        }}
        animate={{ scale: [1, 1.08, 1] }}
        transition={{ repeat: Infinity, duration: 2.5, ease: "easeInOut" }}
      >
        {centerIcon ?? (
          <BarChart2 size={halfSize * 0.11} color="#f4fbf5" strokeWidth={1.5} />
        )}
      </motion.div>
    ),
    [halfSize, centerIcon]
  );

  return (
    <div style={{ display: "flex", justifyContent: "center", alignItems: "center", padding: "1rem", background: "transparent" }}>
      <div style={{ position: "relative", width: size, height: size }}>
        {orbitsData.map((orbit) => {
          const orbitDiameter = size * orbit.radiusFactor;
          const orbitRadius = orbitDiameter / 2;

          return (
            <React.Fragment key={orbit.id}>
              {/* Orbit ring */}
              <div
                style={{
                  position: "absolute",
                  borderRadius: "50%",
                  border: `${orbit.orbitThickness || 1}px dashed ${orbit.orbitColor || "rgba(26,64,77,0.2)"}`,
                  width: orbitDiameter,
                  height: orbitDiameter,
                  top: halfSize - orbitRadius,
                  left: halfSize - orbitRadius,
                }}
              />
              {/* Rotating container */}
              <motion.div
                style={{ position: "absolute", inset: 0, width: size, height: size }}
                animate={{ rotate: 360 }}
                transition={rotationTransition(orbit.speed)}
              >
                <div
                  style={{
                    position: "absolute",
                    top: halfSize,
                    left: halfSize + orbitRadius,
                    transform: "translate(-50%, -50%)",
                  }}
                >
                  <motion.div
                    style={{
                      borderRadius: "50%",
                      background: "rgba(255,255,255,0.92)",
                      backdropFilter: "blur(8px)",
                      boxShadow: "0 2px 12px rgba(26,64,77,0.15)",
                      display: "grid",
                      placeContent: "center",
                      width: orbit.iconSize,
                      height: orbit.iconSize,
                      border: "1px solid rgba(26,64,77,0.1)",
                    }}
                    animate={{ rotate: -360 }}
                    transition={rotationTransition(orbit.speed)}
                  >
                    {orbit.icon}
                  </motion.div>
                </div>
              </motion.div>
            </React.Fragment>
          );
        })}
        {/* Center icon */}
        <div style={{ position: "absolute", inset: 0, display: "grid", placeContent: "center", zIndex: 10 }}>
          {CenterIcon}
        </div>
      </div>
    </div>
  );
}

export default BeamCircle;
