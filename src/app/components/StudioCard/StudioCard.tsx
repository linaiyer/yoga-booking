import styles from './StudioCard.module.css';

type StudioCardProps = {
  id?: string;
  image?: string;
  name: string;
  price?: string;
  location?: string;
  rating?: string | number;
  features?: string[];
  link?: string;
  isSelected?: boolean;
  onClick?: () => void;
  onDoubleClick?: () => void;
};

export default function StudioCard({ image, name, price, location, rating, features, link, isSelected, onClick, onDoubleClick }: StudioCardProps) {
  let clickTimer: NodeJS.Timeout | null = null;

  const handleClick = () => {
    if (clickTimer) clearTimeout(clickTimer);
    clickTimer = setTimeout(() => {
      if (onClick) onClick();
    }, 200);
  };

  const handleDoubleClick = () => {
    if (clickTimer) clearTimeout(clickTimer);
    if (onDoubleClick) onDoubleClick();
  };

  return (
    <div
      className={styles.card + (isSelected ? ' ' + styles.selected : '')}
      onClick={handleClick}
      onDoubleClick={handleDoubleClick}
      style={{ cursor: onClick ? 'pointer' : undefined }}
    >
      <div style={{ position: 'relative' }}>
        {image && <img src={image} alt={name} className={styles.image} />}
        {(rating || price) && (
          <div className={styles.badge}>
            {rating && <><span role="img" aria-label="star">★</span> {rating}</>}
            {!rating && price && <>{price}</>}
          </div>
        )}
      </div>
      <div className={styles.info}>
        <h2 className={styles.name}>{link ? <a href={link} target="_blank" rel="noopener noreferrer">{name}</a> : name}</h2>
        {location && <div className={styles.location}>{location}</div>}
        {features && features.length > 0 && (
          <div className={styles.features}>
            {features.map((cat) => (
              <span key={cat} className={styles.feature}>{cat}</span>
            ))}
          </div>
        )}
        <button className={styles.ctaBtn} tabIndex={0} onClick={onClick} type="button">
          Book
        </button>
      </div>
    </div>
  );
} 