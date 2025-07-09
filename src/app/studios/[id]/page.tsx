"use client";
import { useParams } from 'next/navigation';
import Navbar from '../../components/Navbar/Navbar';
import { useState, useEffect } from 'react';

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
  const [expandedSections, setExpandedSections] = useState<{[key: string]: boolean}>({
    hours: false,
    rules: false
  });

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

  return (
    <>
      <Navbar />
      <main style={{ maxWidth: 1200, margin: '0 auto', padding: '2rem 1rem', color: '#4a5a40' }}>
        {loading ? (
          <div style={{ fontSize: '1.3rem', textAlign: 'center', margin: '3rem 0' }}>Loading studio details...</div>
        ) : error ? (
          <div style={{ color: 'crimson', fontWeight: 600, textAlign: 'center', margin: '3rem 0' }}>{error}</div>
        ) : studio ? (
          <div style={{ display: 'flex', gap: '2.5rem', flexWrap: 'wrap', alignItems: 'flex-start' }}>
            {/* Left column: Gallery + Details */}
            <div style={{ flex: 2, minWidth: 0, maxWidth: 700 }}>
              {/* Studio title with rating and price */}
              <div style={{ marginBottom: '1.5rem' }}>
                <h1 style={{ 
                  fontSize: '2.5rem', 
                  fontWeight: 700, 
                  margin: 0, 
                  color: '#4a5a40',
                  fontFamily: '"Merriweather Sans", sans-serif'
                }}>{studio.name}</h1>
                <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', marginTop: '0.5rem' }}>
                  {studio.rating && (
                    <span style={{ fontSize: '1.1rem', color: '#FFD700', fontWeight: 600 }}>
                      ★ {studio.rating} ({studio.review_count} reviews)
                    </span>
                  )}
                  <span style={{ 
                    background: '#2F4F2E', 
                    color: 'white', 
                    borderRadius: '0.7rem', 
                    padding: '0.3rem 0.8rem', 
                    fontWeight: 600,
                    fontSize: '0.9rem'
                  }}>
                    From $19 / class
                  </span>
                </div>
              </div>

              {/* Image gallery with overlay */}
              {studio.photos && studio.photos.length > 0 && (
                <div style={{ 
                  position: 'relative', 
                  marginBottom: '2rem', 
                  borderRadius: '1.2rem', 
                  overflow: 'hidden',
                  boxShadow: '0 1px 4px rgba(0,0,0,.07)'
                }}>
                  <div style={{ display: 'flex', gap: '1rem', overflowX: 'auto' }}>
                    {studio.photos.map((url: string, i: number) => (
                      <img key={i} src={url} alt={studio.name} style={{ height: 260, borderRadius: '1.2rem', objectFit: 'cover' }} />
                    ))}
                  </div>
                  {/* Semi-opaque overlay for text */}
                  <div style={{ 
                    position: 'absolute', 
                    bottom: 0, 
                    left: 0, 
                    right: 0, 
                    background: 'linear-gradient(rgba(250,248,240,0.82), rgba(250,248,240,0.82))',
                    padding: '2rem 1.5rem 1.5rem',
                    color: '#4a5a40'
                  }}>
                    <h1 style={{ fontSize: '2.3rem', fontWeight: 700, margin: 0, color: '#4a5a40' }}>{studio.name}</h1>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '1.2rem', margin: '0.5rem 0 0.2rem 0' }}>
                      {studio.rating && <span style={{ fontSize: '1.2rem', color: '#FFD700' }}>⭐ {studio.rating} ({studio.review_count} reviews)</span>}
                      {studio.price && <span style={{ background: 'rgba(47,79,46,0.2)', color: '#4a5a40', borderRadius: '0.7rem', padding: '0.2rem 0.8rem', fontWeight: 600 }}>From ${studio.price}</span>}
                    </div>
                    {studio.location && studio.location.display_address && (
                      <div style={{ color: '#6b705c', fontSize: '1.1rem', marginTop: 4 }}>{studio.location.display_address.join(', ')}</div>
                    )}
                  </div>
                </div>
              )}

              {/* Yoga-specific quick facts */}
              <div style={{ 
                background: 'white', 
                borderRadius: '1.2rem', 
                padding: '1.5rem', 
                marginBottom: '1.5rem',
                boxShadow: '0 1px 4px rgba(0,0,0,.07)'
              }}>
                <h3 style={{ fontSize: '1.15rem', fontWeight: 600, marginBottom: '1rem', display: 'flex', alignItems: 'center', gap: '0.5rem', color: '#2F4F2E' }}>
                  ✧ Quick Facts
                </h3>
                <div style={{ 
                  display: 'grid', 
                  gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', 
                  gap: '12px'
                }}>
                  <span style={{ 
                    background: '#EDF4ED', 
                    color: '#2F4F2E', 
                    borderRadius: '0.7rem', 
                    padding: '0.4rem 0.8rem', 
                    fontWeight: 500, 
                    fontSize: '0.85rem',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '0.5rem'
                  }}>
                    <span style={{ display: 'inline-block', transform: 'translateY(2px)' }}>🧘</span>
                    Vinyasa · Yin · Hot
                  </span>
                  <span style={{ 
                    background: '#EDF4ED', 
                    color: '#2F4F2E', 
                    borderRadius: '0.7rem', 
                    padding: '0.4rem 0.8rem', 
                    fontWeight: 500, 
                    fontSize: '0.85rem',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '0.5rem'
                  }}>
                    <span style={{ display: 'inline-block', transform: 'translateY(2px)' }}>🌡️</span>
                    85°F (heated)
                  </span>
                  <span style={{ 
                    background: '#EDF4ED', 
                    color: '#2F4F2E', 
                    borderRadius: '0.7rem', 
                    padding: '0.4rem 0.8rem', 
                    fontWeight: 500, 
                    fontSize: '0.85rem',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '0.5rem'
                  }}>
                    <span style={{ display: 'inline-block', transform: 'translateY(2px)' }}>🧘‍♀️</span>
                    Mats · Blocks · Bolsters
                  </span>
                  <span style={{ 
                    background: '#EDF4ED', 
                    color: '#2F4F2E', 
                    borderRadius: '0.7rem', 
                    padding: '0.4rem 0.8rem', 
                    fontWeight: 500, 
                    fontSize: '0.85rem',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '0.5rem'
                  }}>
                    <span style={{ display: 'inline-block', transform: 'translateY(2px)' }}>🚿</span>
                    2 showers, lockers
                  </span>
                  <span style={{ 
                    background: '#EDF4ED', 
                    color: '#2F4F2E', 
                    borderRadius: '0.7rem', 
                    padding: '0.4rem 0.8rem', 
                    fontWeight: 500, 
                    fontSize: '0.85rem',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '0.5rem'
                  }}>
                    <span style={{ display: 'inline-block', transform: 'translateY(2px)' }}>🚇</span>
                    2 min walk from 4/6/E trains
                  </span>
                </div>
              </div>

              {/* Contact info card */}
              <div style={{ 
                background: 'white', 
                borderRadius: '1.2rem', 
                padding: '1.5rem', 
                marginBottom: '1.5rem',
                boxShadow: '0 1px 4px rgba(0,0,0,.07)'
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
                {/* Mini map placeholder */}
                <div style={{ 
                  marginTop: '1rem', 
                  height: '150px', 
                  background: '#f1f5f2', 
                  borderRadius: '0.8rem',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  color: '#6b705c',
                  fontSize: '0.9rem'
                }}>
                  🗺️ Map preview (click to open Google Maps)
                </div>
              </div>

              {/* About/Description */}
              {studio.description && (
                <div style={{ 
                  background: 'white', 
                  borderRadius: '1.2rem', 
                  padding: '1.5rem', 
                  marginBottom: '1.5rem',
                  boxShadow: '0 1px 4px rgba(0,0,0,.07)'
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
                  borderRadius: '1.2rem', 
                  padding: '1.5rem', 
                  marginBottom: '1.5rem',
                  boxShadow: '0 1px 4px rgba(0,0,0,.07)'
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
                  borderRadius: '1.2rem', 
                  padding: '1.5rem', 
                  marginBottom: '1.5rem',
                  boxShadow: '0 1px 4px rgba(0,0,0,.07)'
                }}>
                  <button 
                    onClick={() => toggleSection('hours')}
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
                      transition: 'background 0.2s'
                    }}
                    onMouseOver={(e) => e.currentTarget.style.background = '#F8F8F4'}
                    onMouseOut={(e) => e.currentTarget.style.background = 'transparent'}
                    aria-expanded={expandedSections.hours}
                  >
                    <h3 style={{ fontSize: '1.15rem', fontWeight: 600, margin: 0, display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                      🕐 Hours
                    </h3>
                    <span style={{ 
                      transform: expandedSections.hours ? 'rotate(180deg)' : 'rotate(0deg)',
                      transition: 'transform 0.2s',
                      fontSize: '1.2rem'
                    }}>▼</span>
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
                borderRadius: '1.2rem', 
                padding: '1.5rem', 
                marginBottom: '2rem',
                boxShadow: '0 1px 4px rgba(0,0,0,.07)'
              }}>
                <button 
                  onClick={() => toggleSection('rules')}
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
                    transition: 'background 0.2s'
                  }}
                  onMouseOver={(e) => e.currentTarget.style.background = '#F8F8F4'}
                  onMouseOut={(e) => e.currentTarget.style.background = 'transparent'}
                  aria-expanded={expandedSections.rules}
                >
                  <h3 style={{ fontSize: '1.15rem', fontWeight: 600, margin: 0, display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                    ✋ House Rules
                  </h3>
                  <span style={{ 
                    transform: expandedSections.rules ? 'rotate(180deg)' : 'rotate(0deg)',
                    transition: 'transform 0.2s',
                    fontSize: '1.2rem'
                  }}>▼</span>
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
                background: '#dde5b6', 
                borderRadius: '1.2rem', 
                padding: '2rem', 
                boxShadow: '0 4px 16px rgba(0,0,0,0.12)', 
                marginBottom: '2rem',
                border: '1.5px solid #2F4F2E'
              }}>
                <h2 style={{ fontSize: '1.3rem', fontWeight: 600, marginBottom: '1.2rem', color: '#4a5a40' }}>Book this Studio</h2>
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
                  <div style={{ fontSize: '1rem', color: '#4a5a40' }}>
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
      </main>
    </>
  );
} 