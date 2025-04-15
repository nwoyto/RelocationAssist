/**
 * Data Service - Fetches authentic data from data.gov APIs
 */

// Housing data from data.gov (HUD datasets)
const HOUSING_DATA_ENDPOINT = 'https://www.huduser.gov/hudapi/public';

// Education data from data.gov (Department of Education datasets)
const EDUCATION_DATA_ENDPOINT = 'https://api.data.gov/ed/collegescorecard/v1';

// Crime data from data.gov (FBI Crime Data API)
const CRIME_DATA_ENDPOINT = 'https://api.usa.gov/crime/fbi/sapi';

/**
 * Fetches housing data for a location
 */
export async function fetchHousingData(state: string, city: string) {
  try {
    // Making request to HUD Fair Market Rents API
    const fmrEndpoint = `${HOUSING_DATA_ENDPOINT}/fmr?State=${encodeURIComponent(state)}&city=${encodeURIComponent(city)}`;
    
    const response = await fetch(fmrEndpoint);
    if (!response.ok) {
      console.error(`Failed to fetch housing data: ${response.statusText}`);
      return null;
    }
    
    const data = await response.json();
    return {
      source: 'data.gov - HUD Fair Market Rents',
      fetched: new Date().toISOString(),
      data
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
    // Making request to College Scorecard API
    const eduEndpoint = `${EDUCATION_DATA_ENDPOINT}/schools?school.state=${encodeURIComponent(state)}&school.city=${encodeURIComponent(city)}&per_page=100&fields=school.name,school.city,school.state,latest.student.size,latest.completion.rate_suppressed.overall`;
    
    const response = await fetch(eduEndpoint);
    if (!response.ok) {
      console.error(`Failed to fetch education data: ${response.statusText}`);
      return null;
    }
    
    const data = await response.json();
    return {
      source: 'data.gov - College Scorecard',
      fetched: new Date().toISOString(),
      data
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
    // Making request to FBI Crime Data API
    const crimeEndpoint = `${CRIME_DATA_ENDPOINT}/api/summarized/state/${encodeURIComponent(state)}/city/${encodeURIComponent(city)}/crime`;
    
    const response = await fetch(crimeEndpoint);
    if (!response.ok) {
      console.error(`Failed to fetch crime data: ${response.statusText}`);
      return null;
    }
    
    const data = await response.json();
    return {
      source: 'data.gov - FBI Crime Data',
      fetched: new Date().toISOString(),
      data
    };
  } catch (error) {
    console.error('Error fetching crime data:', error);
    return null;
  }
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