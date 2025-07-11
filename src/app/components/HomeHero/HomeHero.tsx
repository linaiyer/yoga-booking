"use client";
import styles from './HomeHero.module.css';
import { useState } from 'react';

export default function HomeHero() {
  const [inputValue, setInputValue] = useState('');
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
  ];
  const filtered = inputValue.length > 0
    ? suggestions.filter(s => s.toLowerCase().includes(inputValue.toLowerCase()))
    : [];

  return (
    <section className={styles.hero}>
      <h1 className={styles.title}>All your favorite Yoga Studios in one place</h1>
      <div className={styles.overlay}>
        <form className={styles.ctaForm} autoComplete="off">
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