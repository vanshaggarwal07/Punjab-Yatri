import { useState, useEffect } from 'react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Bus, Plus, Trash2, Edit, Check, X, ArrowRight } from 'lucide-react';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";

type BusStatus = 'active' | 'inactive' | 'maintenance';

interface BusRoute {
  from: string;
  to: string;
  distance: number;
}

interface BusData {
  id: string;
  number: string;
  type: string;
  capacity: number;
  status: BusStatus;
  currentRoute?: BusRoute;
  lastUpdated: Date;
}

const initialBuses: BusData[] = [
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
  }
];

export function BusManagement() {
  const [buses, setBuses] = useState<BusData[]>(() => {
    // Load from localStorage or use initial data
    const savedBuses = localStorage.getItem('busData');
    return savedBuses ? JSON.parse(savedBuses) : initialBuses;
  });
  const [isAdding, setIsAdding] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [formData, setFormData] = useState<Partial<BusData>>({
    number: '',
    type: 'AC Sleeper',
    capacity: 40,
    status: 'active'
  });

  // Save to localStorage whenever buses change
  useEffect(() => {
    localStorage.setItem('busData', JSON.stringify(buses));
  }, [buses]);

  const handleAddBus = () => {
    if (!formData.number) return;
    
    const newBus: BusData = {
      id: Date.now().toString(),
      number: formData.number,
      type: formData.type || 'AC Sleeper',
      capacity: formData.capacity || 40,
      status: (formData.status || 'active') as BusStatus,
      lastUpdated: new Date(),
      currentRoute: formData.currentRoute
    };

    setBuses(prevBuses => [...prevBuses, newBus]);
    setIsAdding(false);
    setFormData({
      number: '',
      type: 'AC Sleeper',
      capacity: 40,
      status: 'active'
    });
  };

  const handleUpdateBus = (id: string) => {
    setBuses(prevBuses => 
      prevBuses.map(bus => 
        bus.id === id ? { 
          ...bus, 
          ...formData, 
          lastUpdated: new Date(),
          status: (formData.status || bus.status) as BusStatus
        } : bus
      )
    );
    setEditingId(null);
  };

  const handleDeleteBus = (id: string) => {
    if (window.confirm('Are you sure you want to delete this bus?')) {
      setBuses(prevBuses => prevBuses.filter(bus => bus.id !== id));
    }
  };

  const handleStatusChange = (id: string, status: 'active' | 'inactive' | 'maintenance') => {
    setBuses(prevBuses => 
      prevBuses.map(bus => 
        bus.id === id ? { ...bus, status, lastUpdated: new Date() } : bus
      )
    );
  };

  // Calculate statistics for the dashboard
  const activeBuses = buses.filter(bus => bus.status === 'active').length;
  const inMaintenance = buses.filter(bus => bus.status === 'maintenance').length;

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center gap-2">
          <Bus className="h-6 w-6" />
          <CardTitle>Bus Management</CardTitle>
        </div>
      </CardHeader>
      <CardContent>
        <div className="flex justify-between items-center mb-4">
          <div className="flex gap-4">
            <div className="px-4 py-2 bg-blue-50 rounded-lg border">
              <div className="text-2xl font-bold">{buses.length}</div>
              <div className="text-sm text-muted-foreground">Total Buses</div>
            </div>
            <div className="px-4 py-2 bg-green-50 rounded-lg border">
              <div className="text-2xl font-bold">{activeBuses}</div>
              <div className="text-sm text-muted-foreground">Active</div>
            </div>
            <div className="px-4 py-2 bg-yellow-50 rounded-lg border">
              <div className="text-2xl font-bold">{inMaintenance}</div>
              <div className="text-sm text-muted-foreground">In Maintenance</div>
            </div>
            <div className="px-4 py-2 bg-red-50 rounded-lg border">
              <div className="text-2xl font-bold">{buses.length - activeBuses - inMaintenance}</div>
              <div className="text-sm text-muted-foreground">Inactive</div>
            </div>
          </div>
          <Button onClick={() => setIsAdding(true)}>
            <Plus className="h-4 w-4 mr-2" /> Add Bus
          </Button>
        </div>

        {isAdding && (
          <div className="mb-6 p-4 border rounded-lg bg-muted/20">
            <h3 className="font-medium mb-4">Add New Bus</h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="space-y-2">
                <Label>Bus Number</Label>
                <Input 
                  placeholder="PB01AB1234" 
                  value={formData.number}
                  onChange={(e) => setFormData({...formData, number: e.target.value})}
                />
              </div>
              <div className="space-y-2">
                <Label>Type</Label>
                <Select 
                  value={formData.type}
                  onValueChange={(value) => setFormData({...formData, type: value})}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select type" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="AC Sleeper">AC Sleeper</SelectItem>
                    <SelectItem value="Non-AC Seater">Non-AC Seater</SelectItem>
                    <SelectItem value="AC Seater">AC Seater</SelectItem>
                    <SelectItem value="Volvo Multi-Axle">Volvo Multi-Axle</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label>Status</Label>
                <Select 
                  value={formData.status}
                  onValueChange={(value: BusStatus) => setFormData({...formData, status: value})}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select status" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="active">Active</SelectItem>
                    <SelectItem value="inactive">Inactive</SelectItem>
                    <SelectItem value="maintenance">Maintenance</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
            <div className="flex justify-end gap-2 mt-4">
              <Button variant="outline" onClick={() => {
                setIsAdding(false);
                setFormData({
                  number: '',
                  type: 'AC Sleeper',
                  capacity: 40,
                  status: 'active'
                });
              }}>Cancel</Button>
              <Button onClick={handleAddBus} disabled={!formData.number}>
                <Plus className="h-4 w-4 mr-2" /> Add Bus
              </Button>
            </div>
          </div>
        )}

        <div className="rounded-md border">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Bus Number</TableHead>
                <TableHead>Type</TableHead>
                <TableHead>Capacity</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Current Route</TableHead>
                <TableHead>Last Updated</TableHead>
                <TableHead className="w-[100px]">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {buses.map((bus) => (
                <TableRow key={bus.id}>
                  <TableCell className="font-medium">{bus.number}</TableCell>
                  <TableCell>{bus.type}</TableCell>
                  <TableCell>{bus.capacity} seats</TableCell>
                  <TableCell>
                    <Select 
                      value={bus.status}
                      onValueChange={(value: 'active' | 'inactive' | 'maintenance') => 
                        handleStatusChange(bus.id, value)
                      }
                    >
                      <SelectTrigger className="w-28">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="active">Active</SelectItem>
                        <SelectItem value="inactive">Inactive</SelectItem>
                        <SelectItem value="maintenance">Maintenance</SelectItem>
                      </SelectContent>
                    </Select>
                  </TableCell>
                  <TableCell>
                    {bus.currentRoute ? (
                      <div className="text-sm">
                        <div className="flex items-center">
                          <span className="font-medium">{bus.currentRoute.from}</span>
                          <ArrowRight className="h-4 w-4 mx-1 text-muted-foreground" />
                          <span className="font-medium">{bus.currentRoute.to}</span>
                        </div>
                        <div className="text-xs text-muted-foreground mt-1">
                          Distance: {bus.currentRoute.distance} km
                        </div>
                      </div>
                    ) : (
                      <span className="text-muted-foreground text-sm">Not assigned</span>
                    )}
                  </TableCell>
                  <TableCell className="text-sm text-muted-foreground">
                    <div>{new Date(bus.lastUpdated).toLocaleDateString()}</div>
                    <div className="text-xs">{new Date(bus.lastUpdated).toLocaleTimeString()}</div>
                  </TableCell>
                  <TableCell>
                    <div className="flex gap-2">
                      {editingId === bus.id ? (
                        <>
                          <Button variant="ghost" size="icon" onClick={() => handleUpdateBus(bus.id)}>
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
                              setEditingId(bus.id);
                              setFormData(bus);
                            }}
                          >
                            <Edit className="h-4 w-4" />
                          </Button>
                          <Button 
                            variant="ghost" 
                            size="icon" 
                            className="text-destructive hover:text-destructive"
                            onClick={() => handleDeleteBus(bus.id)}
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
