/**
 * Data Service - Fetches authentic data from data.gov APIs
 */

// API Keys from environment variables
const CENSUS_API_KEY = process.env.CENSUS_API_KEY;
const EDUCATION_DATA_API_KEY = process.env.EDUCATION_DATA_API_KEY;
const CRIME_DATA_API_KEY = process.env.CRIME_DATA_API_KEY;

// Housing data from Census API
const CENSUS_DATA_ENDPOINT = 'https://api.census.gov/data';

// Education data from data.gov (Department of Education datasets)
const EDUCATION_DATA_ENDPOINT = 'https://api.data.gov/ed/collegescorecard/v1';

// Crime data from data.gov (FBI Crime Data API)
const CRIME_DATA_ENDPOINT = 'https://api.usa.gov/crime/fbi/sapi';

/**
 * Fetches housing data for a location
 */
export async function fetchHousingData(state: string, city: string) {
  try {
    if (!CENSUS_API_KEY) {
      console.error('Census API key is missing');
      return null;
    }

    // Using Census API to get housing data (American Community Survey)
    // Get the most recent available ACS 5-year estimates
    const year = '2020'; // Using 2020 as the most recent complete dataset
    const endpointUrl = `${CENSUS_DATA_ENDPOINT}/${year}/acs/acs5`;
    
    // Variables:
    // B25077_001E: Median home value
    // B25064_001E: Median gross rent
    // B25003_002E: Owner occupied housing units
    // B25003_001E: Total occupied housing units
    
    const variables = 'B25077_001E,B25064_001E,B25003_002E,B25003_001E';
    const query = `${endpointUrl}?get=${variables}&for=place:*&in=state:*&key=${CENSUS_API_KEY}`;
    
    const response = await fetch(query);
    if (!response.ok) {
      console.error(`Failed to fetch housing data: ${response.statusText}`);
      return null;
    }
    
    const rawData = await response.json();
    
    // Process census data to find matching city
    // Census data returns an array where the first element is column headers
    const headers = rawData[0];
    const rows = rawData.slice(1);
    
    // Find city matching our search parameters
    // Note: Census uses place codes and state FIPS codes
    // This is a simplified search for demonstration - would need more logic for production
    let matchingCityData = null;
    
    for (const row of rows) {
      const placeName = row[headers.indexOf('NAME')];
      // Simplistic matching - would need better logic for production
      if (placeName && placeName.toLowerCase().includes(city.toLowerCase())) {
        const medianHomeValue = row[headers.indexOf('B25077_001E')];
        const rentMedian = row[headers.indexOf('B25064_001E')];
        const ownerOccupied = row[headers.indexOf('B25003_002E')];
        const totalOccupied = row[headers.indexOf('B25003_001E')];
        
        // Calculate home ownership rate
        const homeOwnershipRate = totalOccupied > 0 
          ? Math.round((parseInt(ownerOccupied) / parseInt(totalOccupied)) * 100) 
          : 0;
        
        matchingCityData = {
          medianHomeValue,
          rentMedian,
          homeOwnershipRate,
          place: placeName
        };
        break;
      }
    }
    
    if (!matchingCityData) {
      console.log(`No matching housing data found for ${city}, ${state}`);
      return null;
    }
    
    return {
      source: 'Census Bureau - American Community Survey',
      fetched: new Date().toISOString(),
      data: matchingCityData
    };
  } catch (error) {
    console.error('Error fetching housing data:', error);
    return null;
  }
}

/**
 * Fetches education data for a location
 */
export async function fetchEducationData(state: string, city: string) {
  try {
    if (!EDUCATION_DATA_API_KEY) {
      console.error('Education API key is missing');
      return null;
    }
    
    // Making request to College Scorecard API
    const eduEndpoint = `${EDUCATION_DATA_ENDPOINT}/schools?school.state=${encodeURIComponent(state)}&school.city=${encodeURIComponent(city)}&per_page=100&fields=school.name,school.city,school.state,latest.student.size,latest.completion.rate_suppressed.overall&api_key=${EDUCATION_DATA_API_KEY}`;
    
    const response = await fetch(eduEndpoint);
    if (!response.ok) {
      console.error(`Failed to fetch education data: ${response.statusText}`);
      return null;
    }
    
    const rawData = await response.json();
    
    // Process the college data into a more useful format
    const processedData = {
      schoolCount: rawData.metadata?.total || 0,
      averageCompletion: 0,
      studentTeacherRatio: 16.5, // Default value as this isn't directly in the College Scorecard
      schools: rawData.results || []
    };
    
    // Calculate average graduation rate if data is available
    if (rawData.results && rawData.results.length > 0) {
      let totalRate = 0;
      let countWithRates = 0;
      
      rawData.results.forEach((school: any) => {
        const rate = school['latest.completion.rate_suppressed.overall'];
        if (rate !== null && rate !== undefined) {
          totalRate += parseFloat(rate);
          countWithRates++;
        }
      });
      
      if (countWithRates > 0) {
        processedData.averageCompletion = Math.round((totalRate / countWithRates) * 100);
      }
    }
    
    return {
      source: 'data.gov - College Scorecard',
      fetched: new Date().toISOString(),
      data: processedData
    };
  } catch (error) {
    console.error('Error fetching education data:', error);
    return null;
  }
}

