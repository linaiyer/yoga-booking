import styles from './HomeHero.module.css';

export default function HomeHero() {
  return (
    <section className={styles.hero}>
      <h1 className={styles.title}>All your favorite Yoga Studios in one place</h1>
      <div className={styles.overlay}>
        <div className={styles.searchBox}>
          <span className={styles.icon} />
          <input className={styles.input} type="text" placeholder="Enter your city or zip code" />
        </div>
        <button className={styles.cta}>Find Studios Near You</button>
      </div>
    </section>
  );
} 