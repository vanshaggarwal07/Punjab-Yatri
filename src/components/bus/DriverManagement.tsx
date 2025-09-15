import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { 
  User, Plus, Trash2, Edit, Eye, ArrowLeft, Phone, Mail, Calendar, Clock, MapPin, Navigation, X, CheckCircle 
} from 'lucide-react';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';

interface Route {
  id: string;
  name: string;
  startPoint: string;
  endPoint: string;
  distance: number;
  estimatedTime: number;
  stops: Array<{
    name: string;
    location: { lat: number; lng: number };
    arrivalTime: string;
  }>;
}

interface Driver {
  id: string;
  name: string;
  licenseNumber: string;
  contact: string;
  email: string;
  status: 'on-duty' | 'off-duty' | 'on-break';
  currentLocation?: {
    lat: number;
    lng: number;
    lastUpdated: Date;
  };
  assignedBus?: {
    id: string;
    number: string;
    route?: Route;
    nextStop?: string;
    nextStopArrival?: string;
  };
  lastUpdated: Date;
  schedule?: {
    startTime: string;
    endTime: string;
    workingDays: string[];
  };
}

interface Bus {
  id: string;
  number: string;
  type: string;
  status: 'active' | 'inactive' | 'maintenance';
}

interface DriverManagementProps {
  buses: Bus[];
  onDriverUpdate: (driver: Driver) => void;
}

const mockRoutes: Route[] = [
  {
    id: 'r1',
    name: 'Amritsar to Chandigarh Express',
    startPoint: 'Amritsar Bus Stand',
    endPoint: 'Chandigarh ISBT',
    distance: 240,
    estimatedTime: 300,
    stops: [
      { 
        name: 'Amritsar Bus Stand', 
        location: { lat: 31.6340, lng: 74.8723 },
        arrivalTime: '06:00 AM'
      },
      { 
        name: 'Jalandhar Bus Stand', 
        location: { lat: 31.3260, lng: 75.5762 },
        arrivalTime: '07:30 AM'
      },
      { 
        name: 'Ludhiana Bus Stand', 
        location: { lat: 30.9010, lng: 75.8573 },
        arrivalTime: '08:45 AM'
      },
      { 
        name: 'Chandigarh ISBT', 
        location: { lat: 30.7333, lng: 76.7794 },
        arrivalTime: '11:00 AM'
      }
    ]
  }
];

const mockDrivers: Driver[] = [
  {
    id: 'd1',
    name: 'Rajesh Kumar',
    licenseNumber: 'DL1234567890',
    contact: '+919876543210',
    email: 'rajesh.kumar@example.com',
    status: 'on-duty',
    currentLocation: {
      lat: 31.3260 + (Math.random() * 0.01 - 0.005),
      lng: 75.5762 + (Math.random() * 0.01 - 0.005),
      lastUpdated: new Date()
    },
    assignedBus: {
      id: 'b1',
      number: 'PB01AB1234',
      route: mockRoutes[0],
      nextStop: 'Ludhiana Bus Stand',
      nextStopArrival: '08:45 AM'
    },
    schedule: {
      startTime: '06:00',
      endTime: '14:00',
      workingDays: ['Mon', 'Wed', 'Fri', 'Sun']
    },
    lastUpdated: new Date()
  },
  {
    id: 'd2',
    name: 'Simranjeet Singh',
    licenseNumber: 'PB1234567890',
    contact: '+919876543211',
    email: 'simranjeet.s@example.com',
    status: 'on-break',
    currentLocation: {
      lat: 30.9010 + (Math.random() * 0.01 - 0.005),
      lng: 75.8573 + (Math.random() * 0.01 - 0.005),
      lastUpdated: new Date()
    },
    assignedBus: {
      id: 'b2',
      number: 'PB02CD5678',
      route: mockRoutes[0],
      nextStop: 'Chandigarh ISBT',
      nextStopArrival: '11:30 AM'
    },
    schedule: {
      startTime: '10:00',
      endTime: '18:00',
      workingDays: ['Tue', 'Thu', 'Sat']
    },
    lastUpdated: new Date()
  },
  {
    id: 'd3',
    name: 'Amit Sharma',
    licenseNumber: 'HR1234567890',
    contact: '+919876543212',
    email: 'amit.s@example.com',
    status: 'off-duty',
    lastUpdated: new Date()
  }
];

