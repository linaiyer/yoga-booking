"use client";
import Navbar from '../components/Navbar/Navbar';
import StudioSearchBar from '../components/StudioSearchBar/StudioSearchBar';
import StudioFilters from '../components/StudioFilters/StudioFilters';
import StudioTags from '../components/StudioTags/StudioTags';
import StudioCard from '../components/StudioCard/StudioCard';
import MapSection from '../components/MapSection/MapSection';
import { useEffect, useState, useRef } from 'react';
import { useRouter } from 'next/navigation';

export default function StudiosPage() {
  const [studios, setStudios] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedStudioUrl, setSelectedStudioUrl] = useState<string | null>(null);
  const [filters, setFilters] = useState<any>({});
  const [tags, setTags] = useState<string[]>([]);
  const [searchLocation, setSearchLocation] = useState<string>('');
  const [useCurrentLocation, setUseCurrentLocation] = useState(false);
  const [proximity, setProximity] = useState(10);
  const cardRefs = useRef<{ [url: string]: HTMLDivElement | null }>({});
  const router = useRouter();

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

  useEffect(() => {
    if (selectedStudioUrl && cardRefs.current[selectedStudioUrl]) {
      cardRefs.current[selectedStudioUrl]?.scrollIntoView({ behavior: 'smooth', block: 'center' });
    }
  }, [selectedStudioUrl]);

  // Show all studios by default if no search/filter is applied
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

  // Set background_main.png as the background for this page
  useEffect(() => {
    const prev = document.body.style.backgroundImage;
    document.body.style.backgroundImage = "url('/assets/background_main.png')";
    document.body.style.backgroundSize = 'cover';
    document.body.style.backgroundPosition = 'center';
    document.body.style.backgroundRepeat = 'no-repeat';
    return () => { document.body.style.backgroundImage = prev; };
  }, []);

  return (
    <>
      <Navbar />
      <div style={{ maxWidth: 900, margin: '0 auto', padding: '0 0 24px 0' }}>
        <StudioSearchBar onSearch={handleSearch} />
        <StudioFilters onFilterChange={setFilters} />
        <StudioTags onTagsChange={setTags} />
      </div>
      <div style={{ maxWidth: 1400, margin: '0 auto', padding: '0 1rem' }}>
        <div style={{ color: '#4a5a40', fontSize: '1.2rem', fontWeight: 600, margin: '16px 0 8px 0', letterSpacing: '-0.5px' }}>
          {loading ? 'Loading studios...' : `Showing ${filteredStudios.length} studios near you`}
        </div>
        <div style={{ display: 'flex', gap: '2rem', minHeight: 700, flexWrap: 'nowrap' }}>
          {/* Left side: cards */}
          <div style={{ flex: 2.2, minWidth: 0 }}>
            <div
              style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(2, minmax(0, 1fr))',
                gap: '1rem',
                alignItems: 'stretch',
                width: '100%',
              }}
            >
              {filteredStudios.map((studio) => {
                // Extract Yelp business ID from the URL (e.g., https://www.yelp.com/biz/<id>)
                const yelpId = studio.url ? studio.url.split('/').pop() : '';
                return (
                  <div
                    key={studio.url}
                    ref={el => { cardRefs.current[studio.url] = el; }}
                    style={{ height: '100%' }}
                  >
                    <StudioCard
                      name={studio.name}
                      image={studio.image_url}
                      features={studio.categories}
                      price={studio.price}
                      location={studio.address}
                      rating={studio.rating}
                      link={studio.url}
                      isSelected={selectedStudioUrl === studio.url}
                      onClick={() => router.push(`/studios/${yelpId}`)}
                    />
                  </div>
                );
              })}
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