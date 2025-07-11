"use client";
import Link from 'next/link';
import styles from './Navbar.module.css';
import { useState, useEffect } from 'react';
import LoginModal from '../LoginModal/LoginModal';
import AccountSettingsModal from '../AccountSettingsModal/AccountSettingsModal';

export default function Navbar() {
  const [showLogin, setShowLogin] = useState(false);
  const [showAccount, setShowAccount] = useState(false);
  const [user, setUser] = useState<any>(null);

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
          fontFamily: '"Merriweather Sans", sans-serif'
        }}>YogaLink</span>
      </Link>
      <ul className={styles.navLinks}>
        <li><Link href="/studios">Find a Yoga Studio</Link></li>
        {/* <li><Link href="/about">About</Link></li> */}
        {/* <li><Link href="/calendar">Calendar</Link></li> */}
      </ul>
      {user ? (
        <button className={styles.loginBtn} onClick={() => setShowAccount(true)}>
          {user.displayName || user.email || user.phoneNumber || 'User'}
        </button>
      ) : (
        <button className={styles.loginBtn} onClick={() => setShowLogin(true)}>Log in</button>
      )}
      {showLogin && <LoginModal onClose={() => setShowLogin(false)} setUser={setUser} />}
      {showAccount && <AccountSettingsModal user={user} onClose={() => setShowAccount(false)} setUser={setUser} />}
    </nav>
  );
} 