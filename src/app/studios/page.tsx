import Navbar from '../components/Navbar/Navbar';

export default function StudiosPage() {
  return (
    <>
      <Navbar />
      <main style={{ minHeight: '70vh', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center' }}>
        <h1 style={{ color: '#4a5a40', fontSize: '2.5rem', marginBottom: '1rem' }}>Find a Yoga Studio</h1>
        <p style={{ color: '#4a5a40', fontSize: '1.2rem', maxWidth: 600, textAlign: 'center' }}>
          Discover yoga studios near you. Search by city or zip code to find your next class!
        </p>
      </main>
    </>
  );
} 