import Navbar from '../components/Navbar/Navbar';

export default function LoginPage() {
  return (
    <>
      <Navbar />
      <main style={{ minHeight: '70vh', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center' }}>
        <h1 style={{ color: '#4a5a40', fontSize: '2.5rem', marginBottom: '1rem' }}>Log in</h1>
        <p style={{ color: '#4a5a40', fontSize: '1.2rem', maxWidth: 600, textAlign: 'center' }}>
          Log in to your Yoga Booking account to manage your classes and profile.
        </p>
      </main>
    </>
  );
} 