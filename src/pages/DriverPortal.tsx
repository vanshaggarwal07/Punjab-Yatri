import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useToast } from "@/components/ui/use-toast";
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { ArrowLeft, Clock, Bus } from "lucide-react";
import { Link } from "react-router-dom";

interface Bus {
  id: string;
  number: string;
  route: string;
  status: "active" | "inactive" | "maintenance";
  lastUpdated: string;
  currentLocation: {
    lat: number;
    lng: number;
  };
  driver?: {
    id: string;
    name: string;
  };
}

export default function DriverPortal() {
  const [driverId, setDriverId] = useState("");
  const [busNumber, setBusNumber] = useState("");
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const [location, setLocation] = useState<{ lat: number; lng: number } | null>(null);
  const [locationError, setLocationError] = useState("");
  const [isLocationActive, setIsLocationActive] = useState(false);
  const [watchId, setWatchId] = useState<number | null>(null);
  const [currentBus, setCurrentBus] = useState<Bus | null>(null);
  const { toast } = useToast();
  const navigate = useNavigate();

  // Mock authentication - in a real app, this would be an API call
  const authenticateDriver = (driverId: string, busNumber: string) => {
    setIsLoading(true);
    setError("");
    
    // Simulate API call
    setTimeout(() => {
      // Mock validation - in a real app, validate against your backend
      if (driverId && busNumber) {
        setIsAuthenticated(true);
        setCurrentBus({
          id: "bus-001",
          number: busNumber,
          route: "Route 101",
          status: "active",
          lastUpdated: new Date().toISOString(),
          currentLocation: { lat: 0, lng: 0 },
          driver: {
            id: driverId,
            name: `Driver ${driverId}`
          }
        });
        startLocationTracking();
      } else {
        setError("Invalid driver ID or bus number");
      }
      setIsLoading(false);
    }, 1000);
  };

  const startLocationTracking = () => {
    if (!navigator.geolocation) {
      setLocationError("Geolocation is not supported by your browser");
      return;
    }

    // Request location permission and start tracking
    const id = navigator.geolocation.watchPosition(
      (position) => {
        const { latitude, longitude } = position.coords;
        setLocation({ lat: latitude, lng: longitude });
        setIsLocationActive(true);
        
        // In a real app, send this location to your backend
        updateBusLocation(latitude, longitude);
      },
      (error) => {
        console.error("Error getting location:", error);
        setLocationError("Unable to retrieve your location");
        setIsLocationActive(false);
      },
      {
        enableHighAccuracy: true,
        timeout: 10000,
        maximumAge: 0
      }
    );

    setWatchId(id);
  };

  const stopLocationTracking = () => {
    if (watchId !== null) {
      navigator.geolocation.clearWatch(watchId);
      setWatchId(null);
      setIsLocationActive(false);
    }
  };

  // In a real app, this would send the location to your backend
  const updateBusLocation = (lat: number, lng: number) => {
    console.log(`Updating bus location to: ${lat}, ${lng}`);
    // Here you would typically make an API call to update the bus location in your database
    // For example:
    // await fetch('/api/bus/location', {
    //   method: 'POST',
    //   headers: { 'Content-Type': 'application/json' },
    //   body: JSON.stringify({ busNumber, driverId, location: { lat, lng } })
    // });
  };

  const handleLogout = () => {
    stopLocationTracking();
    setIsAuthenticated(false);
    setDriverId("");
    setBusNumber("");
    setLocation(null);
    setCurrentBus(null);
  };

  // Clean up the geolocation watcher when the component unmounts
  useEffect(() => {
    return () => {
      if (watchId !== null) {
        navigator.geolocation.clearWatch(watchId);
      }
    };
  }, [watchId]);

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50 p-4">
        <Card className="w-full max-w-md">
          <CardHeader>
            <CardTitle className="text-2xl font-bold text-center">Driver Login</CardTitle>
          </CardHeader>
          <CardContent>
            <form
              onSubmit={(e) => {
                e.preventDefault();
                authenticateDriver(driverId, busNumber);
              }}
              className="space-y-4"
            >
              <div className="space-y-2">
                <Label htmlFor="driverId">Driver ID</Label>
                <Input
                  id="driverId"
                  type="text"
                  value={driverId}
                  onChange={(e) => setDriverId(e.target.value)}
                  placeholder="Enter your driver ID"
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="busNumber">Bus Number</Label>
                <Input
                  id="busNumber"
                  type="text"
                  value={busNumber}
                  onChange={(e) => setBusNumber(e.target.value)}
                  placeholder="Enter bus number"
                  required
                />
              </div>
              {error && <p className="text-sm text-red-500">{error}</p>}
              <Button type="submit" className="w-full" disabled={isLoading}>
                {isLoading ? "Signing in..." : "Sign In"}
              </Button>
            </form>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 py-4 sm:px-6 lg:px-8 flex justify-between items-center">
          <h1 className="text-xl font-semibold text-gray-900">Driver Portal</h1>
          <div className="flex items-center space-x-4">
            <div className="flex items-center space-x-2">
              <div className={`h-3 w-3 rounded-full ${isLocationActive ? 'bg-green-500' : 'bg-red-500'}`}></div>
              <span className="text-sm text-gray-600">
                {isLocationActive ? 'Location Active' : 'Location Inactive'}
              </span>
            </div>
            <Button variant="outline" size="sm" onClick={handleLogout}>
              Sign Out
            </Button>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 py-6 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="md:col-span-2 space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Location Tracking</CardTitle>
              </CardHeader>
              <CardContent>
                {location ? (
                  <div className="space-y-4">
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <p className="text-sm font-medium text-gray-500">Latitude</p>
                        <p className="text-lg font-mono">{location.lat.toFixed(6)}</p>
                      </div>
                      <div>
                        <p className="text-sm font-medium text-gray-500">Longitude</p>
                        <p className="text-lg font-mono">{location.lng.toFixed(6)}</p>
                      </div>
                    </div>
                    <div className="bg-gray-100 p-4 rounded-lg">
                      <p className="text-sm text-gray-700">
                        Your location is being shared in real-time. The map will update automatically.
                      </p>
                    </div>
                  </div>
                ) : (
                  <div className="text-center py-8">
                    <p className="text-gray-500">Waiting for location data...</p>
                  </div>
                )}
                {locationError && (
                  <div className="mt-4 p-3 bg-red-50 text-red-700 rounded-md text-sm">
                    {locationError}
                  </div>
                )}
              </CardContent>
            </Card>
          </div>

          <div className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Bus Information</CardTitle>
              </CardHeader>
              <CardContent>
                {currentBus && (
                  <div className="space-y-4">
                    <div>
                      <p className="text-sm font-medium text-gray-500">Bus Number</p>
                      <p className="text-lg font-semibold">{currentBus.number}</p>
                    </div>
                    <div>
                      <p className="text-sm font-medium text-gray-500">Route</p>
                      <p>{currentBus.route}</p>
                    </div>
                    <div>
                      <p className="text-sm font-medium text-gray-500">Status</p>
                      <div className="flex items-center">
                        <span className={`inline-block h-2 w-2 rounded-full mr-2 ${
                          currentBus.status === 'active' ? 'bg-green-500' : 
                          currentBus.status === 'inactive' ? 'bg-gray-400' : 'bg-yellow-500'
                        }`}></span>
                        <span className="capitalize">{currentBus.status}</span>
                      </div>
                    </div>
                    <div>
                      <p className="text-sm font-medium text-gray-500">Last Updated</p>
                      <p>{new Date(currentBus.lastUpdated).toLocaleTimeString()}</p>
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Quick Actions</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <Button variant="outline" className="w-full" disabled={!isLocationActive}>
                  Report Issue
                </Button>
                <Button variant="outline" className="w-full" disabled={!isLocationActive}>
                  Start Break
                </Button>
                <Button variant="outline" className="w-full" disabled={!isLocationActive}>
                  End Shift
                </Button>
              </CardContent>
            </Card>
          </div>
        </div>
      </main>
    </div>
  );
}
