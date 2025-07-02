import Navbar from '../components/Navbar/Navbar';

export default function AboutPage() {
  return (
    <>
      <Navbar />
      <main style={{ minHeight: '70vh', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center' }}>
        <h1 style={{ color: '#4a5a40', fontSize: '2.5rem', marginBottom: '1rem' }}>About</h1>
        <p style={{ color: '#4a5a40', fontSize: '1.2rem', maxWidth: 600, textAlign: 'center' }}>
          Yoga Booking helps you find and book classes at your favorite yoga studios, all in one place. Our mission is to make wellness accessible and convenient for everyone.
        </p>
      </main>
    </>
  );
} 