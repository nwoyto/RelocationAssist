import { useState, useEffect } from 'react';
import { Link, useRoute, useLocation } from 'wouter';
import { useLocations } from '@/hooks/useLocations';
import LocationMap from '@/components/LocationMap';
import '@/components/LocationMap.css';

const MapView = () => {
  const { locations } = useLocations();
  const [match, params] = useRoute('/map/:id?');
  const [, navigate] = useLocation();
  const [selectedLocationId, setSelectedLocationId] = useState<number | undefined>(
    params?.id ? parseInt(params.id) : undefined
  );
  const [regionFilter, setRegionFilter] = useState<string>('All Regions');
  const [isRegionOpen, setIsRegionOpen] = useState(false);
  
  // Update selected location when URL param changes
  useEffect(() => {
    if (params?.id) {
      setSelectedLocationId(parseInt(params.id));
    } else {
      setSelectedLocationId(undefined);
    }
  }, [params]);
  
  // Filter locations by region
  const filteredLocations = locations.filter(location => 
    regionFilter === 'All Regions' || location.region === regionFilter
  );
  
  // Available regions
  const regions = ['All Regions', 'Southwest', 'Northern', 'Coastal'];
  
  const selectedLocation = selectedLocationId 
    ? locations.find(loc => loc.id === selectedLocationId) 
    : undefined;

  return (
    <div className="p-4 md:p-6">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-4">
          <div>
            <div className="flex items-center mb-2">
              <div 
                onClick={() => navigate('/')}
                className="mr-2 p-1 hover:bg-neutral-100 rounded transition-colors cursor-pointer"
              >
                <span className="material-icons">arrow_back</span>
              </div>
              <h2 className="font-['Public_Sans'] text-2xl font-bold">
                CBP Port Locations Map
              </h2>
            </div>
            <p className="text-neutral-500">
              Explore CBP locations across the United States
            </p>
          </div>
          
          {/* Filter dropdown */}
          <div className="relative mt-4 md:mt-0">
            <div className="flex items-center">
              <span className="text-neutral-500 mr-2">Filter by:</span>
              <button 
                onClick={() => setIsRegionOpen(!isRegionOpen)} 
                className="bg-white border border-neutral-200 px-3 py-1.5 rounded flex items-center"
              >
                <span className="mr-2 text-sm">{regionFilter}</span>
                <span className="material-icons text-sm">expand_more</span>
              </button>
            </div>
            
            {isRegionOpen && (
              <div 
                className="absolute right-0 mt-1 w-40 bg-white shadow-md rounded z-10 p-2 text-sm"
                onClick={() => setIsRegionOpen(false)}
              >
                {regions.map((region) => (
                  <div 
                    key={region}
                    className="py-1 px-2 hover:bg-neutral-50 cursor-pointer"
                    onClick={() => setRegionFilter(region)}
                  >
                    {region}
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
        
        {/* Map Container */}
        <div className="bg-white rounded-lg shadow-md overflow-hidden mb-6">
          <div className="p-4 border-b border-neutral-100 flex items-center justify-between">
            <h3 className="font-medium">
              {selectedLocation 
                ? `${selectedLocation.name}, ${selectedLocation.state}` 
                : 'All Locations'}
            </h3>
            {selectedLocation && (
              <button 
                onClick={() => navigate('/map')}
                className="text-sm text-[#005ea2] hover:underline"
              >
                View All Locations
              </button>
            )}
          </div>
          <div className="relative">
            <LocationMap 
              locations={filteredLocations}
              selectedLocationId={selectedLocationId}
              height="600px"
              interactive={true}
            />
          </div>
        </div>
        
        {/* Location Info Panel (shows when a location is selected) */}
        {selectedLocation && (
          <div className="bg-white rounded-lg shadow-md overflow-hidden mb-6">
            <div className="p-4 border-b border-neutral-100 bg-[#f9f9f9]">
              <h3 className="font-['Public_Sans'] font-semibold">
                {selectedLocation.name}, {selectedLocation.state}
              </h3>
            </div>
            <div className="p-4">
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-4 mb-4">
                <div>
                  <div className="text-neutral-500 text-sm mb-1">Population</div>
                  <div className="font-medium">{selectedLocation.population.toLocaleString()}</div>
                </div>
                <div>
                  <div className="text-neutral-500 text-sm mb-1">Region</div>
                  <div className="font-medium">{selectedLocation.region}</div>
                </div>
                <div>
                  <div className="text-neutral-500 text-sm mb-1">Climate</div>
                  <div className="font-medium">{selectedLocation.climate}</div>
                </div>
                <div>
                  <div className="text-neutral-500 text-sm mb-1">CBP Facilities</div>
                  <div className="font-medium">{selectedLocation.cbpFacilities}</div>
                </div>
                <div>
                  <div className="text-neutral-500 text-sm mb-1">Cost of Living</div>
                  <div className={`font-medium ${selectedLocation.costOfLiving < 100 ? 'text-[#2e8540]' : 'text-[#d83933]'}`}>
                    {Math.abs(100 - selectedLocation.costOfLiving)}% {selectedLocation.costOfLiving < 100 ? 'below' : 'above'} avg
                  </div>
                </div>
                <div>
                  <div className="text-neutral-500 text-sm mb-1">Median Home</div>
                  <div className="font-medium">${selectedLocation.housingData.medianHomePrice.toLocaleString()}</div>
                </div>
              </div>
              
              <div className="flex justify-center mt-4">
                <div 
                  onClick={() => navigate(`/location/${selectedLocation.id}`)}
                  className="bg-[#005ea2] hover:bg-[#00477b] text-white py-2 px-4 rounded transition-colors cursor-pointer"
                >
                  View Full Details
                </div>
              </div>
            </div>
          </div>
        )}
        
        {/* Location List */}
        <div className="bg-white rounded-lg shadow-md overflow-hidden">
          <div className="p-4 border-b border-neutral-100">
            <h3 className="font-medium">All Locations</h3>
          </div>
          <div className="divide-y divide-neutral-100">
            {filteredLocations.map(location => (
              <div 
                key={location.id}
                className={`p-3 hover:bg-neutral-50 cursor-pointer transition-colors ${
                  location.id === selectedLocationId ? 'bg-[#e7f6ff]' : ''
                }`}
                onClick={() => navigate(`/map/${location.id}`)}
              >
                <div className="flex justify-between items-center">
                  <div>
                    <h4 className="font-medium">{location.name}, {location.state}</h4>
                    <div className="text-sm text-neutral-500">{location.region} Region • {location.cbpFacilities} CBP Facilities</div>
                  </div>
                  <span className="material-icons text-neutral-400">chevron_right</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default MapView;