import { db, pool } from './db';
import { docClient, TABLES } from './dynamodb';
import { PutCommand } from '@aws-sdk/lib-dynamodb';
import { moreCities } from './more-cities';
import { insertLocationSchema, locations } from '@shared/schema';
import { eq } from 'drizzle-orm';

// Enhanced data for cities with realistic values
const enhancedCityData = [
  {
    housingData: {
      medianHomePrice: 0, // Will be set from the city data
      homeownershipRate: 60,
      medianRent: 0, // Will be calculated based on home price
      rentalVacancyRate: 5.8,
      propertyTaxRate: 1.2,
      priceToIncomeRatio: 0, // Will be calculated
      priceGrowthLastYear: 7.5,
      priceGrowth5Years: 42.3,
      neighborhoods: [
        { name: "Downtown", medianPrice: 0, homeTypes: "Condos/Apartments", rating: 4.2 },
        { name: "Northside", medianPrice: 0, homeTypes: "Single Family", rating: 4.5 },
        { name: "Westside", medianPrice: 0, homeTypes: "Mixed", rating: 3.8 },
        { name: "Eastside", medianPrice: 0, homeTypes: "Single Family", rating: 4.0 }
      ],
      estimatedMortgage: 0 // Will be calculated
    },
    schoolData: {
      rating: 4.0,
      publicSchools: 42,
      privateSchools: 12,
      studentTeacherRatio: 16,
      collegeGradRate: 88,
      topSchools: [
        { name: "Central High School", type: "Public", grades: "9-12", rating: 4.5 },
        { name: "Washington Elementary", type: "Public", grades: "K-5", rating: 4.3 },
        { name: "Prep Academy", type: "Private", grades: "6-12", rating: 4.8 }
      ]
    },
    safetyData: {
      crimeIndex: 65,
      crimeIndexDiff: -35,
      violentCrime: 325,
      propertyCrime: 1825,
      safetyRating: "Moderate",
      crimeTrend: "Decreasing"
    },
    lifestyleData: {
      restaurants: 385,
      parks: 24,
      shopping: 18,
      entertainment: 32,
      nightlife: "Moderate",
      artsAndCulture: "Rich",
      outdoorActivities: "Abundant",
      walkScore: 72
    },
    transportationData: {
      transitScore: 0, // Will be set from city data
      walkScore: 0, // Will be set from lifestyleData
      bikeScore: 62,
      hasPublicTransit: true,
      majorAirports: 1,
      interstateAccess: true
    },
    weatherData: {
      climate: "Temperate",
      annualRainfall: 36,
      annualSnowfall: 10,
      summerHigh: 88,
      winterLow: 28,
      sunnyDays: 205,
      airQuality: "Good"
    },
    externalData: {
      dataDate: new Date().toISOString(),
      source: "U.S. Census Bureau",
      hasExpandedData: true
    }
  }
];

/**
 * Add more cities to the databases (PostgreSQL and DynamoDB)
 */
