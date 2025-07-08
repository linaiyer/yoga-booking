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
};

export default function StudioCard({ image, name, price, location, rating, features, link, isSelected, onClick }: StudioCardProps) {
  return (
    <div
      className={styles.card + (isSelected ? ' ' + styles.selected : '')}
      onClick={onClick}
      style={{ cursor: onClick ? 'pointer' : undefined }}
    >
      {image && <img src={image} alt={name} className={styles.image} />}
      <div className={styles.info}>
        <h2 className={styles.name}>{link ? <a href={link} target="_blank" rel="noopener noreferrer">{name}</a> : name}</h2>
        {features && features.length > 0 && (
          <div className={styles.features} style={{ marginBottom: '0.5rem' }}>
            {features.map((cat) => (
              <span key={cat} className={styles.feature}>{cat}</span>
            ))}
          </div>
        )}
        {price && <div className={styles.meta}><span className={styles.price}>{price}</span></div>}
        {location && <div className={styles.meta}><span className={styles.location}>{location}</span></div>}
        {rating && <div className={styles.rating}>⭐ {rating}</div>}
      </div>
    </div>
  );
} 