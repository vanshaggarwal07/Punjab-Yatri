import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { MapPin, Plus, Trash2, Edit, Check, X, Clock, Bus, ArrowRight, Map } from 'lucide-react';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

interface Route {
  id: string;
  name: string;
  from: string;
  to: string;
  distance: number; // in km
  estimatedTime: string; // e.g., '2h 30m'
  status: 'active' | 'inactive';
  stops: {
    name: string;
    distanceFromStart: number;
    estimatedTimeFromStart: string;
  }[];
  assignedBuses: string[];
}

interface Bus {
  id: string;
  number: string;
  type: string;
  status: 'active' | 'inactive' | 'maintenance';
}

interface RouteManagementProps {
  buses: Bus[];
}

const mockRoutes: Route[] = [
  {
    id: 'r1',
    name: 'Golden Temple Express',
    from: 'Amritsar',
    to: 'Chandigarh',
    distance: 230,
    estimatedTime: '4h 30m',
    status: 'active',
    stops: [
      { name: 'Amritsar Bus Stand', distanceFromStart: 0, estimatedTimeFromStart: '0h 0m' },
      { name: 'Beas', distanceFromStart: 45, estimatedTimeFromStart: '1h 0m' },
      { name: 'Jalandhar', distanceFromStart: 80, estimatedTimeFromStart: '1h 45m' },
      { name: 'Ludhiana', distanceFromStart: 140, estimatedTimeFromStart: '2h 45m' },
      { name: 'Chandigarh ISBT', distanceFromStart: 230, estimatedTimeFromStart: '4h 30m' },
    ],
    assignedBuses: ['1']
  },
  // Add more mock routes as needed
];

