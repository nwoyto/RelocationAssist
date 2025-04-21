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
export async function generateCommunitySummary(location: Location & Partial<LocationWithDetails>): Promise<string> {
  try {
    // Extract data safely with fallbacks for missing properties
    const housingData = location.housingData || {} as HousingData;
    const safetyData = location.safetyData || {} as SafetyData;
    const schoolData = location.schoolData || {} as SchoolData;
    const lifestyleData = location.lifestyleData || {} as LifestyleData;
    const transportationData = location.transportationData || {} as TransportationData;

    // Create a detailed prompt based on the location data
    const prompt = `
Generate a detailed and engaging community summary for ${location.name}, ${location.state}.
Use the following information about the city to create an informative overview:

City Information:
- Population: ${location.population || 'Data not available'}
- Region: ${location.region || 'Data not available'}
- Climate: ${location.climate || 'Data not available'}
- Median Income: $${location.medianIncome || 'Data not available'}
- Cost of Living: ${location.costOfLiving || 'Data not available'} (100 is national average)
- Average Commute: ${location.averageCommute || 'Data not available'} minutes
- Median Age: ${location.medianAge || 'Data not available'}
- City Rating: ${location.rating || 'Data not available'}/5

Housing Information:
- Median Home Price: $${housingData.medianHomePrice || 'Data not available'}
- Median Rent: $${housingData.medianRent || 'Data not available'}
- Homeownership Rate: ${housingData.homeownershipRate || 'Data not available'}%
- Price to Income Ratio: ${housingData.priceToIncomeRatio || 'Data not available'}

Safety Information:
- Crime Index: ${safetyData.crimeIndex || 'Data not available'} (lower is better)
- Crime Trend: ${safetyData.crimeTrend || 'Data not available'}
- Safety Rating: ${safetyData.safetyRating || 'Data not available'}

Education:
- School Rating: ${schoolData.rating || 'Data not available'}/5
- Public Schools: ${schoolData.publicSchools || 'Data not available'}
- Private Schools: ${schoolData.privateSchools || 'Data not available'}
- Student-Teacher Ratio: ${schoolData.studentTeacherRatio || 'Data not available'}:1

Lifestyle:
- Restaurants: ${lifestyleData.restaurants || 'Data not available'}
- Entertainment Venues: ${lifestyleData.entertainment || 'Data not available'}
- Parks: ${lifestyleData.parks || 'Data not available'}
- Shopping Centers: ${lifestyleData.shopping || 'Data not available'}
- Nightlife: ${lifestyleData.nightlife || 'Data not available'}
- Arts & Culture: ${lifestyleData.artsAndCulture || 'Data not available'}
- Outdoor Activities: ${lifestyleData.outdoorActivities || 'Data not available'}
- Walk Score: ${lifestyleData.walkScore || 'Data not available'}/100

Transportation:
- Transit Score: ${transportationData.transitScore || 'Data not available'}/100
- Bike Score: ${transportationData.bikeScore || 'Data not available'}/100
- Major Airports: ${transportationData.majorAirports || 'Data not available'}
- Public Transit: ${transportationData.hasPublicTransit ? "Available" : "Limited/Unknown"}
- Interstate Access: ${transportationData.interstateAccess ? "Yes" : "No/Unknown"}

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
export interface AIResponseWithLocationData {
  html: string;
  mentionedLocations: {
    name: string;
    state: string;
    id: number;
  }[];
}

export async function processLocationQuery(
  query: string, 
  locations: Location[], 
  compareLocations?: Location[]
): Promise<AIResponseWithLocationData> {
  try {
    // Create context based on available locations
    const locationContext = locations.map(loc => 
      `${loc.name}, ${loc.state}: Population ${loc.population || 'Unknown'}, Region: ${loc.region || 'Unknown'}, ID: ${loc.id}`
    ).join("\n");

    // Additional context if comparison is requested
    let comparisonContext = "";
    if (compareLocations && compareLocations.length > 0) {
      comparisonContext = "\nDetailed comparison data for:\n" + 
        compareLocations.map(loc => {
          // Extract data safely with fallbacks for missing properties
          const housingData = (loc as any).housingData || {};
          const safetyData = (loc as any).safetyData || {};
          const transportationData = (loc as any).transportationData || {};
          const schoolData = (loc as any).schoolData || {};
          
          return `
- ${loc.name}, ${loc.state} (ID: ${loc.id}):
  Population: ${loc.population || 'Data not available'}
  Median Income: $${loc.medianIncome || 'Data not available'}
  Cost of Living: ${loc.costOfLiving || 'Data not available'} (national avg: 100)
  Median Home Price: $${housingData.medianHomePrice || 'Data not available'}
  Crime Index: ${safetyData.crimeIndex || 'Data not available'}
  Climate: ${loc.climate || 'Data not available'}
  Transit Score: ${transportationData.transitScore || 'Data not available'}
  School Rating: ${schoolData.rating || 'Data not available'}/5
          `;
        }).join("\n");
    }

    // Build a prompt that includes context about available locations and comparison data
    const prompt = `
User Query: ${query}

Available Locations:
${locationContext}

${comparisonContext}

Please provide a helpful, accurate and detailed response to the user's query about CBP relocation information.
If the query is about comparing locations, provide a clear comparison of relevant factors between the cities.
If the query is about specific locations, focus on those location's details.
If you recommend any cities in your response, make sure to specifically mention them by name and state (e.g., "Denver, CO").
If you don't have enough information to answer, suggest what additional information would be helpful.
Format your response in HTML with appropriate tags for readability.

IMPORTANT: After your main response, add a separate JSON block containing all the cities you mentioned, recommended, or discussed in your response. Format this as:
<json>
{
  "mentionedLocations": [
    {"name": "City Name", "state": "ST"},
    {"name": "Another City", "state": "ST"}
  ]
}
</json>

Only include cities in this JSON that are in the available locations list I provided.
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
      max_tokens: 1200
    });

    // Extract HTML content and mentioned locations from the response
    const content = response.choices[0].message.content || "I'm sorry, I couldn't process your query at this time.";
    
    // Extract the JSON data part if it exists
    let mentionedLocations: {name: string, state: string, id: number}[] = [];
    const jsonMatch = content.match(/<json>([\s\S]*?)<\/json>/);
    
    if (jsonMatch && jsonMatch[1]) {
      try {
        const jsonData = JSON.parse(jsonMatch[1]);
        
        // Match the mentioned locations with their IDs from our database
        if (jsonData.mentionedLocations && Array.isArray(jsonData.mentionedLocations)) {
          mentionedLocations = jsonData.mentionedLocations.map(loc => {
            // Find matching location in our database
            const matchingLocation = locations.find(
              dbLoc => dbLoc.name.toLowerCase() === loc.name.toLowerCase() && 
                      dbLoc.state.toLowerCase() === loc.state.toLowerCase()
            );
            
            return {
              name: loc.name,
              state: loc.state,
              id: matchingLocation?.id || 0
            };
          }).filter(loc => loc.id !== 0); // Only include locations that were found in our database
        }
      } catch (err) {
        console.error("Error parsing location JSON data:", err);
      }
    }
    
    // Remove the JSON part from the HTML content
    const htmlContent = content.replace(/<json>[\s\S]*?<\/json>/g, '');
    
    return {
      html: htmlContent,
      mentionedLocations
    };
  } catch (error) {
    console.error("Error processing location query:", error);
    return {
      html: "I'm sorry, I'm having trouble processing your question right now. Please try again later.",
      mentionedLocations: []
    };
  }
}

