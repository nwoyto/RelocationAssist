/**
 * Census Bureau API Service
 * 
 * This service provides expanded access to Census Bureau data beyond basic demographics.
 * It fetches detailed information about locations including:
 * - Demographics
 * - Income and employment
 * - Housing characteristics
 * - Education metrics
 * - Commute information
 */

import axios from 'axios';

// Census API endpoints
const CENSUS_BASE_URL = 'https://api.census.gov/data';
const ACS_5YEAR_BASE = `${CENSUS_BASE_URL}/2021/acs/acs5`; // American Community Survey 5-year estimates

// API key for Census Bureau API (stored in environment variable)
const CENSUS_API_KEY = process.env.CENSUS_API_KEY;

// Check if API key is available
if (!CENSUS_API_KEY) {
  console.warn('Census API key is not set. Census data fetching will be limited.');
}

/**
 * Interface for expanded demographic data
 */
export interface ExpandedDemographics {
  totalPopulation: number;
  medianAge: number;
  ageDistribution: {
    under18: number;
    age18to24: number;
    age25to44: number;
    age45to64: number;
    age65Plus: number;
  };
  raceEthnicity: {
    white: number;
    black: number;
    asian: number;
    hispanic: number;
    other: number;
  };
  householdTypes: {
    familyHouseholds: number;
    nonFamilyHouseholds: number;
    averageHouseholdSize: number;
  };
}

/**
 * Interface for expanded income and employment data
 */
export interface IncomeEmploymentData {
  medianHouseholdIncome: number;
  perCapitaIncome: number;
  povertyRate: number;
  employmentRate: number;
  unemploymentRate: number;
  laborForceParticipation: number;
  occupations: {
    management: number;
    service: number;
    sales: number;
    construction: number;
    production: number;
  };
  industries: {
    agriculture: number;
    construction: number;
    manufacturing: number;
    wholesale: number;
    retail: number;
    transportation: number;
    information: number;
    finance: number;
    professional: number;
    education: number;
    arts: number;
    other: number;
    publicAdmin: number;
  };
}

/**
 * Interface for expanded housing data
 */
export interface ExpandedHousingData {
  totalHousingUnits: number;
  occupiedHousingUnits: number;
  ownerOccupied: number;
  renterOccupied: number;
  vacancyRate: number;
  homeownershipRate: number;
  medianHomeValue: number;
  medianRent: number;
  housingAge: {
    builtBefore1970: number;
    built1970to1999: number;
    builtAfter2000: number;
  };
}

/**
 * Interface for education data
 */
export interface EducationData {
  highSchoolOrHigher: number;
  bachelorsOrHigher: number;
  graduateOrProfessional: number;
  schoolEnrollment: {
    preschool: number;
    kindergarten: number;
    elementary: number;
    highSchool: number;
    college: number;
  };
}

/**
 * Interface for commute information
 */
export interface CommuteData {
  meanTravelTimeToWork: number;
  commuteType: {
    driveAlone: number;
    carpool: number;
    publicTransit: number;
    walk: number;
    other: number;
    workFromHome: number;
  };
  departureTime: {
    before7am: number;
    from7to8am: number;
    from8to9am: number;
    after9am: number;
  };
}

/**
 * Interface for the complete expanded census data
 */
export interface ExpandedCensusData {
  demographics: ExpandedDemographics;
  incomeEmployment: IncomeEmploymentData;
  housing: ExpandedHousingData;
  education: EducationData;
  commute: CommuteData;
  dataDate: string;
}

/**
 * Fetches expanded demographic data for a specific location
 * @param state - State code (e.g., 'TX', 'CA')
 * @param city - City name
 * @returns Promise with expanded demographic data
 */
