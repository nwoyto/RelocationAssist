import { useEffect, useState } from 'react';
import { MapContainer, TileLayer, Marker, Popup, useMap } from 'react-leaflet';
import { Icon, LatLngTuple } from 'leaflet';
import { Location } from '@/lib/types';
import { useLocation } from 'wouter';
import 'leaflet/dist/leaflet.css';

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
function MapViewSetter({ center, zoom }: { center: LatLngTuple, zoom: number }) {
  const map = useMap();
  
  useEffect(() => {
    map.setView(center, zoom);
  }, [center, zoom, map]);
  
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

const LocationMap: React.FC<LocationMapProps> = ({
  locations,
  selectedLocationId,
  height = '400px',
  defaultCenter = [39.8283, -98.5795], // Center of US
  defaultZoom = 4,
  interactive = true
}) => {
  const [, navigate] = useLocation();
  const [mapCenter, setMapCenter] = useState<LatLngTuple>(defaultCenter);
  const [mapZoom, setMapZoom] = useState<number>(defaultZoom);

  // Update map view when selected location changes
  useEffect(() => {
    if (selectedLocationId) {
      const selectedLocation = locations.find(loc => loc.id === selectedLocationId);
      if (selectedLocation) {
        setMapCenter([selectedLocation.lat, selectedLocation.lng]);
        setMapZoom(11); // Closer zoom for selected location
      }
    } else {
      // If no location is selected, reset to default view
      setMapCenter(defaultCenter);
      setMapZoom(defaultZoom);
    }
  }, [selectedLocationId, locations, defaultCenter, defaultZoom]);

  return (
    <div style={{ height, width: '100%' }}>
      <MapContainer 
        center={mapCenter} 
        zoom={mapZoom} 
        style={{ height: '100%', width: '100%' }}
        zoomControl={interactive}
        scrollWheelZoom={interactive}
        dragging={interactive}
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
                <div className="mt-2">
                  <button
                    onClick={() => navigate(`/location/${location.id}`)}
                    className="px-3 py-1 text-xs bg-[#005ea2] text-white rounded hover:bg-[#00477b]"
                  >
                    View Details
                  </button>
                </div>
              </div>
            </Popup>
          </Marker>
        ))}
        
        {/* This component will update the map view when center/zoom changes */}
        <MapViewSetter center={mapCenter} zoom={mapZoom} />
      </MapContainer>
    </div>
  );
};

export default LocationMap;