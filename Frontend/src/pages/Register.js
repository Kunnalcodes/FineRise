import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import UploadImage from "../components/UploadImage";
import API_URL from "../config";
import { MagneticButton } from "../components/MagneticButton";
import { motion } from "framer-motion";
import { BarChart2, Mail, Lock, User, Phone, ArrowRight } from "lucide-react";

function Register() {
  const [form, setForm] = useState({
    firstName: "",
    lastName: "",
    email: "",
    password: "",
    phoneNumber: "",
    imageUrl: "",
  });

  const navigate = useNavigate();

  const handleInputChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const registerUser = () => {
    fetch(`${API_URL}/api/register`, {
      method: "POST",
      headers: { "Content-type": "application/json" },
      body: JSON.stringify(form),
    })
      .then(() => {
        alert("Successfully Registered, Now Login with your details");
        navigate("/login");
      })
      .catch(console.error);
  };

  const uploadImage = async (image) => {
    const data = new FormData();
    data.append("file", image);
    data.append("upload_preset", "inventoryapp");
    await fetch("https://api.cloudinary.com/v1_1/ddhayhptm/image/upload", {
      method: "POST",
      body: data,
    })
      .then((r) => r.json())
      .then((d) => {
        setForm({ ...form, imageUrl: d.url });
        alert("Image Successfully Uploaded");
      })
      .catch(console.error);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    registerUser();
  };

  const inputStyle = {
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
  };

  const onFocus = (e) => { e.target.style.borderColor = "rgba(26,64,77,0.35)"; e.target.style.boxShadow = "0 0 0 3px rgba(26,64,77,0.08)"; };
  const onBlur  = (e) => { e.target.style.borderColor = "transparent"; e.target.style.boxShadow = "none"; };

  return (
    <div
      style={{
        minHeight: "100vh",
        background: "var(--surface)",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        fontFamily: "Inter, sans-serif",
        padding: "2rem 1rem",
      }}
    >
      {/* Decorative blobs */}
      <div style={{ position: "fixed", inset: 0, overflow: "hidden", pointerEvents: "none", zIndex: 0 }}>
        <div style={{ position: "absolute", top: "-10%", left: "-5%", width: 500, height: 500, borderRadius: "50%", background: "radial-gradient(circle, rgba(51,87,101,0.12) 0%, transparent 70%)" }} />
        <div style={{ position: "absolute", bottom: "-10%", right: "-5%", width: 400, height: 400, borderRadius: "50%", background: "radial-gradient(circle, rgba(51,103,99,0.10) 0%, transparent 70%)" }} />
      </div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, ease: [0.4, 0, 0.2, 1] }}
        style={{
          position: "relative",
          zIndex: 1,
          width: "100%",
          maxWidth: 460,
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
            Create your account
          </h1>
          <p style={{ margin: "0.4rem 0 0", fontSize: "0.875rem", color: "var(--on-surface-variant)" }}>
            Join the FineRise platform
          </p>
        </div>

        <form onSubmit={handleSubmit} style={{ display: "flex", flexDirection: "column", gap: "1rem" }}>
          {/* Name row */}
          <div style={{ display: "flex", gap: "0.75rem" }}>
            {[
              { name: "firstName", placeholder: "First Name" },
              { name: "lastName", placeholder: "Last Name" },
            ].map(({ name, placeholder }) => (
              <div key={name} style={{ flex: 1, position: "relative" }}>
                <User size={14} strokeWidth={1.5} color="rgba(65,72,75,0.4)"
                  style={{ position: "absolute", left: 12, top: "50%", transform: "translateY(-50%)", pointerEvents: "none" }} />
                <input
                  name={name}
                  type="text"
                  required
                  placeholder={placeholder}
                  value={form[name]}
                  onChange={handleInputChange}
                  style={{ ...inputStyle, paddingLeft: 36 }}
                  onFocus={onFocus}
                  onBlur={onBlur}
                />
              </div>
            ))}
          </div>

          {/* Email */}
          <div style={{ position: "relative" }}>
            <Mail size={15} strokeWidth={1.5} color="rgba(65,72,75,0.4)"
              style={{ position: "absolute", left: 14, top: "50%", transform: "translateY(-50%)", pointerEvents: "none" }} />
            <input
              id="email-address"
              name="email"
              type="email"
              autoComplete="email"
              required
              placeholder="Email address"
              value={form.email}
              onChange={handleInputChange}
              style={inputStyle}
              onFocus={onFocus}
              onBlur={onBlur}
            />
          </div>

          {/* Password */}
          <div style={{ position: "relative" }}>
            <Lock size={15} strokeWidth={1.5} color="rgba(65,72,75,0.4)"
              style={{ position: "absolute", left: 14, top: "50%", transform: "translateY(-50%)", pointerEvents: "none" }} />
            <input
              id="password"
              name="password"
              type="password"
              autoComplete="new-password"
              required
              placeholder="Password"
              value={form.password}
              onChange={handleInputChange}
              style={inputStyle}
              onFocus={onFocus}
              onBlur={onBlur}
            />
          </div>

          {/* Phone */}
          <div style={{ position: "relative" }}>
            <Phone size={15} strokeWidth={1.5} color="rgba(65,72,75,0.4)"
              style={{ position: "absolute", left: 14, top: "50%", transform: "translateY(-50%)", pointerEvents: "none" }} />
            <input
              name="phoneNumber"
              type="number"
              required
              placeholder="Phone Number"
              value={form.phoneNumber}
              onChange={handleInputChange}
              style={inputStyle}
              onFocus={onFocus}
              onBlur={onBlur}
            />
          </div>

          <UploadImage uploadImage={uploadImage} />

          {/* Terms */}
          <label style={{ display: "flex", alignItems: "center", gap: 8, fontSize: "0.8125rem", color: "var(--on-surface-variant)", cursor: "pointer" }}>
            <input type="checkbox" required style={{ accentColor: "var(--primary)", width: 14, height: 14 }} />
            I agree to the Terms &amp; Conditions
          </label>

          {/* Submit */}
          <div style={{ paddingTop: "0.5rem" }}>
            <MagneticButton type="submit" variant="primary" size="md" onClick={() => {}}>
              Create Account
              <ArrowRight size={15} strokeWidth={2} />
            </MagneticButton>
          </div>
        </form>

        <p style={{ textAlign: "center", fontSize: "0.8125rem", color: "var(--on-surface-variant)", marginTop: "1.5rem" }}>
          Already have an account?{" "}
          <Link to="/login" style={{ color: "var(--primary)", fontWeight: 600, textDecoration: "none" }}>
            Sign in
          </Link>
        </p>
      </motion.div>
    </div>
  );
}

export default Register;
