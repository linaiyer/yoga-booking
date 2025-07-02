import Navbar from '../components/Navbar/Navbar';

export default function CalendarPage() {
  return (
    <>
      <Navbar />
      <main style={{ minHeight: '70vh', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center' }}>
        <h1 style={{ color: '#4a5a40', fontSize: '2.5rem', marginBottom: '1rem' }}>Calendar</h1>
        <p style={{ color: '#4a5a40', fontSize: '1.2rem', maxWidth: 600, textAlign: 'center' }}>
          View and manage your upcoming yoga classes. Stay organized and never miss a session!
        </p>
      </main>
    </>
  );
} 