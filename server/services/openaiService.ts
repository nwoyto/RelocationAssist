import OpenAI from "openai";
import { Location } from "@shared/schema";

// Define the expected nested types more specifically
interface HousingData {
  medianHomePrice: number;
  medianRent: number;
  homeownershipRate: number;
  priceToIncomeRatio: number;
  [key: string]: any;
}

interface SafetyData {
  crimeIndex: number;
  crimeTrend: string;
  safetyRating: string;
  [key: string]: any;
}

interface SchoolData {
  rating: number;
  publicSchools: number;
  privateSchools: number;
  studentTeacherRatio: number;
  [key: string]: any;
}

interface LifestyleData {
  restaurants: number;
  entertainment: number;
  parks: number;
  shopping: number;
  nightlife: string;
  artsAndCulture: string;
  outdoorActivities: string;
  walkScore: number;
  [key: string]: any;
}

interface TransportationData {
  transitScore: number;
  bikeScore: number;
  majorAirports: number;
  hasPublicTransit: boolean;
  interstateAccess: boolean;
  [key: string]: any;
}

// Extended Location type with typed properties
interface LocationWithDetails extends Location {
  housingData: HousingData;
  safetyData: SafetyData;
  schoolData: SchoolData;
  lifestyleData: LifestyleData;
  transportationData: TransportationData;
}

// the newest OpenAI model is "gpt-4o" which was released May 13, 2024. do not change this unless explicitly requested by the user
const MODEL = "gpt-4o";

// Initialize OpenAI client with API key
const openai = new OpenAI({ 
  apiKey: process.env.OPENAI_API_KEY 
});

/**
 * Generate a community summary for a location using OpenAI
 * @param location The location data
 * @returns A detailed community summary
 */
export async function generateCommunitySummary(location: Location): Promise<string> {
  try {
    // Create a detailed prompt based on the location data
    const prompt = `
Generate a detailed and engaging community summary for ${location.name}, ${location.state}.
Use the following information about the city to create an informative overview:

City Information:
- Population: ${location.population}
- Region: ${location.region}
- Climate: ${location.climate}
- Median Income: $${location.medianIncome}
- Cost of Living: ${location.costOfLiving} (100 is national average)
- Average Commute: ${location.averageCommute} minutes
- Median Age: ${location.medianAge}
- City Rating: ${location.rating}/5

Housing Information:
- Median Home Price: $${location.housingData.medianHomePrice}
- Median Rent: $${location.housingData.medianRent}
- Homeownership Rate: ${location.housingData.homeownershipRate}%
- Price to Income Ratio: ${location.housingData.priceToIncomeRatio}

Safety Information:
- Crime Index: ${location.safetyData.crimeIndex} (lower is better)
- Crime Trend: ${location.safetyData.crimeTrend}
- Safety Rating: ${location.safetyData.safetyRating}

Education:
- School Rating: ${location.schoolData.rating}/5
- Public Schools: ${location.schoolData.publicSchools}
- Private Schools: ${location.schoolData.privateSchools}
- Student-Teacher Ratio: ${location.schoolData.studentTeacherRatio}:1

Lifestyle:
- Restaurants: ${location.lifestyleData.restaurants}
- Entertainment Venues: ${location.lifestyleData.entertainment}
- Parks: ${location.lifestyleData.parks}
- Shopping Centers: ${location.lifestyleData.shopping}
- Nightlife: ${location.lifestyleData.nightlife}
- Arts & Culture: ${location.lifestyleData.artsAndCulture}
- Outdoor Activities: ${location.lifestyleData.outdoorActivities}
- Walk Score: ${location.lifestyleData.walkScore}/100

Transportation:
- Transit Score: ${location.transportationData.transitScore}/100
- Bike Score: ${location.transportationData.bikeScore}/100
- Major Airports: ${location.transportationData.majorAirports}
- Public Transit: ${location.transportationData.hasPublicTransit ? "Available" : "Limited"}
- Interstate Access: ${location.transportationData.interstateAccess ? "Yes" : "No"}

Format the response in HTML with appropriate <h2>, <p>, and <ul> tags as needed. 
Make the summary engaging and informative for CBP employees considering relocation to this area.
Include a brief introduction about the city's character, followed by sections on housing, safety, education, lifestyle, and transportation.
Limit your response to about 500-700 words.
`;

    // Call OpenAI API to generate the summary
    const response = await openai.chat.completions.create({
      model: MODEL,
      messages: [
        { role: "system", content: "You are a knowledgeable expert on cities in the United States, creating detailed and helpful community summaries for CBP employees considering relocation." },
        { role: "user", content: prompt }
      ],
      temperature: 0.7,
      max_tokens: 1000
    });

    // Return the generated summary
    return response.choices[0].message.content || "Summary not available at this time.";
  } catch (error) {
    console.error("Error generating community summary:", error);
    return "We're unable to generate a community summary at this time. Please check back later.";
  }
}

/**
 * Process a natural language query about locations
 * @param query The user's query
 * @param locations Available locations data for context
 * @param compareLocations Optional locations for comparison (when using compare feature)
 * @returns AI response to the query
 */
export async function processLocationQuery(
  query: string, 
  locations: Location[], 
  compareLocations?: Location[]
): Promise<string> {
  try {
    // Create context based on available locations
    const locationContext = locations.map(loc => 
      `${loc.name}, ${loc.state}: Population ${loc.population}, Region: ${loc.region}`
    ).join("\n");

    // Additional context if comparison is requested
    let comparisonContext = "";
    if (compareLocations && compareLocations.length > 0) {
      comparisonContext = "\nDetailed comparison data for:\n" + 
        compareLocations.map(loc => `
- ${loc.name}, ${loc.state}:
  Population: ${loc.population}
  Median Income: $${loc.medianIncome}
  Cost of Living: ${loc.costOfLiving} (national avg: 100)
  Median Home Price: $${loc.housingData.medianHomePrice}
  Crime Index: ${loc.safetyData.crimeIndex}
  Climate: ${loc.climate}
  Transit Score: ${loc.transportationData.transitScore}
  School Rating: ${loc.schoolData.rating}/5
      `).join("\n");
    }

    // Build a prompt that includes context about available locations and comparison data
    const prompt = `
User Query: ${query}

Available Locations:
${locationContext}

${comparisonContext}

Please provide a helpful, accurate and detailed response to the user's query about CBP relocation information.
If the query is about comparing locations, provide a clear comparison of relevant factors between the cities.
If the query is about a specific location, focus on that location's details.
If you don't have enough information to answer, suggest what additional information would be helpful.
Format your response in HTML with appropriate tags for readability.
`;

    // Call OpenAI API to process the query
    const response = await openai.chat.completions.create({
      model: MODEL,
      messages: [
        { 
          role: "system", 
          content: "You are a helpful assistant for CBP employees considering relocation. Your role is to answer questions about various locations, help compare cities, and provide insights based on housing, safety, education, and lifestyle factors."
        },
        { role: "user", content: prompt }
      ],
      temperature: 0.7,
      max_tokens: 1000
    });

    // Return the AI's response
    return response.choices[0].message.content || "I'm sorry, I couldn't process your query at this time.";
  } catch (error) {
    console.error("Error processing location query:", error);
    return "I'm sorry, I'm having trouble processing your question right now. Please try again later.";
  }
}