// src/components/ProtectedRoute.jsx
import { Navigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

/**
 * Bungkus route yang butuh login.
 * Props:
 *   - adminOnly: jika true, hanya role "admin" yang boleh masuk
 *   - redirectTo: tujuan redirect jika tidak punya akses (default "/login")
 */
export default function ProtectedRoute({
  children,
  adminOnly = false,
  redirectTo = "/login",
}) {
  const { user, loading } = useAuth();

  // Tampilkan loading spinner sementara sesi dicek
  if (loading) {
    return (
      <div style={loadingStyles.root}>
        <div style={loadingStyles.spinner} />
        <p style={loadingStyles.text}>Memuat sesi...</p>
      </div>
    );
  }

  // Belum login
  if (!user) {
    return <Navigate to={redirectTo} replace />;
  }

  // Login tapi bukan admin, akses halaman admin-only
  if (adminOnly && user.role !== "admin") {
    return <Navigate to="/kasir" replace />;
  }

  return children;
}

const loadingStyles = {
  root: {
    minHeight: "100vh",
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#0f1117",
    gap: "14px",
  },
  spinner: {
    width: "36px",
    height: "36px",
    border: "3px solid rgba(234,179,8,.2)",
    borderTopColor: "#eab308",
    borderRadius: "50%",
    animation: "spin .7s linear infinite",
  },
  text: {
    color: "#64748b",
    fontSize: "13px",
    margin: 0,
  },
};