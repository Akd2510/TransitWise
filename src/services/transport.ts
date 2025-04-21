/**
 * Represents the location of a vehicle.
 */
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

/**
 * Represents fare information.
 */
export interface Fare {
  /**
   * The fare amount in Rupees.
   */
  amount: number;
}

/**
 * Represents a transport option.
 */
export interface TransportOption {
  /**
   * The ID of the transport.
   */
  id: string;
  /**
   * The type of transport (e.g., 'bus', 'train', 'auto').
   */
  type: string;
  /**
   * The current location of the vehicle.
   */
  location: VehicleLocation;
  /**
   * The estimated time of arrival in minutes.
   */
  eta: number;
  /**
   * The fare for this transport option.
   */
  fare: Fare;
}

/**
 * Asynchronously retrieves live location and fare for a given transport mode.
 *
 * @param destination The destination for which to retrieve transport options.
 * @returns A promise that resolves to an array of TransportOption objects.
 */
export async function getTransportOptions(destination: string): Promise<TransportOption[]> {
  // TODO: Implement this by calling an API.

  return [
    {
      id: 'bus123',
      type: 'bus',
      location: { lat: 19.0760, lng: 72.8777 },
      eta: 30,
      fare: { amount: 50 },
    },
    {
      id: 'train456',
      type: 'train',
      location: { lat: 19.0760, lng: 72.8777 },
      eta: 20,
      fare: { amount: 40 },
    },
    {
      id: 'auto789',
      type: 'auto',
      location: { lat: 19.0760, lng: 72.8777 },
      eta: 40,
      fare: { amount: 60 },
    },
  ];
}
