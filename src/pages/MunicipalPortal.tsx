import { useState, useEffect } from 'react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { ArrowLeft, BarChart2, Users, AlertTriangle, Settings, Bus, MapPin, Plus, Lock, User, Building2, BusFront, Map, UserRoundCog } from "lucide-react";
import { Link, useNavigate } from "react-router-dom";
import { BusManagement } from "@/components/bus/BusManagement";
import { DriverManagement } from "@/components/bus/DriverManagement";
import { RouteManagement } from "@/components/bus/RouteManagement";
import MapView from "@/components/MapView";

// Mock data types
interface Bus {
  id: string;
  number: string;
  type: string;
  status: 'active' | 'inactive' | 'maintenance';
  capacity: number;
  currentRoute?: {
    from: string;
    to: string;
    distance: number;
  };
  lastUpdated: Date;
}

// Mock authentication - in a real app, this would be handled by a backend service
const MUNICIPAL_USERS = [
  { id: 'admin', password: 'admin123', name: 'Administrator', role: 'admin' },
  { id: 'traffic', password: 'traffic123', name: 'Traffic Control', role: 'traffic' },
  { id: 'support', password: 'support123', name: 'Support Staff', role: 'support' },
];

export default function MunicipalPortal() {
  const [userId, setUserId] = useState('');
  const [password, setPassword] = useState('');
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [user, setUser] = useState<{id: string; name: string; role: string} | null>(null);
  const [activeTab, setActiveTab] = useState('dashboard');
  const [buses, setBuses] = useState<Bus[]>([]);
  const navigate = useNavigate();

  // Check if already logged in
  useEffect(() => {
    const savedUser = localStorage.getItem('municipalUser');
    if (savedUser) {
      try {
        const userData = JSON.parse(savedUser);
        setUser(userData);
        setIsLoggedIn(true);
      } catch (e) {
        localStorage.removeItem('municipalUser');
      }
    }
  }, []);

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    
    if (!userId.trim() || !password) {
      setError('Please enter both User ID and Password');
      return;
    }
    
    setIsLoading(true);
    
    // Simulate API call
    setTimeout(() => {
      const user = MUNICIPAL_USERS.find(u => u.id === userId && u.password === password);
      
      if (user) {
        const userData = { id: user.id, name: user.name, role: user.role };
        setUser(userData);
        localStorage.setItem('municipalUser', JSON.stringify(userData));
        setIsLoggedIn(true);
      } else {
        setError('Invalid credentials. Please try again.');
      }
      
      setIsLoading(false);
    }, 800); // Simulate network delay
  };
  
  const handleLogout = () => {
    localStorage.removeItem('municipalUser');
    setIsLoggedIn(false);
    setUser(null);
    setUserId('');
    setPassword('');
  };

  // Load mock data
  useEffect(() => {
    // In a real app, this would be an API call
    const mockBuses: Bus[] = [
      {
        id: '1',
        number: 'PB01AB1234',
        type: 'AC Sleeper',
        capacity: 40,
        status: 'active',
        currentRoute: {
          from: 'Amritsar',
          to: 'Chandigarh',
          distance: 230
        },
        lastUpdated: new Date()
      },
      {
        id: '2',
        number: 'PB02CD5678',
        type: 'Non-AC Seater',
        capacity: 50,
        status: 'active',
        currentRoute: {
          from: 'Ludhiana',
          to: 'Jalandhar',
          distance: 90
        },
        lastUpdated: new Date()
      },
      {
        id: '3',
        number: 'PB03EF9012',
        type: 'Volvo Multi-Axle',
        capacity: 45,
        status: 'maintenance',
        lastUpdated: new Date()
      }
    ];
    
    setBuses(mockBuses);
  }, []);

  if (!isLoggedIn) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center p-4">
        <Card className="w-full max-w-md">
          <CardHeader>
            <div className="flex flex-col items-center space-y-2">
              <div className="p-3 rounded-full bg-primary/10">
                <Building2 className="h-8 w-8 text-primary" />
              </div>
              <CardTitle className="text-2xl">Municipal Corporation</CardTitle>
              <p className="text-sm text-muted-foreground">Enter your credentials to access the portal</p>
            </div>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleLogin} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="userId" className="flex items-center gap-2">
                  <User className="h-4 w-4" />
                  User ID
                </Label>
                <Input
                  id="userId"
                  type="text"
                  value={userId}
                  onChange={(e) => setUserId(e.target.value)}
                  placeholder="Enter your user ID"
                  autoComplete="username"
                  required
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="password" className="flex items-center gap-2">
                  <Lock className="h-4 w-4" />
                  Password
                </Label>
                <Input
                  id="password"
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Enter your password"
                  autoComplete="current-password"
                  required
                />
              </div>
              
              {error && (
                <div className="p-3 bg-red-500/10 text-red-600 text-sm rounded-md flex items-start gap-2">
                  <AlertTriangle className="h-4 w-4 mt-0.5 flex-shrink-0" />
                  <span>{error}</span>
                </div>
              )}
              
              <Button type="submit" className="w-full" disabled={isLoading}>
                {isLoading ? 'Logging in...' : 'Login to Portal'}
              </Button>
              
              <div className="text-center text-sm text-muted-foreground mt-4">
                <p>Demo credentials:</p>
                <p className="font-mono text-xs mt-1">
                  admin/admin123, traffic/traffic123, support/support123
                </p>
              </div>
            </form>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <div className="container py-8">
        <div className="flex items-center justify-between mb-8">
          <div>
            <Button variant="ghost" asChild className="mb-2 -ml-3">
              <Link to="/" className="flex items-center gap-2">
                <ArrowLeft className="h-4 w-4" />
                Back to Home
              </Link>
            </Button>
            <h1 className="text-3xl font-bold">Municipal Corporation Portal</h1>
            <p className="text-muted-foreground">Punjab Transport Department</p>
            {user && (
              <div className="mt-1 text-sm text-muted-foreground flex items-center gap-2">
                <span>Logged in as: </span>
                <span className="font-medium text-foreground">{user.name}</span>
                <span className="text-xs bg-muted px-2 py-0.5 rounded-full">{user.role}</span>
              </div>
            )}
          </div>
          <div className="flex items-center gap-2">
            <Button 
              variant="outline" 
              onClick={handleLogout}
              className="text-destructive hover:text-destructive"
            >
              <Lock className="h-4 w-4 mr-2" />
              Logout
            </Button>
          </div>
        </div>
        
        <Tabs 
          defaultValue="dashboard" 
          value={activeTab}
          onValueChange={setActiveTab}
          className="w-full"
        >
          <TabsList className="grid w-full grid-cols-4 lg:grid-cols-5 mb-6">
            <TabsTrigger value="map" className="flex items-center gap-2">
              <Map className="h-4 w-4" />
              Live Map
            </TabsTrigger>
            <TabsTrigger value="dashboard" className="flex items-center gap-2">
              <BarChart2 className="h-4 w-4" />
              Dashboard
            </TabsTrigger>
            <TabsTrigger value="buses" className="flex items-center gap-2">
              <Bus className="h-4 w-4" />
              Buses
            </TabsTrigger>
            <TabsTrigger value="drivers" className="flex items-center gap-2">
              <UserRoundCog className="h-4 w-4" />
              Drivers
            </TabsTrigger>
            <TabsTrigger value="routes" className="flex items-center gap-2">
              <MapPin className="h-4 w-4" />
              Routes
            </TabsTrigger>
            <TabsTrigger value="reports" className="flex items-center gap-2">
              <BarChart2 className="h-4 w-4" />
              Reports
            </TabsTrigger>
          </TabsList>

          <TabsContent value="map" className="mt-6 h-[calc(100vh-200px)]">
            <Card className="h-full">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Map className="h-5 w-5" /> Live Bus Tracking
                </CardTitle>
                <p className="text-sm text-muted-foreground">
                  Real-time location of all active buses across Punjab
                </p>
              </CardHeader>
              <CardContent className="h-[calc(100%-100px)] p-0">
                <div className="h-full w-full">
                  <MapView />
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="dashboard" className="space-y-6">
            <div className="grid md:grid-cols-3 gap-6">
              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Total Buses</CardTitle>
                  <div className="p-2 bg-primary/10 rounded-lg">
                    <BusFront className="h-5 w-5 text-primary" />
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{buses.length}</div>
                  <p className="text-xs text-muted-foreground">
                    {buses.filter(b => b.status === 'active').length} active, {buses.filter(b => b.status === 'maintenance').length} in maintenance
                  </p>
                </CardContent>
              </Card>
              
              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Active Routes</CardTitle>
                  <div className="p-2 bg-green-500/10 rounded-lg">
                    <Map className="h-5 w-5 text-green-600" />
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">12</div>
                  <p className="text-xs text-muted-foreground">
                    +2 new routes added this month
                  </p>
                </CardContent>
              </Card>
              
              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Active Drivers</CardTitle>
                  <div className="p-2 bg-orange-500/10 rounded-lg">
                    <UserRoundCog className="h-5 w-5 text-orange-600" />
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">28</div>
                  <p className="text-xs text-muted-foreground">
                    5 on leave, 23 on duty
                  </p>
                </CardContent>
              </Card>
            </div>
            
            <div className="grid md:grid-cols-2 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle>Quick Actions</CardTitle>
                  <CardDescription>Commonly used actions</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-2 gap-3">
                    <Button 
                      variant="outline" 
                      className="h-24 flex flex-col items-center justify-center gap-2"
                      onClick={() => setActiveTab('buses')}
                    >
                      <Plus className="h-5 w-5" />
                      <span>Add New Bus</span>
                    </Button>
                    <Button 
                      variant="outline" 
                      className="h-24 flex flex-col items-center justify-center gap-2"
                      onClick={() => setActiveTab('routes')}
                    >
                      <MapPin className="h-5 w-5" />
                      <span>Create Route</span>
                    </Button>
                    <Button 
                      variant="outline" 
                      className="h-24 flex flex-col items-center justify-center gap-2"
                      onClick={() => setActiveTab('drivers')}
                    >
                      <User className="h-5 w-5" />
                      <span>Add Driver</span>
                    </Button>
                    <Button 
                      variant="outline" 
                      className="h-24 flex flex-col items-center justify-center gap-2"
                      onClick={() => setActiveTab('reports')}
                    >
                      <BarChart2 className="h-5 w-5" />
                      <span>View Reports</span>
                    </Button>
                  </div>
                </CardContent>
              </Card>
              
              <Card>
                <CardHeader>
                  <CardTitle>Recent Alerts</CardTitle>
                  <CardDescription>Latest system notifications</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="flex items-start gap-3">
                      <div className="p-2 bg-red-100 rounded-lg">
                        <AlertTriangle className="h-5 w-5 text-red-600" />
                      </div>
                      <div>
                        <p className="font-medium">Bus #PB01AB1234 delayed</p>
                        <p className="text-sm text-muted-foreground">Expected delay of 15 minutes on Route 12</p>
                        <p className="text-xs text-muted-foreground mt-1">10 minutes ago</p>
                      </div>
                    </div>
                    <div className="flex items-start gap-3">
                      <div className="p-2 bg-yellow-100 rounded-lg">
                        <Settings className="h-5 w-5 text-yellow-600" />
                      </div>
                      <div>
                        <p className="font-medium">Maintenance required</p>
                        <p className="text-sm text-muted-foreground">Bus #PB02CD5678 due for service</p>
                        <p className="text-xs text-muted-foreground mt-1">2 hours ago</p>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>
          
          <TabsContent value="buses" className="space-y-6">
            <BusManagement />
          </TabsContent>
          
          <TabsContent value="routes" className="space-y-6">
            <RouteManagement buses={buses} />
          </TabsContent>
          
          <TabsContent value="drivers" className="space-y-6">
            <DriverManagement buses={buses} onDriverUpdate={(driver) => {
              // In a real app, this would update the driver in the backend
              console.log('Driver updated:', driver);
            }} />
          </TabsContent>
          
          <TabsContent value="reports" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Reports & Analytics</CardTitle>
                <CardDescription>Generate and view system reports</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="p-6 border rounded-lg bg-muted/20 text-center">
                  <BarChart2 className="h-10 w-10 mx-auto mb-2 text-muted-foreground" />
                  <h3 className="font-medium">Reports Dashboard</h3>
                  <p className="text-sm text-muted-foreground">Select a report type to view detailed analytics</p>
                  <div className="mt-4 grid grid-cols-1 md:grid-cols-3 gap-3">
                    <Button variant="outline" className="flex-col h-auto py-4">
                      <span className="font-medium">Daily Ridership</span>
                      <span className="text-xs text-muted-foreground font-normal mt-1">View daily passenger counts</span>
                    </Button>
                    <Button variant="outline" className="flex-col h-auto py-4">
                      <span className="font-medium">Revenue</span>
                      <span className="text-xs text-muted-foreground font-normal mt-1">Earnings and expenses</span>
                    </Button>
                    <Button variant="outline" className="flex-col h-auto py-4">
                      <span className="font-medium">Maintenance</span>
                      <span className="text-xs text-muted-foreground font-normal mt-1">Vehicle service history</span>
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}
