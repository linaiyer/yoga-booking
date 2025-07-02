import styles from './StudioSearchBar.module.css';

export default function StudioSearchBar() {
  return (
    <form className={styles.searchBar}>
      <input className={styles.input} type="text" placeholder="Enter city or zip code" />
      <input className={styles.input} type="date" />
      <input className={styles.input} type="time" />
      <input className={styles.input} type="number" min={1} placeholder="Guests" />
      <button className={styles.button} type="submit">Search</button>
    </form>
  );
} 