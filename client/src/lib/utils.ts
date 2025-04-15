import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

/**
 * Get a formatted location image URL
 * @param locationName The name of the location
 * @param state The state code (e.g., TX, NY)
 * @param size The size of the image (small, medium, large)
 * @returns A URL string for the location image
 */
export function getLocationImageUrl(locationName: string, state: string, size: 'small' | 'medium' | 'large' = 'medium'): string {
  // Format the location name for use in URL (lowercase, hyphenated)
  const formattedName = locationName.toLowerCase().replace(/\s+/g, '-');
  
  // Use placeholder service that is more reliable
  const width = size === 'small' ? 400 : size === 'medium' ? 800 : 1200;
  const height = size === 'small' ? 300 : size === 'medium' ? 600 : 900;
  
  // Use a reliable placeholder service
  return `https://placehold.co/${width}x${height}?text=${formattedName},+${state}`;
}

/**
 * Get a formatted neighborhood image URL
 * @param locationName The name of the location
 * @param neighborhoodName The name of the neighborhood
 * @returns A URL string for the neighborhood image
 */
export function getNeighborhoodImageUrl(locationName: string, neighborhoodName: string): string {
  // Format the neighborhood name for use in URL (lowercase, hyphenated)
  const formattedLocation = locationName.toLowerCase().replace(/\s+/g, '-');
  const formattedNeighborhood = neighborhoodName.toLowerCase().replace(/\s+/g, '-');
  
  // Use a reliable placeholder service
  return `https://placehold.co/400x300?text=${formattedNeighborhood}+in+${formattedLocation}`;
}

/**
 * Get a formatted housing listing image URL
 * @param address The address of the listing
 * @param index Optional index for variety when multiple images are needed
 * @returns A URL string for the housing listing image
 */
export function getListingImageUrl(address: string, index: number = 0): string {
  // Format the address for use in URL (lowercase, hyphenated)
  const formattedAddress = address.toLowerCase().replace(/\s+/g, '-').replace(/[^\w\-]/g, '');
  
  // Use a reliable placeholder service
  // Adding the index allows for different images even with the same address
  return `https://placehold.co/600x400?text=Property+at+${formattedAddress}+${index}`;
}
