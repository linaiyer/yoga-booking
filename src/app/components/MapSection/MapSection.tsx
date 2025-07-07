"use client";
import { useRef, useEffect } from 'react';
import Map from 'react-map-gl/maplibre';
import maplibregl from 'maplibre-gl';
import styles from './MapSection.module.css';
import 'maplibre-gl/dist/maplibre-gl.css';

type Studio = {
  name: string;
  latitude?: number;
  longitude?: number;
  address?: string;
  url?: string;
};

type MapSectionProps = {
  studios: Studio[];
  selectedStudioUrl: string | null;
  setSelectedStudioUrl: (url: string) => void;
};

export default function MapSection({ studios, selectedStudioUrl, setSelectedStudioUrl }: MapSectionProps) {
  const mapRef = useRef<any>(null);
  const popupRef = useRef<any>(null);

  // Pan/zoom to selected studio
  useEffect(() => {
    if (!mapRef.current || !selectedStudioUrl) return;
    const studio = studios.find(s => s.url === selectedStudioUrl);
    if (!studio || !studio.latitude || !studio.longitude) return;
    mapRef.current.flyTo({
      center: [studio.longitude, studio.latitude],
      zoom: 14,
      essential: true,
    });
  }, [selectedStudioUrl, studios]);

  // Add markers and popups
  useEffect(() => {
    if (!mapRef.current) return;
    // Remove existing markers
    if ((mapRef.current as any)._studioMarkers) {
      (mapRef.current as any)._studioMarkers.forEach((m: any) => m.remove());
    }
    (mapRef.current as any)._studioMarkers = (studios || []).filter(s => s.latitude && s.longitude).map((studio) => {
      const isSelected = selectedStudioUrl === studio.url;
      const el = document.createElement('div');
      el.style.background = isSelected ? '#4a5a40' : '#b7b7a4';
      el.style.borderRadius = '50%';
      el.style.width = isSelected ? '30px' : '22px';
      el.style.height = isSelected ? '30px' : '22px';
      el.style.display = 'flex';
      el.style.alignItems = 'center';
      el.style.justifyContent = 'center';
      el.style.color = '#fff';
      el.style.fontWeight = '700';
      el.style.fontSize = isSelected ? '20px' : '15px';
      el.style.border = isSelected ? '3px solid #dde5b6' : '2px solid #4a5a40';
      el.innerText = '🧘';
      el.style.transition = 'all 0.2s';
      el.onclick = () => {
        if (studio.url) setSelectedStudioUrl(studio.url);
      };
      return new maplibregl.Marker(el)
        .setLngLat([studio.longitude!, studio.latitude!])
        .addTo(mapRef.current);
    });
    // Remove any existing popup
    if (popupRef.current) {
      popupRef.current.remove();
      popupRef.current = null;
    }
    // Add popup for selected studio
    if (selectedStudioUrl) {
      const studio = studios.find(s => s.url === selectedStudioUrl);
      if (studio && studio.latitude && studio.longitude) {
        const popup = new maplibregl.Popup({ offset: 25 })
          .setLngLat([studio.longitude, studio.latitude])
          .setHTML(`<div style='min-width:180px'><strong>${studio.name}</strong><br/>${studio.address || ''}<br/><a href='${studio.url || '#'}' target='_blank'>View on Yelp</a></div>`)
          .addTo(mapRef.current);
        popupRef.current = popup;
      }
    }
  }, [studios, selectedStudioUrl, setSelectedStudioUrl]);

  return (
    <div className={styles.mapContainer}>
      <Map
        initialViewState={{ longitude: -118.35, latitude: 34.05, zoom: 10.2 }}
        style={{ width: '100%', height: '100%' }}
        mapStyle="https://tiles.stadiamaps.com/styles/osm_bright.json"
        onLoad={e => { mapRef.current = e.target; }}
      />
    </div>
  );
} 