'use client';

import React, { useEffect, useRef, useState } from 'react';
import { Navigation, MapPin, ExternalLink, RefreshCw, Sparkles } from 'lucide-react';

export interface HospitalLocation {
  name: string;
  lat: number;
  lng: number;
  address: string;
  eta: string;
  distance: string;
  isRecommended?: boolean;
}

interface GoogleMapEmergencyProps {
  origin?: { lat: number; lng: number; name?: string };
  hospital: HospitalLocation;
  alternativeHospitals?: Array<{ name: string; lat: number; lng: number; eta?: string; distance?: string }>;
  onSelectHospital?: (hospital: any) => void;
  apiKey?: string;
}

declare global {
  interface Window {
    google?: any;
  }
}

export function GoogleMapEmergency({
  origin = { lat: 12.9352, lng: 77.6245, name: 'Your Location' },
  hospital,
  alternativeHospitals = [],
  onSelectHospital,
  apiKey = process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY || 'AIzaSyC6AaQ9mU-hfC7aLE-G1mXoiBixf-UG1-s',
}: GoogleMapEmergencyProps) {
  const mapContainerRef = useRef<HTMLDivElement>(null);
  const mapInstanceRef = useRef<any>(null);
  const directionsRendererRef = useRef<any>(null);
  const glowPolylineRef = useRef<any>(null);
  const markersRef = useRef<any[]>([]);

  const [mapLoaded, setMapLoaded] = useState<boolean>(false);
  const [loadError, setLoadError] = useState<boolean>(false);
  const [activeCoords, setActiveCoords] = useState<{ lat: number; lng: number }>(origin);

  // 1. Get Live Browser Geolocation
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

  // 2. Load Google Maps JS SDK
  useEffect(() => {
    if (!mapContainerRef.current) return;

    const loadScript = () => {
      if (window.google && window.google.maps) {
        initMap();
        return;
      }

      const scriptId = 'google-maps-emergency-script';
      let script = document.getElementById(scriptId) as HTMLScriptElement;
      if (!script) {
        script = document.createElement('script');
        script.id = scriptId;
        script.src = `https://maps.googleapis.com/maps/api/js?key=${apiKey}&libraries=geometry,places`;
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
        script.addEventListener('load', initMap);
      }
    };

    const initMap = () => {
      if (!mapContainerRef.current || !window.google?.maps) return;

      try {
        if (!mapInstanceRef.current) {
          const map = new window.google.maps.Map(mapContainerRef.current, {
            center: {
              lat: (activeCoords.lat + hospital.lat) / 2,
              lng: (activeCoords.lng + hospital.lng) / 2,
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

          mapInstanceRef.current = map;
        }

        renderRouteAndMarkers();
        setMapLoaded(true);
      } catch (err) {
        setLoadError(true);
      }
    };

    loadScript();
  }, [apiKey]);

  // 3. Re-render route and markers whenever active coordinates or selected hospital changes
  const renderRouteAndMarkers = () => {
    const map = mapInstanceRef.current;
    if (!map || !window.google?.maps) return;

    // Clear previous markers
    markersRef.current.forEach((m) => m.setMap(null));
    markersRef.current = [];

    // Clear previous direction renderers
    if (directionsRendererRef.current) {
      directionsRendererRef.current.setMap(null);
      directionsRendererRef.current = null;
    }
    if (glowPolylineRef.current) {
      glowPolylineRef.current.setMap(null);
      glowPolylineRef.current = null;
    }

    const userPos = { lat: activeCoords.lat, lng: activeCoords.lng };
    const destPos = { lat: hospital.lat, lng: hospital.lng };

    // ── 🔵 User Origin Marker ──
    const userMarker = new window.google.maps.Marker({
      position: userPos,
      map,
      title: origin.name || 'Your Location',
      zIndex: 100,
      icon: {
        path: window.google.maps.SymbolPath.CIRCLE,
        scale: 9,
        fillColor: '#2563EB',
        fillOpacity: 1,
        strokeColor: '#FFFFFF',
        strokeWeight: 3.5,
      },
    });
    markersRef.current.push(userMarker);

    // ── 🔴 Destination Hospital Marker ──
    const hospitalMarker = new window.google.maps.Marker({
      position: destPos,
      map,
      title: hospital.name,
      zIndex: 100,
      icon: {
        path: window.google.maps.SymbolPath.CIRCLE,
        scale: 11,
        fillColor: '#DC2626',
        fillOpacity: 1,
        strokeColor: '#FFFFFF',
        strokeWeight: 4,
      },
    });
    markersRef.current.push(hospitalMarker);

    // ── ⚪ Alternative Hospital Markers (Clickable) ──
    alternativeHospitals.forEach((alt) => {
      if (alt.lat === hospital.lat && alt.lng === hospital.lng) return;

      const altMarker = new window.google.maps.Marker({
        position: { lat: alt.lat, lng: alt.lng },
        map,
        title: alt.name,
        zIndex: 50,
        icon: {
          path: window.google.maps.SymbolPath.CIRCLE,
          scale: 6,
          fillColor: '#64748B',
          fillOpacity: 0.8,
          strokeColor: '#FFFFFF',
          strokeWeight: 2,
        },
      });

      if (onSelectHospital) {
        altMarker.addListener('click', () => {
          onSelectHospital(alt);
        });
      }

      markersRef.current.push(altMarker);
    });

    // ── 🛣️ Prominent Double-Layer Route Rendering ──
    const directionsService = new window.google.maps.DirectionsService();
    const directionsRenderer = new window.google.maps.DirectionsRenderer({
      map,
      suppressMarkers: true,
      preserveViewport: false,
      polylineOptions: {
        strokeColor: '#2563EB', // NAYAN Blue
        strokeWeight: 6,
        strokeOpacity: 1.0,
        zIndex: 20,
      },
    });

    directionsRendererRef.current = directionsRenderer;

    directionsService.route(
      {
        origin: userPos,
        destination: destPos,
        travelMode: window.google.maps.TravelMode.DRIVING,
        provideRouteAlternatives: false,
      },
      (result: any, status: any) => {
        if (status === window.google.maps.DirectionsStatus.OK) {
          directionsRenderer.setDirections(result);

          // Render subtle under-glow polyline for high-contrast visibility
          const overviewPath = result.routes[0]?.overview_path;
          if (overviewPath) {
            const glowPolyline = new window.google.maps.Polyline({
              path: overviewPath,
              map,
              strokeColor: '#93C5FD',
              strokeWeight: 12,
              strokeOpacity: 0.45,
              zIndex: 10,
            });
            glowPolylineRef.current = glowPolyline;
          }

          // Fit viewport with generous padding so both endpoints and route are framed
          const bounds = new window.google.maps.LatLngBounds();
          bounds.extend(userPos);
          bounds.extend(destPos);
          map.fitBounds(bounds, { top: 40, bottom: 40, left: 40, right: 40 });
        }
      }
    );
  };

  useEffect(() => {
    if (mapLoaded) {
      renderRouteAndMarkers();
    }
  }, [activeCoords, hospital, alternativeHospitals, mapLoaded]);

  const googleMapsUrl = `https://www.google.com/maps/dir/?api=1&origin=${activeCoords.lat},${activeCoords.lng}&destination=${hospital.lat},${hospital.lng}&travelmode=driving`;

  return (
    <div className="relative w-full h-52 sm:h-56 rounded-2xl bg-[#E8EEF5] dark:bg-slate-800 border border-slate-200 dark:border-slate-700 overflow-hidden shadow-inner group">
      
      {/* Real Google Map Canvas */}
      <div ref={mapContainerRef} className="w-full h-full" />

      {/* Fallback Animated Route SVG if Maps JS is waiting/offline */}
      {!mapLoaded && (
        <div className="absolute inset-0 bg-[#E8EEF5] dark:bg-slate-800 flex items-center justify-center p-4">
          <svg className="w-full h-full" viewBox="0 0 300 160">
            {/* Grid Pattern */}
            <defs>
              <pattern id="grid" width="20" height="20" patternUnits="userSpaceOnUse">
                <path d="M 20 0 L 0 0 0 20" fill="none" stroke="currentColor" className="text-slate-300 dark:text-slate-700 opacity-40" strokeWidth="0.5" />
              </pattern>
            </defs>
            <rect width="100%" height="100%" fill="url(#grid)" />

            {/* Glowing Under-Route */}
            <path
              d="M 40 40 Q 110 80, 170 85 T 255 115"
              fill="none"
              stroke="#93C5FD"
              strokeWidth="10"
              strokeLinecap="round"
              className="opacity-60"
            />
            {/* Main Road Route */}
            <path
              d="M 40 40 Q 110 80, 170 85 T 255 115"
              fill="none"
              stroke="#2563EB"
              strokeWidth="5"
              strokeLinecap="round"
              strokeDasharray="6 3"
              className="animate-pulse"
            />

            {/* Origin User Marker */}
            <g transform="translate(40, 40)">
              <circle r="12" fill="#2563EB" opacity="0.2" className="animate-ping" />
              <circle r="7" fill="#2563EB" stroke="#FFFFFF" strokeWidth="2.5" />
            </g>

            {/* Destination Hospital Marker */}
            <g transform="translate(255, 115)">
              <circle r="14" fill="#DC2626" opacity="0.2" className="animate-ping" />
              <circle r="9" fill="#DC2626" stroke="#FFFFFF" strokeWidth="2.5" />
              <text x="0" y="3.5" textAnchor="middle" fill="#FFFFFF" fontSize="8" fontWeight="bold">H</text>
            </g>
          </svg>
        </div>
      )}

      {/* ── 🔵 Top-Left User Location Badge ── */}
      <div className="absolute top-3 left-3 z-10 flex flex-col items-start pointer-events-none">
        <div className="px-2.5 py-1 rounded-lg bg-[#1E2024]/90 backdrop-blur-md text-white text-[10px] font-extrabold shadow-md flex items-center gap-1.5 border border-white/10">
          <span className="w-2 h-2 rounded-full bg-[#2563EB] ring-2 ring-white animate-pulse" />
          <span>Your Location</span>
        </div>
      </div>

      {/* ── 🔴 Bottom-Left Hospital Name Tag ── */}
      <div className="absolute bottom-3 left-3 z-10 flex flex-col items-start pointer-events-none max-w-[55%]">
        <div className="px-2.5 py-1 rounded-lg bg-[#DC2626] text-white text-[10px] font-black shadow-md flex items-center gap-1 truncate">
          <span>🏥 {hospital.name.length > 22 ? hospital.name.slice(0, 22) + '...' : hospital.name}</span>
        </div>
      </div>

      {/* ── ⏱ Attached Fastest Route & ETA Badge ── */}
      <div className="absolute bottom-3 right-3 z-10 flex flex-col items-end pointer-events-none">
        <div className="px-2.5 py-1 rounded-lg bg-[#2563EB] text-white text-[10px] font-black shadow-lg flex items-center gap-1.5 border border-white/20">
          <Navigation className="w-3 h-3" />
          <span>Fastest Route &bull; {hospital.eta} ({hospital.distance})</span>
        </div>
      </div>

      {/* Open in Google Maps External Button */}
      <a
        href={googleMapsUrl}
        target="_blank"
        rel="noopener noreferrer"
        className="absolute top-3 right-3 z-10 p-1.5 rounded-lg bg-white/95 dark:bg-black/80 hover:bg-white text-slate-700 dark:text-white shadow-md text-xs font-bold transition-all flex items-center gap-1 hover:scale-105"
        title="Open in Google Maps"
      >
        <ExternalLink className="w-3.5 h-3.5 text-[#2563EB]" />
      </a>

    </div>
  );
}
