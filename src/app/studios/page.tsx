import Navbar from '../components/Navbar/Navbar';
import StudioSearchBar from '../components/StudioSearchBar/StudioSearchBar';
import StudioFilterBar from '../components/StudioFilterBar/StudioFilterBar';
import StudioCard from '../components/StudioCard/StudioCard';
import MapSection from '../components/MapSection/MapSection';

const mockStudios = [
  {
    image: '/assets/yoga1.jpg',
    name: 'Sunrise Yoga Center',
    price: '$25/class',
    location: 'Los Angeles, CA',
    rating: 4.9,
    features: ['Hot Yoga', 'Beginner Friendly', 'Meditation'],
  },
  {
    image: '/assets/yoga2.jpg',
    name: 'Peaceful Lotus Studio',
    price: '$30/class',
    location: 'Santa Monica, CA',
    rating: 4.8,
    features: ['Outdoor', 'Heated', 'Family'],
  },
  {
    image: '/assets/yoga3.jpg',
    name: 'Urban Zen Loft',
    price: '$20/class',
    location: 'Burbank, CA',
    rating: 4.7,
    features: ['Private', 'Prenatal', 'Meditation'],
  },
];

export default function StudiosPage() {
  return (
    <>
      <Navbar />
      <div style={{ maxWidth: 1400, margin: '0 auto', padding: '2rem 1rem' }}>
        <div style={{ display: 'flex', gap: '2rem', minHeight: 700, flexWrap: 'nowrap' }}>
          {/* Left side: search, filters, cards */}
          <div style={{ flex: 2.2, minWidth: 0 }}>
            <StudioSearchBar />
            <StudioFilterBar />
            <div style={{ color: '#4a5a40', fontSize: '1.1rem', margin: '1.5rem 0 1rem 0', fontWeight: 500 }}>
              Showing {mockStudios.length} studios near you
            </div>
            <div style={{ display: 'flex', flexWrap: 'wrap' }}>
              {mockStudios.map((studio) => (
                <StudioCard key={studio.name} {...studio} />
              ))}
            </div>
          </div>
          {/* Right side: map */}
          <div style={{ flex: 1, minWidth: 300, maxWidth: 400, height: 650, alignSelf: 'flex-start', position: 'sticky', top: 32 }}>
            <MapSection />
          </div>
        </div>
      </div>
    </>
  );
} 