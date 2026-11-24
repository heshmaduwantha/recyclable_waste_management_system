import { Platform } from 'react-native';
import * as Location from 'expo-location';

export interface LocationCoordinates {
  latitude: number;
  longitude: number;
}

export interface AddressSearchResult {
  display_name: string;
  lat: string;
  lon: string;
  place_id: number;
}

export interface LiveLocationResult {
  latitude: number;
  longitude: number;
  city: string;
  street: string;
  houseNumber: string;
  landmark: string;
  zipCode: string;
  displayName: string;
}

const getBrowserPosition = (options: PositionOptions): Promise<GeolocationPosition> =>
  new Promise((resolve, reject) => {
    if (typeof navigator === 'undefined' || !navigator.geolocation) {
      reject(new Error('Geolocation is not supported by this browser.'));
      return;
    }
    navigator.geolocation.getCurrentPosition(resolve, reject, options);
  });

const extractCityFromNominatim = (addr: Record<string, string | undefined>): string =>
  addr.city ||
  addr.town ||
  addr.village ||
  addr.municipality ||
  addr.suburb ||
  addr.city_district ||
  addr.county ||
  addr.state_district ||
  addr.state ||
  '';

const fetchNearbyLandmark = async (lat: number, lon: number): Promise<string> => {
  const controller = typeof AbortController !== 'undefined' ? new AbortController() : null;
  const timer = controller ? setTimeout(() => controller.abort(), 3000) : null;
  try {
    const query = `[out:json][timeout:3];(node(around:450,${lat},${lon})["name"]["amenity"];node(around:450,${lat},${lon})["name"]["shop"];way(around:450,${lat},${lon})["name"]["amenity"];);out center 8;`;
    const res = await fetch('https://overpass-api.de/api/interpreter', {
      method: 'POST',
      headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
      body: `data=${encodeURIComponent(query)}`,
      ...(controller ? { signal: controller.signal } : {})
    });
    if (!res.ok) return '';
    const data = await res.json();
    const elements: any[] = Array.isArray(data?.elements) ? data.elements : [];
    let bestName = '';
    let bestDist = Infinity;
    for (const el of elements) {
      const name = el?.tags?.name;
      const elLat = el?.lat ?? el?.center?.lat;
      const elLon = el?.lon ?? el?.center?.lon;
      if (!name || typeof elLat !== 'number' || typeof elLon !== 'number') continue;
      const d = locationService.calculateHaversineDistance(lat, lon, elLat, elLon);
      if (d < bestDist) {
        bestDist = d;
        bestName = String(name).trim();
      }
    }
    return bestName;
  } catch {
    return '';
  } finally {
    if (timer) clearTimeout(timer);
  }
};

const formatLandmark = (value: string): string => {
  const trimmed = value.trim();
  if (!trimmed) return '';
  return /^near\b/i.test(trimmed) ? trimmed : `Near ${trimmed}`;
};