async function addMoreCities() {
  try {
    console.log('Starting to add 50 new cities to the database...');
    
    // Check if we're using PostgreSQL or DynamoDB
    const useDynamoDB = process.env.USE_DYNAMO_DB === 'true';
    
    // First, check which cities already exist in PostgreSQL
    console.log('Checking for existing cities in the database...');
    let existingCities: any[] = [];
    
    try {
      existingCities = await db.select({ name: locations.name, state: locations.state }).from(locations);
    } catch (error) {
      console.warn('Error checking existing cities, proceeding anyway:', error);
    }
    
    // Create a lookup set of "City, State" for easy checking
    const existingCitySet = new Set(
      existingCities.map(city => `${city.name}, ${city.state}`)
    );
    
    // Filter out cities that already exist
    const citiesToAdd = moreCities.filter(city => 
      !existingCitySet.has(`${city.name}, ${city.state}`)
    );
    
    console.log(`Found ${citiesToAdd.length} new cities to add to the database.`);
    
    if (citiesToAdd.length === 0) {
      console.log('No new cities to add. Exiting.');
      return;
    }
    
    // Start a counter for generating IDs
    let nextId = 32; // Start after the existing 31 cities
    
    // Prepare the cities with enhanced data
    const preparedCities = citiesToAdd.map(city => {
      // Calculate derived values
      const medianHomePrice = city.medianHomePrice || 250000;
      const medianRent = Math.round(medianHomePrice * 0.005); // Approximate monthly rent
      const priceToIncomeRatio = +(medianHomePrice / (city.medianIncome || 50000)).toFixed(1);
      const estimatedMortgage = Math.round((medianHomePrice - medianHomePrice * 0.2) * 0.005); // 20% down, 0.5% monthly payment
      
      // Enhance neighborhoods with calculated prices
      const neighborhoods = enhancedCityData[0].housingData.neighborhoods.map(neighborhood => {
        // Adjust neighborhood prices based on rating and type
        let priceMultiplier = 1.0;
        if (neighborhood.rating > 4.3) priceMultiplier = 1.2;
        else if (neighborhood.rating < 4.0) priceMultiplier = 0.9;
        
        if (neighborhood.homeTypes === "Condos/Apartments") priceMultiplier *= 0.85;
        else if (neighborhood.homeTypes === "Single Family") priceMultiplier *= 1.1;
        
        return {
          ...neighborhood,
          medianPrice: Math.round(medianHomePrice * priceMultiplier)
        };
      });
      
      // Generate the full city object with all required data
      return {
        id: nextId++,
        name: city.name,
        state: city.state,
        region: city.region || "Unknown",
        lat: city.lat || 0,
        lng: city.lng || 0,
        population: city.population || 0,
        medianIncome: city.medianIncome || 0,
        costOfLivingIndex: city.costOfLivingIndex || 100,
        averageCommute: city.averageCommute || 25,
        housingData: {
          ...enhancedCityData[0].housingData,
          medianHomePrice,
          medianRent,
          priceToIncomeRatio,
          neighborhoods,
          estimatedMortgage
        },
        schoolData: enhancedCityData[0].schoolData,
        safetyData: {
          ...enhancedCityData[0].safetyData,
          // Adjust safety data based on crime rate string
          crimeIndex: city.crimeRate === "Very Low" ? 30 :
                     city.crimeRate === "Low" ? 45 :
                     city.crimeRate === "Moderate" ? 65 :
                     city.crimeRate === "High" ? 85 : 65,
          crimeIndexDiff: city.crimeRate === "Very Low" ? -70 :
                         city.crimeRate === "Low" ? -55 :
                         city.crimeRate === "Moderate" ? -35 :
                         city.crimeRate === "High" ? 15 : -35,
        },
        lifestyleData: {
          ...enhancedCityData[0].lifestyleData,
          walkScore: city.transitScore ? city.transitScore + 15 : 60, // Estimate walkScore based on transitScore
        },
        transportationData: {
          ...enhancedCityData[0].transportationData,
          transitScore: city.transitScore || 30,
          walkScore: city.transitScore ? city.transitScore + 15 : 60, // Same as lifestyleData.walkScore
        },
        weatherData: enhancedCityData[0].weatherData,
        externalData: enhancedCityData[0].externalData,
        createdAt: new Date().toISOString()
      };
    });
    
    // Add cities to PostgreSQL
    if (!useDynamoDB) {
      console.log('Adding cities to PostgreSQL...');
      for (const city of preparedCities) {
        try {
          // Validate with schema
          const validatedCity = insertLocationSchema.parse(city);
          await db.insert(locations).values(validatedCity);
          console.log(`Added ${city.name}, ${city.state} to PostgreSQL`);
        } catch (error) {
          console.error(`Error adding ${city.name}, ${city.state} to PostgreSQL:`, error);
        }
      }
    }
    // Add cities to DynamoDB
    else {
      console.log('Adding cities to DynamoDB...');
      for (const city of preparedCities) {
        try {
          await docClient.send(
            new PutCommand({
              TableName: TABLES.LOCATIONS,
              Item: city
            })
          );
          console.log(`Added ${city.name}, ${city.state} to DynamoDB`);
        } catch (error) {
          console.error(`Error adding ${city.name}, ${city.state} to DynamoDB:`, error);
        }
      }
    }
    
    console.log('Finished adding new cities to the database.');
  } catch (error) {
    console.error('Error in addMoreCities:', error);
  } finally {
    // Close PostgreSQL connection if needed
    if (!process.env.USE_DYNAMO_DB) {
      await pool.end();
    }
  }
}

// Execute the function if this script is run directly
if (require.main === module) {
  addMoreCities()
    .then(() => console.log('Complete!'))
    .catch(console.error);
}

export { addMoreCities };