/**
 * Generate a comprehensive city summary for a specific location
 * This provides a more detailed overview than the community insights
 * @param location The location to generate a summary for
 * @returns A detailed summary of the city including key relocation factors
 */
export async function generateCitySummary(location: LocationWithDetails): Promise<string> {
  try {
    // Initialize OpenAI client
    const openai = new OpenAI({
      apiKey: process.env.OPENAI_API_KEY,
    });

    // Type cast to access optional fields
    const housingData = location.housingData as HousingData || {};
    const safetyData = location.safetyData as SafetyData || {};
    const schoolData = location.schoolData as SchoolData || {};
    const lifestyleData = location.lifestyleData as LifestyleData || {};
    const transportationData = location.transportationData as TransportationData || {};

    // Create the prompt
    const prompt = `Please generate a comprehensive summary of ${location.name}, ${location.state} for CBP employees considering relocation. 
    
Key City Information:
- Name: ${location.name}
- State: ${location.state}
- Region: ${location.region}
- Population: ${location.population.toLocaleString()}
- Median Age: ${location.medianAge}
- Median Income: $${location.medianIncome.toLocaleString()}
- Cost of Living: ${location.costOfLiving}% (100 is national average)
- Climate: ${location.climate}
- Average Commute: ${location.averageCommute} minutes

Housing Information:
- Median Home Price: $${housingData.medianHomePrice?.toLocaleString() || 'Data not available'}
- Median Rent: $${housingData.medianRent?.toLocaleString() || 'Data not available'}/month
- Homeownership Rate: ${housingData.homeownershipRate || 'Data not available'}%
- Price-to-Income Ratio: ${housingData.priceToIncomeRatio || 'Data not available'}

Safety Information:
- Crime Index: ${safetyData.crimeIndex || 'Data not available'} (lower is better)
- Crime Trend: ${safetyData.crimeTrend || 'Data not available'}
- Safety Rating: ${safetyData.safetyRating || 'Data not available'}

Education:
- School Rating: ${schoolData.rating || 'Data not available'}/5
- Public Schools: ${schoolData.publicSchools || 'Data not available'}
- Private Schools: ${schoolData.privateSchools || 'Data not available'}
- Student-Teacher Ratio: ${schoolData.studentTeacherRatio || 'Data not available'}:1

Lifestyle:
- Restaurants: ${lifestyleData.restaurants || 'Data not available'}
- Entertainment Venues: ${lifestyleData.entertainment || 'Data not available'}
- Parks: ${lifestyleData.parks || 'Data not available'}
- Shopping Centers: ${lifestyleData.shopping || 'Data not available'}
- Nightlife: ${lifestyleData.nightlife || 'Data not available'}
- Arts & Culture: ${lifestyleData.artsAndCulture || 'Data not available'}
- Outdoor Activities: ${lifestyleData.outdoorActivities || 'Data not available'}
- Walk Score: ${lifestyleData.walkScore || 'Data not available'}/100

Transportation:
- Transit Score: ${transportationData.transitScore || 'Data not available'}/100
- Bike Score: ${transportationData.bikeScore || 'Data not available'}/100
- Major Airports: ${transportationData.majorAirports || 'Data not available'}
- Public Transit: ${transportationData.hasPublicTransit ? "Available" : "Limited/Unknown"}
- Interstate Access: ${transportationData.interstateAccess ? "Yes" : "No/Unknown"}

CBP Facilities:
- Number of CBP Facilities: ${location.cbpFacilities}

Create a comprehensive and informative summary that includes:
1. A general overview of the city's character, history, and notable features
2. Quality of life assessments for CBP employees and their families
3. Housing market analysis with trends and neighborhood recommendations
4. Community highlights including culture, recreation, and amenities
5. Evaluation of schools and educational opportunities
6. Transportation and commuting information
7. Safety assessment
8. Pros and cons of living in this location for CBP employees
9. Conclusion with key takeaways

Format the summary in clear paragraphs with informative headings. Aim for about 800-1000 words total.
`;

    // Call OpenAI API to generate the summary
    const response = await openai.chat.completions.create({
      model: MODEL,
      messages: [
        { 
          role: "system", 
          content: "You are a relocation specialist with deep knowledge of cities across the United States. Your task is to create comprehensive, accurate, and helpful city summaries for CBP employees considering relocation."
        },
        { role: "user", content: prompt }
      ],
      temperature: 0.7,
      max_tokens: 1200
    });

    // Return the generated summary
    return response.choices[0].message.content || "City summary not available at this time.";
  } catch (error) {
    console.error("Error generating city summary:", error);
    return "We're unable to generate a city summary at this time. Please try again later.";
  }
}