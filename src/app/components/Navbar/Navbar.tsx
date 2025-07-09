import Link from 'next/link';
import styles from './Navbar.module.css';

export default function Navbar() {
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
      <Link href="/login" className={styles.loginBtn}>Log in</Link>
    </nav>
  );
} 