"use client";

import {useEffect, useState, useRef, useCallback} from 'react';
import {Card, CardContent, CardHeader, CardTitle} from "@/components/ui/card";
import {Input} from "@/components/ui/input";
import {Button} from "@/components/ui/button";
import {getTransportOptions, TransportOption} from "@/services/transport";
import {GoogleMap, LoadScript, Marker, DirectionsRenderer, Autocomplete} from "@react-google-maps/api";
import {useToast} from "@/hooks/use-toast";
import {recommendTransport, RecommendTransportInput} from "@/ai/flows/recommend-transport";
import {Weather, getWeather} from "@/services/weather";
import {Alert, AlertDescription, AlertTitle} from "@/components/ui/alert";
import {Cloud, CloudRain, CloudSnow, Sun} from "lucide-react";
import {getCurrentLocation} from "@/services/location";
import {Separator} from "@/components/ui/separator";

const googleMapsApiKey = process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY || '';

const containerStyle = {
  width: '100%',
  height: '400px'
};

const defaultLocation = {
  lat: 19.0760,
  lng: 72.8777
};

const weatherIconMap: { [key: string]: React.ComponentType<{ className?: string }> } = {
  "Sunny": Sun,
  "Clear": Sun,
  "Cloudy": Cloud,
  "Rainy": CloudRain,
  "Drizzle": CloudRain,
  "Snowy": CloudSnow,
  "Snow": CloudSnow,
};