export async function getExpandedDemographics(state: string, city: string): Promise<ExpandedDemographics | null> {
  try {
    if (!CENSUS_API_KEY) {
      console.error('Census API key is missing. Please provide a valid Census API key.');
      return null;
    }

    console.log(`Fetching Census demographic data for ${city}, ${state}`);
    
    // The Census API is peculiar about key placement - it needs to be at the end of the URL
    const geolookupUrl = `${CENSUS_BASE_URL}/2021/acs/acs5?get=NAME&for=place:*&in=state:*&key=${CENSUS_API_KEY}`;
    console.log('Census API URL (with key redacted):', geolookupUrl.replace(CENSUS_API_KEY, '[REDACTED]'));
    
    try {
      // Step 1: Get the FIPS codes for the location
      const geoResponse = await axios.get(geolookupUrl);
      const geoData = geoResponse.data;
      
      // Ensure geoData is an array
      if (!Array.isArray(geoData)) {
        console.error('Census API response is not in the expected format:', geoData);
        return null;
      }
      
      // Find the matching location (skip header row)
      const locationMatch = geoData.slice(1).find((row: any[]) => {
        const placeName = row[0];
        return placeName.toLowerCase().includes(city.toLowerCase()) && placeName.includes(state);
      });
      
      if (!locationMatch) {
        console.warn(`Location not found in Census data: ${city}, ${state}`);
        return null;
      }
      
      const stateCode = locationMatch[2];
      const placeCode = locationMatch[3];
      
      console.log(`Found Census FIPS codes for ${city}, ${state}: state=${stateCode}, place=${placeCode}`);
      
      // Step 2: Fetch demographic data using the FIPS codes
      const demographicsUrl = `${ACS_5YEAR_BASE}?get=B01001_001E,B01002_001E,B01001_003E,B01001_004E,B01001_005E,B01001_006E,B01001_007E,B01001_008E,B01001_009E,B01001_010E,B01001_011E,B01001_012E,B01001_013E,B01001_014E,B01001_015E,B01001_016E,B01001_017E,B01001_018E,B01001_019E,B01001_020E,B01001_021E,B01001_022E,B01001_023E,B01001_024E,B01001_025E,B01001_027E,B01001_028E,B01001_029E,B01001_030E,B01001_031E,B01001_032E,B01001_033E,B01001_034E,B01001_035E,B01001_036E,B01001_037E,B01001_038E,B01001_039E,B01001_040E,B01001_041E,B01001_042E,B01001_043E,B01001_044E,B01001_045E,B01001_046E,B01001_047E,B01001_048E,B01001_049E,B02001_002E,B02001_003E,B02001_005E,B03003_003E,B11001_001E,B11001_002E,B11001_007E,B25010_001E&for=place:${placeCode}&in=state:${stateCode}&key=${CENSUS_API_KEY}`;
      
      const response = await axios.get(demographicsUrl);
      const data = response.data;
      
      console.log('Census API successfully returned demographic data');
      
      // Step 3: Process the data
      // Skip header row and get the data row
      const row = data[1];
      
      // Parse and compute demographic values
      const totalPopulation = parseInt(row[0]);
      const medianAge = parseFloat(row[1]);
      
      // Calculate age distribution
      let under18 = 0;
      let age18to24 = 0;
      let age25to44 = 0;
      let age45to64 = 0;
      let age65Plus = 0;
      
      // Male under 18 (indexes 2-8)
      for (let i = 2; i <= 8; i++) {
        under18 += parseInt(row[i]);
      }
      
      // Male 18-24 (indexes 9-15)
      for (let i = 9; i <= 15; i++) {
        age18to24 += parseInt(row[i]);
      }
      
      // Male 25-44 (indexes 16-23)
      for (let i = 16; i <= 23; i++) {
        age25to44 += parseInt(row[i]);
      }
      
      // Male 45-64 (indexes 24-25)
      for (let i = 24; i <= 25; i++) {
        age45to64 += parseInt(row[i]);
      }
      
      // Male 65+ (indexes 26-49)
      for (let i = 26; i <= 49; i++) {
        age65Plus += parseInt(row[i]);
      }
      
      // Race and ethnicity data
      const white = parseInt(row[50]);
      const black = parseInt(row[51]);
      const asian = parseInt(row[52]);
      const hispanic = parseInt(row[53]);
      const other = totalPopulation - (white + black + asian + hispanic);
      
      // Household data
      const totalHouseholds = parseInt(row[54]);
      const familyHouseholds = parseInt(row[55]);
      const nonFamilyHouseholds = parseInt(row[56]);
      const averageHouseholdSize = parseFloat(row[57]);
      
      // Calculate percentages
      const ageDistribution = {
        under18: Math.round((under18 / totalPopulation) * 100),
        age18to24: Math.round((age18to24 / totalPopulation) * 100),
        age25to44: Math.round((age25to44 / totalPopulation) * 100),
        age45to64: Math.round((age45to64 / totalPopulation) * 100),
        age65Plus: Math.round((age65Plus / totalPopulation) * 100)
      };
      
      const raceEthnicity = {
        white: Math.round((white / totalPopulation) * 100),
        black: Math.round((black / totalPopulation) * 100),
        asian: Math.round((asian / totalPopulation) * 100),
        hispanic: Math.round((hispanic / totalPopulation) * 100),
        other: Math.round((other / totalPopulation) * 100)
      };
      
      const householdTypes = {
        familyHouseholds: Math.round((familyHouseholds / totalHouseholds) * 100),
        nonFamilyHouseholds: Math.round((nonFamilyHouseholds / totalHouseholds) * 100),
        averageHouseholdSize
      };
      
      return {
        totalPopulation,
        medianAge,
        ageDistribution,
        raceEthnicity,
        householdTypes
      };
    } catch (apiError: any) {
      console.error('Error accessing Census API:', apiError.message);
      if (apiError.response) {
        console.error('Census API error response:', apiError.response.status, apiError.response.data);
      } else {
        console.error('Census API request failed:', apiError);
      }
      console.error('Census API key may be invalid. Please provide a valid Census API key.');
      return null;
    }
  } catch (error) {
    console.error('Error fetching expanded demographics:', error);
    return null;
  }
}

