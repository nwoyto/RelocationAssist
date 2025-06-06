import { useState } from "react";
import { useLocation, Link } from "wouter";
import { useLocations } from "@/hooks/useLocations";
import LocationCard from "@/components/LocationCard";

interface SidebarProps {
  isOpen: boolean;
  onToggle: () => void;
}

const Sidebar = ({ isOpen, onToggle }: SidebarProps) => {
  const [currentView, setCurrentView] = useState<'explore' | 'saved' | 'compare'>('explore');
  const [searchQuery, setSearchQuery] = useState('');
  const [regionFilter, setRegionFilter] = useState('All Regions');
  const [isRegionOpen, setIsRegionOpen] = useState(false);
  
  const { 
    locations, 
    compareLocations,
    addToCompare,
    removeFromCompare,
    isInCompare,
    clearCompare
  } = useLocations();

  const [, navigate] = useLocation();

  const filteredLocations = locations.filter(
    location => location.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
               location.state.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleCompareClick = () => {
    if (compareLocations.length > 0) {
      navigate('/compare');
    }
  };

  const regions = ["All Regions", "Southwest", "Northern", "Coastal"];

  return (
    <aside 
      className={`fixed lg:static inset-0 z-40 w-full sm:w-80 md:w-72 bg-white shadow-lg transition-transform duration-300 ease-in-out flex flex-col h-[calc(100vh-56px)] ${
        isOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'
      }`}
    >
      {/* Mobile header with close button */}
      <div className="p-3 border-b border-neutral-100 flex justify-between items-center lg:hidden">
        <h2 className="font-medium text-lg">CBP Relocations</h2>
        <button 
          onClick={onToggle}
          className="p-2 -mr-2 rounded-full hover:bg-neutral-100 flex items-center justify-center"
          aria-label="Close sidebar"
        >
          <span className="material-icons">close</span>
        </button>
      </div>
      
      {/* Search Input */}
      <div className="p-4 border-b border-neutral-100">
        <div className="relative">
          <input 
            type="text" 
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search locations..." 
            className="w-full pl-10 pr-4 py-3 rounded border border-neutral-200 focus:border-[#005ea2] focus:ring-1 focus:ring-[#005ea2] focus:outline-none text-base" 
          />
          <span className="material-icons absolute left-3 top-3 text-neutral-400">search</span>
        </div>
      </div>
      
      {/* Tabs */}
      <div className="flex border-b border-neutral-100">
        <button 
          onClick={() => setCurrentView('explore')} 
          className={`flex-1 py-3 font-medium text-base ${
            currentView === 'explore' 
              ? 'border-b-2 border-[#005ea2] text-[#005ea2]' 
              : 'text-neutral-500'
          }`}
        >
          <span className="material-icons text-base align-text-top mr-1">explore</span> Explore
        </button>
        <button 
          onClick={() => setCurrentView('saved')} 
          className={`flex-1 py-3 font-medium text-base ${
            currentView === 'saved' 
              ? 'border-b-2 border-[#005ea2] text-[#005ea2]' 
              : 'text-neutral-500'
          }`}
        >
          <span className="material-icons text-base align-text-top mr-1">bookmark</span> Saved
        </button>
        <button 
          onClick={() => setCurrentView('compare')} 
          className={`flex-1 py-3 font-medium text-base ${
            currentView === 'compare' 
              ? 'border-b-2 border-[#005ea2] text-[#005ea2]' 
              : 'text-neutral-500'
          }`}
        >
          <span className="material-icons text-base align-text-top mr-1">compare</span> Compare
          {compareLocations.length > 0 && (
            <span className="inline-flex items-center justify-center w-5 h-5 ml-1 text-xs font-semibold rounded-full bg-[#005ea2] text-white">
              {compareLocations.length}
            </span>
          )}
        </button>
      </div>
      
      {/* Location List */}
      <div className="overflow-y-auto flex-1">
        {currentView === 'explore' && (
          <div className="divide-y divide-neutral-100">
            {/* Filter Bar */}
            <div className="p-4 bg-neutral-50 text-base flex justify-between items-center">
              <span className="text-neutral-500">Filter by:</span>
              <div className="relative">
                <button 
                  onClick={() => setIsRegionOpen(!isRegionOpen)} 
                  className="text-[#005ea2] flex items-center py-2 px-3 border border-transparent hover:border-neutral-200 rounded-md"
                  aria-expanded={isRegionOpen}
                  aria-haspopup="true"
                >
                  <span>{regionFilter}</span>
                  <span className="material-icons text-base ml-1">expand_more</span>
                </button>
                {isRegionOpen && (
                  <>
                    {/* Overlay to help with touch dismiss */}
                    <div 
                      className="fixed inset-0 z-10" 
                      onClick={() => setIsRegionOpen(false)}
                    />
                    <div 
                      className="absolute right-0 mt-1 w-48 bg-white shadow-lg rounded-md z-20 p-1 text-base"
                    >
                      {regions.map((region) => (
                        <button 
                          key={region}
                          className="w-full text-left py-2.5 px-4 hover:bg-neutral-50 active:bg-neutral-100 rounded"
                          onClick={() => {
                            setRegionFilter(region);
                            setIsRegionOpen(false);
                          }}
                        >
                          {region}
                        </button>
                      ))}
                    </div>
                  </>
                )}
              </div>
            </div>
            
            {/* Location Cards */}
            {filteredLocations.map((location) => (
              <LocationCard 
                key={location.id}
                location={location}
                onSelect={() => navigate(`/location/${location.id}`)}
                isInCompare={isInCompare(location.id)}
                onCompareToggle={() => {
                  isInCompare(location.id)
                    ? removeFromCompare(location.id)
                    : addToCompare(location.id);
                }}
              />
            ))}
          </div>
        )}
        
        {currentView === 'saved' && (
          <div className="p-4 text-center text-neutral-500">
            <span className="material-icons text-4xl mb-2">bookmark_border</span>
            <p>Your saved locations will appear here</p>
            <button className="mt-3 text-sm text-[#005ea2] font-medium">View Sample Locations</button>
          </div>
        )}
        
        {currentView === 'compare' && (
          <div>
            {compareLocations.length === 0 ? (
              <div className="p-4 text-center text-neutral-500">
                <span className="material-icons text-4xl mb-2">compare_arrows</span>
                <p>Add locations to compare</p>
                <p className="text-sm mt-1">Select up to 3 locations to compare side by side</p>
              </div>
            ) : (
              <div>
                <div className="p-3 bg-neutral-50 border-b border-neutral-100 flex justify-between items-center">
                  <span className="font-medium">{compareLocations.length} selected</span>
                  <button 
                    onClick={clearCompare}
                    className="text-neutral-500 hover:text-[#d83933] text-sm"
                  >
                    Clear All
                  </button>
                </div>
                
                <div className="divide-y divide-neutral-100">
                  {compareLocations.map((id) => {
                    const location = locations.find(loc => loc.id === id);
                    if (!location) return null;
                    
                    return (
                      <div key={id} className="p-3 hover:bg-neutral-50 transition-colors">
                        <div className="flex justify-between items-center">
                          <h3 className="font-medium">{location.name}, {location.state}</h3>
                          <button 
                            onClick={() => removeFromCompare(id)}
                            className="text-neutral-400 hover:text-[#d83933] p-1"
                          >
                            <span className="material-icons text-sm">close</span>
                          </button>
                        </div>
                      </div>
                    );
                  })}
                </div>
                
                <div className="p-3 border-t border-neutral-100">
                  <button 
                    onClick={handleCompareClick}
                    className="w-full py-2 bg-[#005ea2] hover:bg-[#00477b] text-white rounded font-medium transition-colors"
                  >
                    Compare Locations
                  </button>
                </div>
              </div>
            )}
          </div>
        )}
      </div>
    </aside>
  );
};

export default Sidebar;