export default function Home() {
  const [destination, setDestination] = useState('');
  const [transportOptions, setTransportOptions] = useState<TransportOption[]>([]);
  const [recommendedOption, setRecommendedOption] = useState<string>('');
  const {toast} = useToast();
  const [weather, setWeather] = useState<Weather | null>(null);
  const [currentLocation, setCurrentLocation] = useState<{ lat: number, lng: number } | null>(null);
  const [mapCenter, setMapCenter] = useState(defaultLocation);
  const [directions, setDirections] = useState<google.maps.DirectionsResult | null>(null);
  const [origin, setOrigin] = useState<string | null>(null);
  const [isGoogleMapsLoaded, setIsGoogleMapsLoaded] = useState(false);
  const [apiError, setApiError] = useState<string | null>(null);
  const autocompleteRef = useRef<google.maps.places.Autocomplete | null>(null);

  useEffect(() => {
    if (!googleMapsApiKey) {
      setApiError("Google Maps API key is missing. Please provide a valid API key to display the map.");
      return;
    }

    const fetchCurrentLocation = async () => {
      try {
        const location = await getCurrentLocation();
        setCurrentLocation(location);
        setMapCenter(location);
        setOrigin(`${location.lat}, ${location.lng}`);
      } catch (error: any) {
        console.error("Error getting current location:", error.message);
        if (error.message && error.message.toLowerCase().includes("permission denied")) {
          toast({
            title: "Location Error",
            description: "We need your location to provide accurate transport options. Please enable location access in your browser settings.",
            variant: "destructive",
          });
        } else {
          toast({
            title: "Location Error",
            description: error.message || "Failed to get current location. Using default.",
            variant: "destructive",
          });
        }
        setCurrentLocation(defaultLocation);
        setMapCenter(defaultLocation);
        setOrigin(`${defaultLocation.lat}, ${defaultLocation.lng}`);
      }
    };

    fetchCurrentLocation();
  }, [toast, googleMapsApiKey]);

  useEffect(() => {
    const fetchWeather = async () => {
      if (currentLocation) {
        try {
          const currentWeather = await getWeather(currentLocation);
          setWeather(currentWeather);
        } catch (error: any) {
          console.error("Failed to fetch weather:", error);
          toast({
            title: "Weather Error",
            description: error.message || "Failed to load weather information.",
            variant: "destructive",
          });
        }
      }
    };

    if (currentLocation) {
      fetchWeather();
    }
  }, [currentLocation, toast]);

  useEffect(() => {
    if (transportOptions.length > 0) {
      setMapCenter(transportOptions[0].location);
    }
  }, [transportOptions]);

  const onLoad = useCallback((autocomplete: google.maps.places.Autocomplete) => {
    autocompleteRef.current = autocomplete;
  }, []);

  const handleSearch = useCallback(async () => {
    if (!destination) {
      toast({
        title: 'Error',
        description: 'Please enter a destination.'
      });
      return;
    }

    if (!currentLocation) {
      toast({
        title: 'Error',
        description: 'Current location not available.'
      });
      return;
    }

    try {
      const options = await getTransportOptions(destination);
      setTransportOptions(options);

      const aiInput: RecommendTransportInput = {
        destination: destination,
        userPreferences: {
          maxFare: 100,
          maxEta: 60,
          weatherConsiderations: true
        }
      };

      const recommendationResult = await recommendTransport(aiInput);
      setRecommendedOption(recommendationResult.recommendation);

      const directionsService = new google.maps.DirectionsService();
      directionsService.route(
        {
          origin: origin || `${currentLocation.lat}, ${currentLocation.lng}`,
          destination: destination,
          travelMode: google.maps.TravelMode.TRANSIT,
        },
        (response, status) => {
          if (status === google.maps.DirectionsStatus.OK) {
            setDirections(response);
          } else {
            console.error(`Directions error: ${status}`);
            toast({
              title: "Directions Error",
              description: `Failed to fetch directions: ${status}`,
              variant: "destructive",
            });
          }
        }
      );

      toast({
        title: 'Success',
        description: 'Transport options loaded and AI recommendation generated.',
      });

    } catch (error: any) {
      console.error("Transport options error:", error);
      toast({
        title: 'Error',
        description: error.message || 'Failed to load transport options.',
        variant: "destructive",
      });
    }
  }, [destination, currentLocation, origin, toast]);


  const onPlaceChanged = useCallback(() => {
    if (autocompleteRef.current) {
      const place = autocompleteRef.current.getPlace();
      if (place?.geometry?.location) {
        setDestination(place.formatted_address || '');
        setMapCenter({
          lat: place.geometry.location.lat(),
          lng: place.geometry.location.lng()
        });
      } else {
        toast({
          title: "Could not find destination",
          description: "Please enter a valid destination",
          variant: "destructive"
        });
      }
    }
  }, [toast]);

  const onGoogleMapsLoad = () => {
    setIsGoogleMapsLoaded(true);
  };


  const WeatherIcon = weather && weatherIconMap[weather.conditions] ? weatherIconMap[weather.conditions] : Sun;

  const temperatureCelsius = weather ? Math.round((weather.temperatureFarenheit - 32) * 5 / 9) : null;

  return (
    <div className="flex flex-col min-h-screen bg-background">
      <div className="container mx-auto p-4">
        <Card className="mb-4">
          <CardHeader>
            <CardTitle>TransitWise: Your AI-Powered Transport Guide</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex flex-col md:flex-row space-y-2 md:space-y-0 md:space-x-4">
              {apiError ? (
                <Alert variant="destructive">
                  <AlertTitle>Google Maps API Key Required</AlertTitle>
                  <AlertDescription>
                    {apiError}
                  </AlertDescription>
                </Alert>
              ) : (
                <>
                  <LoadScript
                    googleMapsApiKey={googleMapsApiKey}
                    libraries={["places"]}
                    onLoad={onGoogleMapsLoad}
                  >
                    <Autocomplete
                      onLoad={onLoad}
                      onPlaceChanged={onPlaceChanged}
                    >
                      <Input
                        type="text"
                        placeholder="Enter your destination"
                        className="bg-input text-foreground"
                        value={destination}
                        onChange={(e) => setDestination(e.target.value)}
                      />
                    </Autocomplete>
                  </LoadScript>
                  <Button onClick={handleSearch}>Search</Button>
                </>
              )}
            </div>
          </CardContent>
        </Card>

        {weather && (
          <Card className="mb-4">
            <CardHeader>
              <CardTitle>Current Weather</CardTitle>
            </CardHeader>
            <CardContent>
              <Alert>
                <WeatherIcon className="h-6 w-6" />
                <AlertTitle>{weather.conditions}</AlertTitle>
                <AlertDescription>
                  {temperatureCelsius}°C
                  {recommendedOption && (
                    <p className="text-sm text-muted-foreground">
                      Recommended transport: {recommendedOption}
                    </p>
                  )}
                </AlertDescription>
              </Alert>
            </CardContent>
          </Card>
        )}

        {transportOptions.length > 0 && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <Card>
                <CardHeader>
                  <CardTitle>Transport Options</CardTitle>
                </CardHeader>
                <CardContent>
                  <ul className="list-none p-0">
                    {transportOptions.map((option) => (
                      <li key={option.id} className="py-2 border-b last:border-none">
                        <div className="flex justify-between items-center">
                          <div>
                            <p className="font-medium">{option.type}</p>
                            <p className="text-sm text-muted-foreground">ETA: {option.eta} mins</p>
                          </div>
                          <div>
                            <p className="text-sm">₹{option.fare.amount}</p>
                          </div>
                        </div>
                      </li>
                    ))}
                  </ul>
                </CardContent>
              </Card>

              {recommendedOption && (
                <Card>
                  <CardHeader>
                    <CardTitle>AI Recommendation</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p>{recommendedOption}</p>
                    {weather && (
                      <p className="text-sm text-muted-foreground">
                        Recommended transport considering {weather.conditions.toLowerCase()} conditions.
                      </p>
                    )}
                  </CardContent>
                </Card>
              )}
            </div>

            <div>
              <Card>
                <CardHeader>
                  <CardTitle>Route Visualization</CardTitle>
                </CardHeader>
                <CardContent>
                  {isGoogleMapsLoaded ? (
                    <GoogleMap
                      mapContainerStyle={containerStyle}
                      center={mapCenter}
                      zoom={13}
                      onLoad={map => mapRef.current = map}
                    >
                      {currentLocation && (
                        <Marker
                          position={currentLocation}
                          label="You are here"
                        />
                      )}
                      {transportOptions.map((option) => (
                        <Marker
                          key={option.id}
                          position={option.location}
                          label={option.type}
                        />
                      ))}
                      {directions && (
                        <DirectionsRenderer
                          directions={directions}
                          options={{
                            polylineOptions: {
                              strokeColor: "#ff2527"
                            }
                          }}
                        />
                      )}
                    </GoogleMap>
                  ) : (
                    <Alert variant="destructive">
                      <AlertTitle>Map Error</AlertTitle>
                      <AlertDescription>
                        Google Maps API key is missing or failed to load. Please provide a valid API key to display the map.
                      </AlertDescription>
                    </Alert>
                  )}
                </CardContent>
              </Card>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
