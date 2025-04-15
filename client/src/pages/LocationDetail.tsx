import { useState, useEffect } from "react";
import { useRoute, useLocation } from "wouter";
import Sidebar from "@/components/Sidebar";
import { useLocations } from "@/hooks/useLocations";
import { useQuery } from "@tanstack/react-query";
import StarRating from "@/components/StarRating";
import ExternalDataDisplay from "@/components/ExternalDataDisplay";
import { Location } from "@/lib/types";

const LocationDetail = () => {
  const [sidebarOpen, setSidebarOpen] = useState(window.innerWidth >= 1024);
  const [activeTab, setActiveTab] = useState('housing');
  const [match, params] = useRoute('/location/:id');
  const [, navigate] = useLocation();
  
  const { 
    getLocationById, 
    addToCompare, 
    removeFromCompare, 
    isInCompare 
  } = useLocations();
  
  const id = params?.id ? parseInt(params.id) : 0;
  
  const { data: location, isLoading, error } = useQuery<Location>({
    queryKey: [`/api/locations/${id}`],
    enabled: !!id,
  });

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#005ea2]"></div>
      </div>
    );
  }

  if (error || !location) {
    return (
      <div className="p-6 text-center">
        <h3 className="text-lg font-medium mb-2">Error loading location</h3>
        <p className="text-neutral-500">Please try again or select a different location</p>
        <button 
          onClick={() => navigate('/')}
          className="mt-4 px-4 py-2 bg-[#005ea2] text-white rounded hover:bg-[#00477b]"
        >
          Return to Home
        </button>
      </div>
    );
  }

  return (
    <div className="flex flex-col min-h-[calc(100vh-56px)]">
      <div className="flex-1 flex overflow-hidden">
        {/* Sidebar */}
        <Sidebar isOpen={sidebarOpen} onToggle={() => setSidebarOpen(!sidebarOpen)} />
        
        {/* Main Content */}
        <main className="flex-1 overflow-auto h-[calc(100vh-56px)] bg-neutral-50">
          <div className="p-4 md:p-6">
            <div className="max-w-6xl mx-auto">
              {/* Location Header */}
              <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6">
                <div>
                  <div className="flex items-center mb-2">
                    <button 
                      onClick={() => navigate('/')} 
                      className="mr-2 p-1 hover:bg-neutral-100 rounded transition-colors"
                    >
                      <span className="material-icons">arrow_back</span>
                    </button>
                    <h2 className="font-['Public_Sans'] text-2xl font-bold">
                      {location.name}, {location.state}
                    </h2>
                  </div>
                  <p className="text-neutral-500">{location.region} • CBP Field Operations</p>
                </div>
                <div className="flex space-x-2 mt-4 md:mt-0">
                  <button className="flex items-center py-2 px-4 border border-neutral-200 hover:border-neutral-300 rounded transition-colors">
                    <span className="material-icons text-sm mr-1">bookmark_border</span>
                    Save
                  </button>
                  <button 
                    onClick={() => {
                      isInCompare(location.id) 
                        ? removeFromCompare(location.id) 
                        : addToCompare(location.id);
                    }} 
                    className={`flex items-center py-2 px-4 border rounded ${
                      isInCompare(location.id) 
                        ? 'bg-[#1a75b8] text-white border-[#1a75b8]' 
                        : 'border-neutral-200 hover:border-neutral-300'
                    }`}
                  >
                    <span className="material-icons text-sm mr-1">
                      {isInCompare(location.id) ? 'check' : 'compare_arrows'}
                    </span>
                    <span>
                      {isInCompare(location.id) ? 'Added to Compare' : 'Add to Compare'}
                    </span>
                  </button>
                </div>
              </div>
              
              {/* Location Overview */}
              <div className="bg-white rounded-lg shadow-md overflow-hidden mb-6">
                <div className="p-4 sm:p-0">
                  <div className="sm:flex">
                    {/* Map Preview */}
                    <div 
                      className="w-full sm:w-1/3 lg:w-2/5 bg-neutral-200 bg-[url('https://images.unsplash.com/photo-1508848863462-0c1ce30c2f1d?ixlib=rb-1.2.1&auto=format&fit=crop&w=1350&q=80')] bg-cover bg-center sm:h-auto" 
                      style={{ minHeight: '220px' }}
                    ></div>
                    
                    {/* Overview Info */}
                    <div className="p-4 sm:p-6 w-full sm:w-2/3 lg:w-3/5">
                      <h3 className="font-['Public_Sans'] text-lg font-semibold mb-4">Location Overview</h3>
                      
                      <div className="grid grid-cols-2 md:grid-cols-3 gap-4 mb-4">
                        <div>
                          <div className="text-neutral-500 text-sm mb-1">Population</div>
                          <div className="font-medium">{location.population.toLocaleString()}</div>
                        </div>
                        <div>
                          <div className="text-neutral-500 text-sm mb-1">Median Age</div>
                          <div className="font-medium">{location.medianAge}</div>
                        </div>
                        <div>
                          <div className="text-neutral-500 text-sm mb-1">Median Income</div>
                          <div className="font-medium">${location.medianIncome.toLocaleString()}</div>
                        </div>
                        <div>
                          <div className="text-neutral-500 text-sm mb-1">Cost of Living</div>
                          <div className={`font-medium ${location.costOfLiving < 100 ? 'text-[#2e8540]' : 'text-[#d83933]'}`}>
                            {Math.abs(100 - location.costOfLiving)}% {location.costOfLiving < 100 ? 'below' : 'above'} avg
                          </div>
                        </div>
                        <div>
                          <div className="text-neutral-500 text-sm mb-1">Avg Commute</div>
                          <div className="font-medium">{location.averageCommute} min</div>
                        </div>
                        <div>
                          <div className="text-neutral-500 text-sm mb-1">Climate</div>
                          <div className="font-medium">{location.climate}</div>
                        </div>
                      </div>
                      
                      <div className="mt-6">
                        <h4 className="font-medium mb-2">CBP Facilities</h4>
                        <div className="space-y-3 text-sm">
                          {Array.from({ length: location.cbpFacilities }, (_, i) => (
                            <div key={i} className="flex items-start">
                              <span className="material-icons text-[#1a4480] mr-2 text-sm">place</span>
                              <div>
                                <div className="font-medium">
                                  {location.name} {i === 0 ? 'Port of Entry' : 'Field Office'}
                                </div>
                                <div className="text-neutral-500">
                                  {i === 0 
                                    ? `Bridge of the Americas, ${location.name}, ${location.state}` 
                                    : `150 Industrial Blvd, ${location.name}, ${location.state}`}
                                </div>
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              
              {/* Detail Tabs */}
              <div className="mb-6">
                <div className="bg-white rounded-lg shadow-md">
                  {/* Tabs */}
                  <div className="flex overflow-x-auto border-b border-neutral-100">
                    <button 
                      onClick={() => setActiveTab('housing')} 
                      className={`px-4 py-3 font-medium whitespace-nowrap ${
                        activeTab === 'housing' 
                          ? 'border-b-2 border-[#005ea2] text-[#005ea2]' 
                          : 'text-neutral-500'
                      }`}
                    >
                      <span className="material-icons text-sm align-text-top mr-1">home</span> Housing
                    </button>
                    <button 
                      onClick={() => setActiveTab('schools')} 
                      className={`px-4 py-3 font-medium whitespace-nowrap ${
                        activeTab === 'schools' 
                          ? 'border-b-2 border-[#005ea2] text-[#005ea2]' 
                          : 'text-neutral-500'
                      }`}
                    >
                      <span className="material-icons text-sm align-text-top mr-1">school</span> Schools
                    </button>
                    <button 
                      onClick={() => setActiveTab('safety')} 
                      className={`px-4 py-3 font-medium whitespace-nowrap ${
                        activeTab === 'safety' 
                          ? 'border-b-2 border-[#005ea2] text-[#005ea2]' 
                          : 'text-neutral-500'
                      }`}
                    >
                      <span className="material-icons text-sm align-text-top mr-1">shield</span> Safety
                    </button>
                    <button 
                      onClick={() => setActiveTab('lifestyle')} 
                      className={`px-4 py-3 font-medium whitespace-nowrap ${
                        activeTab === 'lifestyle' 
                          ? 'border-b-2 border-[#005ea2] text-[#005ea2]' 
                          : 'text-neutral-500'
                      }`}
                    >
                      <span className="material-icons text-sm align-text-top mr-1">restaurant</span> Lifestyle
                    </button>
                    <button 
                      onClick={() => setActiveTab('transportation')} 
                      className={`px-4 py-3 font-medium whitespace-nowrap ${
                        activeTab === 'transportation' 
                          ? 'border-b-2 border-[#005ea2] text-[#005ea2]' 
                          : 'text-neutral-500'
                      }`}
                    >
                      <span className="material-icons text-sm align-text-top mr-1">directions_car</span> Transportation
                    </button>
                  </div>
                  
                  {/* Tab Content */}
                  <div className="p-6">
                    {/* Housing Tab */}
                    {activeTab === 'housing' && (
                      <div className="flex flex-col lg:flex-row gap-6">
                        <div className="w-full lg:w-2/3">
                          <h3 className="font-['Public_Sans'] text-lg font-semibold mb-4">Housing Market Overview</h3>
                          
                          <div className="bg-neutral-50 p-4 rounded mb-6">
                            <div className="grid grid-cols-2 gap-4">
                              <div>
                                <div className="text-neutral-500 text-sm mb-1">Median Home Price</div>
                                <div className="font-semibold text-lg">${location.housingData.medianHomePrice.toLocaleString()}</div>
                                <div className={`text-sm ${location.housingData.priceDiffFromAvg < 0 ? 'text-[#2e8540]' : 'text-[#d83933]'}`}>
                                  {Math.abs(location.housingData.priceDiffFromAvg)}% {location.housingData.priceDiffFromAvg < 0 ? 'below' : 'above'} national avg
                                </div>
                              </div>
                              <div>
                                <div className="text-neutral-500 text-sm mb-1">Median Rent (2BR)</div>
                                <div className="font-semibold text-lg">${location.housingData.medianRent}/mo</div>
                                <div className={`text-sm ${location.housingData.rentDiffFromAvg < 0 ? 'text-[#2e8540]' : 'text-[#d83933]'}`}>
                                  {Math.abs(location.housingData.rentDiffFromAvg)}% {location.housingData.rentDiffFromAvg < 0 ? 'below' : 'above'} national avg
                                </div>
                              </div>
                            </div>
                          </div>
                          
                          <div className="mb-6">
                            <h4 className="font-medium mb-3">Housing Market Trends</h4>
                            <div className="h-64 bg-neutral-50 rounded flex items-center justify-center text-neutral-400">
                              {/* Chart placeholder */}
                              <div className="text-center">
                                <span className="material-icons text-3xl mb-2">insert_chart</span>
                                <p>Housing price chart visualization</p>
                              </div>
                            </div>
                            <div className="mt-2 text-sm text-neutral-500">
                              Home values have increased {location.housingData.priceGrowthLastYear}% over the past year
                            </div>
                          </div>
                          
                          <div>
                            <div className="flex justify-between items-center mb-3">
                              <h4 className="font-medium">Neighborhood Comparison</h4>
                              <a href="#" className="text-[#005ea2] text-sm hover:underline">View All</a>
                            </div>
                            
                            <div className="overflow-x-auto">
                              <table className="min-w-full divide-y divide-neutral-200">
                                <thead>
                                  <tr>
                                    <th className="px-4 py-3 text-left text-xs font-medium text-neutral-500 uppercase tracking-wider">Neighborhood</th>
                                    <th className="px-4 py-3 text-left text-xs font-medium text-neutral-500 uppercase tracking-wider">Median Price</th>
                                    <th className="px-4 py-3 text-left text-xs font-medium text-neutral-500 uppercase tracking-wider">Home Types</th>
                                    <th className="px-4 py-3 text-left text-xs font-medium text-neutral-500 uppercase tracking-wider">Rating</th>
                                  </tr>
                                </thead>
                                <tbody className="divide-y divide-neutral-100">
                                  {location.housingData.neighborhoods.map((neighborhood: { name: string; medianPrice: number; homeTypes: string; rating: number }, index: number) => (
                                    <tr key={index}>
                                      <td className="px-4 py-3 whitespace-nowrap">{neighborhood.name}</td>
                                      <td className="px-4 py-3 whitespace-nowrap">${neighborhood.medianPrice.toLocaleString()}</td>
                                      <td className="px-4 py-3 whitespace-nowrap">{neighborhood.homeTypes}</td>
                                      <td className="px-4 py-3 whitespace-nowrap">
                                        <StarRating rating={neighborhood.rating} />
                                      </td>
                                    </tr>
                                  ))}
                                </tbody>
                              </table>
                            </div>
                          </div>
                        </div>
                        
                        <div className="w-full lg:w-1/3">
                          {/* Official External Data Section */}
                          {location.externalData && (
                            <div className="mb-6">
                              <ExternalDataDisplay
                                externalData={location.externalData}
                                dataType="housing"
                                title="Official Housing Data"
                                description="Data from Census Bureau Housing Survey"
                              />
                            </div>
                          )}
                        
                          <div className="bg-neutral-50 p-4 rounded mb-6">
                            <h4 className="font-medium mb-3">Recent Listings</h4>
                            
                            <div className="space-y-4">
                              {location.housingData.recentListings.map((listing: { price: number; bedrooms: number; bathrooms: number; sqft: number; address: string; isNew: boolean }, index: number) => (
                                <div key={index} className="bg-white rounded shadow-sm overflow-hidden">
                                  <div className="h-32 bg-neutral-200 relative">
                                    <div className="absolute top-2 left-2 bg-[#005ea2] text-white text-xs py-1 px-2 rounded">
                                      {listing.isNew ? 'New' : ''}
                                    </div>
                                  </div>
                                  <div className="p-3">
                                    <div className="font-medium">${listing.price.toLocaleString()}</div>
                                    <div className="text-sm">{listing.bedrooms} bd | {listing.bathrooms} ba | {listing.sqft.toLocaleString()} sqft</div>
                                    <div className="text-sm text-neutral-500 truncate">{listing.address}</div>
                                  </div>
                                </div>
                              ))}
                            </div>
                            
                            <div className="text-center mt-4">
                              <a href="#" className="text-[#005ea2] font-medium text-sm hover:underline">View all listings</a>
                            </div>
                          </div>
                          
                          <div className="bg-neutral-50 p-4 rounded">
                            <h4 className="font-medium mb-3">Mortgage Calculator</h4>
                            
                            <div className="space-y-3">
                              <div>
                                <label className="text-sm text-neutral-500 mb-1 block">Home Price</label>
                                <input 
                                  type="text" 
                                  defaultValue={`$${location.housingData.medianHomePrice.toLocaleString()}`} 
                                  className="w-full p-2 border border-neutral-200 rounded focus:border-[#005ea2] focus:ring-1 focus:ring-[#005ea2] focus:outline-none"
                                />
                              </div>
                              <div>
                                <label className="text-sm text-neutral-500 mb-1 block">Down Payment</label>
                                <input 
                                  type="text" 
                                  defaultValue={`$${Math.round(location.housingData.medianHomePrice * 0.2).toLocaleString()}`} 
                                  className="w-full p-2 border border-neutral-200 rounded focus:border-[#005ea2] focus:ring-1 focus:ring-[#005ea2] focus:outline-none"
                                />
                              </div>
                              <div>
                                <label className="text-sm text-neutral-500 mb-1 block">Loan Term</label>
                                <select className="w-full p-2 border border-neutral-200 rounded focus:border-[#005ea2] focus:ring-1 focus:ring-[#005ea2] focus:outline-none">
                                  <option>30 years</option>
                                  <option>15 years</option>
                                </select>
                              </div>
                              <div>
                                <label className="text-sm text-neutral-500 mb-1 block">Interest Rate</label>
                                <input 
                                  type="text" 
                                  defaultValue="4.25%" 
                                  className="w-full p-2 border border-neutral-200 rounded focus:border-[#005ea2] focus:ring-1 focus:ring-[#005ea2] focus:outline-none"
                                />
                              </div>
                              
                              <div className="pt-3 border-t border-neutral-200 mt-4">
                                <div className="flex justify-between">
                                  <span className="text-neutral-500">Estimated Payment:</span>
                                  <span className="font-semibold">${location.housingData.estimatedMortgage}/mo</span>
                                </div>
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    )}
                    
                    {/* Schools Tab */}
                    {activeTab === 'schools' && (
                      <div className="flex flex-col lg:flex-row gap-6">
                        <div className="w-full lg:w-2/3">
                          <h3 className="font-['Public_Sans'] text-lg font-semibold mb-4">School Information</h3>
                          <div className="bg-neutral-50 p-4 rounded mb-6">
                            <div className="grid grid-cols-2 gap-4">
                              <div>
                                <div className="text-neutral-500 text-sm mb-1">Overall Rating</div>
                                <div className="flex items-center">
                                  <StarRating rating={location.schoolData.rating} />
                                </div>
                              </div>
                              <div>
                                <div className="text-neutral-500 text-sm mb-1">School Count</div>
                                <div className="font-medium">{location.schoolData.publicSchools} public, {location.schoolData.privateSchools} private</div>
                              </div>
                            </div>
                          </div>
                          
                          <div>
                            <div className="flex justify-between items-center mb-3">
                              <h4 className="font-medium">Top Schools</h4>
                            </div>
                            <div className="space-y-3">
                              {location.schoolData.topSchools.map((school: { name: string; type: string; grades: string; rating: number }, index: number) => (
                                <div key={index} className="bg-white p-3 rounded border border-neutral-100">
                                  <div className="flex justify-between items-start">
                                    <div>
                                      <div className="font-medium">{school.name}</div>
                                      <div className="text-sm text-neutral-500">{school.type} • {school.grades}</div>
                                    </div>
                                    <StarRating rating={school.rating} />
                                  </div>
                                </div>
                              ))}
                            </div>
                          </div>
                        </div>
                        
                        <div className="w-full lg:w-1/3">
                          {/* Official External Data Section */}
                          {location.externalData && (
                            <div className="mb-6">
                              <ExternalDataDisplay
                                externalData={location.externalData}
                                dataType="education"
                                title="Official Education Data"
                                description="Data from Department of Education"
                              />
                            </div>
                          )}
                          
                          <div className="bg-neutral-50 p-4 rounded">
                            <h4 className="font-medium mb-3">Education Resources</h4>
                            <div className="space-y-3">
                              <a href="#" className="flex items-start p-3 bg-white rounded border border-neutral-100 hover:border-[#005ea2] hover:shadow-sm transition-all">
                                <span className="material-icons text-[#005ea2] mr-3">description</span>
                                <div>
                                  <div className="font-medium">School District Map</div>
                                  <p className="text-sm text-neutral-500">View boundaries for all school districts</p>
                                </div>
                              </a>
                              <a href="#" className="flex items-start p-3 bg-white rounded border border-neutral-100 hover:border-[#005ea2] hover:shadow-sm transition-all">
                                <span className="material-icons text-[#005ea2] mr-3">calendar_today</span>
                                <div>
                                  <div className="font-medium">School Calendar</div>
                                  <p className="text-sm text-neutral-500">Important dates for the school year</p>
                                </div>
                              </a>
                            </div>
                          </div>
                        </div>
                      </div>
                    )}
                    
                    {/* Safety Tab */}
                    {activeTab === 'safety' && (
                      <div className="flex flex-col lg:flex-row gap-6">
                        <div className="w-full lg:w-2/3">
                          <h3 className="font-['Public_Sans'] text-lg font-semibold mb-4">Safety Overview</h3>
                          
                          <div className="bg-neutral-50 p-4 rounded mb-6">
                            <div className="flex items-center justify-between mb-3">
                              <div>
                                <div className="text-neutral-500 text-sm mb-1">Crime Index</div>
                                <div className="font-semibold text-lg">
                                  {location.safetyData.crimeIndex} 
                                  <span className="text-sm font-normal ml-1 text-neutral-500">(US avg: 100)</span>
                                </div>
                              </div>
                              <div className={`text-sm font-medium px-3 py-1 rounded-full 
                                ${location.safetyData.crimeIndexDiff <= -10 ? 'bg-green-100 text-green-800' : 
                                  location.safetyData.crimeIndexDiff >= 10 ? 'bg-red-100 text-red-800' : 
                                  'bg-yellow-100 text-yellow-800'}`}>
                                {Math.abs(location.safetyData.crimeIndexDiff)}% 
                                {location.safetyData.crimeIndexDiff < 0 ? ' below avg' : ' above avg'}
                              </div>
                            </div>
                            
                            <div className="grid grid-cols-2 gap-4 mt-4">
                              <div>
                                <div className="text-neutral-500 text-sm mb-1">Violent Crime</div>
                                <div className="font-medium">{location.safetyData.violentCrime} <span className="text-xs text-neutral-500">per 100k</span></div>
                              </div>
                              <div>
                                <div className="text-neutral-500 text-sm mb-1">Property Crime</div>
                                <div className="font-medium">{location.safetyData.propertyCrime} <span className="text-xs text-neutral-500">per 100k</span></div>
                              </div>
                            </div>
                          </div>
                          
                          <div className="mb-6">
                            <h4 className="font-medium mb-3">Safety Comparison</h4>
                            <div className="h-64 bg-neutral-50 rounded flex items-center justify-center text-neutral-400">
                              {/* Chart placeholder */}
                              <div className="text-center">
                                <span className="material-icons text-3xl mb-2">insert_chart</span>
                                <p>Crime comparison chart visualization</p>
                              </div>
                            </div>
                          </div>
                        </div>
                        
                        <div className="w-full lg:w-1/3">
                          {/* Official External Data Section */}
                          {location.externalData && (
                            <div className="mb-6">
                              <ExternalDataDisplay
                                externalData={location.externalData}
                                dataType="safety"
                                title="Official Crime Data"
                                description="Data from FBI Uniform Crime Report"
                              />
                            </div>
                          )}
                          
                          <div className="bg-neutral-50 p-4 rounded">
                            <h4 className="font-medium mb-3">Safety Resources</h4>
                            <div className="space-y-3">
                              <a href="#" className="flex items-start p-3 bg-white rounded border border-neutral-100 hover:border-[#005ea2] hover:shadow-sm transition-all">
                                <span className="material-icons text-[#005ea2] mr-3">map</span>
                                <div>
                                  <div className="font-medium">Crime Map</div>
                                  <p className="text-sm text-neutral-500">View crime incidents by neighborhood</p>
                                </div>
                              </a>
                              <a href="#" className="flex items-start p-3 bg-white rounded border border-neutral-100 hover:border-[#005ea2] hover:shadow-sm transition-all">
                                <span className="material-icons text-[#005ea2] mr-3">local_police</span>
                                <div>
                                  <div className="font-medium">Police Stations</div>
                                  <p className="text-sm text-neutral-500">Locate nearby police and fire stations</p>
                                </div>
                              </a>
                            </div>
                          </div>
                        </div>
                      </div>
                    )}
                    
                    {/* Lifestyle Tab */}
                    {activeTab === 'lifestyle' && (
                      <div className="flex flex-col lg:flex-row gap-6">
                        <div className="w-full lg:w-2/3">
                          <h3 className="font-['Public_Sans'] text-lg font-semibold mb-4">Lifestyle & Recreation</h3>
                          
                          <div className="bg-neutral-50 p-4 rounded mb-6">
                            <div className="grid grid-cols-2 gap-4">
                              <div>
                                <div className="text-neutral-500 text-sm mb-1">Restaurants</div>
                                <div className="font-medium">{location.lifestyleData.restaurants} within 5 miles</div>
                              </div>
                              <div>
                                <div className="text-neutral-500 text-sm mb-1">Parks</div>
                                <div className="font-medium">{location.lifestyleData.parks} within 5 miles</div>
                              </div>
                              <div>
                                <div className="text-neutral-500 text-sm mb-1">Shopping</div>
                                <div className="font-medium">{location.lifestyleData.shopping} retail centers</div>
                              </div>
                              <div>
                                <div className="text-neutral-500 text-sm mb-1">Entertainment</div>
                                <div className="font-medium">{location.lifestyleData.entertainment} venues</div>
                              </div>
                            </div>
                          </div>
                          
                          <div className="mb-6">
                            <h4 className="font-medium mb-3">Local Attractions</h4>
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                              <div className="bg-white rounded border border-neutral-100 overflow-hidden">
                                <div className="h-40 bg-neutral-200"></div>
                                <div className="p-3">
                                  <div className="font-medium">Cultural District</div>
                                  <div className="text-sm text-neutral-500">Museums, galleries, and theaters</div>
                                </div>
                              </div>
                              <div className="bg-white rounded border border-neutral-100 overflow-hidden">
                                <div className="h-40 bg-neutral-200"></div>
                                <div className="p-3">
                                  <div className="font-medium">Outdoor Recreation</div>
                                  <div className="text-sm text-neutral-500">Parks, trails, and sports facilities</div>
                                </div>
                              </div>
                            </div>
                          </div>
                        </div>
                        
                        <div className="w-full lg:w-1/3">
                          <div className="bg-neutral-50 p-4 rounded mb-6">
                            <h4 className="font-medium mb-3">Community Events</h4>
                            <div className="space-y-3">
                              <div className="bg-white p-3 rounded border border-neutral-100">
                                <div className="text-sm text-[#005ea2] font-medium mb-1">APR 15</div>
                                <div className="font-medium">Farmers Market</div>
                                <div className="text-sm text-neutral-500">Downtown Plaza, 9AM - 1PM</div>
                              </div>
                              <div className="bg-white p-3 rounded border border-neutral-100">
                                <div className="text-sm text-[#005ea2] font-medium mb-1">APR 22</div>
                                <div className="font-medium">Arts Festival</div>
                                <div className="text-sm text-neutral-500">City Park, All Weekend</div>
                              </div>
                              <div className="bg-white p-3 rounded border border-neutral-100">
                                <div className="text-sm text-[#005ea2] font-medium mb-1">MAY 5</div>
                                <div className="font-medium">Community Cleanup</div>
                                <div className="text-sm text-neutral-500">Various Locations, 10AM</div>
                              </div>
                            </div>
                            <div className="text-center mt-4">
                              <a href="#" className="text-[#005ea2] font-medium text-sm hover:underline">View all events</a>
                            </div>
                          </div>
                          
                          <div className="bg-neutral-50 p-4 rounded">
                            <h4 className="font-medium mb-3">Local Resources</h4>
                            <div className="space-y-3">
                              <a href="#" className="flex items-start p-3 bg-white rounded border border-neutral-100 hover:border-[#005ea2] hover:shadow-sm transition-all">
                                <span className="material-icons text-[#005ea2] mr-3">explore</span>
                                <div>
                                  <div className="font-medium">City Visitor Guide</div>
                                  <p className="text-sm text-neutral-500">Discover local attractions and activities</p>
                                </div>
                              </a>
                              <a href="#" className="flex items-start p-3 bg-white rounded border border-neutral-100 hover:border-[#005ea2] hover:shadow-sm transition-all">
                                <span className="material-icons text-[#005ea2] mr-3">local_activity</span>
                                <div>
                                  <div className="font-medium">Recreation Programs</div>
                                  <p className="text-sm text-neutral-500">Classes, sports leagues, and activities</p>
                                </div>
                              </a>
                            </div>
                          </div>
                        </div>
                      </div>
                    )}
                    
                    {/* Transportation Tab */}
                    {activeTab === 'transportation' && (
                      <div className="flex flex-col lg:flex-row gap-6">
                        <div className="w-full lg:w-2/3">
                          <h3 className="font-['Public_Sans'] text-lg font-semibold mb-4">Transportation Overview</h3>
                          
                          <div className="bg-neutral-50 p-4 rounded mb-6">
                            <div className="grid grid-cols-3 gap-4">
                              <div>
                                <div className="text-neutral-500 text-sm mb-1">Transit Score</div>
                                <div className="font-medium">{location.transportationData.transitScore}/100</div>
                              </div>
                              <div>
                                <div className="text-neutral-500 text-sm mb-1">Walk Score</div>
                                <div className="font-medium">{location.transportationData.walkScore}/100</div>
                              </div>
                              <div>
                                <div className="text-neutral-500 text-sm mb-1">Bike Score</div>
                                <div className="font-medium">{location.transportationData.bikeScore}/100</div>
                              </div>
                            </div>
                          </div>
                          
                          <div className="bg-white p-4 rounded border border-neutral-100 mb-6">
                            <h4 className="font-medium mb-3">Transit Options</h4>
                            <div className="space-y-3">
                              <div className="flex items-start">
                                <span className="material-icons text-[#005ea2] mr-3">directions_bus</span>
                                <div>
                                  <div className="font-medium">Public Transit</div>
                                  <p className="text-sm text-neutral-500">
                                    {location.transportationData.hasPublicTransit 
                                      ? 'Available with bus and rail service' 
                                      : 'Limited public transit options'}
                                  </p>
                                </div>
                              </div>
                              <div className="flex items-start">
                                <span className="material-icons text-[#005ea2] mr-3">flight</span>
                                <div>
                                  <div className="font-medium">Air Travel</div>
                                  <p className="text-sm text-neutral-500">
                                    {location.transportationData.majorAirports > 0 
                                      ? `${location.transportationData.majorAirports} major airport${location.transportationData.majorAirports > 1 ? 's' : ''} within 30 miles` 
                                      : 'No major airports nearby'}
                                  </p>
                                </div>
                              </div>
                              <div className="flex items-start">
                                <span className="material-icons text-[#005ea2] mr-3">directions_car</span>
                                <div>
                                  <div className="font-medium">Highway Access</div>
                                  <p className="text-sm text-neutral-500">
                                    {location.transportationData.interstateAccess 
                                      ? 'Direct interstate highway access' 
                                      : 'Limited highway connectivity'}
                                  </p>
                                </div>
                              </div>
                            </div>
                          </div>
                          
                          <div className="h-64 bg-neutral-50 rounded flex items-center justify-center text-neutral-400">
                            {/* Map placeholder */}
                            <div className="text-center">
                              <span className="material-icons text-3xl mb-2">map</span>
                              <p>Transit map visualization</p>
                            </div>
                          </div>
                        </div>
                        
                        <div className="w-full lg:w-1/3">
                          <div className="bg-neutral-50 p-4 rounded mb-6">
                            <h4 className="font-medium mb-3">Average Commute Times</h4>
                            <div className="space-y-3">
                              <div className="flex justify-between items-center">
                                <div className="flex items-center">
                                  <span className="material-icons text-[#005ea2] mr-2">home_work</span>
                                  <span>To Downtown</span>
                                </div>
                                <span className="font-medium">{Math.round(location.averageCommute * 0.7)} min</span>
                              </div>
                              <div className="flex justify-between items-center">
                                <div className="flex items-center">
                                  <span className="material-icons text-[#005ea2] mr-2">location_city</span>
                                  <span>To CBP Office</span>
                                </div>
                                <span className="font-medium">{Math.round(location.averageCommute * 0.9)} min</span>
                              </div>
                              <div className="flex justify-between items-center">
                                <div className="flex items-center">
                                  <span className="material-icons text-[#005ea2] mr-2">flight_takeoff</span>
                                  <span>To Airport</span>
                                </div>
                                <span className="font-medium">{Math.round(location.averageCommute * 1.2)} min</span>
                              </div>
                            </div>
                          </div>
                          
                          <div className="bg-neutral-50 p-4 rounded">
                            <h4 className="font-medium mb-3">Transportation Resources</h4>
                            <div className="space-y-3">
                              <a href="#" className="flex items-start p-3 bg-white rounded border border-neutral-100 hover:border-[#005ea2] hover:shadow-sm transition-all">
                                <span className="material-icons text-[#005ea2] mr-3">schedule</span>
                                <div>
                                  <div className="font-medium">Transit Schedules</div>
                                  <p className="text-sm text-neutral-500">Bus and rail timetables</p>
                                </div>
                              </a>
                              <a href="#" className="flex items-start p-3 bg-white rounded border border-neutral-100 hover:border-[#005ea2] hover:shadow-sm transition-all">
                                <span className="material-icons text-[#005ea2] mr-3">directions_bike</span>
                                <div>
                                  <div className="font-medium">Bike Routes</div>
                                  <p className="text-sm text-neutral-500">Maps of dedicated bike lanes and paths</p>
                                </div>
                              </a>
                            </div>
                          </div>
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              </div>
              
              {/* Related Resources */}
              <div className="bg-white rounded-lg shadow-md p-6">
                <h3 className="font-['Public_Sans'] text-lg font-semibold mb-4">CBP Resources for This Location</h3>
                
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  <a href="#" className="border border-neutral-100 rounded p-4 hover:border-[#005ea2] hover:shadow-sm transition-all">
                    <h4 className="font-medium mb-2">Local CBP Contact</h4>
                    <p className="text-sm text-neutral-600 mb-2">Connect with local HR representatives for this location</p>
                    <span className="text-[#005ea2] text-sm font-medium">View contacts</span>
                  </a>
                  
                  <a href="#" className="border border-neutral-100 rounded p-4 hover:border-[#005ea2] hover:shadow-sm transition-all">
                    <h4 className="font-medium mb-2">Relocation Incentives</h4>
                    <p className="text-sm text-neutral-600 mb-2">Learn about potential incentives for this location</p>
                    <span className="text-[#005ea2] text-sm font-medium">View details</span>
                  </a>
                  
                  <a href="#" className="border border-neutral-100 rounded p-4 hover:border-[#005ea2] hover:shadow-sm transition-all">
                    <h4 className="font-medium mb-2">Employee Experiences</h4>
                    <p className="text-sm text-neutral-600 mb-2">Read stories from CBP employees at this location</p>
                    <span className="text-[#005ea2] text-sm font-medium">View stories</span>
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

export default LocationDetail;
