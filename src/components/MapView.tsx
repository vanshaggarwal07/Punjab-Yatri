import React, { useEffect, useRef, useState } from 'react';
import mapboxgl from 'mapbox-gl';
import 'mapbox-gl/dist/mapbox-gl.css';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { MapPin, Navigation, Bus, Users, Clock, Locate } from 'lucide-react';

// Your Mapbox public token
mapboxgl.accessToken = 'pk.eyJ1Ijoic3RhcmsxMjM0IiwiYSI6ImNtZmh5cWVubzBqMXoyaXF0aDNneGg5OWQifQ._dySBvjJtseB2Y6t_iquUA';

interface BusData {
  id: string;
  route: string;
  status: 'On Time' | 'Delayed' | 'Early';
  passengers: string;
  coordinates: [number, number];
  heading: number;
  speed: number;
  nextStop: string;
  eta: string;
}

// Mock bus data with Punjab coordinates
const initialBuses: BusData[] = [
  {
    id: 'PB-001',
    route: 'Amritsar ↔ Ludhiana',
    status: 'On Time',
    passengers: '24/45',
    coordinates: [75.8573, 31.6340], // Amritsar
    heading: 45,
    speed: 45,
    nextStop: 'Civil Hospital',
    eta: '8 min'
  },
  {
    id: 'PB-045',
    route: 'Chandigarh ↔ Patiala',
    status: 'Delayed',
    passengers: '31/40',
    coordinates: [76.7794, 30.7333], // Chandigarh
    heading: 180,
    speed: 35,
    nextStop: 'Railway Station',
    eta: '12 min'
  },
  {
    id: 'PB-078',
    route: 'Jalandhar ↔ Kapurthala',
    status: 'Early',
    passengers: '18/35',
    coordinates: [75.5762, 31.3260], // Jalandhar
    heading: 270,
    speed: 50,
    nextStop: 'Bus Stand',
    eta: '2 min'
  },
  {
    id: 'PB-112',
    route: 'Bathinda ↔ Mansa',
    status: 'On Time',
    passengers: '12/30',
    coordinates: [74.9455, 30.2110], // Bathinda
    heading: 90,
    speed: 40,
    nextStop: 'Market Complex',
    eta: '15 min'
  }
];

