import {VehicleLocation} from "@/services/transport";

export const getCurrentLocation = (): Promise<VehicleLocation> => {
  return new Promise((resolve) => {
    if (typeof window !== 'undefined' && navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          resolve({
            lat: position.coords.latitude,
            lng: position.coords.longitude,
          });
        },
        () => {
          // Use a default location if permission is denied or other errors occur
          resolve({
            lat: 19.0760,
            lng: 72.8777,
          });
        }
      );
    } else {
      // Use a default location if geolocation is not supported
      resolve({
        lat: 19.0760,
        lng: 72.8777,
      });
    }
  });
};
