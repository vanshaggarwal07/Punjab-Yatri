import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useToast } from "@/components/ui/use-toast";
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { ArrowLeft, Clock, Bus, AlertTriangle, Coffee, Power, AlertCircle, Loader2, Wifi, MapPin } from "lucide-react";
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
  const [locationSource, setLocationSource] = useState<'gps' | 'cell'>('gps');
  const [currentBus, setCurrentBus] = useState<Bus | null>(null);
  const [isOnBreak, setIsOnBreak] = useState(false);
  const [emergencyStatus, setEmergencyStatus] = useState<{
    isActive: boolean;
    message: string;
    time: string | null;
  }>({ isActive: false, message: '', time: null });
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
    
    // Update the current bus location in state
    if (currentBus) {
      setCurrentBus({
        ...currentBus,
        currentLocation: { lat, lng },
        lastUpdated: new Date().toISOString()
      });
    }
  };

  const handleLogout = () => {
    stopLocationTracking();
    setIsAuthenticated(false);
    setDriverId("");
    setBusNumber("");
    setLocation(null);
    setCurrentBus(null);
    setIsOnBreak(false);
    setEmergencyStatus({ isActive: false, message: '', time: null });
  };

  const handleReportIssue = async () => {
    if (!currentBus) return;
    
    const issue = prompt('Please describe the issue:');
    if (!issue) return;
    
    setIsLoading(true);
    
    // Simulate API call
    try {
      await new Promise(resolve => setTimeout(resolve, 1000));
      // In a real app, this would be an API call
      // await fetch('/api/report-issue', {
      //   method: 'POST',
      //   body: JSON.stringify({
      //     busId: currentBus.id,
      //     driverId,
      //     issue,
      //     location,
      //     timestamp: new Date().toISOString()
      //   })
      // });
      
      toast({
        title: "Issue Reported",
        description: "Your issue has been reported to the operations team.",
        variant: "default",
      });
    } catch (error) {
      console.error('Error reporting issue:', error);
      toast({
        title: "Error",
        description: "Failed to report issue. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const toggleBreak = async () => {
    if (!currentBus) return;
    
    const newBreakState = !isOnBreak;
    setIsLoading(true);
    
    try {
      await new Promise(resolve => setTimeout(resolve, 800));
      // In a real app, this would be an API call
      // await fetch('/api/driver/break', {
      //   method: 'POST',
      //   body: JSON.stringify({
      //     driverId,
      //     busId: currentBus.id,
      //     isOnBreak: newBreakState,
      //     timestamp: new Date().toISOString()
      //   })
      // });
      
      setIsOnBreak(newBreakState);
      toast({
        title: newBreakState ? "Break Started" : "Break Ended",
        description: newBreakState 
          ? "Your break has started. You will not receive new assignments." 
          : "You are back on duty.",
        variant: "default",
      });
    } catch (error) {
      console.error('Error updating break status:', error);
      toast({
        title: "Error",
        description: "Failed to update break status. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleEmergency = async () => {
    if (!currentBus) return;
    
    if (emergencyStatus.isActive) {
      setEmergencyStatus({ isActive: false, message: '', time: null });
      toast({
        title: "Emergency Resolved",
        description: "Emergency status has been deactivated.",
        variant: "default",
      });
      return;
    }
    
    const emergencyType = prompt('Select emergency type:\n1. Medical Emergency\n2. Mechanical Failure\n3. Security Threat\n4. Other');
    
    if (!emergencyType) return;
    
    const messages = {
      '1': 'Medical Emergency - Immediate assistance required',
      '2': 'Mechanical Failure - Vehicle needs attention',
      '3': 'Security Threat - Urgent assistance needed',
      '4': 'Emergency - Immediate assistance required'
    };
    
    const message = messages[emergencyType as keyof typeof messages] || 'Emergency - Assistance required';
    const time = new Date().toLocaleTimeString();
    
    // In a real app, this would trigger an API call to notify the operations team
    console.log('EMERGENCY ALERT:', { bus: currentBus.number, message, time });
    
    setEmergencyStatus({ isActive: true, message, time });
    
    // Flash the screen red to indicate emergency mode
    document.body.style.animation = 'emergencyFlash 1s 3';
    setTimeout(() => {
      document.body.style.animation = '';
    }, 3000);
    
    toast({
      title: "🚨 Emergency Alert Sent",
      description: "Help is on the way. Stay calm and follow emergency procedures.",
      variant: "destructive",
      duration: 10000,
    });
  };

  const endShift = async () => {
    if (!currentBus || !confirm('Are you sure you want to end your shift? This will log you out.')) {
      return;
    }
    
    setIsLoading(true);
    
    try {
      await new Promise(resolve => setTimeout(resolve, 1000));
      // In a real app, this would be an API call
      // await fetch('/api/shift/end', {
      //   method: 'POST',
      //   body: JSON.stringify({
      //     driverId,
      //     busId: currentBus.id,
      //     endTime: new Date().toISOString(),
      //     endLocation: location
      //   })
      // });
      
      toast({
        title: "Shift Ended",
        description: "Thank you for your service today!",
        variant: "default",
      });
      
      handleLogout();
    } catch (error) {
      console.error('Error ending shift:', error);
      toast({
        title: "Error",
        description: "Failed to end shift. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const getCurrentLocation = () => {
    // Clear any existing location tracking
    if (watchId !== null) {
      navigator.geolocation.clearWatch(watchId);
      setWatchId(null);
    }
    
    if (locationSource === 'cell') {
      // Simulate cell tower location (less accurate)
      const mockLocations = [
        { lat: 30.7333 + (Math.random() * 0.02 - 0.01), lng: 76.7794 + (Math.random() * 0.02 - 0.01) }, // Chandigarh area
        { lat: 31.6340 + (Math.random() * 0.02 - 0.01), lng: 74.8723 + (Math.random() * 0.02 - 0.01) }, // Amritsar area
        { lat: 31.3260 + (Math.random() * 0.02 - 0.01), lng: 75.5762 + (Math.random() * 0.02 - 0.01) }, // Jalandhar area
        { lat: 30.9010 + (Math.random() * 0.02 - 0.01), lng: 75.8573 + (Math.random() * 0.02 - 0.01) }, // Ludhiana area
      ];
      
      const randomLocation = mockLocations[Math.floor(Math.random() * mockLocations.length)];
      
      // Set initial location
      setLocation({
        lat: randomLocation.lat,
        lng: randomLocation.lng
      });
      setIsLocationActive(true);
      
      // Simulate less frequent updates for cell tower
      const interval = setInterval(() => {
        const updatedLocation = {
          lat: randomLocation.lat + (Math.random() * 0.01 - 0.005),
          lng: randomLocation.lng + (Math.random() * 0.01 - 0.005)
        };
        setLocation(updatedLocation);
        updateBusLocation(updatedLocation.lat, updatedLocation.lng);
      }, 10000); // Update every 10 seconds
      
      // Cleanup function
      return () => clearInterval(interval);
    }
    
    // Proceed with GPS if not using cell tower
    if (!navigator.geolocation) {
      setLocationError("Geolocation is not supported by your browser");
      setIsLocationActive(false);
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
                <div className="mb-6 space-y-2">
                  <p className="text-sm font-medium text-gray-700">Location Source</p>
                  <div className="grid grid-cols-2 gap-3">
                    <button
                      type="button"
                      onClick={() => setLocationSource('gps')}
                      className={`flex flex-col items-center justify-center p-4 rounded-lg border-2 transition-colors ${
                        locationSource === 'gps'
                          ? 'border-blue-600 bg-blue-50'
                          : 'border-gray-200 hover:bg-gray-50'
                      }`}
                    >
                      <MapPin className={`h-8 w-8 mb-2 ${
                        locationSource === 'gps' ? 'text-blue-600' : 'text-gray-500'
                      }`} />
                      <span className="font-medium">GPS Location</span>
                      {locationSource === 'gps' && (
                        <span className="text-xs text-blue-600 font-medium mt-1">Active</span>
                      )}
                    </button>
                    <button
                      type="button"
                      onClick={() => setLocationSource('cell')}
                      className={`flex flex-col items-center justify-center p-4 rounded-lg border-2 transition-colors ${
                        locationSource === 'cell'
                          ? 'border-green-600 bg-green-50'
                          : 'border-gray-200 hover:bg-gray-50'
                      }`}
                    >
                      <Wifi className={`h-8 w-8 mb-2 ${
                        locationSource === 'cell' ? 'text-green-600' : 'text-gray-500'
                      }`} />
                      <span className="font-medium">Cell Tower</span>
                      {locationSource === 'cell' && (
                        <span className="text-xs text-green-600 font-medium mt-1">Active</span>
                      )}
                    </button>
                  </div>
                </div>
                
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
                        Using {locationSource === 'gps' ? 'GPS' : 'Cell Tower'} for location tracking.
                        {locationSource === 'gps' 
                          ? ' High accuracy GPS location is active.' 
                          : ' Approximate location based on cell towers.'}
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
                <CardTitle className="flex items-center justify-between">
                  <span>Quick Actions</span>
                  {emergencyStatus.isActive && (
                    <span className="flex items-center text-sm font-normal text-red-600 animate-pulse">
                      <AlertCircle className="h-4 w-4 mr-1" /> EMERGENCY
                    </span>
                  )}
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <Button 
                  variant={emergencyStatus.isActive ? "destructive" : "outline"}
                  className="w-full flex items-center justify-center gap-2"
                  onClick={handleEmergency}
                  disabled={!isLocationActive || isLoading}
                >
                  {isLoading && emergencyStatus.isActive ? (
                    <Loader2 className="h-4 w-4 animate-spin" />
                  ) : (
                    <AlertTriangle className="h-4 w-4" />
                  )}
                  {emergencyStatus.isActive ? 'Emergency Active' : 'Emergency'}
                </Button>
                
                <Button 
                  variant="outline" 
                  className="w-full flex items-center justify-center gap-2"
                  onClick={handleReportIssue}
                  disabled={!isLocationActive || isLoading}
                >
                  <AlertCircle className="h-4 w-4" />
                  Report Issue
                </Button>
                
                <Button 
                  variant={isOnBreak ? 'secondary' : 'outline'}
                  className="w-full flex items-center justify-center gap-2"
                  onClick={toggleBreak}
                  disabled={!isLocationActive || isLoading}
                >
                  <Coffee className="h-4 w-4" />
                  {isOnBreak ? 'End Break' : 'Start Break'}
                </Button>
                
                <Button 
                  variant="outline" 
                  className="w-full flex items-center justify-center gap-2 text-red-600 hover:bg-red-50 hover:text-red-700"
                  onClick={endShift}
                  disabled={isLoading}
                >
                  <Power className="h-4 w-4" />
                  End Shift
                </Button>
                
                {emergencyStatus.isActive && (
                  <div className="mt-2 p-3 bg-red-50 border border-red-200 rounded-md text-sm text-red-700">
                    <div className="font-medium">Emergency Active</div>
                    <div>{emergencyStatus.message}</div>
                    <div className="text-xs opacity-75 mt-1">Reported at: {emergencyStatus.time}</div>
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
        </div>
      </main>
    </div>
  );
}
