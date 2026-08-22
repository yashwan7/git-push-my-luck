'use client';

import React, { useState, useEffect } from 'react';
import { Navigation, MapPin, ExternalLink, Layers, Crosshair, Compass } from 'lucide-react';

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

export function GoogleMapEmergency({
  origin = { lat: 12.9352, lng: 77.6245, name: 'Your Location' },
  hospital,
  alternativeHospitals = [],
  onSelectHospital,
}: GoogleMapEmergencyProps) {
  const [mapType, setMapType] = useState<'roadmap' | 'satellite'>('roadmap');
  const [activeCoords, setActiveCoords] = useState<{ lat: number; lng: number }>(origin);
  const [isIframeLoaded, setIsIframeLoaded] = useState(false);

  // 1. Live Geolocation capture
  useEffect(() => {
    if (typeof window !== 'undefined' && 'geolocation' in navigator) {
      navigator.geolocation.getCurrentPosition(
        (pos) => {
          setActiveCoords({
            lat: pos.coords.latitude,
            lng: pos.coords.longitude,
          });
        },
        () => {},
        { timeout: 4000 }
      );
    }
  }, []);

  const googleMapsUrl = `https://www.google.com/maps/dir/?api=1&origin=${activeCoords.lat},${activeCoords.lng}&destination=${hospital.lat},${hospital.lng}&travelmode=driving`;
  
  // Real Interactive Google Map Embed URL
  const embedUrl = `https://maps.google.com/maps?q=${hospital.lat},${hospital.lng}&t=${mapType === 'satellite' ? 'k' : 'm'}&z=14&output=embed`;

  return (
    <div className="relative w-full h-[220px] sm:h-[260px] md:h-[280px] rounded-2xl overflow-hidden shadow-inner bg-slate-900 border border-slate-200 dark:border-white/10 group">
      
      {/* ── 🗺️ REAL LIVE INTERACTIVE MAP IFRAME ── */}
      <iframe
        title={`Live Emergency Route Map to ${hospital.name}`}
        src={embedUrl}
        className="w-full h-full border-0 filter contrast-[1.05] brightness-[0.98]"
        loading="lazy"
        allowFullScreen
        onLoad={() => setIsIframeLoaded(true)}
      />

      {/* ── 🔵 TOP-LEFT: USER LOCATION BADGE ── */}
      <div className="absolute top-3 left-3 z-10 flex flex-col items-start gap-1">
        <div className="px-3 py-1.5 rounded-xl bg-slate-900/90 backdrop-blur-md text-white text-[11px] font-extrabold shadow-lg flex items-center gap-2 border border-white/20">
          <span className="w-2.5 h-2.5 rounded-full bg-blue-500 ring-2 ring-white animate-pulse" />
          <span>Live GPS Route Active</span>
        </div>
      </div>

      {/* ── 🎛️ TOP-RIGHT CONTROLS: MAP TYPE & EXTERNAL LAUNCH ── */}
      <div className="absolute top-3 right-3 z-10 flex items-center gap-1.5">
        <button
          onClick={() => setMapType(mapType === 'roadmap' ? 'satellite' : 'roadmap')}
          className="px-2.5 py-1.5 rounded-xl bg-white/95 dark:bg-black/80 hover:bg-white text-slate-800 dark:text-white shadow-md text-[10px] font-black uppercase tracking-wider transition-all flex items-center gap-1 hover:scale-105 cursor-pointer border border-slate-200/60"
          title="Toggle Map Type (Road / Satellite)"
        >
          <Layers className="w-3 h-3 text-emerald-600" />
          <span>{mapType === 'roadmap' ? 'Satellite' : 'Roads'}</span>
        </button>

        <a
          href={googleMapsUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="p-1.5 rounded-xl bg-white/95 dark:bg-black/80 hover:bg-white text-slate-800 dark:text-white shadow-md text-xs font-bold transition-all flex items-center gap-1 hover:scale-105 border border-slate-200/60 cursor-pointer"
          title="Open in Google Maps App"
        >
          <ExternalLink className="w-3.5 h-3.5 text-blue-600" />
        </a>
      </div>

      {/* ── 🔴 BOTTOM BAR: DESTINATION HOSPITAL & FASTEST ROUTE ── */}
      <div className="absolute bottom-3 left-3 right-3 z-10 flex flex-wrap items-center justify-between gap-2 pointer-events-none">
        <div className="px-3 py-1.5 rounded-xl bg-red-600/95 backdrop-blur-md text-white text-[11px] font-black shadow-xl flex items-center gap-1.5 border border-red-400/40">
          <MapPin className="w-3.5 h-3.5" />
          <span className="truncate max-w-[200px] sm:max-w-xs">{hospital.name}</span>
        </div>

        <a
          href={googleMapsUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="pointer-events-auto px-3 py-1.5 rounded-xl bg-[#134233]/95 hover:bg-[#1a5542] backdrop-blur-md text-white text-[11px] font-black shadow-xl flex items-center gap-2 border border-emerald-400/40 transition-transform hover:scale-105 cursor-pointer"
        >
          <Navigation className="w-3.5 h-3.5 text-emerald-300 animate-bounce" />
          <span>Fastest Route &bull; {hospital.eta || '12 min'} ({hospital.distance || '3.4 km'})</span>
        </a>
      </div>

    </div>
  );
}
