import { useState } from "react";
import { Link, useLocation } from "wouter";
import { useLocations } from "@/hooks/useLocations";
import { useQuery } from "@tanstack/react-query";
import StarRating from "@/components/StarRating";
import ExternalDataDisplay from "@/components/ExternalDataDisplay";
import { Database } from "lucide-react";
import { Badge } from "@/components/ui/badge";

const CompareView = () => {
  const { compareLocations, removeFromCompare, clearCompare } = useLocations();
  const [, navigate] = useLocation();
  
  const { data: locations, isLoading, error } = useQuery({
    queryKey: [`/api/compare?ids=${compareLocations.join(',')}`],
    enabled: compareLocations.length > 0,
  });

  if (compareLocations.length === 0) {
    return (
      <div className="p-8 text-center">
        <span className="material-icons text-5xl mb-4 text-neutral-400">compare_arrows</span>
        <h2 className="font-['Public_Sans'] text-2xl font-bold mb-2">No Locations to Compare</h2>
        <p className="mb-6 text-neutral-600">Add locations to your comparison list to see them side by side</p>
        <Link href="/">
          <a className="bg-[#005ea2] hover:bg-[#00477b] text-white py-2 px-6 rounded-md font-medium transition-colors inline-flex items-center">
            <span className="material-icons text-sm mr-2">search</span>
            Browse Locations
          </a>
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

  if (error || !locations) {
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

  return (
    <div className="p-4 md:p-6">
      <div className="max-w-6xl mx-auto">
        {/* Compare Header */}
        <div className="flex justify-between items-center mb-6">
          <div>
            <h2 className="font-['Public_Sans'] text-2xl font-bold mb-1">Compare Locations</h2>
            <p className="text-neutral-500">
              Comparing {locations.length} location{locations.length > 1 ? 's' : ''}
            </p>
          </div>
          <button 
            onClick={() => {
              clearCompare();
              navigate('/');
            }} 
            className="flex items-center text-neutral-500 hover:text-neutral-700"
          >
            <span className="material-icons mr-1">close</span>
            <span>Close Comparison</span>
          </button>
        </div>
        
        {/* Compare Table */}
        <div className="bg-white rounded-lg shadow-md overflow-hidden">
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-neutral-200">
              <thead>
                <tr className="bg-neutral-50">
                  <th className="px-6 py-4 text-left text-xs font-medium text-neutral-500 uppercase tracking-wider sticky left-0 bg-neutral-50 min-w-[200px]">
                    Category
                  </th>
                  {locations.map(location => (
                    <th key={location.id} className="px-6 py-4 text-left text-sm font-medium min-w-[250px]">
                      <div className="flex justify-between items-center">
                        <div>
                          <div>{location.name}, {location.state}</div>
                          <div className="text-xs text-neutral-500">{location.region}</div>
                        </div>
                        <button 
                          onClick={() => removeFromCompare(location.id)} 
                          className="text-neutral-400 hover:text-[#d83933] p-1 ml-2"
                        >
                          <span className="material-icons text-sm">close</span>
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
                <tr className="bg-neutral-50 font-medium">
                  <td colSpan={locations.length + 1} className="px-6 py-3 text-sm sticky left-0 bg-neutral-50">
                    Housing
                  </td>
                </tr>
                <tr>
                  <td className="px-6 py-3 text-sm sticky left-0 bg-white">Median Home Price</td>
                  {locations.map(location => (
                    <td key={location.id} className="px-6 py-3 text-sm">
                      <div className="font-medium">${location.housingData.medianHomePrice.toLocaleString()}</div>
                      <div className={`text-xs ${location.housingData.priceDiffFromAvg < 0 ? 'text-[#2e8540]' : 'text-[#d83933]'}`}>
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
                      <div className={`text-xs ${location.housingData.rentDiffFromAvg < 0 ? 'text-[#2e8540]' : 'text-[#d83933]'}`}>
                        {Math.abs(location.housingData.rentDiffFromAvg)}% {location.housingData.rentDiffFromAvg < 0 ? 'below' : 'above'} avg
                      </div>
                    </td>
                  ))}
                </tr>
                
                {/* Schools */}
                <tr className="bg-neutral-50 font-medium">
                  <td colSpan={locations.length + 1} className="px-6 py-3 text-sm sticky left-0 bg-neutral-50">
                    Education
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
                <tr className="bg-neutral-50 font-medium">
                  <td colSpan={locations.length + 1} className="px-6 py-3 text-sm sticky left-0 bg-neutral-50">
                    Safety
                  </td>
                </tr>
                <tr>
                  <td className="px-6 py-3 text-sm sticky left-0 bg-white">Crime Index</td>
                  {locations.map(location => (
                    <td key={location.id} className="px-6 py-3 text-sm">
                      <div className="font-medium">{location.safetyData.crimeIndex}</div>
                      <div className={`text-xs ${
                        location.safetyData.crimeIndexDiff < -50 
                          ? 'text-[#2e8540]' 
                          : location.safetyData.crimeIndexDiff < -20 
                          ? 'text-[#ffbe2e]' 
                          : 'text-[#d83933]'
                      }`}>
                        {Math.abs(location.safetyData.crimeIndexDiff)}% below avg
                      </div>
                    </td>
                  ))}
                </tr>
                
                {/* Lifestyle */}
                <tr className="bg-neutral-50 font-medium">
                  <td colSpan={locations.length + 1} className="px-6 py-3 text-sm sticky left-0 bg-neutral-50">
                    Lifestyle
                  </td>
                </tr>
                <tr>
                  <td className="px-6 py-3 text-sm sticky left-0 bg-white">Cost of Living</td>
                  {locations.map(location => (
                    <td key={location.id} className="px-6 py-3 text-sm">
                      <div className="font-medium">{location.costOfLiving}</div>
                      <div className={`text-xs ${
                        location.costOfLiving < 95 
                          ? 'text-[#2e8540]' 
                          : location.costOfLiving > 105 
                          ? 'text-[#d83933]' 
                          : 'text-[#ffbe2e]'
                      }`}>
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
                <tr className="bg-neutral-50 font-medium">
                  <td colSpan={locations.length + 1} className="px-6 py-3 text-sm sticky left-0 bg-neutral-50">
                    CBP Information
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
        {locations.some(loc => loc.externalData) && (
          <div className="mt-8">
            <div className="flex items-center space-x-2 mb-4">
              <Database className="h-4 w-4 text-[#005ea2]" />
              <h3 className="text-lg font-bold">Authentic Data from data.gov</h3>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {locations.map(location => (
                <div key={`data-${location.id}`} className="space-y-4">
                  <div className="border-b pb-2">
                    <Badge variant="outline" className="mb-1">{location.name}, {location.state}</Badge>
                    <h4 className="text-md font-medium">Official Data Sources</h4>
                  </div>
                  
                  {location.externalData ? (
                    <>
                      <ExternalDataDisplay 
                        externalData={location.externalData}
                        dataType="housing"
                        title="Housing Data"
                        description="Official housing statistics from data.gov"
                      />
                      
                      <ExternalDataDisplay 
                        externalData={location.externalData}
                        dataType="education"
                        title="Education Data"
                        description="Official education statistics from data.gov"
                      />
                      
                      <ExternalDataDisplay 
                        externalData={location.externalData}
                        dataType="safety"
                        title="Safety Data"
                        description="Official crime statistics from data.gov"
                      />
                    </>
                  ) : (
                    <div className="p-4 bg-gray-50 rounded-md text-center text-sm text-gray-500">
                      No official data available for this location
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Action Buttons */}
        <div className="mt-6 flex justify-end space-x-4">
          <button className="py-2 px-4 border border-neutral-200 hover:border-neutral-300 rounded transition-colors">
            <span className="material-icons text-sm mr-1 align-text-bottom">file_download</span>
            Export Comparison
          </button>
          <button className="py-2 px-4 bg-[#005ea2] hover:bg-[#00477b] text-white rounded transition-colors">
            <span className="material-icons text-sm mr-1 align-text-bottom">share</span>
            Share Comparison
          </button>
        </div>
      </div>
    </div>
  );
};

export default CompareView;
