import { db } from "./db";
import { locations } from "@shared/schema";
import { additionalCities } from "./additional-cities";

async function addCitiesToDatabase() {
  console.log("Adding additional cities to database...");
  
  try {
    // Check which cities are already in the database
    const existingLocations = await db.select().from(locations);
    const existingIds = existingLocations.map(location => location.id);
    
    // Filter out cities that are already in the database
    const citiesToAdd = additionalCities.filter(city => !existingIds.includes(city.id));
    
    if (citiesToAdd.length === 0) {
      console.log("All additional cities are already in the database. No new cities to add.");
      return;
    }
    
    // Insert the new cities
    const locationsToInsert = citiesToAdd.map(location => ({
      name: location.name,
      state: location.state,
      region: location.region,
      population: location.population,
      medianAge: location.medianAge.toString(), // Convert to string to match schema
      medianIncome: location.medianIncome,
      costOfLiving: location.costOfLiving.toString(), // Convert to string to match schema
      averageCommute: location.averageCommute,
      climate: location.climate,
      cbpFacilities: location.cbpFacilities,
      rating: location.rating.toString(), // Convert to string to match schema
      lat: location.lat.toString(), // Convert to string to match schema
      lng: location.lng.toString(), // Convert to string to match schema
      housingData: location.housingData,
      schoolData: location.schoolData,
      safetyData: location.safetyData,
      lifestyleData: location.lifestyleData,
      transportationData: location.transportationData
    }));
    
    await db.insert(locations).values(locationsToInsert);
    
    console.log(`Successfully added ${citiesToAdd.length} new cities to the database!`);
  } catch (error) {
    console.error("Error adding cities to database:", error);
  }
}

// No need for direct execution check in ESM environment
// The function will be called from index.ts

export { addCitiesToDatabase };