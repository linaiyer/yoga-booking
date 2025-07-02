import styles from './StudioCard.module.css';

type StudioCardProps = {
  image: string;
  name: string;
  price: string;
  location: string;
  rating: number;
  features: string[];
};

export default function StudioCard({ image, name, price, location, rating, features }: StudioCardProps) {
  return (
    <div className={styles.card}>
      <img src={image} alt={name} className={styles.image} />
      <div className={styles.info}>
        <h2 className={styles.name}>{name}</h2>
        <div className={styles.meta}>
          <span className={styles.price}>{price}</span>
          <span className={styles.location}>{location}</span>
        </div>
        <div className={styles.rating}>⭐ {rating.toFixed(1)}</div>
        <div className={styles.features}>
          {features.map((f) => (
            <span key={f} className={styles.feature}>{f}</span>
          ))}
        </div>
      </div>
    </div>
  );
} 