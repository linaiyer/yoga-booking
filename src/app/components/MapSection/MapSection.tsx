"use client";
import { useState, useRef, useEffect } from 'react';
import Map from 'react-map-gl/maplibre';
import maplibregl from 'maplibre-gl';
import styles from './MapSection.module.css';
import 'maplibre-gl/dist/maplibre-gl.css';

const studios = [
  {
    name: 'Sunrise Yoga Center',
    latitude: 34.0522,
    longitude: -118.2437,
  },
  {
    name: 'Peaceful Lotus Studio',
    latitude: 34.0195,
    longitude: -118.4912,
  },
  {
    name: 'Urban Zen Loft',
    latitude: 34.1808,
    longitude: -118.3089,
  },
];

export default function MapSection() {
  const [viewState, setViewState] = useState({
    longitude: -118.35,
    latitude: 34.05,
    zoom: 10.2,
  });
  const mapRef = useRef<any>(null);

  function handleMapLoad(e: any) {
    mapRef.current = e.target;
    if (!mapRef.current) return;
    // Remove existing markers if any
    if ((mapRef.current as any)._studioMarkers) {
      (mapRef.current as any)._studioMarkers.forEach((m: any) => m.remove());
    }
    (mapRef.current as any)._studioMarkers = studios.map((studio) => {
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
        .setLngLat([studio.longitude, studio.latitude])
        .addTo(mapRef.current);
    });
    // Add zoom controls
    if (!mapRef.current._navControl) {
      mapRef.current._navControl = new maplibregl.NavigationControl();
      mapRef.current.addControl(mapRef.current._navControl, 'top-right');
    }
  }

  return (
    <div className={styles.mapContainer}>
      <Map
        initialViewState={viewState}
        onMove={evt => setViewState(evt.viewState)}
        style={{ width: '100%', height: '100%' }}
        mapStyle="https://tiles.stadiamaps.com/styles/osm_bright.json"
        onLoad={handleMapLoad}
      />
    </div>
  );
} 