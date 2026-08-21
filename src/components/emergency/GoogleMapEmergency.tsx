'use client';

import React, { useEffect, useRef, useState } from 'react';
import { Navigation, MapPin, ExternalLink, RefreshCw } from 'lucide-react';

interface HospitalLocation {
  name: string;
  lat: number;
  lng: number;
  address: string;
  eta: string;
  distance: string;
}

interface GoogleMapEmergencyProps {
  origin?: { lat: number; lng: number; name: string };
  hospital: HospitalLocation;
  apiKey?: string;
}

declare global {
  interface Window {
    google?: any;
    initGoogleMapEmergency?: () => void;
  }
}

export function GoogleMapEmergency({
  origin = { lat: 12.9352, lng: 77.6245, name: 'Your Location (Koramangala)' }, // Koramangala / Bangalore origin
  hospital,
  apiKey = process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY || 'AIzaSyC6AaQ9mU-hfC7aLE-G1mXoiBixf-UG1-s',
}: GoogleMapEmergencyProps) {
  const mapRef = useRef<HTMLDivElement>(null);
  const [mapLoaded, setMapLoaded] = useState<boolean>(false);
  const [loadError, setLoadError] = useState<boolean>(false);
  const [activeCoords, setActiveCoords] = useState<{ lat: number; lng: number }>(origin);

  // Try to get actual user geolocation if available
  useEffect(() => {
    if (typeof window !== 'undefined' && 'geolocation' in navigator) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          setActiveCoords({
            lat: position.coords.latitude,
            lng: position.coords.longitude,
          });
        },
        () => {
          // Keep default Bangalore coordinates
        },
        { timeout: 5000 }
      );
    }
  }, []);

  useEffect(() => {
    if (!mapRef.current) return;

    // Load Google Maps Script
    const loadGoogleMapsScript = () => {
      if (window.google && window.google.maps) {
        initMap();
        return;
      }

      const existingScript = document.getElementById('google-maps-script');
      if (!existingScript) {
        const script = document.createElement('script');
        script.id = 'google-maps-script';
        script.src = `https://maps.googleapis.com/maps/api/js?key=${apiKey}&libraries=places,geometry`;
        script.async = true;
        script.defer = true;
        script.onload = () => {
          initMap();
        };
        script.onerror = () => {
          setLoadError(true);
        };
        document.head.appendChild(script);
      } else {
        existingScript.addEventListener('load', initMap);
      }
    };

    const initMap = () => {
      if (!mapRef.current || !window.google?.maps) return;

      try {
        const userPos = { lat: activeCoords.lat, lng: activeCoords.lng };
        const destPos = { lat: hospital.lat, lng: hospital.lng };

        const map = new window.google.maps.Map(mapRef.current, {
          center: {
            lat: (userPos.lat + destPos.lat) / 2,
            lng: (userPos.lng + destPos.lng) / 2,
          },
          zoom: 13,
          disableDefaultUI: true,
          zoomControl: true,
          styles: [
            {
              featureType: 'poi.business',
              stylers: [{ visibility: 'off' }],
            },
            {
              featureType: 'road',
              elementType: 'geometry',
              stylers: [{ lightness: 100 }, { visibility: 'simplified' }],
            },
          ],
        });

        // User Location Marker
        new window.google.maps.Marker({
          position: userPos,
          map,
          title: origin.name,
          icon: {
            path: window.google.maps.SymbolPath.CIRCLE,
            scale: 8,
            fillColor: '#2563EB',
            fillOpacity: 1,
            strokeColor: '#FFFFFF',
            strokeWeight: 3,
          },
        });

        // Hospital Marker
        new window.google.maps.Marker({
          position: destPos,
          map,
          title: hospital.name,
          icon: {
            path: window.google.maps.SymbolPath.CIRCLE,
            scale: 10,
            fillColor: '#DC2626',
            fillOpacity: 1,
            strokeColor: '#FFFFFF',
            strokeWeight: 3,
          },
        });

        // Draw Route Line
        const directionsService = new window.google.maps.DirectionsService();
        const directionsRenderer = new window.google.maps.DirectionsRenderer({
          map,
          suppressMarkers: true,
          polylineOptions: {
            strokeColor: '#2563EB',
            strokeWeight: 5,
            strokeOpacity: 0.85,
          },
        });

        directionsService.route(
          {
            origin: userPos,
            destination: destPos,
            travelMode: window.google.maps.TravelMode.DRIVING,
          },
          (result: any, status: any) => {
            if (status === window.google.maps.DirectionsStatus.OK) {
              directionsRenderer.setDirections(result);
            }
          }
        );

        setMapLoaded(true);
      } catch (e) {
        setLoadError(true);
      }
    };

    loadGoogleMapsScript();
  }, [activeCoords, hospital, apiKey]);

  const googleMapsUrl = `https://www.google.com/maps/dir/?api=1&origin=${activeCoords.lat},${activeCoords.lng}&destination=${hospital.lat},${hospital.lng}&travelmode=driving`;

  return (
    <div className="relative w-full h-48 rounded-2xl bg-[#E8EEF5] dark:bg-slate-800 border border-slate-200 dark:border-slate-700 overflow-hidden shadow-inner group">
      
      {/* Real Google Map Canvas */}
      <div ref={mapRef} className="w-full h-full" />

      {/* Fallback visual if Maps JS encounters restrictions or while loading */}
      {!mapLoaded && (
        <div className="absolute inset-0 bg-[#E8EEF5] dark:bg-slate-800 flex flex-col items-center justify-center p-4">
          <iframe
            title="Google Maps Emergency Route"
            src={`https://www.google.com/maps/embed/v1/directions?key=${apiKey}&origin=${activeCoords.lat},${activeCoords.lng}&destination=${hospital.lat},${hospital.lng}&mode=driving`}
            className="w-full h-full border-0 absolute inset-0"
            loading="lazy"
            allowFullScreen
          />
        </div>
      )}

      {/* Floating Badges overlay matching reference image */}
      <div className="absolute top-3 left-3 z-10 flex flex-col items-start pointer-events-none">
        <div className="px-2.5 py-1 rounded-lg bg-[#1E2024]/90 backdrop-blur-md text-white text-[10px] font-bold shadow-md flex items-center gap-1.5">
          <span className="w-2 h-2 rounded-full bg-blue-500 animate-ping" />
          <span>Your Location</span>
        </div>
      </div>

      <div className="absolute bottom-3 right-3 z-10 flex flex-col items-end pointer-events-none">
        <div className="px-2.5 py-1 rounded-lg bg-[#2563EB] text-white text-[10px] font-black shadow-lg flex items-center gap-1.5">
          <Navigation className="w-3 h-3" />
          <span>{hospital.eta} ({hospital.distance})</span>
        </div>
      </div>

      {/* Open in Google Maps External Floating Button */}
      <a
        href={googleMapsUrl}
        target="_blank"
        rel="noopener noreferrer"
        className="absolute top-3 right-3 z-10 p-1.5 rounded-lg bg-white/90 dark:bg-black/80 hover:bg-white text-slate-700 dark:text-white shadow-md text-xs font-bold transition-all flex items-center gap-1 hover:scale-105"
        title="Open in Google Maps"
      >
        <ExternalLink className="w-3.5 h-3.5 text-[#2563EB]" />
      </a>

    </div>
  );
}
