import { db } from "./db";
import { locations } from "@shared/schema";
import { sampleLocations } from "./sample-data";

async function seedDatabase() {
  console.log("Seeding database with sample data...");
  
  try {
    // Check if we already have data
    const existingLocations = await db.select().from(locations);
    
    if (existingLocations.length > 0) {
      console.log(`Database already contains ${existingLocations.length} locations. Skipping seed.`);
      return;
    }
    
    // Insert sample locations
    const locationsToInsert = sampleLocations.map(location => ({
      name: location.name,
      state: location.state,
      region: location.region,
      population: location.population,
      medianAge: location.medianAge,
      medianIncome: location.medianIncome,
      costOfLiving: location.costOfLiving,
      averageCommute: location.averageCommute,
      climate: location.climate,
      cbpFacilities: location.cbpFacilities,
      rating: location.rating,
      lat: location.lat,
      lng: location.lng,
      housingData: location.housingData,
      schoolData: location.schoolData,
      safetyData: location.safetyData,
      lifestyleData: location.lifestyleData,
      transportationData: location.transportationData
    }));
    
    await db.insert(locations).values(locationsToInsert);
    
    console.log(`Successfully seeded database with ${sampleLocations.length} locations!`);
  } catch (error) {
    console.error("Error seeding database:", error);
  }
}

export { seedDatabase };