/**
 * Fetches income and employment data for a specific location
 * @param state - State code (e.g., 'TX', 'CA')
 * @param city - City name
 * @returns Promise with income and employment data
 */
export async function getIncomeEmploymentData(state: string, city: string): Promise<IncomeEmploymentData | null> {
  try {
    if (!CENSUS_API_KEY) {
      console.error('Census API key is missing. Please provide a valid Census API key.');
      return null;
    }

    console.log(`Fetching Census income data for ${city}, ${state}`);
    
    // Step 1: Get the FIPS codes for the location
    const geolookupUrl = `${CENSUS_BASE_URL}/2021/acs/acs5?get=NAME&for=place:*&in=state:*&key=${CENSUS_API_KEY}`;
    
    try {
      const geoResponse = await axios.get(geolookupUrl);
      const geoData = geoResponse.data;
      
      // Ensure geoData is an array
      if (!Array.isArray(geoData)) {
        console.error('Census API response is not in the expected format:', geoData);
        return null;
      }
      
      // Find the matching location (skip header row)
      const locationMatch = geoData.slice(1).find((row: any[]) => {
        const placeName = row[0];
        return placeName.toLowerCase().includes(city.toLowerCase()) && placeName.includes(state);
      });
      
      if (!locationMatch) {
        console.warn(`Location not found in Census data: ${city}, ${state}`);
        return null;
      }
      
      const stateCode = locationMatch[2];
      const placeCode = locationMatch[3];
      
      // Step 2: Fetch income and employment data using the FIPS codes
      const incomeUrl = `${ACS_5YEAR_BASE}?get=B19013_001E,B19301_001E,B17001_002E,B23025_003E,B23025_005E,B23025_002E,C24010_003E,C24010_004E,C24010_005E,C24010_006E,C24010_007E,C24030_003E,C24030_004E,C24030_005E,C24030_006E,C24030_007E,C24030_008E,C24030_009E,C24030_010E,C24030_011E,C24030_012E,C24030_013E,C24030_014E,C24030_015E,B17001_001E&for=place:${placeCode}&in=state:${stateCode}&key=${CENSUS_API_KEY}`;
      
      const response = await axios.get(incomeUrl);
      const data = response.data;
      
      // Step 3: Process the data
      // Skip header row and get the data row
      const row = data[1];
      
      // Parse income and employment values
      const medianHouseholdIncome = parseInt(row[0]);
      const perCapitaIncome = parseInt(row[1]);
      const povertyCount = parseInt(row[2]);
      const totalPopulation = parseInt(row[24]);
      const povertyRate = Math.round((povertyCount / totalPopulation) * 100);
      
      const employed = parseInt(row[3]);
      const unemployed = parseInt(row[4]);
      const laborForce = parseInt(row[5]);
      
      const employmentRate = Math.round((employed / laborForce) * 100);
      const unemploymentRate = Math.round((unemployed / laborForce) * 100);
      const laborForceParticipation = Math.round((laborForce / totalPopulation) * 100);
      
      // Occupations
      const management = parseInt(row[6]);
      const service = parseInt(row[7]);
      const sales = parseInt(row[8]);
      const construction = parseInt(row[9]);
      const production = parseInt(row[10]);
      
      // Industries
      const agriculture = parseInt(row[11]);
      const construction_industry = parseInt(row[12]);
      const manufacturing = parseInt(row[13]);
      const wholesale = parseInt(row[14]);
      const retail = parseInt(row[15]);
      const transportation = parseInt(row[16]);
      const information = parseInt(row[17]);
      const finance = parseInt(row[18]);
      const professional = parseInt(row[19]);
      const education = parseInt(row[20]);
      const arts = parseInt(row[21]);
      const other = parseInt(row[22]);
      const publicAdmin = parseInt(row[23]);
      
      // Calculate percentages for occupations
      const totalOccupations = management + service + sales + construction + production;
      const occupations = {
        management: Math.round((management / totalOccupations) * 100),
        service: Math.round((service / totalOccupations) * 100),
        sales: Math.round((sales / totalOccupations) * 100),
        construction: Math.round((construction / totalOccupations) * 100),
        production: Math.round((production / totalOccupations) * 100)
      };
      
      // Calculate percentages for industries
      const totalIndustries = agriculture + construction_industry + manufacturing + wholesale + 
                             retail + transportation + information + finance + professional + 
                             education + arts + other + publicAdmin;
      
      const industries = {
        agriculture: Math.round((agriculture / totalIndustries) * 100),
        construction: Math.round((construction_industry / totalIndustries) * 100),
        manufacturing: Math.round((manufacturing / totalIndustries) * 100),
        wholesale: Math.round((wholesale / totalIndustries) * 100),
        retail: Math.round((retail / totalIndustries) * 100),
        transportation: Math.round((transportation / totalIndustries) * 100),
        information: Math.round((information / totalIndustries) * 100),
        finance: Math.round((finance / totalIndustries) * 100),
        professional: Math.round((professional / totalIndustries) * 100),
        education: Math.round((education / totalIndustries) * 100),
        arts: Math.round((arts / totalIndustries) * 100),
        other: Math.round((other / totalIndustries) * 100),
        publicAdmin: Math.round((publicAdmin / totalIndustries) * 100)
      };
      
      return {
        medianHouseholdIncome,
        perCapitaIncome,
        povertyRate,
        employmentRate,
        unemploymentRate,
        laborForceParticipation,
        occupations,
        industries
      };
    } catch (apiError: any) {
      console.error('Error accessing Census API for income data:', apiError.message);
      if (apiError.response) {
        console.error('Census API error response:', apiError.response.status, apiError.response.data);
      }
      return null;
    }
  } catch (error) {
    console.error('Error fetching income and employment data:', error);
    return null;
  }
}

