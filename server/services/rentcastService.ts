import axios from 'axios';
import { log } from '../vite';

/**
 * Interface for the property data response from Rentcast
 */
interface RentcastPropertyData {
  id: string;
  address: string;
  city: string;
  state: string;
  zipCode: string;
  price: number;
  bedrooms: number;
  bathrooms: number;
  squareFootage: number;
  listedDate: string;
  status: string;
  propertyType: string;
  latitude: number;
  longitude: number;
  photos: string[];
}

/**
 * Interface for market trends data from Rentcast
 */
interface RentcastMarketTrends {
  city: string;
  state: string;
  medianRent: number;
  medianSalePrice: number;
  pricePerSqft: number;
  rentGrowth: {
    oneMonth: number;
    threeMonth: number;
    oneYear: number;
  };
  priceGrowth: {
    oneMonth: number;
    threeMonth: number;
    oneYear: number;
  };
  daysOnMarket: number;
  inventory: number;
  timestamp: string;
}

/**
 * The base URL for Rentcast API
 */
const RENTCAST_API_URL = 'https://api.rentcast.io/v1';

/**
 * API key for Rentcast - stored as an environment variable
 */
const RENTCAST_API_KEY = process.env.RENTCAST_API_KEY;

/**
 * Checks if the API key is available
 */
const checkApiKey = () => {
  if (!RENTCAST_API_KEY) {
    throw new Error('RENTCAST_API_KEY environment variable is not set');
  }
};

/**
 * Default headers for API requests
 */
const getHeaders = () => {
  checkApiKey();
  return {
    'X-Api-Key': RENTCAST_API_KEY as string,
    'Content-Type': 'application/json',
  };
};

/**
 * Fetches property listings for a specific location
 * @param city - The city name
 * @param state - The state code (e.g., TX, NY)
 * @param limit - Maximum number of results to return
 * @returns Promise with property listings data
 */
export async function getPropertyListings(city: string, state: string, limit: number = 10): Promise<RentcastPropertyData[]> {
  try {
    checkApiKey();
    const url = `${RENTCAST_API_URL}/properties`;
    
    const response = await axios.get(url, {
      headers: getHeaders(),
      params: {
        city,
        state,
        status: 'active',
        limit,
      }
    });
    
    log(`Successfully fetched ${response.data.length} property listings for ${city}, ${state}`, 'rentcast');
    return response.data;
  } catch (error) {
    if (axios.isAxiosError(error)) {
      log(`Error fetching property listings: ${error.message} (${error.response?.status})`, 'rentcast');
      if (error.response) {
        log(`Response data: ${JSON.stringify(error.response.data)}`, 'rentcast');
      }
    } else {
      log(`Unexpected error fetching property listings: ${error}`, 'rentcast');
    }
    return [];
  }
}

/**
 * Fetches market trends data for a specific location
 * @param city - The city name
 * @param state - The state code (e.g., TX, NY)
 * @returns Promise with market trends data
 */
export async function getMarketTrends(city: string, state: string): Promise<RentcastMarketTrends | null> {
  try {
    checkApiKey();
    // Note: The API might be different than expected. Trying alternative endpoints or mocking if the API returns 404.
    const url = `${RENTCAST_API_URL}/market/stats`;
    
    try {
      const response = await axios.get(url, {
        headers: getHeaders(),
        params: {
          city,
          state,
        }
      });
      
      log(`Successfully fetched market trends for ${city}, ${state}`, 'rentcast');
      return response.data;
    } catch (axiosError) {
      if (axios.isAxiosError(axiosError) && axiosError.response?.status === 404) {
        // If the API endpoint is not found, log it and try an alternative if available
        log(`API endpoint not found: ${url}. This may indicate Rentcast API has changed.`, 'rentcast');
        
        // Since we can't access the real data, we need to inform the user rather than showing fake data
        return null;
      }
      throw axiosError; // Re-throw to be caught by the outer catch
    }
  } catch (error) {
    if (axios.isAxiosError(error)) {
      log(`Error fetching market trends: ${error.message} (${error.response?.status})`, 'rentcast');
      if (error.response) {
        log(`Response data: ${JSON.stringify(error.response.data)}`, 'rentcast');
      }
    } else {
      log(`Unexpected error fetching market trends: ${error}`, 'rentcast');
    }
    return null;
  }
}

/**
 * Fetches rental price history for a specific location
 * @param city - The city name
 * @param state - The state code (e.g., TX, NY)
 * @param months - Number of months of history to fetch
 * @returns Promise with price history data
 */
export async function getRentalPriceHistory(city: string, state: string, months: number = 12): Promise<any> {
  try {
    checkApiKey();
    // Try alternative endpoint - API structure might be different
    const url = `${RENTCAST_API_URL}/market/rental-trends`;
    
    try {
      const response = await axios.get(url, {
        headers: getHeaders(),
        params: {
          city,
          state,
          months
        }
      });
      
      log(`Successfully fetched rental price history for ${city}, ${state}`, 'rentcast');
      return response.data;
    } catch (axiosError) {
      if (axios.isAxiosError(axiosError) && axiosError.response?.status === 404) {
        // If the API endpoint is not found, log it
        log(`API endpoint not found: ${url}. This may indicate Rentcast API has changed.`, 'rentcast');
        
        // Since we can't access the real data, we need to inform the user
        return null;
      }
      throw axiosError; // Re-throw to be caught by the outer catch
    }
  } catch (error) {
    if (axios.isAxiosError(error)) {
      log(`Error fetching rental price history: ${error.message} (${error.response?.status})`, 'rentcast');
      if (error.response) {
        log(`Response data: ${JSON.stringify(error.response.data)}`, 'rentcast');
      }
    } else {
      log(`Unexpected error fetching rental price history: ${error}`, 'rentcast');
    }
    return null;
  }
}

/**
 * Performs an address search to get property details
 * @param address - Full address to search
 * @returns Promise with property details
 */
export async function getPropertyByAddress(address: string): Promise<any> {
  try {
    checkApiKey();
    const url = `${RENTCAST_API_URL}/property-details`;
    
    const response = await axios.get(url, {
      headers: getHeaders(),
      params: {
        address
      }
    });
    
    log(`Successfully fetched property details for ${address}`, 'rentcast');
    return response.data;
  } catch (error) {
    if (axios.isAxiosError(error)) {
      log(`Error fetching property details: ${error.message} (${error.response?.status})`, 'rentcast');
      if (error.response) {
        log(`Response data: ${JSON.stringify(error.response.data)}`, 'rentcast');
      }
    } else {
      log(`Unexpected error fetching property details: ${error}`, 'rentcast');
    }
    return null;
  }
}