export default function MapView() {
  const mapContainer = useRef<HTMLDivElement>(null);
  const map = useRef<mapboxgl.Map | null>(null);
  const [buses, setBuses] = useState<BusData[]>(initialBuses);
  const [userLocation, setUserLocation] = useState<[number, number] | null>(null);
  const [selectedBus, setSelectedBus] = useState<BusData | null>(null);
  const busMarkersRef = useRef<{ [key: string]: mapboxgl.Marker }>({});

  // Get user's current location
  useEffect(() => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const coords: [number, number] = [
            position.coords.longitude,
            position.coords.latitude
          ];
          setUserLocation(coords);
        },
        (error) => {
          console.error('Error getting location:', error);
          // Fallback to Punjab center if location access denied
          setUserLocation([75.3412, 31.1471]); // Punjab center
        }
      );
    } else {
      setUserLocation([75.3412, 31.1471]); // Punjab center
    }
  }, []);

  // Initialize map
  useEffect(() => {
    if (!mapContainer.current || !userLocation) return;

    map.current = new mapboxgl.Map({
      container: mapContainer.current,
      style: 'mapbox://styles/mapbox/streets-v12',
      center: userLocation,
      zoom: 10,
      pitch: 45,
    });

    // Add navigation controls
    map.current.addControl(new mapboxgl.NavigationControl(), 'top-right');

    // Add geolocate control
    const geolocate = new mapboxgl.GeolocateControl({
      positionOptions: {
        enableHighAccuracy: true
      },
      trackUserLocation: true,
      showUserHeading: true
    });
    map.current.addControl(geolocate, 'top-right');

    // Add user location marker
    new mapboxgl.Marker({ color: '#3b82f6' })
      .setLngLat(userLocation)
      .setPopup(new mapboxgl.Popup().setHTML('<h3>Your Location</h3>'))
      .addTo(map.current);

    return () => {
      map.current?.remove();
    };
  }, [userLocation]);

  // Create bus icon element
  const createBusElement = (bus: BusData) => {
    const el = document.createElement('div');
    el.className = 'bus-marker';
    el.innerHTML = `
      <div style="
        width: 32px;
        height: 32px;
        background: linear-gradient(135deg, hsl(24 95% 53%), hsl(142 70% 35%));
        border-radius: 50%;
        display: flex;
        align-items: center;
        justify-content: center;
        box-shadow: 0 2px 10px rgba(0,0,0,0.2);
        cursor: pointer;
        transform: rotate(${bus.heading}deg);
        border: 2px solid white;
      ">
        <svg width="16" height="16" fill="white" viewBox="0 0 24 24">
          <path d="M4 16c0 .88.39 1.67 1 2.22V20a1 1 0 0 0 1 1h1a1 1 0 0 0 1-1v-1h8v1a1 1 0 0 0 1 1h1a1 1 0 0 0 1-1v-1.78c.61-.55 1-1.34 1-2.22V6c0-3.5-3.58-4-8-4s-8 .5-8 4v10M6.5 17A1.5 1.5 0 1 1 8 15.5A1.5 1.5 0 0 1 6.5 17m11 0A1.5 1.5 0 1 1 19 15.5A1.5 1.5 0 0 1 17.5 17M6 6h12v6H6z"/>
        </svg>
      </div>
    `;
    
    el.addEventListener('click', () => setSelectedBus(bus));
    return el;
  };

  // Add bus markers to map
  useEffect(() => {
    if (!map.current) return;

    // Clear existing markers
    Object.values(busMarkersRef.current).forEach(marker => marker.remove());
    busMarkersRef.current = {};

    // Add new markers
    buses.forEach(bus => {
      const marker = new mapboxgl.Marker({ element: createBusElement(bus) })
        .setLngLat(bus.coordinates)
        .setPopup(
          new mapboxgl.Popup({ offset: 25 }).setHTML(`
            <div style="padding: 8px;">
              <h3 style="margin: 0 0 8px 0; color: hsl(24 95% 53%)">${bus.id}</h3>
              <p style="margin: 4px 0; font-size: 14px;"><strong>Route:</strong> ${bus.route}</p>
              <p style="margin: 4px 0; font-size: 14px;"><strong>Status:</strong> ${bus.status}</p>
              <p style="margin: 4px 0; font-size: 14px;"><strong>Passengers:</strong> ${bus.passengers}</p>
              <p style="margin: 4px 0; font-size: 14px;"><strong>Next Stop:</strong> ${bus.nextStop}</p>
              <p style="margin: 4px 0; font-size: 14px;"><strong>ETA:</strong> ${bus.eta}</p>
            </div>
          `)
        )
        .addTo(map.current);

      busMarkersRef.current[bus.id] = marker;
    });
  }, [buses]);

  // Simulate real-time bus movement
  useEffect(() => {
    const interval = setInterval(() => {
      setBuses(prevBuses => 
        prevBuses.map(bus => {
          // Simple simulation: move bus slightly in its heading direction
          const speed = bus.speed / 100000; // Convert to rough coordinate change
          const headingRad = (bus.heading * Math.PI) / 180;
          
          const newLng = bus.coordinates[0] + Math.cos(headingRad) * speed;
          const newLat = bus.coordinates[1] + Math.sin(headingRad) * speed;
          
          // Randomly change heading slightly for realistic movement
          const headingChange = (Math.random() - 0.5) * 20;
          const newHeading = (bus.heading + headingChange + 360) % 360;
          
          return {
            ...bus,
            coordinates: [newLng, newLat] as [number, number],
            heading: newHeading,
            // Randomly update ETA to simulate real-time changes
            eta: `${Math.max(1, Math.floor(Math.random() * 20))} min`
          };
        })
      );
    }, 3000); // Update every 3 seconds

    return () => clearInterval(interval);
  }, []);

  const centerOnBus = (bus: BusData) => {
    if (map.current) {
      map.current.flyTo({
        center: bus.coordinates,
        zoom: 15,
        pitch: 60,
        duration: 2000
      });
    }
    setSelectedBus(bus);
  };

  const centerOnUser = () => {
    if (map.current && userLocation) {
      map.current.flyTo({
        center: userLocation,
        zoom: 12,
        pitch: 0,
        duration: 2000
      });
    }
  };

  return (
    <div className="h-screen flex">
      {/* Map Container */}
      <div className="flex-1 relative">
        <div ref={mapContainer} className="absolute inset-0" />
        
        {/* Map Controls */}
        <div className="absolute top-4 left-4 z-10 space-y-2">
          <Button onClick={centerOnUser} size="sm" className="gap-2 bg-white text-primary hover:bg-white/90 shadow-lg">
            <Locate className="h-4 w-4" />
            My Location
          </Button>
        </div>

        {/* Live Updates Indicator */}
        <div className="absolute top-4 right-4 z-10">
          <Card className="bg-white/95 backdrop-blur">
            <CardContent className="p-3">
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 bg-success rounded-full pulse-soft"></div>
                <span className="text-sm font-medium">Live Updates</span>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Bus List Sidebar */}
      <div className="w-80 bg-background border-l overflow-y-auto">
        <div className="p-4 border-b">
          <h2 className="text-lg font-semibold flex items-center gap-2">
            <Bus className="h-5 w-5 text-primary" />
            Live Buses ({buses.length})
          </h2>
        </div>

        <div className="p-4 space-y-3">
          {buses.map((bus) => (
            <Card 
              key={bus.id} 
              className={`cursor-pointer transition-all hover:shadow-md ${
                selectedBus?.id === bus.id ? 'ring-2 ring-primary' : ''
              }`}
              onClick={() => centerOnBus(bus)}
            >
              <CardContent className="p-3">
                <div className="flex items-start justify-between mb-2">
                  <div>
                    <div className="font-semibold text-primary">{bus.id}</div>
                    <div className="text-sm text-muted-foreground">{bus.route}</div>
                  </div>
                  <Badge variant={
                    bus.status === 'On Time' ? 'default' : 
                    bus.status === 'Delayed' ? 'destructive' : 'secondary'
                  }>
                    {bus.status}
                  </Badge>
                </div>

                <div className="grid grid-cols-2 gap-2 text-xs">
                  <div className="flex items-center gap-1">
                    <Clock className="h-3 w-3 text-muted-foreground" />
                    <span>{bus.eta}</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <Users className="h-3 w-3 text-muted-foreground" />
                    <span>{bus.passengers}</span>
                  </div>
                  <div className="col-span-2 flex items-center gap-1">
                    <MapPin className="h-3 w-3 text-muted-foreground" />
                    <span className="truncate">{bus.nextStop}</span>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </div>
  );
}