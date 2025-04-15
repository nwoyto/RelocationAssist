import { users, locations, savedLocations, type User, type InsertUser, type Location, type SavedLocation, type InsertLocation, type InsertSavedLocation } from "@shared/schema";
import { db } from "./db";
import { eq, like, or, and, inArray } from "drizzle-orm";
import { sampleLocations } from "./sample-data";

// Interface for storage operations
export interface IStorage {
  getUser(id: number): Promise<User | undefined>;
  getUserByUsername(username: string): Promise<User | undefined>;
  createUser(user: InsertUser): Promise<User>;
  
  // Location methods
  getLocations(search?: string, region?: string): Promise<Location[]>;
  getLocationById(id: number): Promise<Location | undefined>;
  getLocationsByIds(ids: number[]): Promise<Location[]>;
  
  // Saved location methods
  getSavedLocations(userId: number): Promise<SavedLocation[]>;
  saveLocation(userId: number, locationId: number): Promise<SavedLocation>;
  removeSavedLocation(id: number): Promise<void>;
}

export class DatabaseStorage implements IStorage {
  async getUser(id: number): Promise<User | undefined> {
    const [user] = await db.select().from(users).where(eq(users.id, id));
    return user || undefined;
  }

  async getUserByUsername(username: string): Promise<User | undefined> {
    const [user] = await db.select().from(users).where(eq(users.username, username));
    return user || undefined;
  }

  async createUser(insertUser: InsertUser): Promise<User> {
    const [user] = await db
      .insert(users)
      .values(insertUser)
      .returning();
    return user;
  }
  
  async getLocations(search: string = '', region: string = ''): Promise<Location[]> {
    if (!search && !region) {
      return db.select().from(locations);
    }
    
    const conditions = [];
    
    if (search) {
      conditions.push(
        or(
          like(locations.name, `%${search}%`),
          like(locations.state, `%${search}%`)
        )
      );
    }
    
    if (region) {
      conditions.push(eq(locations.region, region));
    }
    
    return db.select().from(locations).where(and(...conditions));
  }
  
  async getLocationById(id: number): Promise<Location | undefined> {
    const [location] = await db.select().from(locations).where(eq(locations.id, id));
    return location || undefined;
  }
  
  async getLocationsByIds(ids: number[]): Promise<Location[]> {
    return db.select().from(locations).where(inArray(locations.id, ids));
  }
  
  async getSavedLocations(userId: number): Promise<SavedLocation[]> {
    return db.select().from(savedLocations).where(eq(savedLocations.userId, userId));
  }
  
  async saveLocation(userId: number, locationId: number): Promise<SavedLocation> {
    const [savedLocation] = await db
      .insert(savedLocations)
      .values({
        userId,
        locationId
      })
      .returning();
    return savedLocation;
  }
  
  async removeSavedLocation(id: number): Promise<void> {
    await db.delete(savedLocations).where(eq(savedLocations.id, id));
  }
}

// Initialize with database storage
export const storage = new DatabaseStorage();