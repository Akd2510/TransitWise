export interface VehicleLocation {
  /**
   * The latitude of the vehicle's location.
   */
  lat: number;
  /**
   * The longitude of the vehicle's location.
   */
  lng: number;
}
export const getCurrentLocation = (): Promise<VehicleLocation> => {
  return new Promise((resolve, reject) => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          resolve({
            lat: position.coords.latitude,
            lng: position.coords.longitude,
          });
        },
        (error: GeolocationPositionError) => {
          let message = "Geolocation error: ";
          switch (error.code) {
            case 1:
              message += "Permission denied";
              break;
            case 2:
              message += "Position unavailable";
              break;
            case 3:
              message += "Timeout";
              break;
            default:
              message += "Unknown error";
          }
          reject(new Error(message));
        },
      );
    } else {
      reject(new Error("Geolocation is not supported by this browser."));
    }
  });
};
