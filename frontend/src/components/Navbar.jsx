import React from 'react';
import { FiShoppingCart, FiFileText, FiLogOut, FiUser } from 'react-icons/fi';
import { useAuth } from '../context/AuthContext';

export default function Navbar({ totalBelanja, paymentAmount, kembalian, cartCount, formatRupiah, onShowReport, onLogout }) {
  const { user } = useAuth();

  return (
    <nav className="navbar" id="navbar-main">
      <div className="navbar-brand">
        <div className="navbar-brand-icon">K</div>
        <div className="navbar-brand-text">
          Kasir<span>Nuril</span>
        </div>
      </div>

      {/* Rekap Harian — hanya admin */}
      {user?.role === 'admin' && (
        <div style={{ marginLeft: '20px', display: 'flex', alignItems: 'center' }}>
          <button
            className="btn"
            style={{
              display: 'flex', alignItems: 'center', gap: '8px',
              background: 'transparent', border: '1px solid #30363d',
              color: '#c9d1d9', padding: '6px 12px', fontSize: '0.85rem'
            }}
            onClick={onShowReport}
          >
            <FiFileText /> Rekap Harian
          </button>
        </div>
      )}

      <div className="navbar-stats">
        <div className="navbar-stat">
          <div className="navbar-stat-label">Total Belanja</div>
          <div className="navbar-stat-value">{formatRupiah(totalBelanja)}</div>
        </div>
        <div className="navbar-stat">
          <div className="navbar-stat-label">Uang Bayar</div>
          <div className="navbar-stat-value blue">{formatRupiah(paymentAmount)}</div>
        </div>
        <div className="navbar-stat">
          <div className="navbar-stat-label">Kembalian</div>
          <div className="navbar-stat-value green">
            {kembalian >= 0 ? formatRupiah(kembalian) : '-' + formatRupiah(Math.abs(kembalian))}
          </div>
        </div>

        {/* Cart icon */}
        <div style={{ position: 'relative', marginLeft: 8 }}>
          <FiShoppingCart size={20} color="#8b949e" />
          {cartCount > 0 && (
            <span style={{
              position: 'absolute', top: -6, right: -8,
              background: '#f85149', color: '#fff',
              fontSize: '0.6rem', fontWeight: 700,
              width: 16, height: 16, borderRadius: '50%',
              display: 'flex', alignItems: 'center', justifyContent: 'center'
            }}>
              {cartCount}
            </span>
          )}
        </div>

        {/* Divider */}
        <div style={{ width: 1, height: 28, background: '#30363d', marginLeft: 12 }} />

        {/* Info user */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginLeft: 4 }}>
          <div style={{
            width: 30, height: 30, borderRadius: '50%',
            backgroundColor: user?.role === 'admin' ? 'rgba(234,179,8,.15)' : 'rgba(63,185,80,.1)',
            border: `1px solid ${user?.role === 'admin' ? 'rgba(234,179,8,.4)' : 'rgba(63,185,80,.3)'}`,
            display: 'flex', alignItems: 'center', justifyContent: 'center',
          }}>
            <FiUser size={14} color={user?.role === 'admin' ? '#eab308' : '#3fb950'} />
          </div>
          <div style={{ lineHeight: 1.3 }}>
            <div style={{ fontSize: '0.8rem', fontWeight: 600, color: '#e6edf3' }}>
              {user?.nama || user?.username}
            </div>
            <div style={{
              fontSize: '0.65rem', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.5px',
              color: user?.role === 'admin' ? '#eab308' : '#3fb950'
            }}>
              {user?.role}
            </div>
          </div>
        </div>

        {/* Tombol Logout */}
        <button
          onClick={onLogout}
          title="Keluar"
          style={{
            display: 'flex', alignItems: 'center', gap: 6,
            background: 'transparent', border: '1px solid #30363d',
            borderRadius: 6, color: '#8b949e', padding: '6px 10px',
            fontSize: '0.8rem', cursor: 'pointer', marginLeft: 4,
            transition: 'all .2s',
          }}
          onMouseEnter={e => { e.currentTarget.style.borderColor = '#f85149'; e.currentTarget.style.color = '#f85149'; }}
          onMouseLeave={e => { e.currentTarget.style.borderColor = '#30363d'; e.currentTarget.style.color = '#8b949e'; }}
        >
          <FiLogOut size={14} /> Keluar
        </button>
      </div>
    </nav>
  );
}