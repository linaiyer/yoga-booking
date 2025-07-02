import styles from './StudioFilterBar.module.css';

const filters = [
  'Hot Yoga',
  'Beginner Friendly',
  'Meditation',
  'Prenatal',
  'Outdoor',
  'Heated',
  'Family',
  'Private',
];

export default function StudioFilterBar() {
  return (
    <div className={styles.filterBar}>
      {filters.map((filter) => (
        <button key={filter} className={styles.filterBtn}>{filter}</button>
      ))}
    </div>
  );
} 