export function RouteManagement({ buses }: RouteManagementProps) {
  const [routes, setRoutes] = useState<Route[]>(mockRoutes);
  const [isAdding, setIsAdding] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [formData, setFormData] = useState<Partial<Route>>({
    name: '',
    from: '',
    to: '',
    distance: 0,
    estimatedTime: '',
    status: 'active',
    stops: [],
    assignedBuses: []
  });
  const [currentStop, setCurrentStop] = useState('');
  const [stopDistance, setStopDistance] = useState('');
  const [stopTime, setStopTime] = useState('');

  const handleAddRoute = () => {
    if (!formData.name || !formData.from || !formData.to) return;
    
    const newRoute: Route = {
      id: Date.now().toString(),
      name: formData.name,
      from: formData.from,
      to: formData.to,
      distance: formData.distance || 0,
      estimatedTime: formData.estimatedTime || '0h 0m',
      status: formData.status || 'active',
      stops: formData.stops || [],
      assignedBuses: formData.assignedBuses || []
    };

    setRoutes([...routes, newRoute]);
    setIsAdding(false);
    setFormData({
      name: '',
      from: '',
      to: '',
      distance: 0,
      estimatedTime: '',
      status: 'active',
      stops: [],
      assignedBuses: []
    });
  };

  const handleUpdateRoute = (id: string) => {
    const updatedRoutes = routes.map(route => 
      route.id === id ? { ...route, ...formData, lastUpdated: new Date() } : route
    );
    setRoutes(updatedRoutes);
    setEditingId(null);
  };

  const handleDeleteRoute = (id: string) => {
    setRoutes(routes.filter(route => route.id !== id));
  };

  const handleStatusChange = (id: string, status: 'active' | 'inactive') => {
    setRoutes(routes.map(route => 
      route.id === id ? { ...route, status, lastUpdated: new Date() } : route
    ));
  };

  const handleAddStop = () => {
    if (!currentStop || !stopDistance || !stopTime) return;
    
    const newStop = {
      name: currentStop,
      distanceFromStart: parseFloat(stopDistance) || 0,
      estimatedTimeFromStart: stopTime
    };
    
    setFormData({
      ...formData,
      stops: [...(formData.stops || []), newStop]
    });
    
    setCurrentStop('');
    setStopDistance('');
    setStopTime('');
  };

  const handleRemoveStop = (index: number) => {
    const updatedStops = [...(formData.stops || [])];
    updatedStops.splice(index, 1);
    setFormData({
      ...formData,
      stops: updatedStops
    });
  };

  const handleAssignBus = (routeId: string, busId: string) => {
    setRoutes(routes.map(route => {
      if (route.id === routeId) {
        const assignedBuses = route.assignedBuses.includes(busId)
          ? route.assignedBuses.filter(id => id !== busId)
          : [...route.assignedBuses, busId];
        return { ...route, assignedBuses };
      }
      return route;
    }));
  };

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between">
        <div className="flex items-center gap-2">
          <Map className="h-6 w-6" />
          <CardTitle>Route Management</CardTitle>
        </div>
        <Button size="sm" onClick={() => setIsAdding(true)}>
          <Plus className="h-4 w-4 mr-2" /> Add Route
        </Button>
      </CardHeader>
      <CardContent>
        {isAdding && (
          <div className="mb-6 p-4 border rounded-lg bg-muted/20">
            <h3 className="font-medium mb-4">Add New Route</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
              <div className="space-y-2">
                <Label>Route Name</Label>
                <Input 
                  placeholder="Golden Temple Express" 
                  value={formData.name}
                  onChange={(e) => setFormData({...formData, name: e.target.value})}
                />
              </div>
              <div className="space-y-2">
                <Label>Status</Label>
                <Select 
                  value={formData.status}
                  onValueChange={(value: 'active' | 'inactive') => setFormData({...formData, status: value})}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select status" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="active">Active</SelectItem>
                    <SelectItem value="inactive">Inactive</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label>From</Label>
                <Input 
                  placeholder="Starting point" 
                  value={formData.from}
                  onChange={(e) => setFormData({...formData, from: e.target.value})}
                />
              </div>
              <div className="space-y-2">
                <Label>To</Label>
                <Input 
                  placeholder="Destination" 
                  value={formData.to}
                  onChange={(e) => setFormData({...formData, to: e.target.value})}
                />
              </div>
              <div className="space-y-2">
                <Label>Distance (km)</Label>
                <Input 
                  type="number"
                  placeholder="230" 
                  value={formData.distance || ''}
                  onChange={(e) => setFormData({...formData, distance: parseFloat(e.target.value) || 0})}
                />
              </div>
              <div className="space-y-2">
                <Label>Estimated Time</Label>
                <Input 
                  placeholder="4h 30m" 
                  value={formData.estimatedTime}
                  onChange={(e) => setFormData({...formData, estimatedTime: e.target.value})}
                />
              </div>
            </div>

            <div className="mb-4">
              <Label>Route Stops</Label>
              <div className="flex gap-2 mt-2">
                <Input 
                  placeholder="Stop name" 
                  value={currentStop}
                  onChange={(e) => setCurrentStop(e.target.value)}
                  className="flex-1"
                />
                <Input 
                  type="number"
                  placeholder="Distance" 
                  value={stopDistance}
                  onChange={(e) => setStopDistance(e.target.value)}
                  className="w-24"
                />
                <Input 
                  placeholder="Time (e.g., 1h 30m)" 
                  value={stopTime}
                  onChange={(e) => setStopTime(e.target.value)}
                  className="w-32"
                />
                <Button type="button" onClick={handleAddStop}>
                  <Plus className="h-4 w-4" />
                </Button>
              </div>
              
              {formData.stops && formData.stops.length > 0 && (
                <div className="mt-2 border rounded-md p-2 space-y-1">
                  {formData.stops.map((stop, index) => (
                    <div key={index} className="flex items-center justify-between text-sm p-1 hover:bg-muted/50 rounded">
                      <span>{stop.name}</span>
                      <div className="flex items-center gap-2">
                        <span className="text-xs text-muted-foreground">
                          {stop.distanceFromStart}km • {stop.estimatedTimeFromStart}
                        </span>
                        <Button 
                          variant="ghost" 
                          size="icon" 
                          className="h-6 w-6"
                          onClick={() => handleRemoveStop(index)}
                        >
                          <X className="h-3 w-3" />
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>

            <div className="flex justify-end gap-2 mt-4">
              <Button variant="outline" onClick={() => setIsAdding(false)}>Cancel</Button>
              <Button onClick={handleAddRoute}>Add Route</Button>
            </div>
          </div>
        )}

        <div className="rounded-md border">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Route</TableHead>
                <TableHead>Stops</TableHead>
                <TableHead>Distance</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Assigned Buses</TableHead>
                <TableHead className="w-[100px]">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {routes.map((route) => (
                <TableRow key={route.id}>
                  <TableCell className="font-medium">
                    <div className="flex flex-col">
                      <span>{route.name}</span>
                      <div className="flex items-center text-xs text-muted-foreground">
                        <span>{route.from}</span>
                        <ArrowRight className="h-3 w-3 mx-1" />
                        <span>{route.to}</span>
                      </div>
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="text-sm">
                      {route.stops.length} stops
                      <div className="text-xs text-muted-foreground line-clamp-1">
                        {route.stops.map(s => s.name).join(' → ')}
                      </div>
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center gap-1">
                      <MapPin className="h-3.5 w-3.5 text-muted-foreground" />
                      <span>{route.distance} km</span>
                    </div>
                    <div className="text-xs text-muted-foreground">
                      ~{route.estimatedTime}
                    </div>
                  </TableCell>
                  <TableCell>
                    <Select 
                      value={route.status}
                      onValueChange={(value: 'active' | 'inactive') => handleStatusChange(route.id, value)}
                    >
                      <SelectTrigger className="w-28">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="active">Active</SelectItem>
                        <SelectItem value="inactive">Inactive</SelectItem>
                      </SelectContent>
                    </Select>
                  </TableCell>
                  <TableCell>
                    <Select 
                      value=""
                      onValueChange={(value) => handleAssignBus(route.id, value)}
                    >
                      <SelectTrigger className="w-40">
                        <SelectValue placeholder="Assign Bus" />
                      </SelectTrigger>
                      <SelectContent>
                        {buses.map(bus => (
                          <SelectItem key={bus.id} value={bus.id}>
                            {bus.number} ({bus.status})
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    {route.assignedBuses.length > 0 && (
                      <div className="mt-1 flex flex-wrap gap-1">
                        {route.assignedBuses.map(busId => {
                          const bus = buses.find(b => b.id === busId);
                          if (!bus) return null;
                          return (
                            <span key={busId} className="text-xs bg-muted px-2 py-0.5 rounded-full">
                              {bus.number}
                            </span>
                          );
                        })}
                      </div>
                    )}
                  </TableCell>
                  <TableCell>
                    <div className="flex gap-2">
                      {editingId === route.id ? (
                        <>
                          <Button variant="ghost" size="icon" onClick={() => handleUpdateRoute(route.id)}>
                            <Check className="h-4 w-4" />
                          </Button>
                          <Button variant="ghost" size="icon" onClick={() => setEditingId(null)}>
                            <X className="h-4 w-4" />
                          </Button>
                        </>
                      ) : (
                        <>
                          <Button 
                            variant="ghost" 
                            size="icon" 
                            onClick={() => {
                              setEditingId(route.id);
                              setFormData(route);
                            }}
                          >
                            <Edit className="h-4 w-4" />
                          </Button>
                          <Button 
                            variant="ghost" 
                            size="icon" 
                            className="text-destructive hover:text-destructive"
                            onClick={() => handleDeleteRoute(route.id)}
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </>
                      )}
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      </CardContent>
    </Card>
  );
}