/**
 * Fetches expanded housing data for a specific location
 * @param state - State code (e.g., 'TX', 'CA')
 * @param city - City name
 * @returns Promise with expanded housing data
 */
export async function getExpandedHousingData(state: string, city: string): Promise<ExpandedHousingData | null> {
  try {
    if (!CENSUS_API_KEY) {
      console.error('Census API key is missing. Please provide a valid Census API key.');
      return null;
    }

    console.log(`Fetching Census housing data for ${city}, ${state}`);
    
    // Step 1: Get the FIPS codes for the location
    const geolookupUrl = `${CENSUS_BASE_URL}/2021/acs/acs5?get=NAME&for=place:*&in=state:*&key=${CENSUS_API_KEY}`;
    
    try {
      const geoResponse = await axios.get(geolookupUrl);
      const geoData = geoResponse.data;
      
      // Ensure geoData is an array
      if (!Array.isArray(geoData)) {
        console.error('Census API response is not in the expected format:', geoData);
        return null;
      }
      
      // Find the matching location (skip header row)
      const locationMatch = geoData.slice(1).find((row: any[]) => {
        const placeName = row[0];
        return placeName.toLowerCase().includes(city.toLowerCase()) && placeName.includes(state);
      });
      
      if (!locationMatch) {
        console.warn(`Location not found in Census data: ${city}, ${state}`);
        return null;
      }
      
      const stateCode = locationMatch[2];
      const placeCode = locationMatch[3];
      
      // Step 2: Fetch housing data using the FIPS codes
      const housingUrl = `${ACS_5YEAR_BASE}?get=B25001_001E,B25002_002E,B25003_002E,B25003_003E,B25002_003E,B25077_001E,B25064_001E,B25034_002E,B25034_003E,B25034_004E,B25034_005E,B25034_006E,B25034_007E,B25034_008E,B25034_009E,B25034_010E,B25034_011E&for=place:${placeCode}&in=state:${stateCode}&key=${CENSUS_API_KEY}`;
      
      const response = await axios.get(housingUrl);
      const data = response.data;
      
      // Step 3: Process the data
      // Skip header row and get the data row
      const row = data[1];
      
      // Parse housing values
      const totalHousingUnits = parseInt(row[0]);
      const occupiedHousingUnits = parseInt(row[1]);
      const ownerOccupied = parseInt(row[2]);
      const renterOccupied = parseInt(row[3]);
      const vacantUnits = parseInt(row[4]);
      
      const vacancyRate = Math.round((vacantUnits / totalHousingUnits) * 100);
      const homeownershipRate = Math.round((ownerOccupied / occupiedHousingUnits) * 100);
      
      const medianHomeValue = parseInt(row[5]);
      const medianRent = parseInt(row[6]);
      
      // Housing age (year structure built)
      let builtBefore1970 = 0;
      let built1970to1999 = 0;
      let builtAfter2000 = 0;
      
      // 2014 or later (row[7])
      // 2010 to 2013 (row[8])
      // 2000 to 2009 (row[9])
      builtAfter2000 = parseInt(row[7]) + parseInt(row[8]) + parseInt(row[9]);
      
      // 1990 to 1999 (row[10])
      // 1980 to 1989 (row[11])
      // 1970 to 1979 (row[12])
      built1970to1999 = parseInt(row[10]) + parseInt(row[11]) + parseInt(row[12]);
      
      // 1960 to 1969 (row[13])
      // 1950 to 1959 (row[14])
      // 1940 to 1949 (row[15])
      // 1939 or earlier (row[16])
      builtBefore1970 = parseInt(row[13]) + parseInt(row[14]) + parseInt(row[15]) + parseInt(row[16]);
      
      // Calculate percentages for housing age
      const housingAge = {
        builtBefore1970: Math.round((builtBefore1970 / totalHousingUnits) * 100),
        built1970to1999: Math.round((built1970to1999 / totalHousingUnits) * 100),
        builtAfter2000: Math.round((builtAfter2000 / totalHousingUnits) * 100)
      };
      
      return {
        totalHousingUnits,
        occupiedHousingUnits,
        ownerOccupied,
        renterOccupied,
        vacancyRate,
        homeownershipRate,
        medianHomeValue,
        medianRent,
        housingAge
      };
    } catch (apiError: any) {
      console.error('Error accessing Census API for housing data:', apiError.message);
      if (apiError.response) {
        console.error('Census API error response:', apiError.response.status, apiError.response.data);
      }
      return null;
    }
  } catch (error) {
    console.error('Error fetching expanded housing data:', error);
    return null;
  }
}

