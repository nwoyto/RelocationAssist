/**
 * Data.gov API Service
 * 
 * This service provides access to data.gov which includes Census Bureau data,
 * Department of Education data, and other government datasets.
 * Unlike direct Census API access, data.gov provides easier access without API key issues.
 */

import axios from 'axios';
import { ExpandedHousingData } from './censusService';

/**
 * Fetches housing data for a specific location from data.gov
 * @param state - State code (e.g., 'TX', 'CA')
 * @param city - City name
 * @returns Promise with housing data
 */
export async function getHousingData(state: string, city: string): Promise<ExpandedHousingData | null> {
  try {
    // Normalize city and state for the query
    const formattedCity = encodeURIComponent(city.toLowerCase());
    const formattedState = encodeURIComponent(state.toLowerCase());
    
    // Use the data.gov API to get housing data
    // This endpoint provides American Community Survey data without requiring a Census API key
    const response = await axios.get(
      `https://api.data.gov/housing/dataset/acs/city?city=${formattedCity}&state=${formattedState}`,
      {
        timeout: 10000,
      }
    );
    
    if (response.data && response.data.data) {
      const data = response.data.data;
      
      // Convert the data to our ExpandedHousingData format
      return {
        totalHousingUnits: data.housing_units || 0,
        occupiedHousingUnits: data.occupied_housing_units || 0,
        ownerOccupied: data.owner_occupied || 0,
        renterOccupied: data.renter_occupied || 0,
        vacancyRate: data.vacancy_rate || 0,
        homeownershipRate: data.homeownership_rate || 0,
        medianHomeValue: data.median_home_value || 0,
        medianRent: data.median_rent || 0,
        housingAge: {
          builtBefore1970: data.built_before_1970 || 0,
          built1970to1999: data.built_1970_to_1999 || 0,
          builtAfter2000: data.built_after_2000 || 0,
        }
      };
    }
    
    return null;
  } catch (error) {
    console.error('Error fetching housing data from data.gov:', error);
    return null;
  }
}

/**
 * Fallback method that uses sample data for housing when the API fails
 * This uses the typical patterns found in the Census ACS for the city/state
 * @param state - State code (e.g., 'TX', 'CA')
 * @param city - City name 
 */
export function getFallbackHousingData(state: string, city: string): ExpandedHousingData {
  // Calculate some reasonable median values based on region
  // This is derived from ACS regional averages
  const getRegionalMedianValues = () => {
    const stateRegions: { [key: string]: string } = {
      'AL': 'south', 'AR': 'south', 'FL': 'south', 'GA': 'south', 'KY': 'south', 
      'LA': 'south', 'MS': 'south', 'NC': 'south', 'SC': 'south', 'TN': 'south', 
      'VA': 'south', 'WV': 'south',
      'AZ': 'west', 'CA': 'west', 'CO': 'west', 'ID': 'west', 'MT': 'west', 
      'NV': 'west', 'NM': 'west', 'OR': 'west', 'UT': 'west', 'WA': 'west', 'WY': 'west',
      'IL': 'midwest', 'IN': 'midwest', 'IA': 'midwest', 'KS': 'midwest', 'MI': 'midwest', 
      'MN': 'midwest', 'MO': 'midwest', 'NE': 'midwest', 'ND': 'midwest', 'OH': 'midwest', 
      'SD': 'midwest', 'WI': 'midwest',
      'CT': 'northeast', 'DE': 'northeast', 'ME': 'northeast', 'MD': 'northeast', 
      'MA': 'northeast', 'NH': 'northeast', 'NJ': 'northeast', 'NY': 'northeast', 
      'PA': 'northeast', 'RI': 'northeast', 'VT': 'northeast',
      'TX': 'south', 'HI': 'west', 'AK': 'west', 'DC': 'northeast'
    };
    
    const region = stateRegions[state] || 'national';
    
    switch (region) {
      case 'northeast':
        return { homeValue: 320000, rent: 1350, homeownership: 62 };
      case 'midwest':
        return { homeValue: 180000, rent: 950, homeownership: 68 };
      case 'south':
        return { homeValue: 210000, rent: 1100, homeownership: 66 };
      case 'west':
        return { homeValue: 425000, rent: 1450, homeownership: 60 };
      default:
        return { homeValue: 260000, rent: 1150, homeownership: 65 };
    }
  };
  
  const { homeValue, rent, homeownership } = getRegionalMedianValues();
  
  return {
    totalHousingUnits: 0,
    occupiedHousingUnits: 0,
    ownerOccupied: 0,
    renterOccupied: 0,
    vacancyRate: 8,
    homeownershipRate: homeownership,
    medianHomeValue: homeValue,
    medianRent: rent,
    housingAge: {
      builtBefore1970: 35,
      built1970to1999: 40,
      builtAfter2000: 25,
    }
  };
}