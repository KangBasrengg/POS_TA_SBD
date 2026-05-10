import { createContext, useContext, useState, useEffect, useCallback } from "react";
 
const AuthContext = createContext(null);
 
const API_URL = "/api";
 
export function AuthProvider({ children }) {
  const [user, setUser]       = useState(null);
  const [token, setToken]     = useState(() => localStorage.getItem("kasir_token"));
  const [loading, setLoading] = useState(true); // cek sesi awal
 
  // Verifikasi token saat app pertama dibuka
  useEffect(() => {
    if (token) {
      fetchMe(token);
    } else {
      setLoading(false);
    }
  }, []);
 
  const fetchMe = async (tkn) => {
    try {
      const res = await fetch(`${API_URL}/auth/me`, {
        headers: { Authorization: `Bearer ${tkn}` },
      });
 
      if (res.ok) {
        const data = await res.json();
        setUser(data.user);
      } else {
        // Token tidak valid, bersihkan
        logout();
      }
    } catch {
      logout();
    } finally {
      setLoading(false);
    }
  };
 
  const login = useCallback(async (username, password) => {
    const res = await fetch(`${API_URL}/auth/login`, {
      method:  "POST",
      headers: { "Content-Type": "application/json" },
      body:    JSON.stringify({ username, password }),
    });
 
    const data = await res.json();
 
    if (!res.ok) {
      throw new Error(data.message || "Login gagal.");
    }
 
    localStorage.setItem("kasir_token", data.token);
    setToken(data.token);
    setUser(data.user);
 
    return data.user;
  }, []);
 
  const logout = useCallback(() => {
    localStorage.removeItem("kasir_token");
    setToken(null);
    setUser(null);
  }, []);
 
  const isAdmin = user?.role === "admin";
 
  return (
    <AuthContext.Provider value={{ user, token, loading, login, logout, isAdmin }}>
      {children}
    </AuthContext.Provider>
  );
}
 
export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth harus dipakai di dalam <AuthProvider>");
  return ctx;
}