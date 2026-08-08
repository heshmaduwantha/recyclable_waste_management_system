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

export const locationService = {
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
    try {
      const response = await fetch(
        `https://nominatim.openstreetmap.org/reverse?format=json&lat=${lat}&lon=${lon}`
      );
      const data = await response.json();
      return data?.display_name || `${lat.toFixed(4)}, ${lon.toFixed(4)}`;
    } catch (error) {
      return `45 Ward Place, Colombo 07 (${lat.toFixed(4)}, ${lon.toFixed(4)})`;
    }
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
