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

  // Calculate percent fill for gradient and bubble position
  const min = 1, max = 50;
  const percent = ((proximity - min) * 100) / (max - min);

  // Tick marks every 10 mi
  const ticks = [1, 10, 20, 30, 40, 50];

  // Reset handler
  const handleReset = () => setProximity(10);

  // Accessibility: label id
  const sliderLabelId = "proximity-slider-label";

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
            Within {proximity} mi
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
            <label id={sliderLabelId} htmlFor="proximity-slider" style={{ position: 'absolute', left: -9999 }}>Search radius</label>
            <div className={styles.sliderTrackWrap}>
              {/* Value bubble */}
              <output
                className={styles.valueBubble}
                htmlFor="proximity-slider"
                style={{ left: `calc(${percent}% + (${8 - percent * 0.15}px))` }}
                aria-live="polite"
              >
                {proximity} mi
                <span className={styles.valueBubbleTail}>
                  <svg viewBox="0 0 16 8"><polygon points="0,0 16,0 8,8" fill="#e7eedf" /></svg>
                </span>
              </output>
              <input
                id="proximity-slider"
                type="range"
                min={min}
                max={max}
                value={proximity}
                onChange={e => setProximity(Number(e.target.value))}
                className={styles.proxSlider}
                aria-labelledby={sliderLabelId}
                style={{
                  // For Chrome/Edge: set --fill for gradient
                  ...(typeof window !== 'undefined' ? { '--fill': `${percent}%` } : {}) as any
                }}
              />
            </div>
            {/* Tick marks */}
            {/* Reset link */}
            <button type="button" className={styles.resetLink} onClick={handleReset}>Reset</button>
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