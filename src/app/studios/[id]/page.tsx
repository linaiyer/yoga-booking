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

  const handleBooking = (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitted(true);
    console.log({ studioId, date, time, people });
  };

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
              {/* Image gallery */}
              {studio.photos && studio.photos.length > 0 && (
                <div style={{ display: 'flex', gap: '1rem', marginBottom: '2rem', overflowX: 'auto', borderRadius: '1.2rem' }}>
                  {studio.photos.map((url: string, i: number) => (
                    <img key={i} src={url} alt={studio.name} style={{ height: 260, borderRadius: '1.2rem', objectFit: 'cover', boxShadow: '0 2px 12px rgba(0,0,0,0.08)' }} />
                  ))}
                </div>
              )}
              {/* Title, rating, tags */}
              <div style={{ marginBottom: '1.2rem' }}>
                <h1 style={{ fontSize: '2.3rem', fontWeight: 700, margin: 0 }}>{studio.name}</h1>
                <div style={{ display: 'flex', alignItems: 'center', gap: '1.2rem', margin: '0.5rem 0 0.2rem 0' }}>
                  {studio.rating && <span style={{ fontSize: '1.2rem' }}>⭐ {studio.rating} ({studio.review_count} reviews)</span>}
                  {studio.price && <span style={{ background: '#dde5b6', color: '#4a5a40', borderRadius: '0.7rem', padding: '0.2rem 0.8rem', fontWeight: 600 }}>{studio.price}</span>}
                  {studio.categories && studio.categories.length > 0 && (
                    <span style={{ display: 'flex', gap: '0.5rem' }}>
                      {studio.categories.map((cat: any) => (
                        <span key={cat.alias} style={{ background: '#dde5b6', color: '#4a5a40', borderRadius: '0.7rem', padding: '0.2rem 0.8rem', fontWeight: 500 }}>{cat.title}</span>
                      ))}
                    </span>
                  )}
                </div>
                {studio.location && studio.location.display_address && (
                  <div style={{ color: '#6b705c', fontSize: '1.1rem', marginTop: 4 }}>{studio.location.display_address.join(', ')}</div>
                )}
              </div>
              {/* Quick facts */}
              <div style={{ display: 'flex', gap: '2rem', marginBottom: '1.5rem', flexWrap: 'wrap' }}>
                <div style={{ minWidth: 120 }}>
                  <div style={{ fontWeight: 600, fontSize: '1.05rem', marginBottom: 2 }}>Capacity</div>
                  <div style={{ color: '#4a5a40', fontSize: '1.1rem' }}>Up to 30 people</div>
                </div>
                <div style={{ minWidth: 120 }}>
                  <div style={{ fontWeight: 600, fontSize: '1.05rem', marginBottom: 2 }}>Phone</div>
                  <div style={{ color: '#4a5a40', fontSize: '1.1rem' }}>{studio.display_phone || 'N/A'}</div>
                </div>
                <div style={{ minWidth: 120 }}>
                  <div style={{ fontWeight: 600, fontSize: '1.05rem', marginBottom: 2 }}>Website</div>
                  <div style={{ color: '#4a5a40', fontSize: '1.1rem' }}>{studio.website ? <a href={studio.website} target="_blank" rel="noopener noreferrer" style={{ color: '#4a5a40', textDecoration: 'underline' }}>Visit</a> : 'N/A'}</div>
                </div>
                <div style={{ minWidth: 120 }}>
                  <div style={{ fontWeight: 600, fontSize: '1.05rem', marginBottom: 2 }}>Yelp</div>
                  <div style={{ color: '#4a5a40', fontSize: '1.1rem' }}>{studio.url ? <a href={studio.url} target="_blank" rel="noopener noreferrer" style={{ color: '#4a5a40', textDecoration: 'underline' }}>View</a> : 'N/A'}</div>
                </div>
              </div>
              {/* About/Description */}
              {studio.description && (
                <div style={{ marginBottom: '1.5rem' }}>
                  <h3 style={{ fontSize: '1.15rem', fontWeight: 600, marginBottom: 6 }}>About</h3>
                  <div style={{ fontSize: '1.08rem', color: '#4a5a40' }}>{studio.description}</div>
                </div>
              )}
              {/* Amenities/features */}
              {studio.attributes && (
                <div style={{ marginBottom: '1.5rem' }}>
                  <h3 style={{ fontSize: '1.15rem', fontWeight: 600, marginBottom: 6 }}>Amenities</h3>
                  <ul style={{ display: 'flex', flexWrap: 'wrap', gap: '0.7rem', padding: 0, listStyle: 'none' }}>
                    {Object.entries(studio.attributes).map(([key, value]) => (
                      <li key={key} style={{ background: '#f1f5f2', color: '#4a5a40', borderRadius: '0.7rem', padding: '0.2rem 0.8rem', fontSize: '0.98rem' }}>{key.replace(/_/g, ' ')}: {String(value)}</li>
                    ))}
                  </ul>
                </div>
              )}
              {/* Hours */}
              {studio.hours && studio.hours.length > 0 && studio.hours[0].open && (
                <div style={{ marginBottom: '1.5rem' }}>
                  <h3 style={{ fontSize: '1.15rem', fontWeight: 600, marginBottom: 6 }}>Hours</h3>
                  <ul style={{ padding: 0, listStyle: 'none', color: '#4a5a40', fontSize: '0.98rem' }}>
                    {studio.hours[0].open.map((h: any, i: number) => (
                      <li key={i}>{['Mon','Tue','Wed','Thu','Fri','Sat','Sun'][h.day]}: {h.start.slice(0,2)}:{h.start.slice(2)} - {h.end.slice(0,2)}:{h.end.slice(2)}</li>
                    ))}
                  </ul>
                </div>
              )}
              {/* Reviews */}
              {studio.review_count > 0 && (
                <div style={{ marginBottom: '2rem' }}>
                  <h3 style={{ fontSize: '1.15rem', fontWeight: 600, marginBottom: 6 }}>Reviews</h3>
                  <div style={{ color: '#6b705c', fontSize: '1.05rem' }}>See more reviews on <a href={studio.url} target="_blank" rel="noopener noreferrer" style={{ color: '#4a5a40', textDecoration: 'underline' }}>Yelp</a>.</div>
                </div>
              )}
              {/* House Rules/Policies (placeholder) */}
              <div style={{ marginBottom: '2rem' }}>
                <h3 style={{ fontSize: '1.15rem', fontWeight: 600, marginBottom: 6 }}>House Rules</h3>
                <ul style={{ color: '#4a5a40', fontSize: '1.05rem', paddingLeft: 18 }}>
                  <li>No smoking inside the studio</li>
                  <li>Arrive 10 minutes before class</li>
                  <li>Respect other guests and staff</li>
                  <li>Cancellation: 24 hours notice for full refund</li>
                </ul>
              </div>
            </div>
            {/* Right column: Booking widget, sticky on desktop */}
            <div style={{ flex: 1, minWidth: 320, maxWidth: 400, position: 'sticky', top: 32, alignSelf: 'flex-start' }}>
              <form onSubmit={handleBooking} style={{ background: '#dde5b6', borderRadius: '1.2rem', padding: '2rem', boxShadow: '0 2px 12px rgba(0,0,0,0.08)', marginBottom: '2rem' }}>
                <h2 style={{ fontSize: '1.3rem', fontWeight: 600, marginBottom: '1.2rem', color: '#4a5a40' }}>Book this Studio</h2>
                <div style={{ marginBottom: '1rem' }}>
                  <label style={{ display: 'block', marginBottom: 6 }}>Date</label>
                  <input type="date" value={date} onChange={e => setDate(e.target.value)} required style={{ width: '100%', padding: 8, borderRadius: 6, border: '1px solid #b7b7a4', fontSize: '1rem' }} />
                </div>
                <div style={{ marginBottom: '1rem' }}>
                  <label style={{ display: 'block', marginBottom: 6 }}>Time</label>
                  <input type="time" value={time} onChange={e => setTime(e.target.value)} required style={{ width: '100%', padding: 8, borderRadius: 6, border: '1px solid #b7b7a4', fontSize: '1rem' }} />
                </div>
                <div style={{ marginBottom: '1.5rem' }}>
                  <label style={{ display: 'block', marginBottom: 6 }}>Number of People</label>
                  <input type="number" min={1} max={30} value={people} onChange={e => setPeople(Number(e.target.value))} required style={{ width: '100%', padding: 8, borderRadius: 6, border: '1px solid #b7b7a4', fontSize: '1rem' }} />
                </div>
                <button type="submit" style={{ background: '#4a5a40', color: '#fff', fontWeight: 600, fontSize: '1.1rem', border: 'none', borderRadius: 8, padding: '0.8rem 2.2rem', cursor: 'pointer', boxShadow: '0 2px 8px rgba(0,0,0,0.10)' }}>
                  Book
                </button>
                {submitted && (
                  <div style={{ marginTop: '1.2rem', color: '#4a5a40', fontWeight: 500 }}>
                    Booking submitted! (Check console for details.)
                  </div>
                )}
              </form>
              {/* Host/Owner Info (placeholder) */}
              <div style={{ background: '#f1f5f2', borderRadius: '1.2rem', padding: '1.2rem', boxShadow: '0 2px 8px rgba(0,0,0,0.06)', marginBottom: '2rem' }}>
                <h3 style={{ fontSize: '1.1rem', fontWeight: 600, marginBottom: 6 }}>Host Info</h3>
                <div style={{ color: '#4a5a40', fontSize: '1.05rem' }}>Hosted by <b>{studio.name}</b></div>
                <div style={{ color: '#6b705c', fontSize: '0.98rem', marginTop: 4 }}>Pro Host</div>
                <div style={{ color: '#6b705c', fontSize: '0.98rem', marginTop: 2 }}>Response time: Within a day</div>
              </div>
            </div>
          </div>
        ) : null}
      </main>
    </>
  );
} 