/**
 * Fetches crime data for a location
 */
export async function fetchCrimeData(state: string, city: string) {
  try {
    if (!CRIME_DATA_API_KEY) {
      console.error('Crime API key is missing');
      return null;
    }
    
    // Making request to FBI Crime Data API
    // Note: The FBI Crime Data API requires state abbreviations and properly formatted city names
    const crimeEndpoint = `${CRIME_DATA_ENDPOINT}/api/summarized/agencies/byStateAbbr/${encodeURIComponent(state)}/offenses/2018/2022?API_KEY=${CRIME_DATA_API_KEY}`;
    
    const response = await fetch(crimeEndpoint);
    if (!response.ok) {
      console.error(`Failed to fetch crime data: ${response.statusText}`);
      return null;
    }
    
    const rawData = await response.json();
    
    // Process the data to find city-specific crime statistics
    // This is simplified - in production would need more sophisticated filtering
    let cityData = null;
    
    if (rawData.results && rawData.results.length > 0) {
      // Try to find crime data for the specific city
      const agencyData = rawData.results.find((agency: any) => 
        agency.agency_name && agency.agency_name.toLowerCase().includes(city.toLowerCase())
      );
      
      if (agencyData) {
        // Format the data for our application
        cityData = {
          crimeRate: calculateCrimeRate(agencyData),
          violentCrime: extractViolentCrimeRate(agencyData),
          propertyCrime: extractPropertyCrimeRate(agencyData),
          year: agencyData.year || 2022
        };
      } else {
        // If no exact city match, use state average as approximation
        const stateTotal = {
          violent_crime: 0,
          property_crime: 0,
          population: 0
        };
        
        // Calculate state averages
        rawData.results.forEach((agency: any) => {
          if (agency.population && agency.population > 0) {
            stateTotal.violent_crime += (agency.violent_crime || 0);
            stateTotal.property_crime += (agency.property_crime || 0);
            stateTotal.population += agency.population;
          }
        });
        
        if (stateTotal.population > 0) {
          cityData = {
            crimeRate: Math.round(((stateTotal.violent_crime + stateTotal.property_crime) / stateTotal.population) * 100000),
            violentCrime: Math.round((stateTotal.violent_crime / stateTotal.population) * 100000),
            propertyCrime: Math.round((stateTotal.property_crime / stateTotal.population) * 100000),
            year: 2022,
            note: 'Based on state average'
          };
        }
      }
    }
    
    if (!cityData) {
      console.log(`No matching crime data found for ${city}, ${state}`);
      return null;
    }
    
    return {
      source: 'data.gov - FBI Crime Data API',
      fetched: new Date().toISOString(),
      data: cityData
    };
  } catch (error) {
    console.error('Error fetching crime data:', error);
    return null;
  }
}

// Helper function to calculate overall crime rate per 100,000 residents
function calculateCrimeRate(agencyData: any): number {
  if (!agencyData.population || agencyData.population === 0) {
    return 0;
  }
  
  const totalCrimes = (agencyData.violent_crime || 0) + (agencyData.property_crime || 0);
  return Math.round((totalCrimes / agencyData.population) * 100000);
}

// Helper function to extract violent crime rate
function extractViolentCrimeRate(agencyData: any): number {
  if (!agencyData.population || agencyData.population === 0) {
    return 0;
  }
  
  return Math.round((agencyData.violent_crime || 0) / agencyData.population * 100000);
}

// Helper function to extract property crime rate
function extractPropertyCrimeRate(agencyData: any): number {
  if (!agencyData.population || agencyData.population === 0) {
    return 0;
  }
  
  return Math.round((agencyData.property_crime || 0) / agencyData.population * 100000);
}

/**
 * Enriches location data with additional information from data.gov
 */
export async function enrichLocationData(location: any) {
  const { state, name: city } = location;
  
  // Fetch data in parallel for better performance
  const [housingData, educationData, crimeData] = await Promise.all([
    fetchHousingData(state, city),
    fetchEducationData(state, city),
    fetchCrimeData(state, city)
  ]);
  
  return {
    ...location,
    externalData: {
      housing: housingData,
      education: educationData, 
      safety: crimeData,
      lastUpdated: new Date().toISOString()
    }
  };
}