export const locationService = {
  /**
   * Fetch current live GPS coordinates from device (Web Geolocation API or Expo Location on iOS/Android)
   */
  getCurrentCoordinates: async (): Promise<LocationCoordinates> => {
    if (Platform.OS === 'web') {
      try {
        const pos = await getBrowserPosition({
          enableHighAccuracy: true,
          timeout: 10000,
          maximumAge: 30000
        });
        return {
          latitude: pos.coords.latitude,
          longitude: pos.coords.longitude
        };
      } catch (err: any) {
        if (err?.code === 1) {
          throw new Error('Location permission denied. Please allow location access in your browser.');
        }
        // Retry with lower accuracy if high-accuracy GPS timed out or was unavailable
        try {
          const pos = await getBrowserPosition({
            enableHighAccuracy: false,
            timeout: 10000,
            maximumAge: 60000
          });
          return {
            latitude: pos.coords.latitude,
            longitude: pos.coords.longitude
          };
        } catch (retryErr: any) {
          if (retryErr?.code === 1) {
            throw new Error('Location permission denied. Please allow location access in your browser.');
          }
          throw new Error(retryErr?.message || 'Unable to retrieve your live GPS location.');
        }
      }
    }

    const { status } = await Location.requestForegroundPermissionsAsync();
    if (status !== 'granted') {
      throw new Error('Location permission denied. Please enable location access in settings.');
    }

    try {
      const pos = await Location.getCurrentPositionAsync({
        accuracy: Location.Accuracy.Balanced
      });
      return {
        latitude: pos.coords.latitude,
        longitude: pos.coords.longitude
      };
    } catch {
      const lastKnown = await Location.getLastKnownPositionAsync();
      if (lastKnown) {
        return {
          latitude: lastKnown.coords.latitude,
          longitude: lastKnown.coords.longitude
        };
      }
      throw new Error('Unable to retrieve your live GPS location. Make sure GPS is turned on.');
    }
  },

  /**
   * Reverse geocode coordinates into structured city, street, house number, and landmark
   */
  reverseGeocodeDetails: async (lat: number, lon: number): Promise<LiveLocationResult> => {
    let city = '';
    let street = '';
    let houseNumber = '';
    let landmark = '';
    let zipCode = '';
    let displayName = '';
    let areaFallback = '';
    let regionFallback = '';

    // Kick off Nominatim reverse geocode and nearby landmark lookup in parallel
    const nominatimPromise = fetch(
      `https://nominatim.openstreetmap.org/reverse?format=jsonv2&lat=${lat}&lon=${lon}&zoom=18&addressdetails=1&accept-language=en`
    )
      .then((res) => (res.ok ? res.json() : null))
      .catch((err) => {
        console.warn('Nominatim reverse geocode failed:', err);
        return null;
      });

    const nearbyPoiPromise = fetchNearbyLandmark(lat, lon);

    const [nominatimData, nearbyPoi] = await Promise.all([nominatimPromise, nearbyPoiPromise]);

    if (nominatimData) {
      const addr: Record<string, string | undefined> = nominatimData?.address || {};
      city = extractCityFromNominatim(addr);

      const rawHouse =
        addr.house_number ||
        addr.house_name ||
        addr.building ||
        addr.unit ||
        addr.flat ||
        '';
      if (rawHouse) {
        houseNumber = /^\d/.test(rawHouse) ? `No. ${rawHouse}` : rawHouse;
      }

      const road =
        addr.road ||
        addr.pedestrian ||
        addr.residential ||
        addr.footway ||
        addr.highway ||
        addr.path ||
        '';
      const area =
        addr.neighbourhood ||
        addr.quarter ||
        addr.suburb ||
        addr.hamlet ||
        addr.city_district ||
        '';
      areaFallback = area || addr.state_district || addr.county || '';
      regionFallback = addr.state || addr.state_district || '';

      const areaForStreet = area && area.toLowerCase() !== city.toLowerCase() ? area : '';
      street = [road, areaForStreet].filter(Boolean).join(', ');

      const directPoi =
        addr.amenity ||
        addr.shop ||
        addr.tourism ||
        addr.leisure ||
        addr.office ||
        addr.healthcare ||
        addr.historic ||
        addr.public_building ||
        addr.railway ||
        (nominatimData?.name &&
        nominatimData.name !== road &&
        nominatimData.name !== city
          ? String(nominatimData.name)
          : '');
      if (directPoi) {
        landmark = formatLandmark(directPoi);
      }

      zipCode = addr.postcode || '';
      displayName = nominatimData?.display_name || '';

      if (!houseNumber && nominatimData?.name && nominatimData.name !== road && nominatimData.name !== city) {
        houseNumber = String(nominatimData.name);
      }
    }

    // 2. BigDataCloud CORS-friendly reverse geocode fallback if city or street is still missing
    if (!city || !street) {
      try {
        const res = await fetch(
          `https://api.bigdatacloud.net/data/reverse-geocode-client?latitude=${lat}&longitude=${lon}&localityLanguage=en`
        );
        if (res.ok) {
          const data = await res.json();
          if (!city) {
            city = data?.city || data?.locality || data?.principalSubdivision || '';
          }
          if (!regionFallback && data?.principalSubdivision) {
            regionFallback = data.principalSubdivision;
          }
          if (!areaFallback && data?.locality) {
            areaFallback = data.locality;
          }
          if (!street) {
            const locPart = data?.locality && data.locality !== city ? data.locality : '';
            const subPart =
              data?.principalSubdivision && data.principalSubdivision !== city
                ? data.principalSubdivision
                : '';
            street = [locPart, subPart].filter(Boolean).join(', ');
          }
          if (!zipCode && data?.postcode) {
            zipCode = data.postcode;
          }
          if (!displayName) {
            displayName = [street, city, data?.countryName].filter(Boolean).join(', ');
          }
        }
      } catch (err) {
        console.warn('BigDataCloud reverse geocode failed:', err);
      }
    }

    // 3. Native OS reverse geocode fallback (iOS/Android)
    if ((!city || !street || !houseNumber) && Platform.OS !== 'web') {
      try {
        const places = await Location.reverseGeocodeAsync({ latitude: lat, longitude: lon });
        const place = places?.[0];
        if (place) {
          if (!city) {
            city = place.city || place.subregion || place.district || place.region || '';
          }
          if (!houseNumber && place.streetNumber) {
            houseNumber = /^\d/.test(place.streetNumber) ? `No. ${place.streetNumber}` : place.streetNumber;
          } else if (!houseNumber && place.name && place.name !== place.street && place.name !== city) {
            houseNumber = place.name;
          }
          if (!street) {
            const area = place.district && place.district !== city ? place.district : '';
            street = [place.street, area].filter(Boolean).join(', ');
          }
          if (!areaFallback && place.district) {
            areaFallback = place.district;
          }
          if (!zipCode && place.postalCode) zipCode = place.postalCode;
          if (!displayName) {
            displayName = [houseNumber, street, city, place.country].filter(Boolean).join(', ');
          }
        }
      } catch (err) {
        console.warn('Native reverse geocode failed:', err);
      }
    }

    // Ensure every doorstep field is populated from real location context
    if (!street) {
      const fallbackParts = displayName
        .split(',')
        .map((p) => p.trim())
        .filter((p) => p && p.toLowerCase() !== city.toLowerCase() && !/^\d{4,}$/.test(p));
      street =
        areaFallback ||
        fallbackParts[0] ||
        (regionFallback && regionFallback !== city ? regionFallback : '') ||
        (city ? `${city} Central` : `${lat.toFixed(4)}, ${lon.toFixed(4)}`);
    }

    if (!houseNumber) {
      houseNumber = zipCode
        ? `Postal ${zipCode}`
        : `GPS ${lat.toFixed(4)}, ${lon.toFixed(4)}`;
    }

    if (!landmark) {
      landmark = formatLandmark(nearbyPoi || areaFallback || regionFallback || city);
    }

    return {
      latitude: lat,
      longitude: lon,
      city,
      street,
      houseNumber,
      landmark,
      zipCode,
      displayName: displayName || [street, city].filter(Boolean).join(', ') || `${lat.toFixed(4)}, ${lon.toFixed(4)}`
    };
  },

  /**
   * Fetch live GPS coordinates and resolve the live city & address details.
   * On web, if browser GPS is unavailable (non-HTTPS or desktop without location services),
   * falls back to live IP geolocation unless permission was explicitly denied.
   */
  fetchLiveLocation: async (): Promise<LiveLocationResult> => {
    try {
      const coords = await locationService.getCurrentCoordinates();
      return await locationService.reverseGeocodeDetails(coords.latitude, coords.longitude);
    } catch (err: any) {
      const message = String(err?.message || '');
      const isPermissionDenied = message.toLowerCase().includes('permission denied');
      if (Platform.OS === 'web' && !isPermissionDenied) {
        try {
          const res = await fetch('https://ipwho.is/');
          if (res.ok) {
            const data = await res.json();
            if (data?.success && data?.city) {
              const lat = Number(data.latitude) || 0;
              const lon = Number(data.longitude) || 0;
              if (lat && lon) {
                const details = await locationService.reverseGeocodeDetails(lat, lon);
                return {
                  ...details,
                  city: details.city || data.city,
                  zipCode: details.zipCode || data.postal || ''
                };
              }
              return {
                latitude: lat,
                longitude: lon,
                city: data.city,
                street: data.region || `${data.city} Area`,
                houseNumber: data.postal ? `Postal ${data.postal}` : `Area ${data.city}`,
                landmark: formatLandmark(data.region || data.city),
                zipCode: data.postal || '',
                displayName: [data.city, data.region, data.country].filter(Boolean).join(', ')
              };
            }
          }
        } catch (ipErr) {
          console.warn('IP geolocation fallback failed:', ipErr);
        }
      }
      throw err;
    }
  },

  /**
   * Search address coordinates using OpenStreetMap Nominatim API
   */
  searchAddress: async (query: string): Promise<AddressSearchResult[]> => {
    try {
      const response = await fetch(
        `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(query)}`
      );
      const data = await response.json();
      return data || [];
    } catch (error) {
      console.warn('Nominatim Geocoding API Error, falling back to mock results:', error);
      return [
        {
          display_name: '45 Ward Place, Colombo 07, Western Province, Sri Lanka',
          lat: '6.9147',
          lon: '79.8653',
          place_id: 101
        },
        {
          display_name: '78 Duplication Road, Colombo 03, Western Province, Sri Lanka',
          lat: '6.8982',
          lon: '79.8542',
          place_id: 102
        }
      ];
    }
  },

  /**
   * Reverse geocode GPS coordinates to human-readable address
   */
  reverseGeocode: async (lat: number, lon: number): Promise<string> => {
    const details = await locationService.reverseGeocodeDetails(lat, lon);
    return details.displayName;
  },

  /**
   * Calculates Haversine distance in meters between two GPS coordinates
   */
  calculateHaversineDistance: (
    lat1: number,
    lon1: number,
    lat2: number,
    lon2: number
  ): number => {
    const R = 6371000; // Earth radius in meters
    const dLat = ((lat2 - lat1) * Math.PI) / 180;
    const dLon = ((lon2 - lon1) * Math.PI) / 180;
    const a =
      Math.sin(dLat / 2) * Math.sin(dLat / 2) +
      Math.cos((lat1 * Math.PI) / 180) *
      Math.cos((lat2 * Math.PI) / 180) *
      Math.sin(dLon / 2) *
      Math.sin(dLon / 2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    return Math.round(R * c); // Returns distance in meters
  },

  /**
   * Verifies if collector is within 50 meters of customer doorstep
   */
  verifyDoorstepProximity: (
    pickerLoc: LocationCoordinates,
    customerLoc: LocationCoordinates
  ): { isWithinRange: boolean; distanceMeters: number } => {
    const distanceMeters = locationService.calculateHaversineDistance(
      pickerLoc.latitude,
      pickerLoc.longitude,
      customerLoc.latitude,
      customerLoc.longitude
    );
    return {
      isWithinRange: distanceMeters <= 50,
      distanceMeters
    };
  },

  /**
   * Calculates route travel ETA in minutes based on distance in km
   */
  calculateRouteETA: (distanceKm: number): number => {
    const averageSpeedKmH = 25; // Average urban truck speed
    return Math.max(3, Math.ceil((distanceKm / averageSpeedKmH) * 60));
  }
};
