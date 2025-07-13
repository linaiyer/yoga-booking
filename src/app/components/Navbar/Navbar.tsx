"use client";
import Link from 'next/link';
import styles from './Navbar.module.css';
import { useState, useEffect, useRef } from 'react';
import LoginModal from '../LoginModal/LoginModal';
import AccountSettingsModal from '../AccountSettingsModal/AccountSettingsModal';

export default function Navbar() {
  const [showLogin, setShowLogin] = useState(false);
  const [showAccount, setShowAccount] = useState(false);
  const [user, setUser] = useState<any>(null);
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (typeof window !== 'undefined') {
      const stored = localStorage.getItem('yogalink_user');
      if (stored) {
        try {
          setUser(JSON.parse(stored));
        } catch {}
      }
    }
  }, []);

  // Close dropdown on outside click
  useEffect(() => {
    function handleClick(e: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) {
        setDropdownOpen(false);
      }
    }
    if (dropdownOpen) document.addEventListener('mousedown', handleClick);
    return () => document.removeEventListener('mousedown', handleClick);
  }, [dropdownOpen]);

  return (
    <nav className={styles.navbar}>
      <Link href="/" className={styles.logo} style={{ display: 'flex', alignItems: 'center' }}>
        <img src="/assets/YogaLink.png" alt="YogaLink" style={{ height: '40px' }} />
        <span style={{ 
          fontSize: '24px',
          fontWeight: 600,
          color: '#264A2E',
          textTransform: 'uppercase',
          letterSpacing: '0.04em',
          fontFamily: 'Merriweather Sans, sans-serif'
        }}>YogaLink</span>
      </Link>
      <ul className={styles.navLinks}>
        <li><Link href="/studios">Find a Yoga Studio</Link></li>
      </ul>
      {user ? (
        <div ref={dropdownRef} style={{ position: 'relative' }}>
          <button
            style={{
              background: 'none',
              border: 'none',
              display: 'flex',
              alignItems: 'center',
              gap: 6,
              fontWeight: 600,
              fontSize: 16,
              color: '#264A2E',
              cursor: 'pointer',
              padding: '6px 12px',
              borderRadius: 8,
              boxShadow: dropdownOpen ? '0 2px 8px rgba(0,0,0,0.08)' : 'none',
              transition: 'box-shadow 0.15s',
            }}
            aria-haspopup="menu"
            aria-expanded={dropdownOpen}
            onClick={() => setDropdownOpen(v => !v)}
          >
            {/* User icon SVG */}
            <svg width="22" height="22" fill="none" viewBox="0 0 24 24" stroke="#264A2E" strokeWidth="2"><circle cx="12" cy="8" r="4"/><path d="M4 20c0-2.5 3.5-4 8-4s8 1.5 8 4"/></svg>
            <span>{user.displayName || user.email || user.phoneNumber || 'User'}</span>
            {/* Chevron SVG */}
            <svg width="18" height="18" fill="none" viewBox="0 0 20 20" stroke="#264A2E" strokeWidth="2" style={{ transform: dropdownOpen ? 'rotate(180deg)' : 'rotate(0deg)', transition: 'transform 0.2s' }}><path d="M6 8l4 4 4-4"/></svg>
          </button>
          {dropdownOpen && (
            <div style={{
              position: 'absolute',
              right: 0,
              top: '110%',
              background: '#fff',
              borderRadius: 10,
              boxShadow: '0 4px 16px rgba(0,0,0,0.12)',
              minWidth: 160,
              zIndex: 100,
              padding: '8px 0',
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'stretch',
            }} role="menu">
              <button style={{
                background: 'none',
                border: 'none',
                padding: '10px 18px',
                textAlign: 'left',
                fontSize: 15,
                color: '#264A2E',
                cursor: 'pointer',
                fontWeight: 500,
                borderRadius: 6,
                transition: 'background 0.15s',
              }} onClick={() => { setShowAccount(true); setDropdownOpen(false); }} role="menuitem">Account</button>
              <button style={{
                background: 'none',
                border: 'none',
                padding: '10px 18px',
                textAlign: 'left',
                fontSize: 15,
                color: '#c0392b',
                cursor: 'pointer',
                fontWeight: 500,
                borderRadius: 6,
                transition: 'background 0.15s',
              }} onClick={() => { setUser(null); localStorage.removeItem('yogalink_user'); setDropdownOpen(false); }} role="menuitem">Log out</button>
            </div>
          )}
        </div>
      ) : (
        <button className={styles.loginBtn} onClick={() => setShowLogin(true)}>Log in</button>
      )}
      {showLogin && <LoginModal onClose={() => setShowLogin(false)} setUser={setUser} />}
      {showAccount && <AccountSettingsModal user={user} onClose={() => setShowAccount(false)} setUser={setUser} />}
    </nav>
  );
} 