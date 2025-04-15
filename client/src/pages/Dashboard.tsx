import { useState } from "react";
import { useLocation, Link } from "wouter";
import Sidebar from "@/components/Sidebar";
import { useLocations } from "@/hooks/useLocations";
import StarRating from "@/components/StarRating";
import LocationMap from "@/components/LocationMap";
import "@/components/LocationMap.css";

const Dashboard = () => {
  const [sidebarOpen, setSidebarOpen] = useState(window.innerWidth >= 1024);
  const { locations } = useLocations();
  const [, navigate] = useLocation();
  const [searchQuery, setSearchQuery] = useState("");

  return (
    <div className="flex flex-col min-h-[calc(100vh-56px)]">
      <div className="flex-1 flex overflow-hidden">
        {/* Sidebar */}
        <Sidebar isOpen={sidebarOpen} onToggle={() => setSidebarOpen(!sidebarOpen)} />
        
        {/* Main Content */}
        <main className="flex-1 overflow-auto h-[calc(100vh-56px)] bg-neutral-50">
          <div className="p-4 md:p-6">
            <div className="max-w-6xl mx-auto">
              <div className="flex items-center mb-6">
                <button 
                  onClick={() => setSidebarOpen(!sidebarOpen)}
                  className="lg:hidden p-2 mr-2 hover:bg-neutral-100 rounded-full"
                >
                  <span className="material-icons">menu</span>
                </button>
                <h2 className="font-['Public_Sans'] text-2xl font-bold">Welcome to CBP Relocation Resources</h2>
              </div>
              
              {/* Search Bar (Large) */}
              <div className="bg-white rounded-lg shadow-md p-6 mb-8">
                <h3 className="font-['Public_Sans'] text-lg font-semibold mb-4">Find Your Ideal Location</h3>
                <div className="flex flex-col md:flex-row gap-4">
                  <div className="flex-1 relative">
                    <span className="material-icons absolute left-3 top-3 text-neutral-400">search</span>
                    <input 
                      type="text" 
                      placeholder="Enter city, state, or ZIP code" 
                      className="w-full pl-10 pr-4 py-3 rounded-md border border-neutral-200 focus:border-[#005ea2] focus:ring-1 focus:ring-[#005ea2] focus:outline-none"
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                    />
                  </div>
                  <button 
                    className="bg-[#005ea2] hover:bg-[#00477b] text-white py-3 px-6 rounded-md font-medium transition-colors"
                    onClick={() => {
                      if (searchQuery.trim() && locations.length > 0) {
                        const filteredLocations = locations.filter(
                          loc => loc.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
                                 loc.state.toLowerCase().includes(searchQuery.toLowerCase())
                        );
                        if (filteredLocations.length > 0) {
                          navigate(`/location/${filteredLocations[0].id}`);
                        }
                      }
                    }}
                  >
                    Search
                  </button>
                </div>
                <div className="mt-4 flex flex-wrap gap-2">
                  <span className="text-sm font-medium mr-2 text-neutral-500">Popular:</span>
                  {locations.slice(0, 4).map(location => (
                    <a 
                      key={location.id}
                      href={`/location/${location.id}`} 
                      className="text-sm text-[#005ea2] hover:underline"
                    >
                      {location.name}, {location.state}
                    </a>
                  ))}
                </div>
              </div>
              
              {/* Featured Sections */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
                {/* Housing Overview */}
                <div className="bg-white rounded-lg shadow-sm overflow-hidden">
                  <div className="bg-[#2d5999] text-white p-4">
                    <h3 className="font-['Public_Sans'] font-semibold">Housing Overview</h3>
                  </div>
                  <div className="p-4">
                    <div className="flex justify-between mb-3">
                      <span className="text-sm text-neutral-500">National Average</span>
                      <span className="font-medium">$375,000</span>
                    </div>
                    <div className="space-y-2">
                      <div className="flex justify-between items-center">
                        <span>San Diego, CA</span>
                        <span className="font-medium">$825,000</span>
                      </div>
                      <div className="w-full bg-neutral-100 rounded-full h-2">
                        <div className="bg-[#d83933] h-2 rounded-full" style={{ width: '92%' }}></div>
                      </div>
                    </div>
                    <div className="space-y-2 mt-4">
                      <div className="flex justify-between items-center">
                        <span>El Paso, TX</span>
                        <span className="font-medium">$225,000</span>
                      </div>
                      <div className="w-full bg-neutral-100 rounded-full h-2">
                        <div className="bg-[#2e8540] h-2 rounded-full" style={{ width: '45%' }}></div>
                      </div>
                    </div>
                    <div className="mt-4 text-center">
                      <a href="#" className="text-sm text-[#005ea2] font-medium hover:underline">View all housing data</a>
                    </div>
                  </div>
                </div>
                
                {/* School Ratings */}
                <div className="bg-white rounded-lg shadow-sm overflow-hidden">
                  <div className="bg-[#2d5999] text-white p-4">
                    <h3 className="font-['Public_Sans'] font-semibold">Education Overview</h3>
                  </div>
                  <div className="p-4">
                    <div className="space-y-4">
                      <div>
                        <div className="flex justify-between mb-1">
                          <span>Tucson, AZ</span>
                          <StarRating rating={4} />
                        </div>
                        <p className="text-sm text-neutral-500">25 public schools, 8 private schools</p>
                      </div>
                      <div>
                        <div className="flex justify-between mb-1">
                          <span>Buffalo, NY</span>
                          <StarRating rating={3} />
                        </div>
                        <p className="text-sm text-neutral-500">18 public schools, 5 private schools</p>
                      </div>
                      <div>
                        <div className="flex justify-between mb-1">
                          <span>Laredo, TX</span>
                          <StarRating rating={3} />
                        </div>
                        <p className="text-sm text-neutral-500">32 public schools, 4 private schools</p>
                      </div>
                    </div>
                    <div className="mt-4 text-center">
                      <a href="#" className="text-sm text-[#005ea2] font-medium hover:underline">View all education data</a>
                    </div>
                  </div>
                </div>
                
                {/* Safety Overview */}
                <div className="bg-white rounded-lg shadow-sm overflow-hidden">
                  <div className="bg-[#2d5999] text-white p-4">
                    <h3 className="font-['Public_Sans'] font-semibold">Safety Overview</h3>
                  </div>
                  <div className="p-4">
                    <div className="flex justify-between mb-3">
                      <span className="text-sm text-neutral-500">National Average</span>
                      <span className="font-medium">100 (index)</span>
                    </div>
                    <div className="space-y-4">
                      <div>
                        <div className="flex justify-between mb-1">
                          <span>El Paso, TX</span>
                          <span className="font-medium text-[#2e8540]">42</span>
                        </div>
                        <div className="w-full bg-neutral-100 rounded-full h-2">
                          <div className="bg-[#2e8540] h-2 rounded-full" style={{ width: '42%' }}></div>
                        </div>
                        <p className="text-xs text-neutral-500 mt-1">58% lower crime than national average</p>
                      </div>
                      <div>
                        <div className="flex justify-between mb-1">
                          <span>San Diego, CA</span>
                          <span className="font-medium text-[#e6a500]">96</span>
                        </div>
                        <div className="w-full bg-neutral-100 rounded-full h-2">
                          <div className="bg-[#e6a500] h-2 rounded-full" style={{ width: '96%' }}></div>
                        </div>
                        <p className="text-xs text-neutral-500 mt-1">4% lower crime than national average</p>
                      </div>
                    </div>
                    <div className="mt-4 text-center">
                      <a href="#" className="text-sm text-[#005ea2] font-medium hover:underline">View all safety data</a>
                    </div>
                  </div>
                </div>
              </div>
              
              {/* Map Preview */}
              <div className="bg-white rounded-lg shadow-md overflow-hidden mb-8">
                <div className="p-4 border-b border-neutral-100 flex justify-between items-center">
                  <h3 className="font-['Public_Sans'] font-semibold">CBP Port Locations</h3>
                  <Link href="/map">
                    <a className="text-[#005ea2] text-sm font-medium hover:underline">View Full Map</a>
                  </Link>
                </div>
                <div className="h-64 lg:h-96 relative">
                  <div className="absolute inset-0">
                    <LocationMap 
                      locations={locations} 
                      height="100%"
                      interactive={false}
                    />
                  </div>
                  <div className="absolute inset-0 bg-neutral-800/10 flex items-center justify-center">
                    <div className="bg-white/90 p-4 rounded-lg shadow-lg max-w-md text-center">
                      <h4 className="font-medium mb-2">Interactive Location Map</h4>
                      <p className="text-sm text-neutral-600 mb-3">Explore CBP port locations and surrounding communities across the United States</p>
                      <Link href="/map">
                        <a className="bg-[#005ea2] hover:bg-[#00477b] text-white py-2 px-4 rounded font-medium transition-colors inline-flex items-center">
                          <span className="material-icons text-sm align-text-bottom mr-1">map</span>
                          Open Interactive Map
                        </a>
                      </Link>
                    </div>
                  </div>
                </div>
              </div>
              
              {/* Resources Section */}
              <div className="bg-white rounded-lg shadow-sm">
                <div className="p-4 border-b border-neutral-100">
                  <h3 className="font-['Public_Sans'] font-semibold">Relocation Resources</h3>
                </div>
                <div className="p-4 grid grid-cols-1 md:grid-cols-3 gap-4">
                  <a href="#" className="block bg-neutral-50 p-4 rounded border border-neutral-100 hover:border-[#005ea2] hover:shadow-sm transition-all">
                    <div className="flex items-start">
                      <span className="material-icons text-[#005ea2] mr-3">payments</span>
                      <div>
                        <h4 className="font-medium mb-1">Relocation Assistance</h4>
                        <p className="text-sm text-neutral-600">Learn about financial assistance programs for CBP employees</p>
                      </div>
                    </div>
                  </a>
                  
                  <a href="#" className="block bg-neutral-50 p-4 rounded border border-neutral-100 hover:border-[#005ea2] hover:shadow-sm transition-all">
                    <div className="flex items-start">
                      <span className="material-icons text-[#005ea2] mr-3">menu_book</span>
                      <div>
                        <h4 className="font-medium mb-1">Moving Guides</h4>
                        <p className="text-sm text-neutral-600">Step-by-step guides for smooth relocations</p>
                      </div>
                    </div>
                  </a>
                  
                  <a href="#" className="block bg-neutral-50 p-4 rounded border border-neutral-100 hover:border-[#005ea2] hover:shadow-sm transition-all">
                    <div className="flex items-start">
                      <span className="material-icons text-[#005ea2] mr-3">support_agent</span>
                      <div>
                        <h4 className="font-medium mb-1">Contact HR Support</h4>
                        <p className="text-sm text-neutral-600">Get personalized assistance with relocation questions</p>
                      </div>
                    </div>
                  </a>
                </div>
              </div>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
};

export default Dashboard;
