// src/pages/RegisterPage.jsx
import { useState } from "react";
import { useAuth } from "../context/AuthContext";

const API_URL = "/api";

export default function RegisterPage({ onBackToLogin }) {
  const [form, setForm] = useState({
    nama: "",
    username: "",
    password: "",
    confirmPassword: "",
    role: "kasir",
  });
  const [errors, setErrors] = useState({});
  const [apiError, setApiError] = useState("");
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [showPass, setShowPass] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
    setErrors({ ...errors, [e.target.name]: "" });
    setApiError("");
  };

  const validate = () => {
    const newErrors = {};
    if (!form.nama.trim())           newErrors.nama = "Nama lengkap wajib diisi";
    if (!form.username.trim())       newErrors.username = "Username wajib diisi";
    else if (form.username.length < 3) newErrors.username = "Username minimal 3 karakter";
    else if (!/^[a-zA-Z0-9_]+$/.test(form.username))
      newErrors.username = "Username hanya boleh huruf, angka, dan underscore";
    if (!form.password)              newErrors.password = "Password wajib diisi";
    else if (form.password.length < 6) newErrors.password = "Password minimal 6 karakter";
    if (!form.confirmPassword)       newErrors.confirmPassword = "Konfirmasi password wajib diisi";
    else if (form.password !== form.confirmPassword)
      newErrors.confirmPassword = "Password tidak cocok";
    return newErrors;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const validationErrors = validate();
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      return;
    }

    setLoading(true);
    try {
      const res = await fetch(`${API_URL}/auth/register`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          nama: form.nama.trim(),
          username: form.username.trim(),
          password: form.password,
          role: form.role,
        }),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.message || "Registrasi gagal.");

      setSuccess(true);
    } catch (err) {
      setApiError(err.message);
    } finally {
      setLoading(false);
    }
  };

  // ── Tampilan sukses ──────────────────────────────────────────────────────
  if (success) {
    return (
      <div style={styles.root}>
        <div style={styles.gridBg} aria-hidden="true" />
        <div style={{ ...styles.card, textAlign: "center" }}>
          <div style={styles.successIcon}>✓</div>
          <h2 style={styles.title}>Akun Berhasil Dibuat!</h2>
          <p style={{ ...styles.subtitle, marginBottom: "28px" }}>
            Akun <strong style={{ color: "#eab308" }}>{form.username}</strong> sudah siap digunakan.
            Silakan login dengan akun baru kamu.
          </p>
          <button onClick={onBackToLogin} style={styles.submitBtn}>
            Ke Halaman Login
          </button>
        </div>
      </div>
    );
  }

  // ── Form Register ────────────────────────────────────────────────────────
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

        <h1 style={styles.title}>Buat Akun Baru</h1>
        <p style={styles.subtitle}>Daftarkan akun kasir atau admin baru</p>

        {apiError && (
          <div style={styles.errorBox} role="alert">
            <span>⚠</span> {apiError}
          </div>
        )}

        <form onSubmit={handleSubmit} style={styles.form} noValidate>

          {/* Nama */}
          <Field
            id="nama" name="nama" label="Nama Lengkap"
            icon="👤" placeholder="Masukkan nama lengkap"
            value={form.nama} onChange={handleChange}
            error={errors.nama}
          />

          {/* Username */}
          <Field
            id="username" name="username" label="Username"
            icon="🪪" placeholder="Huruf, angka, underscore"
            value={form.username} onChange={handleChange}
            error={errors.username} autoComplete="username"
          />

          {/* Role */}
          <div style={styles.fieldGroup}>
            <label style={styles.label}>Role</label>
            <div style={styles.roleWrap}>
              {["kasir", "admin"].map((r) => (
                <button
                  key={r}
                  type="button"
                  onClick={() => setForm({ ...form, role: r })}
                  style={{
                    ...styles.roleBtn,
                    ...(form.role === r ? styles.roleBtnActive : {}),
                  }}
                >
                  {r === "kasir" ? "🧾 Kasir" : "⚙️ Admin"}
                </button>
              ))}
            </div>
          </div>

          {/* Password */}
          <Field
            id="password" name="password" label="Password"
            icon="🔒" placeholder="Minimal 6 karakter"
            value={form.password} onChange={handleChange}
            error={errors.password}
            type={showPass ? "text" : "password"}
            autoComplete="new-password"
            showToggle onToggle={() => setShowPass(!showPass)} showState={showPass}
          />

          {/* Konfirmasi Password */}
          <Field
            id="confirmPassword" name="confirmPassword" label="Konfirmasi Password"
            icon="🔑" placeholder="Ulangi password"
            value={form.confirmPassword} onChange={handleChange}
            error={errors.confirmPassword}
            type={showConfirm ? "text" : "password"}
            autoComplete="new-password"
            showToggle onToggle={() => setShowConfirm(!showConfirm)} showState={showConfirm}
          />

          <button
            type="submit"
            disabled={loading}
            style={{
              ...styles.submitBtn,
              marginTop: "4px",
              opacity: loading ? 0.7 : 1,
              cursor: loading ? "not-allowed" : "pointer",
            }}
          >
            {loading ? <span style={styles.spinner} /> : "Daftar Sekarang"}
          </button>
        </form>

        {/* Link ke login */}
        <p style={styles.loginLink}>
          Sudah punya akun?{" "}
          <button onClick={onBackToLogin} style={styles.linkBtn}>
            Masuk di sini
          </button>
        </p>

        <p style={styles.footer}>
          KasirNuril &copy; {new Date().getFullYear()} — Sistem Kasir Terpadu
        </p>
      </div>
    </div>
  );
}

