import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { enrichLocationData } from "./services/dataService";
import * as rentcastService from "./services/rentcastService";
import * as censusService from "./services/censusService";
import * as climateService from "./services/climateService";
import * as dataGovService from "./services/dataGovService";
import { generateCommunitySummary, processLocationQuery, generateCitySummary } from "./services/openaiService";

export async function registerRoutes(app: Express): Promise<Server> {
  // API Routes for locations
  app.get("/api/locations", async (req, res) => {
    try {
      const searchQuery = req.query.search as string || '';
      const region = req.query.region as string || '';
      const locations = await storage.getLocations(searchQuery, region);
      res.json(locations);
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch locations" });
    }
  });

  app.get("/api/locations/:id", async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      const location = await storage.getLocationById(id);
      
      if (!location) {
        return res.status(404).json({ error: "Location not found" });
      }
      
      // Get additional authentic data from data.gov
      try {
        const enrichedLocation = await enrichLocationData(location);
        res.json(enrichedLocation);
      } catch (enrichError) {
        console.error("Error enriching location data:", enrichError);
        // Still return the base location data even if enrichment fails
        res.json(location);
      }
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch location" });
    }
  });

  // API Routes for saved locations
  app.get("/api/saved-locations", async (req, res) => {
    try {
      const userId = req.query.userId as string;
      
      if (!userId) {
        return res.status(400).json({ error: "User ID is required" });
      }
      
      const savedLocations = await storage.getSavedLocations(parseInt(userId));
      res.json(savedLocations);
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch saved locations" });
    }
  });

  app.post("/api/saved-locations", async (req, res) => {
    try {
      const { userId, locationId } = req.body;
      
      if (!userId || !locationId) {
        return res.status(400).json({ error: "User ID and Location ID are required" });
      }
      
      const savedLocation = await storage.saveLocation(parseInt(userId), parseInt(locationId));
      res.status(201).json(savedLocation);
    } catch (error) {
      res.status(500).json({ error: "Failed to save location" });
    }
  });

  app.delete("/api/saved-locations/:id", async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      await storage.removeSavedLocation(id);
      res.status(204).send();
    } catch (error) {
      res.status(500).json({ error: "Failed to remove saved location" });
    }
  });

  // Rentcast API Routes
  app.get("/api/rentcast/property-listings", async (req, res) => {
    try {
      const city = req.query.city as string;
      const state = req.query.state as string;
      const limit = req.query.limit ? parseInt(req.query.limit as string) : 10;
      
      if (!city || !state) {
        return res.status(400).json({ error: "City and state are required" });
      }
      
      const listings = await rentcastService.getPropertyListings(city, state, limit);
      res.json(listings);
    } catch (error) {
      console.error("Error fetching property listings:", error);
      res.status(500).json({ error: "Failed to fetch property listings" });
    }
  });

  app.get("/api/rentcast/market-trends", async (req, res) => {
    try {
      const city = req.query.city as string;
      const state = req.query.state as string;
      
      if (!city || !state) {
        return res.status(400).json({ error: "City and state are required" });
      }
      
      const trends = await rentcastService.getMarketTrends(city, state);
      res.json(trends);
    } catch (error) {
      console.error("Error fetching market trends:", error);
      res.status(500).json({ error: "Failed to fetch market trends" });
    }
  });

  app.get("/api/rentcast/rental-history", async (req, res) => {
    try {
      const city = req.query.city as string;
      const state = req.query.state as string;
      const months = req.query.months ? parseInt(req.query.months as string) : 12;
      
      if (!city || !state) {
        return res.status(400).json({ error: "City and state are required" });
      }
      
      const history = await rentcastService.getRentalPriceHistory(city, state, months);
      res.json(history);
    } catch (error) {
      console.error("Error fetching rental price history:", error);
      res.status(500).json({ error: "Failed to fetch rental price history" });
    }
  });

  app.get("/api/rentcast/property", async (req, res) => {
    try {
      const address = req.query.address as string;
      
      if (!address) {
        return res.status(400).json({ error: "Address is required" });
      }
      
      const property = await rentcastService.getPropertyByAddress(address);
      res.json(property);
    } catch (error) {
      console.error("Error fetching property details:", error);
      res.status(500).json({ error: "Failed to fetch property details" });
    }
  });

  // API Routes for comparison
  app.get("/api/compare", async (req, res) => {
    try {
      const locationIds = req.query.ids as string;
      
      if (!locationIds) {
        return res.status(400).json({ error: "Location IDs are required" });
      }
      
      const ids = locationIds.split(',').map(id => parseInt(id));
      const locations = await storage.getLocationsByIds(ids);
      
      // Enrich locations with additional data from data.gov
      try {
        const enrichedLocationsPromises = locations.map(location => enrichLocationData(location));
        const enrichedLocations = await Promise.all(enrichedLocationsPromises);
        res.json(enrichedLocations);
      } catch (enrichError) {
        console.error("Error enriching locations data for comparison:", enrichError);
        // Still return the base locations data even if enrichment fails
        res.json(locations);
      }
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch locations for comparison" });
    }
  });

  // Census Bureau API Routes
  app.get("/api/census/expanded", async (req, res) => {
    try {
      const city = req.query.city as string;
      const state = req.query.state as string;
      
      if (!city || !state) {
        return res.status(400).json({ error: "City and state are required" });
      }
      
      const censusData = await censusService.getAllExpandedCensusData(city, state);
      
      if (!censusData) {
        return res.status(404).json({ error: "Census data not found for this location" });
      }
      
      res.json(censusData);
    } catch (error) {
      console.error("Error fetching expanded census data:", error);
      res.status(500).json({ error: "Failed to fetch expanded census data" });
    }
  });

  app.get("/api/census/demographics", async (req, res) => {
    try {
      const city = req.query.city as string;
      const state = req.query.state as string;
      
      if (!city || !state) {
        return res.status(400).json({ error: "City and state are required" });
      }
      
      const demographics = await censusService.getExpandedDemographics(city, state);
      
      if (!demographics) {
        return res.status(404).json({ error: "Demographic data not found for this location" });
      }
      
      res.json(demographics);
    } catch (error) {
      console.error("Error fetching demographic data:", error);
      res.status(500).json({ error: "Failed to fetch demographic data" });
    }
  });

  app.get("/api/census/income-employment", async (req, res) => {
    try {
      const city = req.query.city as string;
      const state = req.query.state as string;
      
      if (!city || !state) {
        return res.status(400).json({ error: "City and state are required" });
      }
      
      const incomeEmployment = await censusService.getIncomeEmploymentData(city, state);
      
      if (!incomeEmployment) {
        return res.status(404).json({ error: "Income and employment data not found for this location" });
      }
      
      res.json(incomeEmployment);
    } catch (error) {
      console.error("Error fetching income and employment data:", error);
      res.status(500).json({ error: "Failed to fetch income and employment data" });
    }
  });

  app.get("/api/census/housing", async (req, res) => {
    try {
      const city = req.query.city as string;
      const state = req.query.state as string;
      
      if (!city || !state) {
        return res.status(400).json({ error: "City and state are required" });
      }
      
      // Try the Census Bureau API first
      try {
        console.log(`Fetching Census housing data for ${state}, ${city}`);
        const housingData = await censusService.getExpandedHousingData(city, state);
        
        if (housingData) {
          return res.json(housingData);
        }
      } catch (censusError) {
        console.log("Census API error, falling back to data.gov:", censusError);
      }
      
      // If Census API fails, fall back to data.gov
      try {
        console.log(`Fetching data.gov housing data for ${state}, ${city}`);
        const dataGovHousingData = await dataGovService.getHousingData(city, state);
        
        if (dataGovHousingData) {
          return res.json(dataGovHousingData);
        }
      } catch (dataGovError) {
        console.log("data.gov API error:", dataGovError);
      }
      
      // If all APIs fail, use fallback regional data
      const fallbackData = dataGovService.getFallbackHousingData(state, city);
      return res.json(fallbackData);
    } catch (error) {
      console.error("Error fetching housing data:", error);
      res.status(500).json({ error: "Failed to fetch housing data" });
    }
  });

  app.get("/api/census/education", async (req, res) => {
    try {
      const city = req.query.city as string;
      const state = req.query.state as string;
      
      if (!city || !state) {
        return res.status(400).json({ error: "City and state are required" });
      }
      
      const educationData = await censusService.getEducationData(city, state);
      
      if (!educationData) {
        return res.status(404).json({ error: "Education data not found for this location" });
      }
      
      res.json(educationData);
    } catch (error) {
      console.error("Error fetching education data:", error);
      res.status(500).json({ error: "Failed to fetch education data" });
    }
  });

  app.get("/api/census/commute", async (req, res) => {
    try {
      const city = req.query.city as string;
      const state = req.query.state as string;
      
      if (!city || !state) {
        return res.status(400).json({ error: "City and state are required" });
      }
      
      const commuteData = await censusService.getCommuteData(city, state);
      
      if (!commuteData) {
        return res.status(404).json({ error: "Commute data not found for this location" });
      }
      
      res.json(commuteData);
    } catch (error) {
      console.error("Error fetching commute data:", error);
      res.status(500).json({ error: "Failed to fetch commute data" });
    }
  });

  // Data.gov API Routes
  app.get("/api/datagov/housing", async (req, res) => {
    try {
      const city = req.query.city as string;
      const state = req.query.state as string;
      
      if (!city || !state) {
        return res.status(400).json({ error: "City and state are required" });
      }
      
      console.log(`Fetching data.gov housing data for ${state}, ${city}`);
      const housingData = await dataGovService.getHousingData(city, state);
      
      if (!housingData) {
        // If no data from API, use regional fallback data
        const fallbackData = dataGovService.getFallbackHousingData(state, city);
        return res.json({
          ...fallbackData,
          source: "regional_patterns"
        });
      }
      
      res.json({
        ...housingData,
        source: "data.gov"
      });
    } catch (error) {
      console.error("Error fetching data.gov housing data:", error);
      
      // If error occurs, return regional fallback data
      const fallbackData = dataGovService.getFallbackHousingData(req.query.state as string, req.query.city as string);
      res.json({
        ...fallbackData,
        source: "regional_patterns"
      });
    }
  });
  
  // Climate API Routes
  app.get("/api/climate", async (req, res) => {
    try {
      const city = req.query.city as string;
      const state = req.query.state as string;
      
      if (!city || !state) {
        return res.status(400).json({ error: "City and state are required" });
      }
      
      const climateData = await climateService.getClimateData(city, state);
      
      if (!climateData) {
        return res.status(404).json({ error: "Climate data not found for this location" });
      }
      
      res.json(climateData);
    } catch (error) {
      console.error("Error fetching climate data:", error);
      res.status(500).json({ error: "Failed to fetch climate data" });
    }
  });

  // AI-powered Community Summary Routes
  app.get("/api/ai/community-summary/:id", async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      const location = await storage.getLocationById(id);
      
      if (!location) {
        return res.status(404).json({ error: "Location not found" });
      }
      
      // Generate AI-powered community summary
      // Cast the location to include optional detailed fields that might be present
      const summary = await generateCommunitySummary(location as any);
      res.json({ summary });
    } catch (error) {
      console.error("Error generating community summary:", error);
      res.status(500).json({ error: "Failed to generate community summary" });
    }
  });

  // AI Chatbot for location questions
  app.post("/api/ai/chat", async (req, res) => {
    try {
      const { query, locationIds } = req.body;
      
      if (!query) {
        return res.status(400).json({ error: "Query is required" });
      }
      
      // Get all locations for context
      const allLocations = await storage.getLocations();
      
      // Get specific locations for comparison if provided
      let compareLocations: any[] = [];
      if (locationIds && locationIds.length > 0) {
        compareLocations = await storage.getLocationsByIds(locationIds);
      }
      
      // Process the query with AI - now returns structured data with locations
      const response = await processLocationQuery(query, allLocations, compareLocations);
      res.json({ 
        response: response.html,
        mentionedLocations: response.mentionedLocations 
      });
    } catch (error) {
      console.error("Error processing AI chat query:", error);
      res.status(500).json({ error: "Failed to process query" });
    }
  });
  
  // AI-generated City Summary
  app.post("/api/ai/summary", async (req, res) => {
    try {
      const { locationId } = req.body;
      
      if (!locationId) {
        return res.status(400).json({ error: "Location ID is required" });
      }
      
      // Get location data
      const location = await storage.getLocationById(locationId);
      
      if (!location) {
        return res.status(404).json({ error: "Location not found" });
      }
      
      // Enrich location with additional data if possible
      let enrichedLocation = location;
      try {
        enrichedLocation = await enrichLocationData(location);
      } catch (enrichError) {
        console.warn("Warning: Could not enrich location data for summary:", enrichError);
        // Continue with base location data
      }
      
      // Generate the city summary
      const summary = await generateCitySummary(enrichedLocation as any);
      res.json({ summary });
    } catch (error) {
      console.error("Error generating city summary:", error);
      res.status(500).json({ error: "Failed to generate city summary" });
    }
  });

  // Create HTTP server
  const httpServer = createServer(app);
  
  return httpServer;
}
