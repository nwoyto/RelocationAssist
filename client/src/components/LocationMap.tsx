import { useEffect, useState } from 'react';
import { MapContainer, TileLayer, Marker, Popup, useMap } from 'react-leaflet';
import { Icon, LatLngTuple } from 'leaflet';
import { Location } from '@/lib/types';
import { useLocation } from 'wouter';
import 'leaflet/dist/leaflet.css';

// Add custom styles for better mobile experience
import './LocationMap.css';

// Fix for marker icon issues in React Leaflet
import markerIcon from 'leaflet/dist/images/marker-icon.png';
import markerIcon2x from 'leaflet/dist/images/marker-icon-2x.png';
import markerShadow from 'leaflet/dist/images/marker-shadow.png';

// Custom icon setup
const defaultIcon = new Icon({
  iconUrl: markerIcon,
  iconRetinaUrl: markerIcon2x,
  shadowUrl: markerShadow,
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
  shadowSize: [41, 41]
});

const highlightedIcon = new Icon({
  iconUrl: markerIcon,
  iconRetinaUrl: markerIcon2x,
  shadowUrl: markerShadow,
  iconSize: [30, 45], // slightly larger
  iconAnchor: [15, 45],
  popupAnchor: [1, -34],
  className: 'highlighted-marker', // will add a CSS class for styling
  shadowSize: [41, 41]
});

// Helper component to set the map view
function MapViewSetter({ center, zoom, selectedLocation }: { 
  center: LatLngTuple;
  zoom: number;
  selectedLocation?: Location;
}) {
  const map = useMap();
  
  useEffect(() => {
    if (selectedLocation) {
      map.setView([selectedLocation.lat, selectedLocation.lng], 11);
    } else {
      map.setView(center, zoom);
    }
  }, [map, center, zoom, selectedLocation]);
  
  return null;
}

interface LocationMapProps {
  locations: Location[];
  selectedLocationId?: number;
  height?: string;
  defaultCenter?: LatLngTuple;
  defaultZoom?: number;
  interactive?: boolean;
}

const LocationMap = ({
  locations,
  selectedLocationId,
  height = '400px',
  defaultCenter = [39.8283, -98.5795], // Center of US
  defaultZoom = 4,
  interactive = true
}: LocationMapProps) => {
  const [, navigate] = useLocation();
  const [mapReady, setMapReady] = useState(false);

  // Find the selected location if it exists
  const selectedLocation = selectedLocationId && locations?.length 
    ? locations.find(loc => loc.id === selectedLocationId)
    : undefined;
    
  // Fix for map not rendering on mobile by triggering a resize event
  useEffect(() => {
    // Delay to ensure the DOM has fully rendered
    const timeout = setTimeout(() => {
      window.dispatchEvent(new Event('resize'));
      setMapReady(true);
    }, 100);
    
    return () => clearTimeout(timeout);
  }, []);

  return (
    <div style={{ height, width: '100%' }} className="location-map-container">
      <MapContainer 
        center={defaultCenter} 
        zoom={defaultZoom} 
        style={{ height: '100%', width: '100%' }}
        zoomControl={interactive}
        scrollWheelZoom={interactive}
        dragging={interactive}
        className={`mobile-map-fix ${mapReady ? 'map-ready' : 'map-loading'}`}
        attributionControl={false}
      >
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />
        
        {locations.map(location => (
          <Marker 
            key={location.id}
            position={[location.lat, location.lng]}
            icon={location.id === selectedLocationId ? highlightedIcon : defaultIcon}
            eventHandlers={{
              click: () => {
                if (interactive) {
                  navigate(`/location/${location.id}`);
                }
              }
            }}
          >
            <Popup>
              <div className="text-center">
                <h3 className="font-medium mb-1">{location.name}, {location.state}</h3>
                <p className="text-sm text-neutral-500">{location.region} Region</p>
                {interactive && (
                  <div className="mt-2">
                    <button
                      onClick={() => navigate(`/location/${location.id}`)}
                      className="px-3 py-1 text-xs bg-[#005ea2] text-white rounded hover:bg-[#00477b]"
                    >
                      View Details
                    </button>
                  </div>
                )}
              </div>
            </Popup>
          </Marker>
        ))}
        
        {/* This component will update the map view when selected location changes */}
        <MapViewSetter 
          center={defaultCenter} 
          zoom={defaultZoom} 
          selectedLocation={selectedLocation} 
        />
      </MapContainer>
      
      {/* Loading overlay */}
      {!mapReady && (
        <div className="absolute inset-0 bg-neutral-100 flex items-center justify-center">
          <div className="text-neutral-500 animate-pulse">Loading map...</div>
        </div>
      )}
    </div>
  );
};

export default LocationMap;