// src/pages/LoginPage.jsx
import { useState } from "react";
import { useAuth } from "../context/AuthContext";
import RegisterPage from "./RegisterPage";

export default function LoginPage() {
  const { login } = useAuth();

  const [form, setForm]         = useState({ username: "", password: "" });
  const [error, setError]       = useState("");
  const [loading, setLoading]   = useState(false);
  const [showPass, setShowPass] = useState(false);
  const [showRegister, setShowRegister] = useState(false);

  // Tampilkan halaman register
  if (showRegister) {
    return <RegisterPage onBackToLogin={() => setShowRegister(false)} />;
  }

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
    setError("");
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.username || !form.password) {
      setError("Username dan password wajib diisi.");
      return;
    }
    setLoading(true);
    try {
      await login(form.username, form.password);
      // AuthContext update user → AppContent otomatis render KasirApp
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={styles.root}>
      <div style={styles.gridBg} aria-hidden="true" />

      <div style={styles.card}>
        {/* Logo */}
        <div style={styles.logoWrap}>
          <div style={styles.logoBox}>K</div>
          <span style={styles.logoText}>
            Kasir<span style={styles.logoAccent}>Nuril</span>
          </span>
        </div>

        <h1 style={styles.title}>Masuk ke Sistem</h1>
        <p style={styles.subtitle}>Masukkan kredensial akun kasir kamu</p>

        {error && (
          <div style={styles.errorBox} role="alert">
            <span style={styles.errorIcon}>⚠</span>
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} style={styles.form} noValidate>
          {/* Username */}
          <div style={styles.fieldGroup}>
            <label style={styles.label} htmlFor="username">Username</label>
            <div style={styles.inputWrap}>
              <span style={styles.inputIcon}>👤</span>
              <input
                id="username" name="username" type="text"
                autoComplete="username" placeholder="Masukkan username"
                value={form.username} onChange={handleChange}
                style={styles.input} autoFocus
              />
            </div>
          </div>

          {/* Password */}
          <div style={styles.fieldGroup}>
            <label style={styles.label} htmlFor="password">Password</label>
            <div style={styles.inputWrap}>
              <span style={styles.inputIcon}>🔒</span>
              <input
                id="password" name="password"
                type={showPass ? "text" : "password"}
                autoComplete="current-password" placeholder="Masukkan password"
                value={form.password} onChange={handleChange}
                style={{ ...styles.input, paddingRight: "44px" }}
              />
              <button
                type="button" onClick={() => setShowPass(!showPass)}
                style={styles.eyeBtn}
                aria-label={showPass ? "Sembunyikan password" : "Tampilkan password"}
              >
                {showPass ? "🙈" : "👁"}
              </button>
            </div>
          </div>

          <button
            type="submit" disabled={loading}
            style={{
              ...styles.submitBtn,
              opacity: loading ? 0.7 : 1,
              cursor: loading ? "not-allowed" : "pointer",
            }}
          >
            {loading ? <span style={styles.spinner} /> : "Masuk"}
          </button>
        </form>

        {/* Link ke Register */}
        <p style={styles.registerLink}>
          Belum punya akun?{" "}
          <button onClick={() => setShowRegister(true)} style={styles.linkBtn}>
            Daftar di sini
          </button>
        </p>

        <p style={styles.footer}>
          KasirNuril &copy; {new Date().getFullYear()} — Sistem Kasir Terpadu
        </p>
      </div>
    </div>
  );
}

const styles = {
  root: {
    minHeight: "100vh", display: "flex", alignItems: "center",
    justifyContent: "center", backgroundColor: "#0f1117",
    fontFamily: "'Segoe UI', sans-serif", position: "relative", overflow: "hidden",
  },
  gridBg: {
    position: "absolute", inset: 0,
    backgroundImage: `
      linear-gradient(rgba(234,179,8,.06) 1px, transparent 1px),
      linear-gradient(90deg, rgba(234,179,8,.06) 1px, transparent 1px)
    `,
    backgroundSize: "40px 40px", pointerEvents: "none",
  },
  card: {
    position: "relative", width: "100%", maxWidth: "420px",
    backgroundColor: "#1a1d27", border: "1px solid rgba(234,179,8,.2)",
    borderRadius: "16px", padding: "40px 36px",
    boxShadow: "0 0 60px rgba(234,179,8,.08), 0 24px 48px rgba(0,0,0,.5)",
    zIndex: 1,
  },
  logoWrap: {
    display: "flex", alignItems: "center", gap: "10px",
    marginBottom: "28px", justifyContent: "center",
  },
  logoBox: {
    width: "36px", height: "36px", backgroundColor: "#eab308",
    borderRadius: "8px", display: "flex", alignItems: "center",
    justifyContent: "center", fontWeight: "800", fontSize: "18px", color: "#0f1117",
  },
  logoText: { fontSize: "22px", fontWeight: "700", color: "#f1f5f9", letterSpacing: "-0.3px" },
  logoAccent: { color: "#eab308" },
  title: { fontSize: "22px", fontWeight: "700", color: "#f1f5f9", margin: "0 0 6px", textAlign: "center" },
  subtitle: { fontSize: "13px", color: "#64748b", margin: "0 0 24px", textAlign: "center" },
  errorBox: {
    display: "flex", alignItems: "center", gap: "8px",
    backgroundColor: "rgba(239,68,68,.12)", border: "1px solid rgba(239,68,68,.3)",
    borderRadius: "8px", padding: "10px 14px",
    color: "#fca5a5", fontSize: "13px", marginBottom: "16px",
  },
  errorIcon: { flexShrink: 0, fontSize: "14px" },
  form: { display: "flex", flexDirection: "column", gap: "18px" },
  fieldGroup: { display: "flex", flexDirection: "column", gap: "6px" },
  label: { fontSize: "12px", fontWeight: "600", color: "#94a3b8", textTransform: "uppercase", letterSpacing: "0.5px" },
  inputWrap: { position: "relative", display: "flex", alignItems: "center" },
  inputIcon: { position: "absolute", left: "12px", fontSize: "14px", pointerEvents: "none", userSelect: "none" },
  input: {
    width: "100%", padding: "11px 12px 11px 38px",
    backgroundColor: "#0f1117", border: "1px solid rgba(234,179,8,.15)",
    borderRadius: "8px", color: "#f1f5f9", fontSize: "14px",
    outline: "none", transition: "border-color .2s", boxSizing: "border-box",
  },
  eyeBtn: {
    position: "absolute", right: "10px", background: "none", border: "none",
    cursor: "pointer", fontSize: "15px", padding: "4px", color: "#64748b", lineHeight: 1,
  },
  submitBtn: {
    marginTop: "6px", padding: "13px", backgroundColor: "#eab308",
    border: "none", borderRadius: "8px", color: "#0f1117",
    fontWeight: "700", fontSize: "15px", cursor: "pointer",
    transition: "background-color .2s",
    display: "flex", alignItems: "center", justifyContent: "center", minHeight: "48px",
  },
  spinner: {
    width: "18px", height: "18px",
    border: "2.5px solid rgba(15,17,23,.3)", borderTopColor: "#0f1117",
    borderRadius: "50%", animation: "spin .7s linear infinite", display: "inline-block",
  },
  registerLink: { marginTop: "20px", fontSize: "13px", color: "#64748b", textAlign: "center" },
  linkBtn: {
    background: "none", border: "none", color: "#eab308",
    fontWeight: "600", cursor: "pointer", fontSize: "13px", padding: 0,
  },
  footer: { marginTop: "16px", fontSize: "11px", color: "#334155", textAlign: "center" },
};