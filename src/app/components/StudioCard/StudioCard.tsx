import styles from './StudioCard.module.css';

type StudioCardProps = {
  image?: string;
  name: string;
  price?: string;
  location?: string;
  rating?: string | number;
  features?: string[];
  link?: string;
};

export default function StudioCard({ image, name, price, location, rating, features, link }: StudioCardProps) {
  return (
    <div className={styles.card}>
      {image && <img src={image} alt={name} className={styles.image} />}
      <div className={styles.info}>
        <h2 className={styles.name}>{link ? <a href={link} target="_blank" rel="noopener noreferrer">{name}</a> : name}</h2>
        {price && <div className={styles.meta}><span className={styles.price}>{price}</span></div>}
        {location && <div className={styles.meta}><span className={styles.location}>{location}</span></div>}
        {rating && <div className={styles.rating}>⭐ {rating}</div>}
        {features && features.length > 0 && (
          <div className={styles.features}>
            {features.map((f) => (
              <span key={f} className={styles.feature}>{f}</span>
            ))}
          </div>
        )}
      </div>
    </div>
  );
} 