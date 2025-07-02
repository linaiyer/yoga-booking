import Link from 'next/link';
import styles from './Navbar.module.css';

export default function Navbar() {
  return (
    <nav className={styles.navbar}>
      <Link href="/" className={styles.logo}>Yoga</Link>
      <ul className={styles.navLinks}>
        <li><Link href="/studios">Find a Yoga Studio</Link></li>
        <li><Link href="/about">About</Link></li>
        <li><Link href="/calendar">Calendar</Link></li>
      </ul>
      <Link href="/login" className={styles.loginBtn}>Log in</Link>
    </nav>
  );
} 