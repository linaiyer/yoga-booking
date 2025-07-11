"use client";
import styles from './HomeHero.module.css';
import { useState } from 'react';
import { useRouter } from 'next/navigation';

export default function HomeHero() {
  const [inputValue, setInputValue] = useState('');
  const router = useRouter();
  const suggestions = [
    'Ann Arbor · MI',
    'New York · NY',
    'San Francisco · CA',
    'Austin · TX',
    'Seattle · WA',
    'Chicago · IL',
    'Denver · CO',
    'Boston · MA',
    'Portland · OR',
    'Los Angeles · CA',
    'Atlanta · GA',
    'Albuquerque · NM',
    'Arlington · VA',
    'Anchorage · AK',
    'Aurora · CO',
    'Alexandria · VA',
    'Akron · OH',
    'Augusta · GA',
    'Amarillo · TX',
    'Anaheim · CA',
    'Baltimore · MD',
    'Birmingham · AL',
    'Buffalo · NY',
    'Charlotte · NC',
    'Columbus · OH',
    'Dallas · TX',
    'Detroit · MI',
    'El Paso · TX',
    'Fort Worth · TX',
    'Fresno · CA',
    'Houston · TX',
    'Indianapolis · IN',
    'Jacksonville · FL',
    'Kansas City · MO',
    'Las Vegas · NV',
    'Louisville · KY',
    'Memphis · TN',
    'Mesa · AZ',
    'Miami · FL',
    'Milwaukee · WI',
    'Minneapolis · MN',
    'Nashville · TN',
    'Oklahoma City · OK',
    'Omaha · NE',
    'Philadelphia · PA',
    'Phoenix · AZ',
    'Pittsburgh · PA',
    'Raleigh · NC',
    'Sacramento · CA',
    'San Antonio · TX',
    'San Diego · CA',
    'San Jose · CA',
    'Tucson · AZ',
    'Tulsa · OK',
    'Virginia Beach · VA',
    'Washington · DC',
  ];
  const filtered = inputValue.length > 0
    ? suggestions.filter(s => s.toLowerCase().startsWith(inputValue.toLowerCase()))
    : [];

  return (
    <section className={styles.hero}>
      <h1 className={styles.title}>All your favorite Yoga Studios in one place</h1>
      <div className={styles.overlay}>
        <form className={styles.ctaForm} autoComplete="off" onSubmit={e => {
          e.preventDefault();
          router.push(`/studios?q=${encodeURIComponent(inputValue)}`);
        }}>
          <div className={styles.inputWrapper}>
            <span className={styles.icon} />
            <input
              className={styles.input}
              type="text"
              placeholder="Enter a city or ZIP code"
              aria-label="City or ZIP code"
              value={inputValue}
              onChange={e => setInputValue(e.target.value)}
              autoComplete="off"
            />
            {filtered.length > 0 && (
              <ul className={styles.suggestions} role="listbox">
                {filtered.map(s => (
                  <li
                    key={s}
                    className={styles.suggestionItem}
                    role="option"
                    tabIndex={0}
                    onMouseDown={() => setInputValue(s)}
                  >
                    {s}
                  </li>
                ))}
              </ul>
            )}
          </div>
          <button className={styles.cta} type="submit">Find Studios Near You</button>
        </form>
      </div>
    </section>
  );
} 