// ─── Reusable Field Component ───────────────────────────────────────────────
function Field({
  id, name, label, icon, placeholder, value, onChange, error,
  type = "text", autoComplete, showToggle, onToggle, showState,
}) {
  return (
    <div style={styles.fieldGroup}>
      <label style={styles.label} htmlFor={id}>{label}</label>
      <div style={styles.inputWrap}>
        <span style={styles.inputIcon}>{icon}</span>
        <input
          id={id} name={name} type={type}
          placeholder={placeholder} value={value}
          onChange={onChange} autoComplete={autoComplete}
          style={{
            ...styles.input,
            borderColor: error ? "rgba(239,68,68,.5)" : "rgba(234,179,8,.15)",
            paddingRight: showToggle ? "44px" : "12px",
          }}
        />
        {showToggle && (
          <button
            type="button" onClick={onToggle}
            style={styles.eyeBtn}
            aria-label={showState ? "Sembunyikan" : "Tampilkan"}
          >
            {showState ? "🙈" : "👁"}
          </button>
        )}
      </div>
      {error && <p style={styles.fieldError}>{error}</p>}
    </div>
  );
}

// ─── Styles ─────────────────────────────────────────────────────────────────
const styles = {
  root: {
    minHeight: "100vh",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#0f1117",
    fontFamily: "'Segoe UI', sans-serif",
    position: "relative",
    overflow: "hidden",
    padding: "24px 16px",
  },
  gridBg: {
    position: "absolute",
    inset: 0,
    backgroundImage: `
      linear-gradient(rgba(234,179,8,.06) 1px, transparent 1px),
      linear-gradient(90deg, rgba(234,179,8,.06) 1px, transparent 1px)
    `,
    backgroundSize: "40px 40px",
    pointerEvents: "none",
  },
  card: {
    position: "relative",
    width: "100%",
    maxWidth: "440px",
    backgroundColor: "#1a1d27",
    border: "1px solid rgba(234,179,8,.2)",
    borderRadius: "16px",
    padding: "36px",
    boxShadow: "0 0 60px rgba(234,179,8,.08), 0 24px 48px rgba(0,0,0,.5)",
    zIndex: 1,
  },
  logoWrap: {
    display: "flex", alignItems: "center", gap: "10px",
    marginBottom: "24px", justifyContent: "center",
  },
  logoBox: {
    width: "36px", height: "36px",
    backgroundColor: "#eab308", borderRadius: "8px",
    display: "flex", alignItems: "center", justifyContent: "center",
    fontWeight: "800", fontSize: "18px", color: "#0f1117",
  },
  logoText: { fontSize: "22px", fontWeight: "700", color: "#f1f5f9", letterSpacing: "-0.3px" },
  logoAccent: { color: "#eab308" },
  title: { fontSize: "20px", fontWeight: "700", color: "#f1f5f9", margin: "0 0 6px", textAlign: "center" },
  subtitle: { fontSize: "13px", color: "#64748b", margin: "0 0 20px", textAlign: "center" },
  errorBox: {
    display: "flex", alignItems: "center", gap: "8px",
    backgroundColor: "rgba(239,68,68,.12)", border: "1px solid rgba(239,68,68,.3)",
    borderRadius: "8px", padding: "10px 14px",
    color: "#fca5a5", fontSize: "13px", marginBottom: "16px",
  },
  form: { display: "flex", flexDirection: "column", gap: "14px" },
  fieldGroup: { display: "flex", flexDirection: "column", gap: "5px" },
  label: { fontSize: "11px", fontWeight: "600", color: "#94a3b8", textTransform: "uppercase", letterSpacing: "0.5px" },
  inputWrap: { position: "relative", display: "flex", alignItems: "center" },
  inputIcon: { position: "absolute", left: "12px", fontSize: "14px", pointerEvents: "none", userSelect: "none" },
  input: {
    width: "100%", padding: "11px 12px 11px 38px",
    backgroundColor: "#0f1117", border: "1px solid rgba(234,179,8,.15)",
    borderRadius: "8px", color: "#f1f5f9", fontSize: "14px",
    outline: "none", transition: "border-color .2s", boxSizing: "border-box",
  },
  eyeBtn: {
    position: "absolute", right: "10px",
    background: "none", border: "none", cursor: "pointer",
    fontSize: "15px", padding: "4px", color: "#64748b", lineHeight: 1,
  },
  fieldError: { fontSize: "11px", color: "#f87171", margin: "2px 0 0" },
  roleWrap: { display: "flex", gap: "8px" },
  roleBtn: {
    flex: 1, padding: "9px", borderRadius: "8px", border: "1px solid rgba(234,179,8,.2)",
    backgroundColor: "#0f1117", color: "#64748b", fontSize: "13px",
    fontWeight: "600", cursor: "pointer", transition: "all .2s",
  },
  roleBtnActive: {
    backgroundColor: "rgba(234,179,8,.15)", borderColor: "#eab308",
    color: "#eab308",
  },
  submitBtn: {
    padding: "13px", backgroundColor: "#eab308", border: "none",
    borderRadius: "8px", color: "#0f1117", fontWeight: "700",
    fontSize: "15px", cursor: "pointer", transition: "background-color .2s",
    display: "flex", alignItems: "center", justifyContent: "center", minHeight: "48px",
  },
  spinner: {
    width: "18px", height: "18px",
    border: "2.5px solid rgba(15,17,23,.3)", borderTopColor: "#0f1117",
    borderRadius: "50%", animation: "spin .7s linear infinite", display: "inline-block",
  },
  successIcon: {
    width: "64px", height: "64px", borderRadius: "50%",
    backgroundColor: "rgba(34,197,94,.15)", border: "2px solid rgba(34,197,94,.4)",
    display: "flex", alignItems: "center", justifyContent: "center",
    fontSize: "28px", color: "#4ade80", margin: "0 auto 20px",
  },
  loginLink: { marginTop: "20px", fontSize: "13px", color: "#64748b", textAlign: "center" },
  linkBtn: {
    background: "none", border: "none", color: "#eab308",
    fontWeight: "600", cursor: "pointer", fontSize: "13px", padding: 0,
  },
  footer: { marginTop: "20px", fontSize: "11px", color: "#334155", textAlign: "center" },
};