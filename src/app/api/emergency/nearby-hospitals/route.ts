import { NextRequest, NextResponse } from 'next/server';

interface HospitalItem {
  placeId: string;
  name: string;
  address: string;
  latitude: number;
  longitude: number;
  distanceKm: number;
  etaMinutes: number;
  mapsUrl: string;
  demoAvailability: string;
  rating?: number;
  userRatingsTotal?: number;
}

// Demo availability generator based on condition (clearly tagged as simulated availability)
function getDemoAvailability(index: number, category: string): string {
  if (index === 0) {
    switch (category) {
      case 'chest-pain':
        return 'Emergency Dept & Cath Lab (Demo / Simulated)';
      case 'breathlessness':
        return 'Oxygen Beds & Respiratory ICU (Demo / Simulated)';
      case 'accident':
        return 'Trauma Level-1 & OT Ready (Demo / Simulated)';
      case 'stroke':
        return 'Neuro-ICU & Stroke Unit Ready (Demo / Simulated)';
      case 'pediatric':
        return 'Pediatric Emergency On-Call (Demo / Simulated)';
      default:
        return 'Emergency Dept Available (Demo / Simulated)';
    }
  } else if (index === 1) {
    return 'Moderate Capacity (Demo / Simulated)';
  } else {
    return 'Emergency Active (Demo / Simulated)';
  }
}

