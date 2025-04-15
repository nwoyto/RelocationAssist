import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";

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
      
      res.json(location);
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

  // API Routes for comparison
  app.get("/api/compare", async (req, res) => {
    try {
      const locationIds = req.query.ids as string;
      
      if (!locationIds) {
        return res.status(400).json({ error: "Location IDs are required" });
      }
      
      const ids = locationIds.split(',').map(id => parseInt(id));
      const locations = await storage.getLocationsByIds(ids);
      res.json(locations);
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch locations for comparison" });
    }
  });

  // Create HTTP server
  const httpServer = createServer(app);
  
  return httpServer;
}
