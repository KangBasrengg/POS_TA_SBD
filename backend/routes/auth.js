require('dotenv').config(); // ← tambah di sini supaya JWT_SECRET pasti terbaca
const express = require("express");
const router = express.Router();
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const pool = require("../db");

const JWT_SECRET = process.env.JWT_SECRET || 'kasirNuril_s3cr3t_k3y_2026';
const JWT_EXPIRES_IN = process.env.JWT_EXPIRES_IN || '8h';

// Middleware verifikasi token
const verifyToken = (req, res, next) => {
  const authHeader = req.headers["authorization"];
  const token = authHeader && authHeader.split(" ")[1];

  if (!token) {
    return res.status(401).json({ message: "Token tidak ditemukan. Akses ditolak." });
  }

  try {
    const decoded = jwt.verify(token, JWT_SECRET);
    req.user = decoded;
    next();
  } catch (err) {
    return res.status(403).json({ message: "Token tidak valid atau sudah kedaluwarsa." });
  }
};

// POST /api/auth/register
router.post("/register", async (req, res) => {
  const { nama, username, password, role } = req.body;

  if (!nama || !username || !password) {
    return res.status(400).json({ message: "Semua field wajib diisi." });
  }

  try {
    const [existing] = await pool.query(
      "SELECT id FROM users WHERE username = ?",
      [username]
    );

    if (existing.length > 0) {
      return res.status(409).json({ message: "Username sudah digunakan." });
    }

    const hashedPassword = await bcrypt.hash(password, 12);
    const userRole = role === "admin" ? "admin" : "kasir";

    await pool.query(
      "INSERT INTO users (nama, username, password, role) VALUES (?, ?, ?, ?)",
      [nama, username, hashedPassword, userRole]
    );

    res.status(201).json({ message: "Akun berhasil dibuat." });
  } catch (err) {
    console.error("Register error:", err);
    res.status(500).json({ message: "Terjadi kesalahan server." });
  }
});

// POST /api/auth/login
router.post("/login", async (req, res) => {
  const { username, password } = req.body;

  if (!username || !password) {
    return res.status(400).json({ message: "Username dan password wajib diisi." });
  }

  try {
    const [rows] = await pool.query(
      "SELECT * FROM users WHERE username = ? AND is_active = 1",
      [username]
    );

    if (rows.length === 0) {
      return res.status(401).json({ message: "Username atau password salah." });
    }

    const user = rows[0];
    const isMatch = await bcrypt.compare(password, user.password);

    if (!isMatch) {
      return res.status(401).json({ message: "Username atau password salah." });
    }

    const token = jwt.sign(
      { id: user.id, username: user.username, role: user.role, nama: user.nama },
      JWT_SECRET,
      { expiresIn: JWT_EXPIRES_IN }
    );

    res.json({
      message: "Login berhasil.",
      token,
      user: {
        id: user.id,
        nama: user.nama,
        username: user.username,
        role: user.role,
      },
    });
  } catch (err) {
    console.error("Login error:", err);
    res.status(500).json({ message: "Terjadi kesalahan server." });
  }
});

// GET /api/auth/me
router.get("/me", verifyToken, async (req, res) => {
  try {
    const [rows] = await pool.query(
      "SELECT id, nama, username, role, created_at FROM users WHERE id = ?",
      [req.user.id]
    );

    if (rows.length === 0) {
      return res.status(404).json({ message: "User tidak ditemukan." });
    }

    res.json({ user: rows[0] });
  } catch (err) {
    console.error("Me error:", err);
    res.status(500).json({ message: "Terjadi kesalahan server." });
  }
});

// POST /api/auth/logout
router.post("/logout", verifyToken, (req, res) => {
  res.json({ message: "Logout berhasil." });
});

module.exports = { router, verifyToken };