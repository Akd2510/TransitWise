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
  const numOptions = Math.floor(Math.random() * 3) + 2; // 2 to 4 options
  const options: TransportOption[] = [];

  for (let i = 0; i < numOptions; i++) {
    const type = ['bus', 'train', 'auto'][Math.floor(Math.random() * 3)];
    const location: VehicleLocation = {
      lat: 19.0760 + (Math.random() - 0.5) * 0.1, // within ~11 km
      lng: 72.8777 + (Math.random() - 0.5) * 0.1,
    };
    const eta = Math.floor(Math.random() * 60) + 10; // 10 to 70 minutes
    const fare: Fare = { amount: Math.floor(Math.random() * 100) + 20 }; // 20 to 120 rupees

    options.push({
      id: `${type}${Math.random().toString(36).substring(2, 9)}`, // random id
      type,
      location,
      eta,
      fare,
    });
  }

  return options;
}
