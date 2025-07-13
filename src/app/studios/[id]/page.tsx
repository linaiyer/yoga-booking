"use client";
import { useParams } from 'next/navigation';
import Navbar from '../../components/Navbar/Navbar';
import { useState, useEffect, useRef } from 'react';
import Map from 'react-map-gl/maplibre';
import maplibregl from 'maplibre-gl';
import 'maplibre-gl/dist/maplibre-gl.css';
import { useMediaQuery } from 'react-responsive';

export default function StudioDetailPage() {
  const params = useParams();
  const studioId = params?.id;

  // Booking widget state
  const [date, setDate] = useState('');
  const [time, setTime] = useState('');
  const [people, setPeople] = useState(1);
  const [submitted, setSubmitted] = useState(false);

  // Yelp data state
  const [studio, setStudio] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  
  // Website info state
  const [websiteInfo, setWebsiteInfo] = useState<{ website?: string; error?: string } | null>(null);

  // Accordion state
  const isLargeScreen = useMediaQuery({ minWidth: 1024 });
  const [expandedSections, setExpandedSections] = useState<{[key: string]: boolean}>({
    hours: false,
    rules: false
  });
  // Sync expanded state with screen size on mount and when screen size changes
  useEffect(() => {
    setExpandedSections({ hours: isLargeScreen, rules: isLargeScreen });
  }, [isLargeScreen]);

  // Map refs
  const mapRef = useRef<any>(null);
  const markerRef = useRef<any>(null);

  useEffect(() => {
    if (!studioId) return;
    setLoading(true);
    fetch(`http://localhost:8000/studio/${studioId}`)
      .then(res => res.json())
      .then(data => {
        if (data.error) setError(data.error);
        else setStudio(data);
        setLoading(false);
      })
      .catch(e => {
        setError('Failed to fetch studio details.');
        setLoading(false);
      });
  }, [studioId]);

  useEffect(() => {
    if (!studioId) return;
    fetch(`http://localhost:8000/studio/${studioId}/website-info`)
      .then(res => res.json())
      .then(data => setWebsiteInfo(data))
      .catch(() => setWebsiteInfo({ error: 'Failed to fetch website info.' }));
  }, [studioId]);

  // Add marker to map when studio data is loaded
  useEffect(() => {
    if (!mapRef.current || !studio?.coordinates?.latitude || !studio?.coordinates?.longitude) return;
    
    // Remove existing marker
    if (markerRef.current) {
      markerRef.current.remove();
    }

    // Create marker element
    const el = document.createElement('div');
    el.style.background = '#264A2E';
    el.style.borderRadius = '50%';
    el.style.width = '30px';
    el.style.height = '30px';
    el.style.display = 'flex';
    el.style.alignItems = 'center';
    el.style.justifyContent = 'center';
    el.style.color = '#fff';
    el.style.fontWeight = '700';
    el.style.fontSize = '20px';
    el.style.border = '3px solid #dde5b6';
    el.innerText = '🧘';

    // Add marker to map
    markerRef.current = new maplibregl.Marker(el)
      .setLngLat([studio.coordinates.longitude, studio.coordinates.latitude])
      .addTo(mapRef.current);

    // Center map on studio
    mapRef.current.flyTo({
      center: [studio.coordinates.longitude, studio.coordinates.latitude],
      zoom: 14,
      essential: true,
    });
  }, [studio]);

  useEffect(() => {
    // Save previous background style
    const prevBg = document.body.style.background;
    // Set background with !important
    document.body.style.setProperty('background', "url('/assets/background_main.png') center/cover no-repeat", 'important');
    return () => {
      // Restore previous background
      document.body.style.setProperty('background', prevBg, 'important');
    };
  }, []);

  const handleBooking = (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitted(true);
    console.log({ studioId, date, time, people });
  };

  const toggleSection = (section: string) => {
    setExpandedSections(prev => ({
      ...prev,
      [section]: !prev[section]
    }));
  };

  // Calculate subtotal (placeholder pricing)
  const subtotal = people * 30; // $30 per person placeholder

  // Handle map click to open Google Maps
  const handleMapClick = () => {
    if (studio?.coordinates?.latitude && studio?.coordinates?.longitude) {
      const url = `https://www.google.com/maps?q=${studio.coordinates.latitude},${studio.coordinates.longitude}`;
      window.open(url, '_blank');
    }
  };

  return (
    <>
      <main>
        <Navbar />
        {/* Divider at the top */}
        <hr style={{ border: 'none', borderTop: '2px solid #e7eedf', margin: '0 0 2rem 0', width: '100%' }} />
        {/* Space after divider */}
        <div style={{ width: '100%', maxWidth: 900, margin: '0 auto', padding: '0 1rem' }}>
          {/* Studio Title */}
          {studio && (
            <>
              <h1 style={{ fontSize: 32, fontWeight: 700, margin: '1.5rem 0 0.5rem 0', lineHeight: 1.15, color: '#4a5a40', fontFamily: 'Inter, sans-serif', textAlign: 'left' }}>{studio.name}</h1>
              {/* Info line: rating, reviews, location, etc. */}
              <div style={{ display: 'flex', alignItems: 'center', gap: 18, fontSize: 17, color: '#4a5a40', marginBottom: '1.2rem', flexWrap: 'wrap', textAlign: 'left' }}>
                {/* Rating */}
                {studio.rating && (
                  <span style={{ display: 'flex', alignItems: 'center', gap: 4, fontWeight: 600 }}>
                    <span role="img" aria-label="star" style={{ color: '#F5C84C', fontSize: 20 }}>★</span>
                    {studio.rating}
                  </span>
                )}
                {/* Reviews */}
                {studio.review_count && (
                  <span style={{ color: '#4a5a40', fontWeight: 500, fontSize: 16 }}>
                    • <a href="#reviews" style={{ color: '#4a5a40', textDecoration: 'underline', fontWeight: 500 }}>{studio.review_count} reviews</a>
                  </span>
                )}
                {/* Location */}
                {studio.location && (
                  <span style={{ color: '#4a5a40', fontWeight: 400, fontSize: 16 }}>
                    • {studio.location.city}, {studio.location.state}
                  </span>
                )}
                {/* Distance (if available) */}
                {studio.distance && (
                  <span style={{ color: '#4a5a40', fontWeight: 400, fontSize: 16 }}>
                    • {studio.distance.toFixed(1)} miles away
                  </span>
                )}
              </div>
              {/* Main image below info line */}
              <div style={{
                position: 'relative',
                width: '100%',
                aspectRatio: '16/9',
                maxWidth: 900,
                maxHeight: 480,
                overflow: 'hidden',
                borderRadius: 24,
                margin: '0 0 2.5rem 0',
                background: (studio.photos && studio.photos.length > 0) || studio.image_url
                  ? undefined
                  : 'linear-gradient(120deg, #e7eedf 0%, #b7b7a4 100%)',
                boxShadow: '0 2px 12px rgba(0,0,0,0.08)',
              }}>
                {/* Show photo if available, else fallback */}
                {studio.photos && studio.photos.length > 0 ? (
                  <img
                    src={studio.photos[0]}
                    alt={studio.name}
                    style={{
                      width: '100%',
                      height: '100%',
                      objectFit: 'cover',
                      display: 'block',
                      borderRadius: 24,
                    }}
                  />
                ) : studio.image_url ? (
                  <img
                    src={studio.image_url}
                    alt={studio.name}
                    style={{
                      width: '100%',
                      height: '100%',
                      objectFit: 'cover',
                      display: 'block',
                      borderRadius: 24,
                    }}
                  />
                ) : (
                  <div style={{ width: '100%', height: '100%' }} />
                )}
              </div>
            </>
          )}
          {loading ? (
            <div style={{ fontSize: '1.3rem', textAlign: 'center', margin: '3rem 0' }}>Loading studio details...</div>
          ) : error ? (
            <div style={{ color: 'crimson', fontWeight: 600, textAlign: 'center', margin: '3rem 0' }}>{error}</div>
          ) : studio ? (
            <div style={{ display: 'flex', gap: '2.5rem', flexWrap: 'wrap', alignItems: 'flex-start' }}>
              {/* Left column: Gallery + Details */}
              <div style={{ flex: 2, minWidth: 0, maxWidth: 700 }}>
                {/* Yoga-specific quick facts */}
                <div style={{ 
                  background: 'white', 
                  borderRadius: '1.5rem', 
                  padding: '2rem 1.5rem', 
                  marginBottom: '1.5rem',
                  boxShadow: '0 1px 6px rgba(0,0,0,0.06)',
                  outline: '1px solid #f3f4f6',
                  border: 'none',
                }}>
                  <h3 style={{ fontSize: '1.15rem', fontWeight: 600, marginBottom: '1rem', display: 'flex', alignItems: 'center', gap: '0.5rem', color: '#2F4F2E' }}>
                    ✧ Quick Facts
                  </h3>
                  <div style={{
                    display: 'flex',
                    flexWrap: 'wrap',
                    gap: '0.5rem',
                  }}>
                    {/* Render each quick fact as a pill chip */}
                    <span style={{ background: '#e7eedf', color: '#2F4F2E', borderRadius: 999, padding: '0.4rem 0.9rem', fontWeight: 600, fontSize: '0.97rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                      <span style={{ display: 'inline-block', transform: 'translateY(2px)' }}>🧘</span>
                      Vinyasa · Yin · Hot
                    </span>
                    <span style={{ background: '#e7eedf', color: '#2F4F2E', borderRadius: 999, padding: '0.4rem 0.9rem', fontWeight: 600, fontSize: '0.97rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                      <span style={{ display: 'inline-block', transform: 'translateY(2px)' }}>🌡️</span>
                      85°F (heated)
                    </span>
                    <span style={{ background: '#e7eedf', color: '#2F4F2E', borderRadius: 999, padding: '0.4rem 0.9rem', fontWeight: 600, fontSize: '0.97rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                      <span style={{ display: 'inline-block', transform: 'translateY(2px)' }}>🧘‍♀️</span>
                      Mats · Blocks · Bolsters
                    </span>
                    <span style={{ background: '#e7eedf', color: '#2F4F2E', borderRadius: 999, padding: '0.4rem 0.9rem', fontWeight: 600, fontSize: '0.97rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                      <span style={{ display: 'inline-block', transform: 'translateY(2px)' }}>🚿</span>
                      2 showers, lockers
                    </span>
                    <span style={{ background: '#e7eedf', color: '#2F4F2E', borderRadius: 999, padding: '0.4rem 0.9rem', fontWeight: 600, fontSize: '0.97rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                      <span style={{ display: 'inline-block', transform: 'translateY(2px)' }}>🚇</span>
                      2 min walk from 4/6/E trains
                    </span>
                  </div>
                </div>

                {/* Contact info card */}
                <div style={{ 
                  background: 'white', 
                  borderRadius: '1.5rem', 
                  padding: '2rem 1.5rem', 
                  marginBottom: '1.5rem',
                  boxShadow: '0 1px 6px rgba(0,0,0,0.06)',
                  outline: '1px solid #f3f4f6',
                  border: 'none',
                }}>
                  <h3 style={{ fontSize: '1.15rem', fontWeight: 600, marginBottom: '1rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                    📞 Contact Info
                  </h3>
                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.5rem' }}>
                    <div>
                      <div style={{ fontWeight: 600, fontSize: '1.05rem', marginBottom: 2 }}>Capacity</div>
                      <div style={{ color: '#4a5a40', fontSize: '1.1rem' }}>Up to 30 people</div>
                    </div>
                    <div>
                      <div style={{ fontWeight: 600, fontSize: '1.05rem', marginBottom: 2 }}>Phone</div>
                      <div style={{ color: '#4a5a40', fontSize: '1.1rem' }}>{studio.display_phone || 'N/A'}</div>
                    </div>
                    <div>
                      <div style={{ fontWeight: 600, fontSize: '1.05rem', marginBottom: 2 }}>Website</div>
                      <div style={{ color: '#4a5a40', fontSize: '1.1rem' }}>
                        {websiteInfo && websiteInfo.website ? (
                          <a href={websiteInfo.website} target="_blank" rel="noopener noreferrer" style={{ color: '#4a5a40', textDecoration: 'underline' }}>Visit</a>
                        ) : websiteInfo && websiteInfo.error === 'No business website available from Yelp API.' ? (
                          <span style={{ color: '#2F4F2E', opacity: 0.7 }}>⧗ Coming soon</span>
                        ) : (
                          'N/A'
                        )}
                      </div>
                    </div>
                    <div>
                      <div style={{ fontWeight: 600, fontSize: '1.05rem', marginBottom: 2 }}>Yelp</div>
                      <div style={{ color: '#4a5a40', fontSize: '1.1rem' }}>{studio.url ? <a href={studio.url} target="_blank" rel="noopener noreferrer" style={{ color: '#4a5a40', textDecoration: 'underline' }}>View</a> : 'N/A'}</div>
                    </div>
                  </div>
                  {/* Working mini map */}
                  <div style={{ 
                    marginTop: '1rem', 
                    height: '150px', 
                    borderRadius: '0.8rem',
                    overflow: 'hidden',
                    position: 'relative',
                    cursor: 'pointer'
                  }} onClick={handleMapClick}>
                    <Map
                      initialViewState={{ 
                        longitude: studio.coordinates?.longitude || -74.006, 
                        latitude: studio.coordinates?.latitude || 40.7128, 
                        zoom: 14 
                      }}
                      style={{ width: '100%', height: '100%' }}
                      mapStyle="https://tiles.stadiamaps.com/styles/osm_bright.json"
                      onLoad={e => { mapRef.current = e.target; }}
                      interactive={false}
                    />
                    {/* Click overlay */}
                    <div style={{
                      position: 'absolute',
                      top: 0,
                      left: 0,
                      right: 0,
                      bottom: 0,
                      background: 'rgba(0,0,0,0.1)',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      color: '#4a5a40',
                      fontSize: '0.9rem',
                      fontWeight: 600,
                      backdropFilter: 'blur(1px)',
                      transition: 'all 0.2s'
                    }} onMouseOver={(e) => e.currentTarget.style.background = 'rgba(0,0,0,0.2)'} onMouseOut={(e) => e.currentTarget.style.background = 'rgba(0,0,0,0.1)'}>
                      🗺️ Click to open Google Maps
                    </div>
                  </div>
                </div>

                {/* About/Description */}
                {studio.description && (
                  <div style={{ 
                    background: 'white', 
                    borderRadius: '1.5rem', 
                    padding: '2rem 1.5rem', 
                    marginBottom: '1.5rem',
                    boxShadow: '0 1px 6px rgba(0,0,0,0.06)',
                    outline: '1px solid #f3f4f6',
                    border: 'none',
                  }}>
                    <h3 style={{ fontSize: '1.15rem', fontWeight: 600, marginBottom: '1rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                      ✧ About the Studio
                    </h3>
                    <div style={{ fontSize: '1.08rem', color: '#4a5a40', lineHeight: 1.6, fontFamily: '"Inter", sans-serif' }}>{studio.description}</div>
                  </div>
                )}

                {/* Amenities/features */}
                {studio.attributes && (
                  <div style={{ 
                    background: 'white', 
                    borderRadius: '1.5rem', 
                    padding: '2rem 1.5rem', 
                    marginBottom: '1.5rem',
                    boxShadow: '0 1px 6px rgba(0,0,0,0.06)',
                    outline: '1px solid #f3f4f6',
                    border: 'none',
                  }}>
                    <h3 style={{ fontSize: '1.15rem', fontWeight: 600, marginBottom: '1rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                      ✧ Amenities
                    </h3>
                    <ul style={{ display: 'flex', flexWrap: 'wrap', gap: '0.7rem', padding: 0, listStyle: 'none' }}>
                      {Object.entries(studio.attributes).map(([key, value]) => (
                        <li key={key} style={{ background: '#f1f5f2', color: '#4a5a40', borderRadius: '0.7rem', padding: '0.2rem 0.8rem', fontSize: '0.98rem' }}>{key.replace(/_/g, ' ')}: {String(value)}</li>
                      ))}
                    </ul>
                  </div>
                )}

                {/* Hours - Accordion */}
                {studio.hours && studio.hours.length > 0 && studio.hours[0].open && (
                  <div style={{ 
                    background: 'white', 
                    borderRadius: '1.5rem', 
                    padding: '2rem 1.5rem', 
                    marginBottom: '1.5rem',
                    boxShadow: '0 1px 6px rgba(0,0,0,0.06)',
                    outline: '1px solid #f3f4f6',
                    border: 'none',
                  }}>
                    <button 
                      onClick={() => setExpandedSections(s => ({ ...s, hours: !s.hours }))}
                      style={{ 
                        width: '100%', 
                        textAlign: 'left', 
                        background: 'none', 
                        border: 'none', 
                        cursor: 'pointer',
                        display: 'flex',
                        justifyContent: 'space-between',
                        alignItems: 'center',
                        padding: '0.5rem',
                        borderRadius: '0.5rem',
                        transition: 'background 0.2s',
                        fontWeight: 600,
                        fontSize: '1.15rem',
                        color: '#2F4F2E',
                      }}
                      aria-expanded={expandedSections.hours}
                    >
                      <span style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                        Hours
                      </span>
                      <span style={{ 
                        transform: expandedSections.hours ? 'rotate(90deg)' : 'rotate(0deg)',
                        transition: 'transform 0.2s',
                        fontSize: '1.2rem',
                        display: 'inline-block',
                      }}>
                        ▶
                      </span>
                    </button>
                    {expandedSections.hours && (
                      <ul style={{ 
                        padding: 0, 
                        listStyle: 'none', 
                        color: '#4a5a40', 
                        fontSize: '0.98rem', 
                        marginTop: '1rem',
                        paddingLeft: '20px',
                        borderLeft: '2px solid #D9E4D7'
                      }}>
                        {studio.hours[0].open.map((h: any, i: number) => (
                          <li key={i}>{['Mon','Tue','Wed','Thu','Fri','Sat','Sun'][h.day]}: {h.start.slice(0,2)}:{h.start.slice(2)} - {h.end.slice(0,2)}:{h.end.slice(2)}</li>
                        ))}
                      </ul>
                    )}
                  </div>
                )}
                {/* House Rules - Accordion */}
                <div style={{ 
                  background: 'white', 
                  borderRadius: '1.5rem', 
                  padding: '2rem 1.5rem', 
                  marginBottom: '2rem',
                  boxShadow: '0 1px 6px rgba(0,0,0,0.06)',
                  outline: '1px solid #f3f4f6',
                  border: 'none',
                }}>
                  <button 
                    onClick={() => setExpandedSections(s => ({ ...s, rules: !s.rules }))}
                    style={{ 
                      width: '100%', 
                      textAlign: 'left', 
                      background: 'none', 
                      border: 'none', 
                      cursor: 'pointer',
                      display: 'flex',
                      justifyContent: 'space-between',
                      alignItems: 'center',
                      padding: '0.5rem',
                      borderRadius: '0.5rem',
                      transition: 'background 0.2s',
                      fontWeight: 600,
                      fontSize: '1.15rem',
                      color: '#2F4F2E',
                    }}
                    aria-expanded={expandedSections.rules}
                  >
                    <span style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                      House Rules
                    </span>
                    <span style={{ 
                      transform: expandedSections.rules ? 'rotate(90deg)' : 'rotate(0deg)',
                      transition: 'transform 0.2s',
                      fontSize: '1.2rem',
                      display: 'inline-block',
                    }}>
                      ▶
                    </span>
                  </button>
                  {expandedSections.rules && (
                    <ul style={{ 
                      color: '#4a5a40', 
                      fontSize: '1.05rem', 
                      paddingLeft: '20px', 
                      marginTop: '1rem', 
                      lineHeight: 1.6,
                      borderLeft: '2px solid #D9E4D7'
                    }}>
                      <li>No smoking inside the studio</li>
                      <li>Arrive 10 minutes before class</li>
                      <li>Respect other guests and staff</li>
                      <li>Cancellation: 24 hours notice for full refund</li>
                    </ul>
                  )}
                </div>
              </div>

              {/* Right column: Booking widget, sticky on desktop */}
              <div style={{ flex: 1, minWidth: 320, maxWidth: 400, position: 'sticky', top: 96, alignSelf: 'flex-start' }}>
                <form onSubmit={handleBooking} style={{ 
                  background: '#e7eedf', 
                  borderRadius: '1.2rem', 
                  padding: '2rem', 
                  boxShadow: '0 4px 16px rgba(0,0,0,0.12)', 
                  marginBottom: '2rem',
                  border: '1.5px solid #2F4F2E'
                }}>
                  <h2 style={{ fontSize: 24, fontWeight: 600, marginBottom: '1.2rem', color: '#4a5a40', fontFamily: 'Inter, sans-serif' }}>Book this Studio</h2>
                  <div style={{ marginBottom: '1rem' }}>
                    <label style={{ display: 'block', marginBottom: 6, fontWeight: 600 }}>Date</label>
                    <input 
                      type="date" 
                      value={date} 
                      onChange={e => setDate(e.target.value)} 
                      required 
                      placeholder="Select a date"
                      style={{ 
                        width: '100%', 
                        padding: 12, 
                        borderRadius: 8, 
                        border: '2px solid #8FA88F', 
                        fontSize: '1rem',
                        background: 'white',
                        boxSizing: 'border-box',
                        height: '48px'
                      }} 
                    />
                  </div>
                  <div style={{ marginBottom: '1rem' }}>
                    <label style={{ display: 'block', marginBottom: 6, fontWeight: 600 }}>Time</label>
                    <input 
                      type="time" 
                      value={time} 
                      onChange={e => setTime(e.target.value)} 
                      required 
                      placeholder="Pick a class time"
                      style={{ 
                        width: '100%', 
                        padding: 12, 
                        borderRadius: 8, 
                        border: '2px solid #8FA88F', 
                        fontSize: '1rem',
                        background: 'white',
                        boxSizing: 'border-box',
                        height: '48px'
                      }} 
                    />
                  </div>
                  <div style={{ marginBottom: '1.5rem' }}>
                    <label style={{ display: 'block', marginBottom: 6, fontWeight: 600 }}>Number of People</label>
                    <input 
                      type="number" 
                      min={1} 
                      max={30} 
                      value={people} 
                      onChange={e => setPeople(Number(e.target.value))} 
                      required 
                      style={{ 
                        width: '100%', 
                        padding: 12, 
                        borderRadius: 8, 
                        border: '2px solid #8FA88F', 
                        fontSize: '1rem',
                        background: 'white',
                        boxSizing: 'border-box',
                        height: '48px'
                      }} 
                    />
                  </div>
                  {/* Pricing recap */}
                  <div style={{ 
                    marginBottom: '1.5rem', 
                    padding: '1rem', 
                    background: 'rgba(255,255,255,0.6)', 
                    borderRadius: 8,
                    textAlign: 'center'
                  }}>
                    <div style={{ fontSize: 16, color: '#4a5a40' }}>
                      Subtotal for {people} guest{people > 1 ? 's' : ''}: <strong>${subtotal}</strong>
                    </div>
                  </div>
                  <button 
                    type="submit" 
                    style={{ 
                      background: '#2F4F2E', 
                      color: '#fff', 
                      fontWeight: 600, 
                      fontSize: '1.1rem', 
                      border: 'none', 
                      borderRadius: 8, 
                      padding: '1rem 2.2rem', 
                      cursor: 'pointer', 
                      boxShadow: '0 2px 4px rgba(0,0,0,.15)',
                      width: '100%',
                      transition: 'background 0.15s ease',
                      height: '48px'
                    }}
                    onMouseOver={(e) => e.currentTarget.style.background = '#1a2f1a'}
                    onMouseOut={(e) => e.currentTarget.style.background = '#2F4F2E'}
                  >
                    Book Now
                  </button>
                  <div style={{ 
                    marginTop: '1rem', 
                    padding: '0.8rem', 
                    background: 'rgba(255,255,255,0.6)', 
                    borderRadius: 6, 
                    fontSize: '0.9rem',
                    color: '#4a5a40',
                    textAlign: 'center',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    gap: '0.5rem'
                  }}>
                    <span>ℹ️</span> Free cancellation up to 24h before class
                  </div>
                  {submitted && (
                    <div style={{ marginTop: '1.2rem', color: '#4a5a40', fontWeight: 500, textAlign: 'center' }}>
                      Booking submitted! (Check console for details.)
                    </div>
                  )}
                </form>
              </div>
            </div>
          ) : null}
        </div>
      </main>
    </>
  );
} 