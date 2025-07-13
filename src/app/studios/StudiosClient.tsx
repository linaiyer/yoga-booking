"use client";
import Navbar from '../components/Navbar/Navbar';
import StudioSearchBar from '../components/StudioSearchBar/StudioSearchBar';
import StudioFilters from '../components/StudioFilters/StudioFilters';
import StudioTags from '../components/StudioTags/StudioTags';
import StudioCard from '../components/StudioCard/StudioCard';
import MapSection from '../components/MapSection/MapSection';
import { useEffect, useState, useRef } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
// Haversine formula to calculate distance between two lat/lng points in miles
function getDistanceFromLatLonInMiles(lat1: number, lon1: number, lat2: number, lon2: number) {
  const R = 3958.8; // Radius of the earth in miles
  const dLat = (lat2 - lat1) * Math.PI / 180;
  const dLon = (lon2 - lon1) * Math.PI / 180;
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) *
    Math.sin(dLon / 2) * Math.sin(dLon / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return R * c;
}

export default function StudiosClient() {
  const [studios, setStudios] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedStudioUrl, setSelectedStudioUrl] = useState<string | null>(null);
  const [filters, setFilters] = useState<any>({});
  const [tags, setTags] = useState<string[]>([]);
  const [searchLocation, setSearchLocation] = useState<string>('');
  const [useCurrentLocation, setUseCurrentLocation] = useState(false);
  const [proximity, setProximity] = useState(10);
  const [userCoords, setUserCoords] = useState<{lat: number, lng: number} | null>(null);
  const cardRefs = useRef<{ [url: string]: HTMLDivElement | null }>({});
  const router = useRouter();
  const searchParams = useSearchParams();
  const initialLocation = searchParams.get('q') || '';

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

  // Geocode the searchLocation to lat/lng (simple version: only on search)
  useEffect(() => {
    if (useCurrentLocation) {
      if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(
          (pos) => setUserCoords({ lat: pos.coords.latitude, lng: pos.coords.longitude }),
          () => setUserCoords(null)
        );
      }
    } else if (searchLocation) {
      // Use a geocoding API (replace with your own or a real one)
      fetch(`https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(searchLocation)}`)
        .then(res => res.json())
        .then(data => {
          if (data && data.length > 0) {
            setUserCoords({ lat: parseFloat(data[0].lat), lng: parseFloat(data[0].lon) });
          } else {
            setUserCoords(null);
          }
        })
        .catch(() => setUserCoords(null));
    } else {
      setUserCoords(null);
    }
  }, [searchLocation, useCurrentLocation]);

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
    // Proximity/location filter
    if (userCoords && studio.coordinates) {
      const dist = getDistanceFromLatLonInMiles(userCoords.lat, userCoords.lng, studio.coordinates.latitude, studio.coordinates.longitude);
      if (dist > proximity) return false;
    } else if (searchLocation) {
      // Fallback: if geocoding failed, do substring match on address
      const address = studio.address?.toLowerCase() || '';
      if (!address.includes(searchLocation.toLowerCase())) return false;
    }
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
        <StudioSearchBar onSearch={handleSearch} initialLocation={initialLocation} />
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
                return (
                  <div
                    key={studio.id}
                    ref={el => { cardRefs.current[studio.url] = el; }}
                    style={{ height: '100%' }}
                  >
                    <StudioCard
                      id={studio.id}
                      name={studio.name}
                      image={studio.image_url}
                      features={studio.categories}
                      price={studio.price}
                      location={studio.address}
                      rating={studio.rating}
                      link={studio.url}
                      isSelected={selectedStudioUrl === studio.url}
                      onClick={() => setSelectedStudioUrl(studio.url)}
                      onDoubleClick={() => router.push(`/studios/${studio.id}`)}
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