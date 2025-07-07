import styles from './StudioTags.module.css';
import { useState } from 'react';

const tags = [
  'Vinyasa', 'Hatha', 'Yin', 'Restorative', 'Power', 'Hot', 'Prenatal', 'Meditation', 'Breathwork', 'SoundBath'
];

export default function StudioTags({ onTagsChange }: { onTagsChange: (tags: string[]) => void }) {
  const [selected, setSelected] = useState<string[]>([]);

  const handleToggle = (tag: string) => {
    setSelected(prev => {
      const next = prev.includes(tag) ? prev.filter(t => t !== tag) : [...prev, tag];
      onTagsChange(next);
      return next;
    });
  };

  return (
    <div className={styles.tagsBar}>
      {tags.map(tag => (
        <button
          key={tag}
          className={selected.includes(tag) ? styles.tagSelected : styles.tagBtn}
          type="button"
          onClick={() => handleToggle(tag)}
        >
          {tag}
        </button>
      ))}
    </div>
  );
} 