export function DriverManagement({ buses, onDriverUpdate }: DriverManagementProps) {
  const [drivers, setDrivers] = useState<Driver[]>(mockDrivers);
  const [isAdding, setIsAdding] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [selectedDriver, setSelectedDriver] = useState<Driver | null>(null);
  const [formData, setFormData] = useState<Partial<Driver>>({
    name: '',
    licenseNumber: '',
    contact: '',
    email: '',
    status: 'off-duty'
  });

  // Simulate location updates
  useEffect(() => {
    const interval = setInterval(() => {
      setDrivers(currentDrivers => 
        currentDrivers.map(driver => {
          if (driver.status === 'on-duty' && driver.currentLocation) {
            // Add small random movement
            const lat = driver.currentLocation.lat + (Math.random() * 0.002 - 0.001);
            const lng = driver.currentLocation.lng + (Math.random() * 0.002 - 0.001);
            
            return {
              ...driver,
              currentLocation: {
                lat,
                lng,
                lastUpdated: new Date()
              },
              lastUpdated: new Date()
            };
          }
          return driver;
        })
      );
    }, 5000); // Update every 5 seconds

    return () => clearInterval(interval);
  }, []);

  const handleAddDriver = () => {
    if (!formData.name || !formData.licenseNumber) return;
    
    const newDriver: Driver = {
      id: Date.now().toString(),
      name: formData.name,
      licenseNumber: formData.licenseNumber,
      contact: formData.contact || '',
      email: formData.email || '',
      status: formData.status || 'off-duty',
      lastUpdated: new Date()
    };

    setDrivers([...drivers, newDriver]);
    setIsAdding(false);
    setFormData({
      name: '',
      licenseNumber: '',
      contact: '',
      email: '',
      status: 'off-duty'
    });
  };

  const handleUpdateDriver = (id: string) => {
    const updatedDrivers = drivers.map(driver => 
      driver.id === id ? { ...driver, ...formData, lastUpdated: new Date() } : driver
    );
    setDrivers(updatedDrivers);
    setEditingId(null);
    onDriverUpdate(updatedDrivers.find(d => d.id === id)!);
  };

  const handleDeleteDriver = (id: string) => {
    setDrivers(drivers.filter(driver => driver.id !== id));
  };

  const handleStatusChange = (id: string, status: Driver['status']) => {
    const updatedDrivers = drivers.map(driver => 
      driver.id === id ? { ...driver, status, lastUpdated: new Date() } : driver
    );
    setDrivers(updatedDrivers);
    onDriverUpdate(updatedDrivers.find(d => d.id === id)!);
  };

  const handleAssignBus = (driverId: string, busId: string) => {
    const bus = buses.find(b => b.id === busId);
    if (!bus) return;
    
    const updatedDrivers = drivers.map(driver => {
      if (driver.id === driverId) {
        return {
          ...driver,
          assignedBus: {
            id: bus.id,
            number: bus.number,
            route: bus.status === 'active' ? mockRoutes[0] : undefined
          },
          lastUpdated: new Date()
        };
      }
      return driver;
    });
    
    setDrivers(updatedDrivers);
    onDriverUpdate(updatedDrivers.find(d => d.id === driverId)!);
  };

  const getStatusBadge = (status: Driver['status']) => {
    const statusMap = {
      'on-duty': { text: 'On Duty', variant: 'default' as const },
      'off-duty': { text: 'Off Duty', variant: 'secondary' as const },
      'on-break': { text: 'On Break', variant: 'outline' as const }
    };
    
    const { text, variant } = statusMap[status] || { text: 'Unknown', variant: 'outline' as const };
    
    return (
      <Badge variant={variant}>
        {status === 'on-duty' && <CheckCircle className="w-3 h-3 mr-1" />}
        {status === 'on-break' && <Clock className="w-3 h-3 mr-1" />}
        {text}
      </Badge>
    );
  };

  // Simple map component since MapView is not available
  const MapView = ({ location }: { location: { lat: number; lng: number } }) => (
    <div className="w-full h-64 bg-gray-100 rounded-md flex items-center justify-center">
      <MapPin className="w-8 h-8 text-red-500" />
      <span className="ml-2">
        {location.lat.toFixed(4)}, {location.lng.toFixed(4)}
      </span>
    </div>
  );

  const renderDriverForm = () => (
    <div className="space-y-4">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="name">Full Name</Label>
          <Input
            id="name"
            value={formData.name}
            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
            placeholder="Enter driver's full name"
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="license">License Number</Label>
          <Input
            id="license"
            value={formData.licenseNumber}
            onChange={(e) => setFormData({ ...formData, licenseNumber: e.target.value })}
            placeholder="Enter license number"
          />
        </div>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="contact">Contact Number</Label>
          <Input
            id="contact"
            value={formData.contact}
            onChange={(e) => setFormData({ ...formData, contact: e.target.value })}
            placeholder="Enter contact number"
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="email">Email</Label>
          <Input
            id="email"
            type="email"
            value={formData.email}
            onChange={(e) => setFormData({ ...formData, email: e.target.value })}
            placeholder="Enter email address"
          />
        </div>
      </div>
      <div className="space-y-2">
        <Label>Status</Label>
        <Select
          value={formData.status}
          onValueChange={(value: Driver['status']) => 
            setFormData({ ...formData, status: value })
          }
        >
          <SelectTrigger>
            <SelectValue placeholder="Select status" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="on-duty">On Duty</SelectItem>
            <SelectItem value="off-duty">Off Duty</SelectItem>
            <SelectItem value="on-break">On Break</SelectItem>
          </SelectContent>
        </Select>
      </div>
    </div>
  );

  const renderDriverDetails = (driver: Driver) => {
    if (!driver) return null;
    
    return (
      <div className="space-y-6">
        {/* Personal Information */}
        <Card>
          <CardHeader>
            <CardTitle>Personal Information</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="flex items-center space-x-2">
                <Phone className="w-4 h-4 text-muted-foreground" />
                <span>{driver.contact}</span>
              </div>
              <div className="flex items-center space-x-2">
                <Mail className="w-4 h-4 text-muted-foreground" />
                <span>{driver.email}</span>
              </div>
              <div className="flex items-center space-x-2">
                <Calendar className="w-4 h-4 text-muted-foreground" />
                <span>License: {driver.licenseNumber}</span>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Assigned Bus */}
        {driver.assignedBus && (
          <Card>
            <CardHeader>
              <CardTitle>Assigned Bus</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex items-center space-x-2">
                  <span className="font-medium">Bus Number:</span>
                  <span>{driver.assignedBus.number}</span>
                </div>
                {driver.assignedBus.route && (
                  <div className="space-y-2">
                    <div className="flex items-center space-x-2">
                      <span className="font-medium">Route:</span>
                      <span>{driver.assignedBus.route.name}</span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Navigation className="w-4 h-4 text-muted-foreground" />
                      <span>Next Stop: {driver.assignedBus.nextStop || 'N/A'}</span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Clock className="w-4 h-4 text-muted-foreground" />
                      <span>ETA: {driver.assignedBus.nextStopArrival || 'N/A'}</span>
                    </div>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        )}

        {/* Location */}
        {driver.currentLocation && (
          <Card>
            <CardHeader>
              <CardTitle>Current Location</CardTitle>
              <CardDescription>
                Last updated: {new Date(driver.currentLocation.lastUpdated).toLocaleString()}
              </CardDescription>
            </CardHeader>
            <CardContent>
              <MapView location={driver.currentLocation} />
            </CardContent>
          </Card>
        )}

        {/* Schedule */}
        {driver.schedule && (
          <Card>
            <CardHeader>
              <CardTitle>Schedule</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                <div className="flex items-center space-x-2">
                  <Clock className="w-4 h-4 text-muted-foreground" />
                  <span>Shift: {driver.schedule.startTime} - {driver.schedule.endTime}</span>
                </div>
                <div className="flex items-start space-x-2">
                  <Calendar className="w-4 h-4 text-muted-foreground mt-0.5" />
                  <span>Working Days: {driver.schedule.workingDays.join(', ')}</span>
                </div>
              </div>
            </CardContent>
          </Card>
        )}
      </div>
    );
  };

  // Main component render
  return (
    <div className="space-y-6">
      {/* Header Section */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Driver Management</h1>
          <p className="text-muted-foreground">
            Manage drivers and monitor their assigned routes
          </p>
        </div>
        <Button 
          onClick={() => {
            setIsAdding(true);
            setFormData({
              name: '',
              licenseNumber: '',
              contact: '',
              email: '',
              status: 'off-duty'
            });
          }}
        >
          <Plus className="h-4 w-4 mr-2" /> Add Driver
        </Button>
      </div>

      {/* Main Content */}
      <Tabs defaultValue="list" className="space-y-4">
        <TabsList>
          <TabsTrigger value="list">Driver List</TabsTrigger>
          {selectedDriver && (
            <TabsTrigger value="details">Driver Details</TabsTrigger>
          )}
        </TabsList>

        {/* Driver List Tab */}
        <TabsContent value="list">
          <Card>
            <CardContent className="p-0">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Driver</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Assigned Bus</TableHead>
                    <TableHead>Route</TableHead>
                    <TableHead>Last Updated</TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {drivers.map((driver) => (
                    <TableRow key={driver.id}>
                      <TableCell className="font-medium">
                        <div className="flex items-center gap-2">
                          <User className="h-4 w-4 text-muted-foreground" />
                          {driver.name}
                        </div>
                      </TableCell>
                      <TableCell>
                        {getStatusBadge(driver.status)}
                      </TableCell>
                      <TableCell>
                        {driver.assignedBus ? (
                          <div className="flex items-center gap-2">
                            <span>{driver.assignedBus.number}</span>
                          </div>
                        ) : (
                          <span className="text-muted-foreground">Not assigned</span>
                        )}
                      </TableCell>
                      <TableCell>
                        {driver.assignedBus?.route?.name || 'N/A'}
                      </TableCell>
                      <TableCell className="text-sm text-muted-foreground">
                        {new Date(driver.lastUpdated).toLocaleTimeString()}
                      </TableCell>
                      <TableCell>
                        <div className="flex justify-end gap-2">
                          <Button 
                            variant="ghost" 
                            size="icon"
                            onClick={() => setSelectedDriver(driver)}
                          >
                            <Eye className="h-4 w-4" />
                          </Button>
                          <Button 
                            variant="ghost" 
                            size="icon"
                            onClick={() => {
                              setEditingId(driver.id);
                              setFormData(driver);
                            }}
                          >
                            <Edit className="h-4 w-4" />
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Driver Details Tab */}
        {selectedDriver && (
          <TabsContent value="details" className="space-y-4">
            <div className="flex items-center space-x-4">
              <Button 
                variant="outline" 
                size="icon"
                onClick={() => setSelectedDriver(null)}
              >
                <ArrowLeft className="h-4 w-4" />
              </Button>
              <h2 className="text-xl font-semibold">
                {selectedDriver.name}'s Details
              </h2>
              <div className="ml-auto">
                {getStatusBadge(selectedDriver.status)}
              </div>
            </div>
            {renderDriverDetails(selectedDriver)}
          </TabsContent>
        )}
      </Tabs>

      {/* Add/Edit Driver Modal */}
      {(isAdding || editingId) && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-background p-6 rounded-lg w-full max-w-2xl">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-semibold">
                {editingId ? 'Edit Driver' : 'Add New Driver'}
              </h3>
              <Button 
                variant="ghost" 
                size="icon" 
                onClick={() => {
                  setIsAdding(false);
                  setEditingId(null);
                }}
              >
                <X className="h-4 w-4" />
              </Button>
            </div>
            <div className="space-y-4">
              {renderDriverForm()}
              <div className="flex justify-end space-x-2 pt-4">
                <Button 
                  variant="outline" 
                  onClick={() => {
                    setIsAdding(false);
                    setEditingId(null);
                  }}
                >
                  Cancel
                </Button>
                <Button 
                  onClick={() => editingId ? handleUpdateDriver(editingId) : handleAddDriver()}
                  disabled={!formData.name || !formData.licenseNumber}
                >
                  {editingId ? 'Update' : 'Add'} Driver
                </Button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