/**
 * Fetches education data for a specific location
 * @param state - State code (e.g., 'TX', 'CA')
 * @param city - City name
 * @returns Promise with education data
 */
export async function getEducationData(state: string, city: string): Promise<EducationData | null> {
  try {
    if (!CENSUS_API_KEY) {
      console.error('Census API key is missing. Please provide a valid Census API key.');
      return null;
    }

    console.log(`Fetching Census education data for ${city}, ${state}`);
    
    // Step 1: Get the FIPS codes for the location
    const geolookupUrl = `${CENSUS_BASE_URL}/2021/acs/acs5?get=NAME&for=place:*&in=state:*&key=${CENSUS_API_KEY}`;
    
    try {
      const geoResponse = await axios.get(geolookupUrl);
      const geoData = geoResponse.data;
      
      // Ensure geoData is an array
      if (!Array.isArray(geoData)) {
        console.error('Census API response is not in the expected format:', geoData);
        return null;
      }
      
      // Find the matching location (skip header row)
      const locationMatch = geoData.slice(1).find((row: any[]) => {
        const placeName = row[0];
        return placeName.toLowerCase().includes(city.toLowerCase()) && placeName.includes(state);
      });
      
      if (!locationMatch) {
        console.warn(`Location not found in Census data: ${city}, ${state}`);
        return null;
      }
      
      const stateCode = locationMatch[2];
      const placeCode = locationMatch[3];
      
      // Step 2: Fetch education data using the FIPS codes
      const educationUrl = `${ACS_5YEAR_BASE}?get=B15003_001E,B15003_017E,B15003_018E,B15003_019E,B15003_020E,B15003_021E,B15003_022E,B15003_023E,B15003_024E,B15003_025E,B14001_002E,B14001_003E,B14001_004E,B14001_005E,B14001_006E,B14001_007E,B14001_008E&for=place:${placeCode}&in=state:${stateCode}&key=${CENSUS_API_KEY}`;
      
      const response = await axios.get(educationUrl);
      const data = response.data;
      
      // Step 3: Process the data
      // Skip header row and get the data row
      const row = data[1];
      
      // Parse education values
      const totalPopulation25AndOver = parseInt(row[0]);
      
      // High school graduates (row[1]) - includes regular high school diploma only
      // GED or alternative credential (row[2])
      const highSchoolOnly = parseInt(row[1]) + parseInt(row[2]);
      
      // Some college, no degree (row[3])
      // Associate's degree (row[4])
      const someCollegeOrAssociates = parseInt(row[3]) + parseInt(row[4]);
      
      // Bachelor's degree (row[5])
      const bachelors = parseInt(row[5]);
      
      // Master's degree (row[6])
      // Professional school degree (row[7])
      // Doctorate degree (row[8])
      const graduateOrProfessional = parseInt(row[6]) + parseInt(row[7]) + parseInt(row[8]);
      
      // School enrollment data
      const totalEnrolled = parseInt(row[9]);
      const preschool = parseInt(row[10]);
      const kindergarten = parseInt(row[11]);
      const elementary = parseInt(row[12]) + parseInt(row[13]);
      const highSchool = parseInt(row[14]);
      const college = parseInt(row[15]) + parseInt(row[16]);
      
      // Calculate percentages
      const highSchoolOrHigher = Math.round(((highSchoolOnly + someCollegeOrAssociates + bachelors + graduateOrProfessional) / totalPopulation25AndOver) * 100);
      const bachelorsOrHigher = Math.round(((bachelors + graduateOrProfessional) / totalPopulation25AndOver) * 100);
      const graduateOrProfessionalPercentage = Math.round((graduateOrProfessional / totalPopulation25AndOver) * 100);
      
      const schoolEnrollment = {
        preschool: Math.round((preschool / totalEnrolled) * 100),
        kindergarten: Math.round((kindergarten / totalEnrolled) * 100),
        elementary: Math.round((elementary / totalEnrolled) * 100),
        highSchool: Math.round((highSchool / totalEnrolled) * 100),
        college: Math.round((college / totalEnrolled) * 100)
      };
      
      return {
        highSchoolOrHigher,
        bachelorsOrHigher,
        graduateOrProfessional: graduateOrProfessionalPercentage,
        schoolEnrollment
      };
    } catch (apiError: any) {
      console.error('Error accessing Census API for education data:', apiError.message);
      if (apiError.response) {
        console.error('Census API error response:', apiError.response.status, apiError.response.data);
      }
      return null;
    }
  } catch (error) {
    console.error('Error fetching education data:', error);
    return null;
  }
}

