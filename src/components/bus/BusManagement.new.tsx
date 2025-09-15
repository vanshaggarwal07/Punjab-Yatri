import { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Bus, Plus, Trash2, Edit, X, Wrench, PowerOff, CheckCircle } from 'lucide-react';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Bus as BusType, BusManagementProps } from '@/@types';

const busTypes = [
  { value: 'ac_sleeper', label: 'AC Sleeper' },
  { value: 'non_ac_sleeper', label: 'Non-AC Sleeper' },
  { value: 'ac_seater', label: 'AC Seater' },
  { value: 'non_ac_seater', label: 'Non-AC Seater' },
  { value: 'volvo_multiaxle', label: 'Volvo Multi-Axle' },
];

export default function BusManagement({ buses, onBusesChange }: BusManagementProps) {
  const [isAdding, setIsAdding] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [formData, setFormData] = useState<Partial<BusType>>({
    number: '',
    type: 'ac_sleeper',
    capacity: 40,
    status: 'inactive',
    lastUpdated: new Date()
  });

  // Handle form input changes
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: name === 'capacity' ? parseInt(value) || 0 : value
    }));
  };

  // Handle status change for a bus
  const handleStatusChange = (id: string, status: BusType['status']) => {
    const updatedBuses = buses.map(bus => 
      bus.id === id ? { ...bus, status, lastUpdated: new Date() } : bus
    );
    onBusesChange(updatedBuses);
  };

  // Handle form submission for adding/editing a bus
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.number || !formData.type) return;

    if (editingId) {
      // Update existing bus
      const updatedBuses = buses.map(bus => 
        bus.id === editingId 
          ? { ...formData, id: editingId, lastUpdated: new Date() } as BusType 
          : bus
      );
      onBusesChange(updatedBuses);
      setEditingId(null);
    } else {
      // Add new bus
      const newBus: BusType = {
        ...formData,
        id: Date.now().toString(),
        lastUpdated: new Date(),
        status: formData.status || 'inactive',
        capacity: formData.capacity || 0,
      } as BusType;
      onBusesChange([...buses, newBus]);
    }
    
    // Reset form
    setFormData({
      number: '',
      type: 'ac_sleeper',
      capacity: 40,
      status: 'inactive',
      lastUpdated: new Date()
    });
    setIsAdding(false);
  };

  // Handle editing a bus
  const handleEdit = (bus: BusType) => {
    setEditingId(bus.id);
    setFormData({
      number: bus.number,
      type: bus.type,
      capacity: bus.capacity,
      status: bus.status,
      currentRoute: bus.currentRoute,
      lastUpdated: new Date()
    });
    setIsAdding(true);
  };

  // Handle deleting a bus
  const handleDelete = (id: string) => {
    if (window.confirm('Are you sure you want to delete this bus?')) {
      onBusesChange(buses.filter(bus => bus.id !== id));
    }
  };

  // Get status badge with appropriate styling
  const getStatusBadge = (status: BusType['status']) => {
    const statusMap = {
      active: 'bg-green-100 text-green-800',
      inactive: 'bg-gray-100 text-gray-800',
      maintenance: 'bg-yellow-100 text-yellow-800'
    };
    
    return (
      <span className={`px-2 py-1 text-xs rounded-full ${statusMap[status]}`}>
        {status.charAt(0).toUpperCase() + status.slice(1)}
      </span>
    );
  };

  // Get status icon
  const getStatusIcon = (status: BusType['status']) => {
    switch (status) {
      case 'active':
        return <CheckCircle className="h-4 w-4 text-green-500" />;
      case 'maintenance':
        return <Wrench className="h-4 w-4 text-yellow-500" />;
      default:
        return <PowerOff className="h-4 w-4 text-gray-400" />;
    }
  };

  // Calculate statistics
  const activeBusesCount = buses.filter(bus => bus.status === 'active').length;
  const inMaintenanceCount = buses.filter(bus => bus.status === 'maintenance').length;
  const inactiveBusesCount = buses.filter(bus => bus.status === 'inactive').length;

  return (
    <div className="space-y-6">
      {/* Statistics Cards */}
      <div className="grid gap-4 md:grid-cols-3">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Buses</CardTitle>
            <Bus className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{buses.length}</div>
            <p className="text-xs text-muted-foreground">
              {activeBusesCount} active, {inMaintenanceCount} in maintenance
            </p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Active Buses</CardTitle>
            <CheckCircle className="h-4 w-4 text-green-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">{activeBusesCount}</div>
            <p className="text-xs text-muted-foreground">
              {buses.length > 0 ? Math.round((activeBusesCount / buses.length) * 100) : 0}% of total fleet
            </p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">In Maintenance</CardTitle>
            <Wrench className="h-4 w-4 text-yellow-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-yellow-600">{inMaintenanceCount}</div>
            <p className="text-xs text-muted-foreground">
              {buses.length > 0 ? Math.round((inMaintenanceCount / buses.length) * 100) : 0}% of total fleet
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Add/Edit Bus Form */}
      <Card>
        <CardHeader>
          <div className="flex justify-between items-center">
            <CardTitle>{editingId ? 'Edit Bus' : 'Add New Bus'}</CardTitle>
            <Button 
              variant={isAdding ? 'outline' : 'default'} 
              onClick={() => {
                setIsAdding(!isAdding);
                if (isAdding) {
                  setEditingId(null);
                  setFormData({
                    number: '',
                    type: 'ac_sleeper',
                    capacity: 40,
                    status: 'inactive',
                    lastUpdated: new Date()
                  });
                }
              }}
            >
              {isAdding ? (
                <>
                  <X className="mr-2 h-4 w-4" />
                  Cancel
                </>
              ) : (
                <>
                  <Plus className="mr-2 h-4 w-4" />
                  Add Bus
                </>
              )}
            </Button>
          </div>
          <CardDescription>
            {editingId ? 'Update the bus details below' : 'Fill in the details to add a new bus'}
          </CardDescription>
        </CardHeader>
        
        {isAdding && (
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="number">Bus Number</Label>
                  <Input
                    id="number"
                    name="number"
                    value={formData.number}
                    onChange={handleInputChange}
                    placeholder="e.g., PB01AB1234"
                    required
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="type">Bus Type</Label>
                  <Select
                    value={formData.type}
                    onValueChange={(value) => setFormData(prev => ({ ...prev, type: value }))}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select bus type" />
                    </SelectTrigger>
                    <SelectContent>
                      {busTypes.map(type => (
                        <SelectItem key={type.value} value={type.value}>
                          {type.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="capacity">Seating Capacity</Label>
                  <Input
                    id="capacity"
                    name="capacity"
                    type="number"
                    min="1"
                    value={formData.capacity}
                    onChange={handleInputChange}
                    required
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="status">Status</Label>
                  <Select
                    value={formData.status}
                    onValueChange={(value: BusType['status']) => 
                      setFormData(prev => ({ ...prev, status: value }))
                    }
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
              
              <div className="flex justify-end space-x-2 pt-4">
                <Button 
                  type="button" 
                  variant="outline" 
                  onClick={() => {
                    setIsAdding(false);
                    setEditingId(null);
                  }}
                >
                  Cancel
                </Button>
                <Button type="submit">
                  {editingId ? 'Update Bus' : 'Add Bus'}
                </Button>
              </div>
            </form>
          </CardContent>
        )}
      </Card>

      {/* Buses List */}
      <Card>
        <CardHeader>
          <CardTitle>Bus Fleet</CardTitle>
          <CardDescription>
            Manage your bus fleet and view current status
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="rounded-md border">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Bus Number</TableHead>
                  <TableHead>Type</TableHead>
                  <TableHead>Capacity</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Last Updated</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {buses.length > 0 ? (
                  buses.map((bus) => (
                    <TableRow key={bus.id}>
                      <TableCell className="font-medium">{bus.number}</TableCell>
                      <TableCell>
                        {busTypes.find(t => t.value === bus.type)?.label || bus.type}
                      </TableCell>
                      <TableCell>{bus.capacity}</TableCell>
                      <TableCell>
                        <div className="flex items-center gap-2">
                          {getStatusIcon(bus.status)}
                          {getStatusBadge(bus.status)}
                        </div>
                      </TableCell>
                      <TableCell>
                        {new Date(bus.lastUpdated).toLocaleString()}
                      </TableCell>
                      <TableCell className="text-right">
                        <div className="flex justify-end gap-2">
                          <Button
                            variant="ghost"
                            size="icon"
                            onClick={() => handleEdit(bus)}
                          >
                            <Edit className="h-4 w-4" />
                          </Button>
                          <Button
                            variant="ghost"
                            size="icon"
                            className="text-red-500 hover:text-red-600"
                            onClick={() => handleDelete(bus.id)}
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                          <Select
                            value={bus.status}
                            onValueChange={(value: BusType['status']) => 
                              handleStatusChange(bus.id, value)
                            }
                          >
                            <SelectTrigger className="w-[120px]">
                              <SelectValue placeholder="Status" />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="active">Active</SelectItem>
                              <SelectItem value="inactive">Inactive</SelectItem>
                              <SelectItem value="maintenance">Maintenance</SelectItem>
                            </SelectContent>
                          </Select>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))
                ) : (
                  <TableRow>
                    <TableCell colSpan={6} className="text-center py-8 text-muted-foreground">
                      No buses found. Add your first bus to get started.
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
