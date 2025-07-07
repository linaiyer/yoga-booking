"use client";
import Navbar from '../components/Navbar/Navbar';
import StudioSearchBar from '../components/StudioSearchBar/StudioSearchBar';
import StudioFilterBar from '../components/StudioFilterBar/StudioFilterBar';
import StudioCard from '../components/StudioCard/StudioCard';
import MapSection from '../components/MapSection/MapSection';
import { useEffect, useState } from 'react';

export default function StudiosPage() {
  const [studios, setStudios] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedStudioUrl, setSelectedStudioUrl] = useState<string | null>(null);

  useEffect(() => {
    async function fetchStudios() {
      setLoading(true);
      try {
        const res = await fetch('http://localhost:8000/studios');
        const data = await res.json();
        setStudios(data);
      } catch (e) {
        setStudios([]);
      }
      setLoading(false);
    }
    fetchStudios();
  }, []);

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
              {loading ? 'Loading studios...' : `Showing ${studios.length} studios near you`}
            </div>
            <div style={{ display: 'flex', flexWrap: 'wrap' }}>
              {studios.map((studio) => (
                <StudioCard
                  key={studio.url}
                  name={studio.name}
                  location={studio.address}
                  rating={studio.rating}
                  link={studio.url}
                  isSelected={selectedStudioUrl === studio.url}
                  onClick={() => setSelectedStudioUrl(studio.url)}
                />
              ))}
            </div>
          </div>
          {/* Right side: map */}
          <div style={{ flex: 1, minWidth: 300, maxWidth: 400, height: 650, alignSelf: 'flex-start', position: 'sticky', top: 32 }}>
            <MapSection studios={studios} selectedStudioUrl={selectedStudioUrl} setSelectedStudioUrl={setSelectedStudioUrl} />
          </div>
        </div>
      </div>
    </>
  );
} 