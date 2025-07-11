import styles from './StudioSearchBar.module.css';
import { useState, useRef, useEffect } from 'react';
import { createPortal } from 'react-dom';

export default function StudioSearchBar({ onSearch, initialLocation = '' }: { onSearch: (location: string, proximity: number, useCurrentLocation: boolean) => void, initialLocation?: string }) {
  const [location, setLocation] = useState(initialLocation);
  const [proximity, setProximity] = useState(10); // default 10 miles
  const [showSlider, setShowSlider] = useState(false);
  const sliderRef = useRef<HTMLDivElement>(null);
  const pillButtonRef = useRef<HTMLButtonElement>(null);
  const [popoverPosition, setPopoverPosition] = useState<{top: number, left: number} | null>(null);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    onSearch(location, proximity, false);
  };

  const handleGeolocate = () => {
    onSearch('', proximity, true);
  };

  // Close slider popover on outside click
  function handleClickOutside(e: MouseEvent) {
    if (sliderRef.current && !sliderRef.current.contains(e.target as Node) && pillButtonRef.current && !pillButtonRef.current.contains(e.target as Node)) {
      setShowSlider(false);
    }
  }
  // Attach/detach event listener
  useEffect(() => {
    if (showSlider) {
      document.addEventListener('mousedown', handleClickOutside);
      if (pillButtonRef.current) {
        const rect = pillButtonRef.current.getBoundingClientRect();
        setPopoverPosition({
          top: rect.bottom + window.scrollY + 8, // 8px below
          left: rect.left + window.scrollX
        });
      }
    } else {
      document.removeEventListener('mousedown', handleClickOutside);
      setPopoverPosition(null);
    }
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [showSlider]);

  return (
    <form className={styles.searchCard} onSubmit={handleSearch} autoComplete="off">
      <div className={styles.locWrap}>
        <input
          className={styles.locInput}
          type="search"
          autoComplete="postal-code"
          placeholder="Enter city or zip code"
          value={location}
          onChange={e => setLocation(e.target.value)}
          list="zip-list"
        />
      </div>
      <div className={styles.sliderWrapper}>
        <div className={styles.proxPillWrap}>
          <button
            type="button"
            className={styles.proxPill}
            onClick={() => setShowSlider(v => !v)}
            aria-label="Set proximity"
            ref={pillButtonRef}
          >
            Within {proximity} mi <span className={styles.pillArrow}>⌄</span>
          </button>
        </div>
        {showSlider && typeof window !== 'undefined' && popoverPosition && createPortal(
          <div
            className={styles.proxPopover}
            ref={sliderRef}
            style={{
              position: 'absolute',
              top: popoverPosition.top,
              left: popoverPosition.left,
              zIndex: 9999
            }}
          >
            <div className={styles.sliderTrackWrap}>
              <input
                type="range"
                min={1}
                max={50}
                value={proximity}
                onChange={e => setProximity(Number(e.target.value))}
                className={styles.proxSlider}
              />
              <span className={styles.proxBadge} style={{ left: `${2 + (proximity-1)*98/49}%` }}>{proximity} mi</span>
            </div>
          </div>,
          document.body
        )}
      </div>
      <button
        type="submit"
        className={styles.searchBtn}
      >
        Search
      </button>
    </form>
  );
} 