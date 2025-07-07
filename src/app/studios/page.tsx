"use client";
import Navbar from '../components/Navbar/Navbar';
import StudioSearchBar from '../components/StudioSearchBar/StudioSearchBar';
import StudioFilters from '../components/StudioFilters/StudioFilters';
import StudioTags from '../components/StudioTags/StudioTags';
import StudioCard from '../components/StudioCard/StudioCard';
import MapSection from '../components/MapSection/MapSection';
import { useEffect, useState, useRef } from 'react';

export default function StudiosPage() {
  const [studios, setStudios] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedStudioUrl, setSelectedStudioUrl] = useState<string | null>(null);
  const [filters, setFilters] = useState<any>({});
  const [tags, setTags] = useState<string[]>([]);
  const [searchLocation, setSearchLocation] = useState<string>('Manhattan, NY');
  const [useCurrentLocation, setUseCurrentLocation] = useState(false);
  const [proximity, setProximity] = useState(10);
  const cardRefs = useRef<{ [url: string]: HTMLDivElement | null }>({});

  useEffect(() => {
    async function fetchStudios() {
      setLoading(true);
      try {
        // For now, just fetch all studios for Manhattan, NY
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

  useEffect(() => {
    if (selectedStudioUrl && cardRefs.current[selectedStudioUrl]) {
      cardRefs.current[selectedStudioUrl]?.scrollIntoView({ behavior: 'smooth', block: 'center' });
    }
  }, [selectedStudioUrl]);

  // Client-side filtering logic
  const filteredStudios = studios.filter((studio) => {
    // Rating
    if (filters.rating && studio.rating < parseFloat(filters.rating)) return false;
    // Price (Yelp uses $/$$/$$$)
    if (filters.price && studio.price !== filters.price) return false;
    // Tags (simulate by searching in name, including experience levels)
    if (tags.length > 0) {
      const name = studio.name?.toLowerCase() || '';
      if (!tags.some(tag => name.includes(tag.toLowerCase()))) return false;
    }
    // Location (simulate by searching in address)
    if (searchLocation && !useCurrentLocation) {
      const address = studio.address?.toLowerCase() || '';
      if (!address.includes(searchLocation.toLowerCase())) return false;
    }
    // Proximity (simulate by always passing for now)
    return true;
  });

  const handleSearch = (location: string, prox: number, useGeo: boolean) => {
    setSearchLocation(location || '');
    setUseCurrentLocation(useGeo);
    setProximity(prox);
    // In a real app, you would refetch from the backend here
  };

  return (
    <>
      <Navbar />
      <div style={{ maxWidth: 1400, margin: '0 auto', padding: '2rem 1rem' }}>
        <div style={{ display: 'flex', gap: '2rem', minHeight: 700, flexWrap: 'nowrap' }}>
          {/* Left side: search, filters, cards */}
          <div style={{ flex: 2.2, minWidth: 0 }}>
            <StudioSearchBar onSearch={handleSearch} />
            <StudioFilters onFilterChange={setFilters} />
            <StudioTags onTagsChange={setTags} />
            <div style={{ color: '#4a5a40', fontSize: '1.1rem', margin: '1.5rem 0 1rem 0', fontWeight: 500 }}>
              {loading ? 'Loading studios...' : `Showing ${filteredStudios.length} studios near you`}
            </div>
            <div style={{ display: 'flex', flexWrap: 'wrap' }}>
              {filteredStudios.map((studio) => (
                <div
                  key={studio.url}
                  ref={el => { cardRefs.current[studio.url] = el; }}
                  style={{ width: 320, margin: '0.5rem' }}
                >
                  <StudioCard
                    name={studio.name}
                    location={studio.address}
                    rating={studio.rating}
                    link={studio.url}
                    isSelected={selectedStudioUrl === studio.url}
                    onClick={() => setSelectedStudioUrl(studio.url)}
                  />
                </div>
              ))}
            </div>
          </div>
          {/* Right side: map */}
          <div style={{ flex: 1, minWidth: 300, maxWidth: 400, height: 650, alignSelf: 'flex-start', position: 'sticky', top: 32 }}>
            <MapSection studios={filteredStudios} selectedStudioUrl={selectedStudioUrl} setSelectedStudioUrl={setSelectedStudioUrl} />
          </div>
        </div>
      </div>
    </>
  );
} 