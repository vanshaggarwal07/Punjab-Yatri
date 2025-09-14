export interface Bus {
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
  currentLocation?: {
    lat: number;
    lng: number;
  };
  lastUpdated: Date;
  driverId?: string;
  routeId?: string;
}

export interface Driver {
  id: string;
  name: string;
  licenseNumber: string;
  contact: string;
  status: 'active' | 'on_leave' | 'inactive';
  assignedBusId?: string;
}

export interface RouteStop {
  name: string;
  lat: number;
  lng: number;
  distanceFromStart: number;
  estimatedTimeFromStart: string;
}

export interface Route {
  id: string;
  name: string;
  from: string;
  to: string;
  distance: number;
  estimatedTime: string; // e.g., '2h 30m'
  status: 'active' | 'inactive';
  stops: RouteStop[];
  activeBuses: string[];
  assignedBuses: string[];
  lastUpdated?: Date;
}

export interface BusManagementProps {
  buses: Bus[];
  onBusesChange: (buses: Bus[]) => void;
}

export interface RouteManagementProps {
  buses: Bus[];
  onBusesUpdate: (buses: Bus[]) => void;
}

export interface DriverManagementProps {
  buses: Bus[];
  onDriverUpdate: (driver: Driver) => void;
  onBusesUpdate: (buses: Bus[]) => void;
}
