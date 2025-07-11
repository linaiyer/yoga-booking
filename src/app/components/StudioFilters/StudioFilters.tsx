import styles from './StudioFilters.module.css';
import { useState } from 'react';

const priceRanges = ['$', '$$', '$$$'];

export default function StudioFilters({ onFilterChange }: { onFilterChange: (filters: any) => void }) {
  const [rating, setRating] = useState('');
  const [price, setPrice] = useState('');

  const handleRatingChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setRating(e.target.value);
    onFilterChange({ rating: e.target.value, price });
  };

  const handlePriceChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setPrice(e.target.value);
    onFilterChange({ rating, price: e.target.value });
  };

  return (
    <div className={styles.filtersBar}>
      <select className={styles.select} value={rating} onChange={handleRatingChange}>
        <option value="">Rating</option>
        <option value="4">4+ stars</option>
        <option value="4.5">4.5+ stars</option>
        <option value="5">5 stars</option>
      </select>
      <select className={styles.select} value={price} onChange={handlePriceChange}>
        <option value="">Price</option>
        {priceRanges.map(p => <option key={p} value={p}>{p}</option>)}
      </select>
      <button className={styles.moreFiltersPill} type="button">More filters</button>
    </div>
  );
} 