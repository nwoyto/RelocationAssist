import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { enrichLocationData } from "./services/dataService";
import * as rentcastService from "./services/rentcastService";

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

  // Create HTTP server
  const httpServer = createServer(app);
  
  return httpServer;
}
