import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { User, Plus, Trash2, Edit, Check, X, Clock, MapPin, Bus, Phone, Mail } from 'lucide-react';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

interface Driver {
  id: string;
  name: string;
  licenseNumber: string;
  contact: string;
  email: string;
  status: 'on-duty' | 'off-duty' | 'on-break';
  assignedBus?: {
    id: string;
    number: string;
    route?: string;
  };
  lastUpdated: Date;
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

const mockDrivers: Driver[] = [
  {
    id: 'd1',
    name: 'Rajesh Kumar',
    licenseNumber: 'DL1234567890',
    contact: '+919876543210',
    email: 'rajesh.kumar@example.com',
    status: 'on-duty',
    assignedBus: {
      id: '1',
      number: 'PB01AB1234',
      route: 'Amritsar to Chandigarh'
    },
    lastUpdated: new Date()
  },
  // Add more mock data as needed
];

export function DriverManagement({ buses, onDriverUpdate }: DriverManagementProps) {
  const [drivers, setDrivers] = useState<Driver[]>(mockDrivers);
  const [isAdding, setIsAdding] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [formData, setFormData] = useState<Partial<Driver>>({
    name: '',
    licenseNumber: '',
    contact: '',
    email: '',
    status: 'off-duty'
  });

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
            route: bus.status === 'active' ? 'Route TBD' : undefined
          },
          lastUpdated: new Date()
        };
      }
      return driver;
    });
    
    setDrivers(updatedDrivers);
    onDriverUpdate(updatedDrivers.find(d => d.id === driverId)!);
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'on-duty':
        return <span className="px-2 py-1 text-xs rounded-full bg-green-100 text-green-800">On Duty</span>;
      case 'off-duty':
        return <span className="px-2 py-1 text-xs rounded-full bg-gray-100 text-gray-800">Off Duty</span>;
      case 'on-break':
        return <span className="px-2 py-1 text-xs rounded-full bg-yellow-100 text-yellow-800">On Break</span>;
      default:
        return <span className="px-2 py-1 text-xs rounded-full bg-gray-100">{status}</span>;
    }
  };

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between">
        <div className="flex items-center gap-2">
          <User className="h-6 w-6" />
          <CardTitle>Driver Management</CardTitle>
        </div>
        <Button size="sm" onClick={() => setIsAdding(true)}>
          <Plus className="h-4 w-4 mr-2" /> Add Driver
        </Button>
      </CardHeader>
      <CardContent>
        {isAdding && (
          <div className="mb-6 p-4 border rounded-lg bg-muted/20">
            <h3 className="font-medium mb-4">Add New Driver</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>Full Name</Label>
                <Input 
                  placeholder="Rajesh Kumar" 
                  value={formData.name}
                  onChange={(e) => setFormData({...formData, name: e.target.value})}
                />
              </div>
              <div className="space-y-2">
                <Label>License Number</Label>
                <Input 
                  placeholder="DL1234567890" 
                  value={formData.licenseNumber}
                  onChange={(e) => setFormData({...formData, licenseNumber: e.target.value})}
                />
              </div>
              <div className="space-y-2">
                <Label>Contact Number</Label>
                <Input 
                  placeholder="+919876543210" 
                  value={formData.contact}
                  onChange={(e) => setFormData({...formData, contact: e.target.value})}
                />
              </div>
              <div className="space-y-2">
                <Label>Email</Label>
                <Input 
                  type="email"
                  placeholder="driver@example.com" 
                  value={formData.email}
                  onChange={(e) => setFormData({...formData, email: e.target.value})}
                />
              </div>
              <div className="space-y-2">
                <Label>Status</Label>
                <Select 
                  value={formData.status}
                  onValueChange={(value: Driver['status']) => setFormData({...formData, status: value})}
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
            <div className="flex justify-end gap-2 mt-4">
              <Button variant="outline" onClick={() => setIsAdding(false)}>Cancel</Button>
              <Button onClick={handleAddDriver}>Add Driver</Button>
            </div>
          </div>
        )}

        <div className="rounded-md border">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Driver</TableHead>
                <TableHead>Contact</TableHead>
                <TableHead>License</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Assigned Bus</TableHead>
                <TableHead>Last Updated</TableHead>
                <TableHead className="w-[100px]">Actions</TableHead>
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
                    <div className="flex flex-col">
                      <div className="flex items-center gap-1">
                        <Phone className="h-3 w-3 text-muted-foreground" />
                        <span>{driver.contact}</span>
                      </div>
                      <div className="flex items-center gap-1">
                        <Mail className="h-3 w-3 text-muted-foreground" />
                        <span className="text-xs text-muted-foreground">{driver.email}</span>
                      </div>
                    </div>
                  </TableCell>
                  <TableCell className="text-sm">{driver.licenseNumber}</TableCell>
                  <TableCell>
                    <Select 
                      value={driver.status}
                      onValueChange={(value: Driver['status']) => handleStatusChange(driver.id, value)}
                    >
                      <SelectTrigger className="w-32">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="on-duty">On Duty</SelectItem>
                        <SelectItem value="off-duty">Off Duty</SelectItem>
                        <SelectItem value="on-break">On Break</SelectItem>
                      </SelectContent>
                    </Select>
                  </TableCell>
                  <TableCell>
                    <Select 
                      value={driver.assignedBus?.id || ''}
                      onValueChange={(value) => handleAssignBus(driver.id, value)}
                    >
                      <SelectTrigger className="w-40">
                        <SelectValue placeholder="Assign Bus" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="">Unassign</SelectItem>
                        {buses.map(bus => (
                          <SelectItem key={bus.id} value={bus.id}>
                            {bus.number} ({bus.type})
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </TableCell>
                  <TableCell className="text-sm text-muted-foreground">
                    {new Date(driver.lastUpdated).toLocaleTimeString()}
                  </TableCell>
                  <TableCell>
                    <div className="flex gap-2">
                      {editingId === driver.id ? (
                        <>
                          <Button variant="ghost" size="icon" onClick={() => handleUpdateDriver(driver.id)}>
                            <Check className="h-4 w-4" />
                          </Button>
                          <Button variant="ghost" size="icon" onClick={() => setEditingId(null)}>
                            <X className="h-4 w-4" />
                          </Button>
                        </>
                      ) : (
                        <>
                          <Button variant="ghost" size="icon" onClick={() => {
                            setEditingId(driver.id);
                            setFormData(driver);
                          }}>
                            <Edit className="h-4 w-4" />
                          </Button>
                          <Button 
                            variant="ghost" 
                            size="icon" 
                            className="text-destructive hover:text-destructive"
                            onClick={() => handleDeleteDriver(driver.id)}
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