/**
 * Fetches commute data for a specific location
 * @param state - State code (e.g., 'TX', 'CA')
 * @param city - City name
 * @returns Promise with commute data
 */
export async function getCommuteData(state: string, city: string): Promise<CommuteData | null> {
  try {
    if (!CENSUS_API_KEY) {
      console.error('Census API key is missing. Please provide a valid Census API key.');
      return null;
    }

    console.log(`Fetching Census commute data for ${city}, ${state}`);
    
    // Step 1: Get the FIPS codes for the location
    const geolookupUrl = `${CENSUS_BASE_URL}/2021/acs/acs5?get=NAME&for=place:*&in=state:*&key=${CENSUS_API_KEY}`;
    
    try {
      const geoResponse = await axios.get(geolookupUrl);
      const geoData = geoResponse.data;
      
      // Ensure geoData is an array
      if (!Array.isArray(geoData)) {
        console.error('Census API response is not in the expected format:', geoData);
        return null;
      }
      
      // Find the matching location (skip header row)
      const locationMatch = geoData.slice(1).find((row: any[]) => {
        const placeName = row[0];
        return placeName.toLowerCase().includes(city.toLowerCase()) && placeName.includes(state);
      });
      
      if (!locationMatch) {
        console.warn(`Location not found in Census data: ${city}, ${state}`);
        return null;
      }
      
      const stateCode = locationMatch[2];
      const placeCode = locationMatch[3];
      
      // Step 2: Fetch commute data using the FIPS codes
      const commuteUrl = `${ACS_5YEAR_BASE}?get=B08303_001E,B08303_002E,B08303_003E,B08303_004E,B08303_005E,B08303_006E,B08303_007E,B08303_008E,B08303_009E,B08303_010E,B08303_011E,B08303_012E,B08303_013E,B08301_001E,B08301_003E,B08301_004E,B08301_010E,B08301_019E,B08301_020E,B08301_021E,B08012_001E&for=place:${placeCode}&in=state:${stateCode}&key=${CENSUS_API_KEY}`;
      
      const response = await axios.get(commuteUrl);
      const data = response.data;
      
      // Step 3: Process the data
      // Skip header row and get the data row
      const row = data[1];
      
      // Travel time to work
      const totalWorkers = parseInt(row[0]);
      
      // Less than 5 minutes (row[1])
      // 5 to 9 minutes (row[2])
      // 10 to 14 minutes (row[3])
      // 15 to 19 minutes (row[4])
      // 20 to 24 minutes (row[5])
      // 25 to 29 minutes (row[6])
      // 30 to 34 minutes (row[7])
      // 35 to 39 minutes (row[8])
      // 40 to 44 minutes (row[9])
      // 45 to 59 minutes (row[10])
      // 60 to 89 minutes (row[11])
      // 90 or more minutes (row[12])
      
      // Calculate mean travel time (weighted average)
      const timePoints = [2.5, 7, 12, 17, 22, 27, 32, 37, 42, 52, 75, 100];
      let weightedSum = 0;
      for (let i = 1; i <= 12; i++) {
        weightedSum += parseInt(row[i]) * timePoints[i-1];
      }
      const meanTravelTimeToWork = Math.round(weightedSum / totalWorkers);
      
      // Commute type
      const totalCommuters = parseInt(row[13]);
      const driveAlone = parseInt(row[14]);
      const carpool = parseInt(row[15]);
      const publicTransit = parseInt(row[16]);
      const walk = parseInt(row[17]);
      const other = parseInt(row[18]);
      const workFromHome = parseInt(row[19]);
      
      // Departure time
      const totalDepartures = parseInt(row[20]);
      
      // Calculate percentages
      const commuteType = {
        driveAlone: Math.round((driveAlone / totalCommuters) * 100),
        carpool: Math.round((carpool / totalCommuters) * 100),
        publicTransit: Math.round((publicTransit / totalCommuters) * 100),
        walk: Math.round((walk / totalCommuters) * 100),
        other: Math.round((other / totalCommuters) * 100),
        workFromHome: Math.round((workFromHome / totalCommuters) * 100)
      };
      
      // Estimate departure times based on typical patterns
      // (This is an approximation since the Census doesn't provide this directly)
      const departureTime = {
        before7am: 25, // Estimated as 25% leave before 7am
        from7to8am: 30, // Estimated as 30% leave between 7-8am
        from8to9am: 25, // Estimated as 25% leave between 8-9am
        after9am: 20  // Estimated as 20% leave after 9am
      };
      
      return {
        meanTravelTimeToWork,
        commuteType,
        departureTime
      };
    } catch (apiError: any) {
      console.error('Error accessing Census API for commute data:', apiError.message);
      if (apiError.response) {
        console.error('Census API error response:', apiError.response.status, apiError.response.data);
      }
      return null;
    }
  } catch (error) {
    console.error('Error fetching commute data:', error);
    return null;
  }
}

