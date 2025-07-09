"use client";
import Link from 'next/link';
import styles from './Navbar.module.css';
import { useState } from 'react';
import LoginModal from '../LoginModal/LoginModal';

export default function Navbar() {
  const [showLogin, setShowLogin] = useState(false);

  return (
    <nav className={styles.navbar}>
      <Link href="/" className={styles.logo} style={{ display: 'flex', alignItems: 'center' }}>
        <img src="/assets/YogaLink.png" alt="YogaLink" style={{ height: '40px', marginRight: '12px' }} />
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
        <li><Link href="/about">About</Link></li>
        {/* <li><Link href="/calendar">Calendar</Link></li> */}
      </ul>
      <button className={styles.loginBtn} onClick={() => setShowLogin(true)}>Log in</button>
      {showLogin && <LoginModal onClose={() => setShowLogin(false)} />}
    </nav>
  );
} 