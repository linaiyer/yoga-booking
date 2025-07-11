import styles from './StudioFilterBar.module.css';
import { useState } from 'react';

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
  const [showFilters, setShowFilters] = useState(false);

  return (
    <div className={styles.filterBar}>
      <button
        className={styles.moreFiltersBtn}
        onClick={() => setShowFilters((v) => !v)}
        type="button"
      >
        {showFilters ? 'Less filters' : 'More filters'}
      </button>
      {showFilters && filters.map((filter) => (
        <button key={filter} className={styles.filterBtn}>{filter}</button>
      ))}
    </div>
  );
} 