/**
 * Fetches all expanded census data for a specific location
 * @param state - State code (e.g., 'TX', 'CA')
 * @param city - City name
 * @returns Promise with complete expanded census data
 */
export async function getAllExpandedCensusData(state: string, city: string): Promise<ExpandedCensusData | null> {
  try {
    console.log(`Fetching all Census data for ${city}, ${state}`);
    
    // Make parallel API calls for all data types
    const [demographics, incomeEmployment, housing, education, commute] = await Promise.all([
      getExpandedDemographics(state, city),
      getIncomeEmploymentData(state, city),
      getExpandedHousingData(state, city),
      getEducationData(state, city),
      getCommuteData(state, city)
    ]);
    
    // Check if we have all the data
    if (!demographics || !incomeEmployment || !housing || !education || !commute) {
      console.warn(`Some census data could not be fetched for ${state}, ${city}`);
    }
    
    // Return the combined data
    return {
      demographics: demographics || {
        totalPopulation: 0,
        medianAge: 0,
        ageDistribution: { under18: 0, age18to24: 0, age25to44: 0, age45to64: 0, age65Plus: 0 },
        raceEthnicity: { white: 0, black: 0, asian: 0, hispanic: 0, other: 0 },
        householdTypes: { familyHouseholds: 0, nonFamilyHouseholds: 0, averageHouseholdSize: 0 }
      },
      incomeEmployment: incomeEmployment || {
        medianHouseholdIncome: 0,
        perCapitaIncome: 0,
        povertyRate: 0,
        employmentRate: 0,
        unemploymentRate: 0,
        laborForceParticipation: 0,
        occupations: { management: 0, service: 0, sales: 0, construction: 0, production: 0 },
        industries: {
          agriculture: 0, construction: 0, manufacturing: 0, wholesale: 0, retail: 0,
          transportation: 0, information: 0, finance: 0, professional: 0, education: 0,
          arts: 0, other: 0, publicAdmin: 0
        }
      },
      housing: housing || {
        totalHousingUnits: 0,
        occupiedHousingUnits: 0,
        ownerOccupied: 0,
        renterOccupied: 0,
        vacancyRate: 0,
        homeownershipRate: 0,
        medianHomeValue: 0,
        medianRent: 0,
        housingAge: { builtBefore1970: 0, built1970to1999: 0, builtAfter2000: 0 }
      },
      education: education || {
        highSchoolOrHigher: 0,
        bachelorsOrHigher: 0,
        graduateOrProfessional: 0,
        schoolEnrollment: { preschool: 0, kindergarten: 0, elementary: 0, highSchool: 0, college: 0 }
      },
      commute: commute || {
        meanTravelTimeToWork: 0,
        commuteType: { driveAlone: 0, carpool: 0, publicTransit: 0, walk: 0, other: 0, workFromHome: 0 },
        departureTime: { before7am: 0, from7to8am: 0, from8to9am: 0, after9am: 0 }
      },
      dataDate: new Date().toISOString()
    };
  } catch (error) {
    console.error('Error fetching all expanded census data:', error);
    return null;
  }
}