import { useState } from "react";
import { Link, useLocation } from "wouter";
import { useLocations } from "@/hooks/useLocations";
import { useQuery } from "@tanstack/react-query";
import StarRating from "@/components/StarRating";
import ExternalDataDisplay from "@/components/ExternalDataDisplay";
import { Database } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Location } from "@/lib/types";

const CompareView = () => {
  const { compareLocations, removeFromCompare, clearCompare } = useLocations();
  const [, navigate] = useLocation();
  
  const { data: locations, isLoading, error } = useQuery<Location[]>({
    queryKey: [`/api/compare?ids=${compareLocations.join(',')}`],
    enabled: compareLocations.length > 0,
  });

  if (compareLocations.length === 0) {
    return (
      <div className="p-8 text-center">
        <span className="material-icons text-5xl mb-4 text-neutral-400">compare_arrows</span>
        <h2 className="font-['Public_Sans'] text-2xl font-bold mb-2">No Locations to Compare</h2>
        <p className="mb-6 text-neutral-600">Add locations to your comparison list to see them side by side</p>
        <Link href="/" className="bg-[#005ea2] hover:bg-[#00477b] text-white py-2 px-6 rounded-md font-medium transition-colors inline-flex items-center">
          <span className="material-icons text-sm mr-2">search</span>
          Browse Locations
        </Link>
      </div>
    );
  }

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#005ea2]"></div>
      </div>
    );
  }

  if (error || !locations || !Array.isArray(locations)) {
    return (
      <div className="p-6 text-center">
        <h3 className="text-lg font-medium mb-2">Error loading comparison data</h3>
        <p className="text-neutral-500 mb-4">Please try again</p>
        <button 
          onClick={() => navigate('/')}
          className="px-4 py-2 bg-[#005ea2] text-white rounded hover:bg-[#00477b]"
        >
          Return to Home
        </button>
      </div>
    );
  }
  
  // At this point, locations is confirmed to be an array of Location objects
  const locationArray: Location[] = locations;

  return (
    <div className="p-4 md:p-6">
      <div className="max-w-6xl mx-auto">
        {/* Compare Header - Apple-inspired design */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-8">
          <div>
            <h2 className="text-3xl font-semibold mb-2 text-gray-900" style={{ letterSpacing: '-0.025em' }}>
              Compare Locations
            </h2>
            <p className="text-gray-500">
              Comparing <span className="text-gray-700">{locationArray.length}</span> location{locationArray.length > 1 ? 's' : ''} side by side
            </p>
          </div>
          <div className="mt-4 sm:mt-0 flex items-center">
            <Link href="/" className="mr-4 flex items-center text-blue-500 hover:text-blue-600 font-medium">
              <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="mr-1">
                <line x1="12" y1="5" x2="12" y2="19"></line>
                <line x1="5" y1="12" x2="19" y2="12"></line>
              </svg>
              <span>Add Location</span>
            </Link>
            <button 
              onClick={() => {
                clearCompare();
                navigate('/');
              }} 
              className="flex items-center bg-gray-100 hover:bg-gray-200 py-2 px-4 transition-colors"
              style={{ borderRadius: '8px' }}
            >
              <span className="text-gray-700 font-medium">Close</span>
            </button>
          </div>
        </div>
        
        {/* Compare Table - Apple-inspired */}
        <div className="bg-white border border-gray-200 overflow-hidden shadow-sm" style={{ borderRadius: '12px' }}>
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead>
                <tr className="bg-gray-50">
                  <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider sticky left-0 bg-gray-50 min-w-[200px]" style={{ letterSpacing: '0.05em' }}>
                    Category
                  </th>
                  {locations.map(location => (
                    <th key={location.id} className="px-6 py-4 text-left min-w-[250px]">
                      <div className="flex justify-between items-center">
                        <div>
                          <div className="font-medium text-gray-900" style={{ letterSpacing: '-0.01em' }}>{location.name}, {location.state}</div>
                          <div className="text-xs text-gray-500 flex items-center mt-1">
                            <span className="inline-block w-3 h-3 bg-blue-500 mr-1.5" style={{ borderRadius: '4px' }}></span>
                            {location.region}
                          </div>
                        </div>
                        <button 
                          onClick={() => removeFromCompare(location.id)} 
                          className="text-gray-400 hover:text-gray-500 p-1.5 bg-gray-100 hover:bg-gray-200 transition-colors ml-2"
                          style={{ borderRadius: '8px' }}
                          title="Remove from comparison"
                        >
                          <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                            <line x1="18" y1="6" x2="6" y2="18"></line>
                            <line x1="6" y1="6" x2="18" y2="18"></line>
                          </svg>
                        </button>
                      </div>
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y divide-neutral-200">
                {/* Overall */}
                <tr>
                  <td className="px-6 py-4 text-sm font-medium text-neutral-800 sticky left-0 bg-white">
                    Overall Rating
                  </td>
                  {locations.map(location => (
                    <td key={location.id} className="px-6 py-4 text-sm">
                      <div className="mb-1">
                        <StarRating rating={location.rating} />
                      </div>
                      <div className="text-xs text-neutral-500">{location.rating}/5.0</div>
                    </td>
                  ))}
                </tr>
                
                {/* Housing */}
                <tr className="bg-gray-50">
                  <td colSpan={locationArray.length + 1} className="px-6 py-4 text-sm sticky left-0 bg-gray-50">
                    <div className="flex items-center">
                      <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-blue-500 mr-2">
                        <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"></path>
                        <polyline points="9 22 9 12 15 12 15 22"></polyline>
                      </svg>
                      <span className="font-medium text-gray-900">Housing</span>
                    </div>
                  </td>
                </tr>
                <tr>
                  <td className="px-6 py-3 text-sm sticky left-0 bg-white">Median Home Price</td>
                  {locations.map(location => (
                    <td key={location.id} className="px-6 py-3 text-sm">
                      <div className="font-medium">${location.housingData.medianHomePrice.toLocaleString()}</div>
                      <div className={`text-xs flex items-center mt-1 ${location.housingData.priceDiffFromAvg < 0 ? 'text-[#2e8540]' : 'text-[#d83933]'}`}>
                        <span className="material-icons text-sm mr-1">
                          {location.housingData.priceDiffFromAvg < 0 ? 'trending_down' : 'trending_up'}
                        </span>
                        {Math.abs(location.housingData.priceDiffFromAvg)}% {location.housingData.priceDiffFromAvg < 0 ? 'below' : 'above'} avg
                      </div>
                    </td>
                  ))}
                </tr>
                <tr>
                  <td className="px-6 py-3 text-sm sticky left-0 bg-white">Median Rent (2BR)</td>
                  {locations.map(location => (
                    <td key={location.id} className="px-6 py-3 text-sm">
                      <div className="font-medium">${location.housingData.medianRent}/mo</div>
                      <div className={`text-xs flex items-center mt-1 ${location.housingData.rentDiffFromAvg < 0 ? 'text-[#2e8540]' : 'text-[#d83933]'}`}>
                        <span className="material-icons text-sm mr-1">
                          {location.housingData.rentDiffFromAvg < 0 ? 'trending_down' : 'trending_up'}
                        </span>
                        {Math.abs(location.housingData.rentDiffFromAvg)}% {location.housingData.rentDiffFromAvg < 0 ? 'below' : 'above'} avg
                      </div>
                    </td>
                  ))}
                </tr>
                
                {/* Schools */}
                <tr className="bg-gray-50">
                  <td colSpan={locationArray.length + 1} className="px-6 py-4 text-sm sticky left-0 bg-gray-50">
                    <div className="flex items-center">
                      <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-blue-500 mr-2">
                        <path d="M2 3h6a4 4 0 0 1 4 4v14a3 3 0 0 0-3-3H2z"></path>
                        <path d="M22 3h-6a4 4 0 0 0-4 4v14a3 3 0 0 1 3-3h7z"></path>
                      </svg>
                      <span className="font-medium text-gray-900">Education</span>
                    </div>
                  </td>
                </tr>
                <tr>
                  <td className="px-6 py-3 text-sm sticky left-0 bg-white">School Rating</td>
                  {locations.map(location => (
                    <td key={location.id} className="px-6 py-3 text-sm">
                      <StarRating rating={location.schoolData.rating} />
                    </td>
                  ))}
                </tr>
                <tr>
                  <td className="px-6 py-3 text-sm sticky left-0 bg-white">School Count</td>
                  {locations.map(location => (
                    <td key={location.id} className="px-6 py-3 text-sm">
                      {location.schoolData.publicSchools} public, {location.schoolData.privateSchools} private
                    </td>
                  ))}
                </tr>
                
                {/* Safety */}
                <tr className="bg-gray-50">
                  <td colSpan={locationArray.length + 1} className="px-6 py-4 text-sm sticky left-0 bg-gray-50">
                    <div className="flex items-center">
                      <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-blue-500 mr-2">
                        <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"></path>
                      </svg>
                      <span className="font-medium text-gray-900">Safety</span>
                    </div>
                  </td>
                </tr>
                <tr>
                  <td className="px-6 py-3 text-sm sticky left-0 bg-white">Crime Index</td>
                  {locations.map(location => (
                    <td key={location.id} className="px-6 py-3 text-sm">
                      <div className="font-medium flex items-center">
                        {location.safetyData.crimeIndex}
                        <span className={`ml-2 inline-flex items-center justify-center rounded-full w-5 h-5 text-xs ${
                          location.safetyData.crimeIndexDiff < -50 
                            ? 'bg-[#2e8540]/10 text-[#2e8540]' 
                            : location.safetyData.crimeIndexDiff < -20 
                            ? 'bg-[#ffbe2e]/10 text-[#ffbe2e]' 
                            : 'bg-[#d83933]/10 text-[#d83933]'
                        }`}>
                          {location.safetyData.crimeIndexDiff < -50 ? 'A' : location.safetyData.crimeIndexDiff < -20 ? 'B' : 'C'}
                        </span>
                      </div>
                      <div className={`text-xs flex items-center mt-1 ${
                        location.safetyData.crimeIndexDiff < -50 
                          ? 'text-[#2e8540]' 
                          : location.safetyData.crimeIndexDiff < -20 
                          ? 'text-[#ffbe2e]' 
                          : 'text-[#d83933]'
                      }`}>
                        <span className="material-icons text-sm mr-1">
                          {location.safetyData.crimeIndexDiff < 0 ? 'trending_down' : 'trending_up'}
                        </span>
                        {Math.abs(location.safetyData.crimeIndexDiff)}% below avg
                      </div>
                    </td>
                  ))}
                </tr>
                
                {/* Lifestyle */}
                <tr className="bg-gray-50">
                  <td colSpan={locationArray.length + 1} className="px-6 py-4 text-sm sticky left-0 bg-gray-50">
                    <div className="flex items-center">
                      <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-blue-500 mr-2">
                        <path d="M18 8h1a4 4 0 0 1 0 8h-1"></path>
                        <path d="M2 8h16v9a4 4 0 0 1-4 4H6a4 4 0 0 1-4-4V8z"></path>
                        <line x1="6" y1="1" x2="6" y2="4"></line>
                        <line x1="10" y1="1" x2="10" y2="4"></line>
                        <line x1="14" y1="1" x2="14" y2="4"></line>
                      </svg>
                      <span className="font-medium text-gray-900">Lifestyle</span>
                    </div>
                  </td>
                </tr>
                <tr>
                  <td className="px-6 py-3 text-sm sticky left-0 bg-white">Cost of Living</td>
                  {locations.map(location => (
                    <td key={location.id} className="px-6 py-3 text-sm">
                      <div className="font-medium flex items-center">
                        {location.costOfLiving}
                        <span className={`ml-2 inline-flex items-center justify-center rounded-full w-5 h-5 text-xs ${
                          location.costOfLiving < 95 
                            ? 'bg-[#2e8540]/10 text-[#2e8540]' 
                            : location.costOfLiving > 105 
                            ? 'bg-[#d83933]/10 text-[#d83933]' 
                            : 'bg-[#ffbe2e]/10 text-[#ffbe2e]'
                        }`}>
                          {location.costOfLiving < 95 ? 'A' : location.costOfLiving > 105 ? 'C' : 'B'}
                        </span>
                      </div>
                      <div className={`text-xs flex items-center mt-1 ${
                        location.costOfLiving < 95 
                          ? 'text-[#2e8540]' 
                          : location.costOfLiving > 105 
                          ? 'text-[#d83933]' 
                          : 'text-[#ffbe2e]'
                      }`}>
                        <span className="material-icons text-sm mr-1">
                          {location.costOfLiving < 100 ? 'trending_down' : 'trending_up'}
                        </span>
                        {Math.abs(100 - location.costOfLiving)}% {location.costOfLiving < 100 ? 'below' : 'above'} avg
                      </div>
                    </td>
                  ))}
                </tr>
                <tr>
                  <td className="px-6 py-3 text-sm sticky left-0 bg-white">Climate</td>
                  {locations.map(location => (
                    <td key={location.id} className="px-6 py-3 text-sm">
                      {location.climate}
                    </td>
                  ))}
                </tr>
                
                {/* CBP Specific */}
                <tr className="bg-[#f0f9ff] font-medium border-l-4 border-l-[#0ea5e9]">
                  <td colSpan={locations.length + 1} className="px-6 py-3 text-sm sticky left-0 bg-[#f0f9ff]">
                    <div className="flex items-center text-[#0284c7] uppercase tracking-wide text-xs font-bold">
                      <span className="material-icons text-sm mr-2">business</span>
                      CBP Information
                    </div>
                  </td>
                </tr>
                <tr>
                  <td className="px-6 py-3 text-sm sticky left-0 bg-white">Facilities</td>
                  {locations.map(location => (
                    <td key={location.id} className="px-6 py-3 text-sm">
                      {location.cbpFacilities} Port of Entry Facilities
                    </td>
                  ))}
                </tr>
                <tr>
                  <td className="px-6 py-3 text-sm sticky left-0 bg-white">Relocation Incentives</td>
                  {locations.map(location => (
                    <td key={location.id} className="px-6 py-3 text-sm">
                      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                        location.region === 'Coastal' 
                          ? 'bg-neutral-200 text-neutral-800' 
                          : 'bg-[#2e8540] text-white'
                      }`}>
                        {location.region === 'Coastal' ? 'Limited' : 'Available'}
                      </span>
                    </td>
                  ))}
                </tr>
              </tbody>
            </table>
          </div>
        </div>
        
        {/* External Data Section */}
        {locationArray.some(loc => loc.externalData) && (
          <div className="mt-10">
            <div className="flex items-center bg-[#f0f9ff] p-4 mb-6 border-l-4 border-l-[#0ea5e9]" style={{ borderRadius: '2px' }}>
              <Database className="h-5 w-5 text-[#0284c7] mr-3" />
              <div>
                <h3 className="text-lg font-bold text-[#0f172a] flex items-center">
                  <span className="text-[#0284c7] tracking-wide uppercase text-sm">data.gov</span>
                  <span className="mx-2 text-xs text-[#64748b]">|</span>
                  <span>Authentic Data</span>
                </h3>
                <p className="text-sm text-[#64748b]">
                  Verified official information sourced directly from U.S. Government data services
                </p>
              </div>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {locationArray.map(location => (
                <div key={`data-${location.id}`} className="border border-[#e2e8f0] overflow-hidden shadow-sm" style={{ borderRadius: '2px' }}>
                  <div className="bg-[#0284c7] text-white p-3">
                    <Badge variant="outline" className="mb-1 border-white text-white uppercase tracking-wide text-xs">{location.name}, {location.state}</Badge>
                    <h4 className="text-md font-medium flex items-center">
                      <span className="material-icons text-sm mr-2">verified</span>
                      Official Data Sources
                    </h4>
                  </div>
                  
                  <div className="p-4">
                    {location.externalData ? (
                      <>
                        <ExternalDataDisplay 
                          externalData={location.externalData}
                          dataType="housing"
                          title="Housing Data"
                          description="Official housing statistics from data.gov"
                        />
                        
                        <div className="my-4 border-t border-[#e2e8f0]"></div>
                        
                        <ExternalDataDisplay 
                          externalData={location.externalData}
                          dataType="education"
                          title="Education Data"
                          description="Official education statistics from data.gov"
                        />
                        
                        <div className="my-4 border-t border-[#e2e8f0]"></div>
                        
                        <ExternalDataDisplay 
                          externalData={location.externalData}
                          dataType="safety"
                          title="Safety Data"
                          description="Official crime statistics from data.gov"
                        />
                      </>
                    ) : (
                      <div className="p-4 bg-[#f8fafc] text-center text-sm text-[#64748b]">
                        <span className="material-icons text-[#94a3b8] mb-2 text-xl">info_outline</span>
                        <p>No official data available for this location</p>
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Action Buttons */}
        <div className="mt-8 flex flex-col sm:flex-row justify-between items-center gap-4 bg-[#f8fafc] p-4 border border-[#e2e8f0]" style={{ borderRadius: '2px' }}>
          <div>
            <h3 className="text-[#0f172a] font-semibold mb-1 flex items-center">
              <span className="material-icons text-sm mr-2 text-[#0284c7]">save</span>
              SAVE COMPARISON
            </h3>
            <p className="text-sm text-[#64748b]">Export or share your comparison with colleagues</p>
          </div>
          <div className="flex gap-3 mt-3 sm:mt-0">
            <button 
              className="py-2.5 px-5 border border-[#e2e8f0] hover:border-[#0ea5e9] bg-white transition-colors flex items-center shadow-sm hover:shadow"
              style={{ borderRadius: '2px' }}
            >
              <span className="material-icons text-sm mr-2 text-[#0284c7]">file_download</span>
              <span className="font-medium uppercase text-[#334155] text-sm tracking-wide">Export</span>
            </button>
            <button 
              className="py-2.5 px-5 bg-[#0284c7] hover:bg-[#0369a1] text-white transition-colors flex items-center shadow-sm hover:shadow"
              style={{ borderRadius: '2px' }}
            >
              <span className="material-icons text-sm mr-2">share</span>
              <span className="font-medium uppercase text-sm tracking-wide">Share</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CompareView;
