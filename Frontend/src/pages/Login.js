import { useContext, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import API_URL from "../config";
import AuthContext from "../AuthContext";
import { MagneticButton } from "../components/MagneticButton";
import { motion } from "framer-motion";
import { BarChart2, Mail, Lock, ArrowRight } from "lucide-react";

function Login() {
  const [form, setForm] = useState({ email: "", password: "" });
  const [loggingIn, setLoggingIn] = useState(false);
  const authContext = useContext(AuthContext);
  const navigate = useNavigate();

  const handleInputChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const doLogin = async (email, password) => {
    setLoggingIn(true);
    try {
      const res = await fetch(`${API_URL}/api/login`, {
        method: "POST",
        headers: { "Content-type": "application/json" },
        body: JSON.stringify({ email, password }),
      });
      if (!res.ok) { alert("Wrong credentials, try again."); setLoggingIn(false); return; }
      const data = await res.json();
      localStorage.setItem("user", JSON.stringify(data));
      authContext.signin(data._id, () => navigate("/"));
    } catch {
      alert("Cannot connect to backend. Ensure server is running on port 4000.");
    }
    setLoggingIn(false);
  };

  const loginUser = (e) => {
    e.preventDefault();
    if (!form.email || !form.password) { alert("Please enter both email and password."); return; }
    doLogin(form.email, form.password);
  };

  const quickLogin = () => doLogin("admin@finerise.com", "password123");

  return (
    <div
      style={{
        minHeight: "100vh",
        background: "var(--surface)",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        fontFamily: "Inter, sans-serif",
        padding: "1rem",
      }}
    >
      {/* Decorative blobs */}
      <div style={{ position: "fixed", inset: 0, overflow: "hidden", pointerEvents: "none", zIndex: 0 }}>
        <div style={{ position: "absolute", top: "-10%", right: "-5%", width: 500, height: 500, borderRadius: "50%", background: "radial-gradient(circle, rgba(51,87,101,0.12) 0%, transparent 70%)" }} />
        <div style={{ position: "absolute", bottom: "-10%", left: "-5%", width: 400, height: 400, borderRadius: "50%", background: "radial-gradient(circle, rgba(51,103,99,0.10) 0%, transparent 70%)" }} />
      </div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, ease: [0.4, 0, 0.2, 1] }}
        style={{
          position: "relative",
          zIndex: 1,
          width: "100%",
          maxWidth: 420,
          background: "rgba(255,255,255,0.82)",
          backdropFilter: "blur(20px)",
          WebkitBackdropFilter: "blur(20px)",
          border: "1px solid rgba(255,255,255,0.6)",
          borderRadius: 20,
          boxShadow: "0 24px 64px rgba(22,29,26,0.08)",
          padding: "2.5rem",
        }}
      >
        {/* Logo */}
        <div style={{ display: "flex", flexDirection: "column", alignItems: "center", marginBottom: "2rem" }}>
          <div
            style={{
              width: 50,
              height: 50,
              borderRadius: 14,
              background: "linear-gradient(135deg, #1a404d 0%, #335765 100%)",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              marginBottom: "1rem",
              boxShadow: "0 8px 24px rgba(26,64,77,0.3)",
            }}
          >
            <BarChart2 size={24} color="#f4fbf5" strokeWidth={1.5} />
          </div>
          <h1 style={{ fontSize: "1.5rem", fontWeight: 800, color: "var(--on-surface)", letterSpacing: "-0.03em", margin: 0 }}>
            Sign in to FineRise
          </h1>
          <p style={{ margin: "0.4rem 0 0", fontSize: "0.875rem", color: "var(--on-surface-variant)" }}>
            Your authoritative inventory platform
          </p>
        </div>

        <form onSubmit={loginUser} style={{ display: "flex", flexDirection: "column", gap: "1rem" }}>
          {/* Email field */}
          <div>
            <label style={{ display: "block", fontSize: "0.6875rem", fontWeight: 600, letterSpacing: "0.06em", textTransform: "uppercase", color: "var(--on-surface-variant)", marginBottom: "0.5rem" }}>
              Email
            </label>
            <div style={{ position: "relative" }}>
              <Mail size={15} strokeWidth={1.5} color="rgba(65,72,75,0.4)" style={{ position: "absolute", left: 14, top: "50%", transform: "translateY(-50%)", pointerEvents: "none" }} />
              <input
                id="email-address"
                name="email"
                type="email"
                autoComplete="email"
                required
                placeholder="you@example.com"
                value={form.email}
                onChange={handleInputChange}
                style={{
                  width: "100%",
                  paddingLeft: 40,
                  paddingRight: 14,
                  paddingTop: 11,
                  paddingBottom: 11,
                  background: "var(--surface-low)",
                  border: "1.5px solid transparent",
                  borderRadius: 10,
                  fontSize: "0.9rem",
                  fontFamily: "Inter, sans-serif",
                  color: "var(--on-surface)",
                  outline: "none",
                  boxSizing: "border-box",
                  transition: "border-color 0.2s, box-shadow 0.2s",
                }}
                onFocus={(e) => { e.target.style.borderColor = "rgba(26,64,77,0.35)"; e.target.style.boxShadow = "0 0 0 3px rgba(26,64,77,0.08)"; }}
                onBlur={(e) => { e.target.style.borderColor = "transparent"; e.target.style.boxShadow = "none"; }}
              />
            </div>
          </div>

          {/* Password field */}
          <div>
            <label style={{ display: "block", fontSize: "0.6875rem", fontWeight: 600, letterSpacing: "0.06em", textTransform: "uppercase", color: "var(--on-surface-variant)", marginBottom: "0.5rem" }}>
              Password
            </label>
            <div style={{ position: "relative" }}>
              <Lock size={15} strokeWidth={1.5} color="rgba(65,72,75,0.4)" style={{ position: "absolute", left: 14, top: "50%", transform: "translateY(-50%)", pointerEvents: "none" }} />
              <input
                id="password"
                name="password"
                type="password"
                autoComplete="current-password"
                required
                placeholder="••••••••"
                value={form.password}
                onChange={handleInputChange}
                style={{
                  width: "100%",
                  paddingLeft: 40,
                  paddingRight: 14,
                  paddingTop: 11,
                  paddingBottom: 11,
                  background: "var(--surface-low)",
                  border: "1.5px solid transparent",
                  borderRadius: 10,
                  fontSize: "0.9rem",
                  fontFamily: "Inter, sans-serif",
                  color: "var(--on-surface)",
                  outline: "none",
                  boxSizing: "border-box",
                  transition: "border-color 0.2s, box-shadow 0.2s",
                }}
                onFocus={(e) => { e.target.style.borderColor = "rgba(26,64,77,0.35)"; e.target.style.boxShadow = "0 0 0 3px rgba(26,64,77,0.08)"; }}
                onBlur={(e) => { e.target.style.borderColor = "transparent"; e.target.style.boxShadow = "none"; }}
              />
            </div>
          </div>

          {/* Remember & Forgot */}
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
            <label style={{ display: "flex", alignItems: "center", gap: 7, fontSize: "0.8125rem", color: "var(--on-surface-variant)", cursor: "pointer" }}>
              <input type="checkbox" name="remember-me" id="remember-me"
                style={{ accentColor: "var(--primary)", width: 14, height: 14 }} />
              Remember me
            </label>
            <span style={{ fontSize: "0.8125rem", color: "var(--primary)", fontWeight: 600, cursor: "pointer" }}>
              Forgot password?
            </span>
          </div>

          {/* Submit */}
          <div style={{ paddingTop: "0.5rem", display: "flex", flexDirection: "column", gap: "0.625rem" }}>
            <MagneticButton type="submit" variant="primary" size="md" style={{ width: "100%" }} onClick={() => {}}>
              {loggingIn ? "Signing in…" : "Sign in"}
              <ArrowRight size={15} strokeWidth={2} />
            </MagneticButton>

            {/* Quick Demo Login */}
            <button
              type="button"
              onClick={quickLogin}
              disabled={loggingIn}
              style={{
                width: "100%", padding: "10px 16px", border: "1.5px dashed rgba(26,64,77,0.25)",
                borderRadius: 10, background: "rgba(26,64,77,0.04)", cursor: "pointer",
                fontSize: "0.8125rem", fontFamily: "Inter, sans-serif", fontWeight: 600,
                color: "#1a404d", letterSpacing: "-0.01em", transition: "all 0.2s",
              }}
              onMouseEnter={e => e.target.style.background = "rgba(26,64,77,0.08)"}
              onMouseLeave={e => e.target.style.background = "rgba(26,64,77,0.04)"}
            >
              ⚡ Demo Login — admin@finerise.com
            </button>
          </div>
        </form>

        <p style={{ textAlign: "center", fontSize: "0.8125rem", color: "var(--on-surface-variant)", marginTop: "1.5rem" }}>
          Don't have an account?{" "}
          <Link to="/register" style={{ color: "var(--primary)", fontWeight: 600, textDecoration: "none" }}>
            Register now
          </Link>
        </p>
      </motion.div>
    </div>
  );
}

export default Login;
