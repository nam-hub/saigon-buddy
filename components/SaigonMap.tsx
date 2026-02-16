
import React, { useEffect, useRef } from 'react';
import { SAIGON_LOCATIONS } from '../constants';
import { SaigonLocation } from '../types';

interface SaigonMapProps {
  onLocationSelect: (loc: SaigonLocation) => void;
  selectedId?: string;
}

const SaigonMap: React.FC<SaigonMapProps> = ({ onLocationSelect, selectedId }) => {
  const mapContainerRef = useRef<HTMLDivElement>(null);
  const mapInstanceRef = useRef<any>(null);
  const markersRef = useRef<Record<string, any>>({});

  useEffect(() => {
    if (!mapContainerRef.current || mapInstanceRef.current) return;

    // @ts-ignore
    const L = window.L;
    const map = L.map(mapContainerRef.current).setView([10.7769, 106.7009], 14);
    
    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      attribution: '&copy; OpenStreetMap contributors'
    }).addTo(map);

    SAIGON_LOCATIONS.forEach(loc => {
      const marker = L.marker([loc.lat, loc.lng])
        .addTo(map)
        .bindPopup(`<b>${loc.name}</b><br>${loc.shortDesc}`)
        .on('click', () => onLocationSelect(loc));
      
      markersRef.current[loc.id] = marker;
    });

    mapInstanceRef.current = map;

    return () => {
      if (mapInstanceRef.current) {
        mapInstanceRef.current.remove();
        mapInstanceRef.current = null;
      }
    };
  }, [onLocationSelect]);

  useEffect(() => {
    if (selectedId && markersRef.current[selectedId] && mapInstanceRef.current) {
      const marker = markersRef.current[selectedId];
      marker.openPopup();
      mapInstanceRef.current.setView(marker.getLatLng(), 15);
    }
  }, [selectedId]);

  return <div ref={mapContainerRef} className="h-full w-full shadow-inner bg-slate-200" />;
};

export default SaigonMap;