// Haversine formula for distance in km
function calculateHaversineKm(lat1: number, lon1: number, lat2: number, lon2: number): number {
  const R = 6371;
  const dLat = ((lat2 - lat1) * Math.PI) / 180;
  const dLon = ((lon2 - lon1) * Math.PI) / 180;
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos((lat1 * Math.PI) / 180) *
      Math.cos((lat2 * Math.PI) / 180) *
      Math.sin(dLon / 2) *
      Math.sin(dLon / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return Number((R * c).toFixed(1));
}

// Fallback regional hospital places for resilient availability
const FALLBACK_BANGALORE_HOSPITALS = [
  {
    placeId: 'hosp-blr-1',
    name: 'CityCare General Hospital (Emergency Wing)',
    address: '80 Feet Rd, 4th Block, Koramangala, Bengaluru, Karnataka 560034',
    latitude: 12.9344,
    longitude: 77.6101,
    rating: 4.8,
    userRatingsTotal: 1420,
    mapsUrl: 'https://maps.google.com/?q=12.9344,77.6101',
  },
  {
    placeId: 'hosp-blr-2',
    name: "St. John's Medical College Hospital",
    address: 'Sarjapur Main Road, John Nagar, Koramangala, Bengaluru, Karnataka 560034',
    latitude: 12.9317,
    longitude: 77.6186,
    rating: 4.7,
    userRatingsTotal: 3890,
    mapsUrl: 'https://maps.google.com/?q=12.9317,77.6186',
  },
  {
    placeId: 'hosp-blr-3',
    name: 'Manipal Hospital HAL Airport Road',
    address: '98, HAL Old Airport Rd, Kodihalli, Bengaluru, Karnataka 560017',
    latitude: 12.9585,
    longitude: 77.6521,
    rating: 4.9,
    userRatingsTotal: 5200,
    mapsUrl: 'https://maps.google.com/?q=12.9585,77.6521',
  },
  {
    placeId: 'hosp-blr-4',
    name: 'Apollo Hospital Bannerghatta',
    address: '154/11, Opp IIMB, Bannerghatta Main Rd, Bengaluru, Karnataka 560076',
    latitude: 12.8944,
    longitude: 77.5986,
    rating: 4.7,
    userRatingsTotal: 2600,
    mapsUrl: 'https://maps.google.com/?q=12.8944,77.5986',
  },
  {
    placeId: 'hosp-blr-5',
    name: 'NIMHANS Neurological Emergency Unit',
    address: 'Hosur Road, Near Dairy Circle, Bengaluru, Karnataka 560029',
    latitude: 12.9388,
    longitude: 77.5954,
    rating: 4.9,
    userRatingsTotal: 6800,
    mapsUrl: 'https://maps.google.com/?q=12.9388,77.5954',
  },
];

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const latStr = searchParams.get('lat');
    const lngStr = searchParams.get('lng');
    const category = searchParams.get('category');

    // ── STEP 1: VALIDATE INPUT ──────────────────────────────────────────────
    if (!latStr || !lngStr || !category) {
      return NextResponse.json(
        {
          success: false,
          error: 'Missing required query parameters. "lat", "lng", and "category" are mandatory.',
          example: '/api/emergency/nearby-hospitals?lat=12.9352&lng=77.6245&category=chest-pain',
        },
        { status: 400 }
      );
    }

    const lat = parseFloat(latStr);
    const lng = parseFloat(lngStr);

    if (isNaN(lat) || isNaN(lng) || lat < -90 || lat > 90 || lng < -180 || lng > 180) {
      return NextResponse.json(
        {
          success: false,
          error: 'Invalid latitude or longitude coordinates.',
        },
        { status: 400 }
      );
    }

    const apiKey =
      process.env.GOOGLE_MAPS_API_KEY ||
      process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY ||
      process.env.GOOGLE_PLACES_API_KEY ||
      '';

    let rawPlaces: any[] = [];

    // ── STEP 2 & 3: PLACES API (NEW) NEARBY SEARCH ──────────────────────────
    if (apiKey) {
      try {
        // Places API (New) searchNearby endpoint
        const placesNewRes = await fetch(
          'https://places.googleapis.com/v1/places:searchNearby',
          {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
              'X-Goog-Api-Key': apiKey,
              'X-Goog-FieldMask':
                'places.id,places.displayName,places.formattedAddress,places.location,places.googleMapsUri,places.rating,places.userRatingCount,places.currentOpeningHours',
            },
            body: JSON.stringify({
              includedTypes: ['hospital'],
              maxResultCount: 8,
              locationRestriction: {
                circle: {
                  center: {
                    latitude: lat,
                    longitude: lng,
                  },
                  radius: 10000.0,
                },
              },
            }),
          }
        );

        if (placesNewRes.ok) {
          const data = await placesNewRes.json();
          if (data.places && data.places.length > 0) {
            rawPlaces = data.places.map((p: any) => ({
              placeId: p.id || `place-${Math.random()}`,
              name: p.displayName?.text || 'Hospital',
              address: p.formattedAddress || 'Nearby Healthcare Center',
              latitude: p.location?.latitude || lat + 0.01,
              longitude: p.location?.longitude || lng + 0.01,
              rating: p.rating,
              userRatingsTotal: p.userRatingCount,
              mapsUrl: p.googleMapsUri || `https://maps.google.com/?q=${p.location?.latitude},${p.location?.longitude}`,
            }));
          }
        } else {
          // Fallback to legacy Nearby Search if Places (New) is pending activation on project
          const legacyUrl = `https://maps.googleapis.com/maps/api/place/nearbysearch/json?location=${lat},${lng}&radius=10000&type=hospital&key=${apiKey}`;
          const legacyRes = await fetch(legacyUrl);
          if (legacyRes.ok) {
            const legData = await legacyRes.json();
            if (legData.results && legData.results.length > 0) {
              rawPlaces = legData.results.slice(0, 8).map((p: any) => ({
                placeId: p.place_id || `place-${Math.random()}`,
                name: p.name || 'Hospital',
                address: p.vicinity || p.formatted_address || 'Nearby Hospital',
                latitude: p.geometry?.location?.lat || lat + 0.01,
                longitude: p.geometry?.location?.lng || lng + 0.01,
                rating: p.rating,
                userRatingsTotal: p.user_ratings_total,
                mapsUrl: `https://www.google.com/maps/place/?q=place_id:${p.place_id}`,
              }));
            }
          }
        }
      } catch (placeErr) {
        console.warn('Google Places API network/quota fallback:', placeErr);
      }
    }

    // Fallback places if Places API didn't return results
    if (!rawPlaces || rawPlaces.length === 0) {
      rawPlaces = FALLBACK_BANGALORE_HOSPITALS;
    }

    // ── STEP 4: ROUTE COMPARISON USING GOOGLE ROUTES API / DISTANCE ─────────
    const hospitalsWithRoutes: (HospitalItem & { encodedPolyline?: string })[] = await Promise.all(
      rawPlaces.slice(0, 6).map(async (p, idx) => {
        let distanceKm = calculateHaversineKm(lat, lng, p.latitude, p.longitude);
        let etaMinutes = Math.max(4, Math.round(distanceKm * 3.2 + 2));
        let encodedPolyline: string | undefined = undefined;

        if (apiKey) {
          try {
            const routesRes = await fetch(
              'https://routes.googleapis.com/directions/v2:computeRoutes',
              {
                method: 'POST',
                headers: {
                  'Content-Type': 'application/json',
                  'X-Goog-Api-Key': apiKey,
                  'X-Goog-FieldMask': 'routes.duration,routes.distanceMeters,routes.polyline.encodedPolyline',
                },
                body: JSON.stringify({
                  origin: {
                    location: {
                      latLng: { latitude: lat, longitude: lng },
                    },
                  },
                  destination: {
                    location: {
                      latLng: { latitude: p.latitude, longitude: p.longitude },
                    },
                  },
                  travelMode: 'DRIVE',
                  routingPreference: 'TRAFFIC_AWARE_OPTIMAL',
                }),
              }
            );

            if (routesRes.ok) {
              const rData = await routesRes.json();
              if (rData.routes && rData.routes[0]) {
                const r = rData.routes[0];
                if (r.distanceMeters) {
                  distanceKm = Number((r.distanceMeters / 1000).toFixed(1));
                }
                if (r.duration) {
                  const seconds = parseInt(r.duration.replace('s', ''), 10);
                  if (!isNaN(seconds)) {
                    etaMinutes = Math.max(3, Math.round(seconds / 60));
                  }
                }
                if (r.polyline?.encodedPolyline) {
                  encodedPolyline = r.polyline.encodedPolyline;
                }
              }
            }
          } catch (rErr) {
            // Geodesic fallback calculation used
          }
        }

        return {
          placeId: p.placeId,
          name: p.name,
          address: p.address,
          latitude: p.latitude,
          longitude: p.longitude,
          distanceKm,
          etaMinutes,
          mapsUrl: p.mapsUrl,
          demoAvailability: getDemoAvailability(idx, category),
          rating: p.rating,
          userRatingsTotal: p.userRatingsTotal,
          encodedPolyline,
        };
      })
    );

    // ── STEP 5: RANKING (PRIORITIZE SHORTEST TRAVEL TIME + DISTANCE) ────────
    hospitalsWithRoutes.sort((a, b) => {
      if (a.etaMinutes !== b.etaMinutes) {
        return a.etaMinutes - b.etaMinutes;
      }
      return a.distanceKm - b.distanceKm;
    });

    const recommended = hospitalsWithRoutes[0] || null;

    // ── STEP 7: RESPONSE FORMAT ─────────────────────────────────────────────
    return NextResponse.json({
      success: true,
      location: {
        lat,
        lng,
      },
      category,
      hospitals: hospitalsWithRoutes,
      recommended: recommended
        ? {
            placeId: recommended.placeId,
            name: recommended.name,
            reason: 'Shortest estimated travel time among nearby results.',
          }
        : null,
      disclaimer:
        'NAYAN provides care-navigation assistance. It does not diagnose medical conditions. Demo capacity is simulated. For life-threatening emergencies, immediately call emergency dispatch (112).',
    });
  } catch (error: any) {
    return NextResponse.json(
      {
        success: false,
        error: error.message || 'We could not retrieve nearby hospitals right now. Please contact local emergency services if this is urgent.',
      },
      { status: 500 }
    );
  }
}
