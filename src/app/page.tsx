"use client";

import {useEffect, useState} from 'react';
import {Card, CardContent, CardHeader, CardTitle} from "@/components/ui/card";
import {Input} from "@/components/ui/input";
import {Button} from "@/components/ui/button";
import {getTransportOptions, TransportOption} from "@/services/transport";
import {GoogleMap, LoadScript, Marker} from "@react-google-maps/api";
import {useToast} from "@/hooks/use-toast";
import {recommendTransport, RecommendTransportInput} from "@/ai/flows/recommend-transport";
import {Weather, getWeather} from "@/services/weather";
import {Alert, AlertDescription, AlertTitle} from "@/components/ui/alert";
import {Cloud, CloudRain, CloudSnow, Sun} from "lucide-react";
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
  "Cloudy": Cloud,
  "Rainy": CloudRain,
  "Snowy": CloudSnow,
};

export default function Home() {
  const [destination, setDestination] = useState('');
  const [transportOptions, setTransportOptions] = useState<TransportOption[]>([]);
  const [recommendedOption, setRecommendedOption] = useState<string>('');
  const {toast} = useToast();
  const [weather, setWeather] = useState<Weather | null>(null);

  const [mapCenter, setMapCenter] = useState(defaultLocation);

  useEffect(() => {
    const fetchWeather = async () => {
      try {
        const currentWeather = await getWeather({lat: 19.0760, lng: 72.8777});
        setWeather(currentWeather);
      } catch (error) {
        console.error("Failed to fetch weather:", error);
        toast({
          title: "Error",
          description: "Failed to load weather information.",
          variant: "destructive",
        });
      }
    };

    fetchWeather();
  }, []);

  useEffect(() => {
    if (transportOptions.length > 0) {
      setMapCenter(transportOptions[0].location);
    }
  }, [transportOptions]);

  const handleSearch = async () => {
    if (!destination) {
      toast({
        title: 'Error',
        description: 'Please enter a destination.'
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

      toast({
        title: 'Success',
        description: 'Transport options loaded and AI recommendation generated.',
      });

    } catch (error: any) {
      toast({
        title: 'Error',
        description: error.message || 'Failed to load transport options.',
      });
      console.error(error);
    }
  };

  const WeatherIcon = weather && weatherIconMap[weather.conditions] ? weatherIconMap[weather.conditions] : Sun;

  return (
    <div className="flex flex-col min-h-screen bg-background">
      <div className="container mx-auto p-4">
        <Card className="mb-4">
          <CardHeader>
            <CardTitle>TransitWise: Your AI-Powered Transport Guide</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex flex-col md:flex-row space-y-2 md:space-y-0 md:space-x-4">
              <Input
                type="text"
                placeholder="Enter your destination"
                value={destination}
                onChange={(e) => setDestination(e.target.value)}
                className="bg-input text-foreground"
              />
              <Button onClick={handleSearch} className="bg-primary text-primary-foreground">
                Search
              </Button>
            </div>
          </CardContent>
        </Card>

        {weather && (
          <Card className="mb-4">
            <CardHeader>
              <CardTitle>Current Weather in Mumbai</CardTitle>
            </CardHeader>
            <CardContent>
              <Alert>
                <WeatherIcon className="h-6 w-6"/>
                <AlertTitle>{weather.conditions}</AlertTitle>
                <AlertDescription>
                  {weather.temperatureFarenheit}°F
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
                  <LoadScript googleMapsApiKey={googleMapsApiKey}>
                    <GoogleMap
                      mapContainerStyle={containerStyle}
                      center={mapCenter}
                      zoom={13}
                    >
                      {transportOptions.map((option) => (
                        <Marker
                          key={option.id}
                          position={option.location}
                          label={option.type}
                        />
                      ))}
                    </GoogleMap>
                  </LoadScript>
                </CardContent>
              </Card>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
