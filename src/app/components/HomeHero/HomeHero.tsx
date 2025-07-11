import styles from './HomeHero.module.css';

export default function HomeHero() {
  return (
    <section className={styles.hero}>
      <h1 className={styles.title}>All your favorite Yoga Studios in one place</h1>
      <div className={styles.overlay}>
        <form className={styles.ctaForm}>
          <span className={styles.icon} />
          <input className={styles.input} type="text" placeholder="Enter a city or ZIP code" aria-label="City or ZIP code" />
          <button className={styles.cta} type="submit">Find Studios Near You</button>
        </form>
      </div>
    </section>
  );
} 