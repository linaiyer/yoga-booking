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
};

type MapSectionProps = {
  studios: Studio[];
};

export default function MapSection({ studios }: MapSectionProps) {
  const mapRef = useRef<any>(null);

  useEffect(() => {
    if (!mapRef.current) return;
    // Remove existing markers if any
    if ((mapRef.current as any)._studioMarkers) {
      (mapRef.current as any)._studioMarkers.forEach((m: any) => m.remove());
    }
    (mapRef.current as any)._studioMarkers = (studios || []).filter(s => s.latitude && s.longitude).map((studio) => {
      const el = document.createElement('div');
      el.style.background = '#b7b7a4';
      el.style.borderRadius = '50%';
      el.style.width = '22px';
      el.style.height = '22px';
      el.style.display = 'flex';
      el.style.alignItems = 'center';
      el.style.justifyContent = 'center';
      el.style.color = '#fff';
      el.style.fontWeight = '700';
      el.style.fontSize = '15px';
      el.style.border = '2px solid #4a5a40';
      el.innerText = '🧘';
      return new maplibregl.Marker(el)
        .setLngLat([studio.longitude!, studio.latitude!])
        .addTo(mapRef.current);
    });
  }, [studios]);

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