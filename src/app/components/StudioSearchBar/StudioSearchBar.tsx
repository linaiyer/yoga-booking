import styles from './StudioSearchBar.module.css';
import { useState } from 'react';

export default function StudioSearchBar({ onSearch }: { onSearch: (location: string, proximity: number, useCurrentLocation: boolean) => void }) {
  const [location, setLocation] = useState('');
  const [proximity, setProximity] = useState(10); // default 10 miles

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    onSearch(location, proximity, false);
  };

  const handleGeolocate = () => {
    onSearch('', proximity, true);
  };

  return (
    <form className={styles.searchBar} onSubmit={handleSearch}>
      <input
        className={styles.input}
        type="text"
        placeholder="Enter city or zip code"
        value={location}
        onChange={e => setLocation(e.target.value)}
      />
      <div className={styles.proximityContainer}>
        <input
          type="range"
          min={1}
          max={50}
          value={proximity}
          onChange={e => setProximity(Number(e.target.value))}
          className={styles.proximitySlider}
        />
        <span className={styles.proximityLabel}>Within {proximity} mi</span>
      </div>
      <button type="button" className={styles.geoBtn} onClick={handleGeolocate} title="Use my location">
        <span role="img" aria-label="location">📍</span>
      </button>
      <button className={styles.button} type="submit">Search</button>
    </form>
  );
} 