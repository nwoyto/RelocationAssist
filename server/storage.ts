import { users, type User, type InsertUser } from "@shared/schema";
import { Location, SavedLocation } from "@/lib/types";
import { sampleLocations } from "./sample-data";

// modify the interface with any CRUD methods
// you might need

export interface IStorage {
  getUser(id: number): Promise<User | undefined>;
  getUserByUsername(username: string): Promise<User | undefined>;
  createUser(user: InsertUser): Promise<User>;
  
  // Location methods
  getLocations(search?: string, region?: string): Promise<Location[]>;
  getLocationById(id: number): Promise<Location | undefined>;
  getLocationsByIds(ids: number[]): Promise<Location[]>;
  
  // Saved location methods
  getSavedLocations(userId: string): Promise<SavedLocation[]>;
  saveLocation(userId: string, locationId: number): Promise<SavedLocation>;
  removeSavedLocation(id: number): Promise<void>;
}

export class MemStorage implements IStorage {
  private users: Map<number, User>;
  private locations: Map<number, Location>;
  private savedLocations: Map<number, SavedLocation>;
  userCurrentId: number;
  savedLocationCurrentId: number;

  constructor() {
    this.users = new Map();
    this.locations = new Map();
    this.savedLocations = new Map();
    this.userCurrentId = 1;
    this.savedLocationCurrentId = 1;
    
    // Initialize with sample data
    this.initializeSampleData();
  }
  
  private initializeSampleData() {
    // Add sample locations
    sampleLocations.forEach(location => {
      this.locations.set(location.id, location);
    });
  }

  // User methods
  async getUser(id: number): Promise<User | undefined> {
    return this.users.get(id);
  }

  async getUserByUsername(username: string): Promise<User | undefined> {
    return Array.from(this.users.values()).find(
      (user) => user.username === username,
    );
  }

  async createUser(insertUser: InsertUser): Promise<User> {
    const id = this.userCurrentId++;
    const user: User = { ...insertUser, id };
    this.users.set(id, user);
    return user;
  }
  
  // Location methods
  async getLocations(search: string = '', region: string = ''): Promise<Location[]> {
    let locations = Array.from(this.locations.values());
    
    if (search) {
      const searchLower = search.toLowerCase();
      locations = locations.filter(
        location => location.name.toLowerCase().includes(searchLower) || 
                    location.state.toLowerCase().includes(searchLower)
      );
    }
    
    if (region && region !== 'All Regions') {
      locations = locations.filter(location => location.region === region);
    }
    
    return locations;
  }
  
  async getLocationById(id: number): Promise<Location | undefined> {
    return this.locations.get(id);
  }
  
  async getLocationsByIds(ids: number[]): Promise<Location[]> {
    return ids
      .map(id => this.locations.get(id))
      .filter((location): location is Location => !!location);
  }
  
  // Saved location methods
  async getSavedLocations(userId: string): Promise<SavedLocation[]> {
    return Array.from(this.savedLocations.values()).filter(
      savedLocation => savedLocation.userId === userId
    );
  }
  
  async saveLocation(userId: string, locationId: number): Promise<SavedLocation> {
    const id = this.savedLocationCurrentId++;
    const savedLocation: SavedLocation = { id, userId, locationId };
    this.savedLocations.set(id, savedLocation);
    return savedLocation;
  }
  
  async removeSavedLocation(id: number): Promise<void> {
    this.savedLocations.delete(id);
  }
}

export const storage = new MemStorage();
