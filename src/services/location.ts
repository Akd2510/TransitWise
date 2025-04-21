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
        (error) => {
          reject(error);
        }
      );
    } else {
      reject(new Error("Geolocation is not supported by this browser."));
    }
  });
};
