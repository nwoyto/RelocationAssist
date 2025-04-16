import { docClient, TABLES } from "./dynamodb";
import { 
  PutCommand,
  GetCommand, 
  ScanCommand, 
  QueryCommand, 
  DeleteCommand 
} from "@aws-sdk/lib-dynamodb";
import type { 
  User, 
  InsertUser, 
  Location, 
  SavedLocation, 
  InsertSavedLocation 
} from "@shared/schema";
import { IStorage } from "./storage";

// Global ID counters (in a production app, you would use a proper ID generation strategy)
let locationIdCounter = 1;
let userIdCounter = 1;
let savedLocationIdCounter = 1;

/**
 * DynamoDB implementation of the storage interface
 */
export class DynamoStorage implements IStorage {
  
  // Initialize the counters when the storage is created
  constructor() {
    this.initializeCounters();
  }
  
  /**
   * Initialize the ID counters by scanning the tables to find the max IDs
   */
  private async initializeCounters() {
    try {
      // Get max location ID
      const locationResponse = await docClient.send(
        new ScanCommand({
          TableName: TABLES.LOCATIONS,
          ProjectionExpression: "id"
        })
      );
      
      if (locationResponse.Items && locationResponse.Items.length > 0) {
        const maxLocationId = Math.max(...locationResponse.Items.map(item => item.id));
        locationIdCounter = maxLocationId + 1;
      }
      
      // Get max user ID
      const userResponse = await docClient.send(
        new ScanCommand({
          TableName: TABLES.USERS,
          ProjectionExpression: "id"
        })
      );
      
      if (userResponse.Items && userResponse.Items.length > 0) {
        const maxUserId = Math.max(...userResponse.Items.map(item => item.id));
        userIdCounter = maxUserId + 1;
      }
      
      // Get max saved location ID
      const savedLocationResponse = await docClient.send(
        new ScanCommand({
          TableName: TABLES.SAVED_LOCATIONS,
          ProjectionExpression: "id"
        })
      );
      
      if (savedLocationResponse.Items && savedLocationResponse.Items.length > 0) {
        const maxSavedLocationId = Math.max(...savedLocationResponse.Items.map(item => item.id));
        savedLocationIdCounter = maxSavedLocationId + 1;
      }
      
      console.log(`DynamoDB ID counters initialized: locations=${locationIdCounter}, users=${userIdCounter}, savedLocations=${savedLocationIdCounter}`);
    } catch (error) {
      console.error("Error initializing ID counters:", error);
      // Continue with default values if there's an error
    }
  }
  
  /**
   * Get a user by ID
   */
  async getUser(id: number): Promise<User | undefined> {
    try {
      const response = await docClient.send(
        new GetCommand({
          TableName: TABLES.USERS,
          Key: { id }
        })
      );
      
      return response.Item as User;
    } catch (error) {
      console.error(`Error getting user ${id}:`, error);
      return undefined;
    }
  }
  
  /**
   * Get a user by username
   */
  async getUserByUsername(username: string): Promise<User | undefined> {
    try {
      const response = await docClient.send(
        new QueryCommand({
          TableName: TABLES.USERS,
          IndexName: "UsernameIndex",
          KeyConditionExpression: "username = :username",
          ExpressionAttributeValues: {
            ":username": username
          }
        })
      );
      
      if (response.Items && response.Items.length > 0) {
        return response.Items[0] as User;
      }
      
      return undefined;
    } catch (error) {
      console.error(`Error getting user by username ${username}:`, error);
      return undefined;
    }
  }
  
  /**
   * Create a new user
   */
  async createUser(insertUser: InsertUser): Promise<User> {
    try {
      const id = userIdCounter++;
      const user: User = {
        ...insertUser,
        id,
        createdAt: new Date().toISOString()
      };
      
      await docClient.send(
        new PutCommand({
          TableName: TABLES.USERS,
          Item: user
        })
      );
      
      return user;
    } catch (error) {
      console.error(`Error creating user:`, error);
      throw error;
    }
  }
  
  /**
   * Get locations with optional filtering
   */
  async getLocations(search: string = '', region: string = ''): Promise<Location[]> {
    try {
      let response;
      
      if (region) {
        // If region is specified, use the RegionIndex
        response = await docClient.send(
          new QueryCommand({
            TableName: TABLES.LOCATIONS,
            IndexName: "RegionIndex",
            KeyConditionExpression: "region = :region",
            ExpressionAttributeValues: {
              ":region": region
            }
          })
        );
      } else {
        // Otherwise scan the entire table
        response = await docClient.send(
          new ScanCommand({
            TableName: TABLES.LOCATIONS
          })
        );
      }
      
      if (response.Items) {
        // Apply search filter if specified
        if (search) {
          const searchLower = search.toLowerCase();
          return (response.Items as Location[]).filter(
            location => 
              location.name.toLowerCase().includes(searchLower) || 
              location.state.toLowerCase().includes(searchLower)
          );
        }
        
        return response.Items as Location[];
      }
      
      return [];
    } catch (error) {
      console.error(`Error getting locations:`, error);
      return [];
    }
  }
  
  /**
   * Get a location by ID
   */
  async getLocationById(id: number): Promise<Location | undefined> {
    try {
      const response = await docClient.send(
        new GetCommand({
          TableName: TABLES.LOCATIONS,
          Key: { id }
        })
      );
      
      return response.Item as Location;
    } catch (error) {
      console.error(`Error getting location ${id}:`, error);
      return undefined;
    }
  }
  
  /**
   * Get multiple locations by their IDs
   */
  async getLocationsByIds(ids: number[]): Promise<Location[]> {
    try {
      // DynamoDB doesn't have a direct batch get with a list of IDs in the same way SQL does
      // So we'll fetch each location individually and combine the results
      const locationPromises = ids.map(id => this.getLocationById(id));
      const locations = await Promise.all(locationPromises);
      
      // Filter out any undefined values (locations that weren't found)
      return locations.filter(location => location !== undefined) as Location[];
    } catch (error) {
      console.error(`Error getting locations by ids:`, error);
      return [];
    }
  }
  
  /**
   * Get saved locations for a user
   */
  async getSavedLocations(userId: number): Promise<SavedLocation[]> {
    try {
      const response = await docClient.send(
        new QueryCommand({
          TableName: TABLES.SAVED_LOCATIONS,
          IndexName: "UserIdIndex",
          KeyConditionExpression: "userId = :userId",
          ExpressionAttributeValues: {
            ":userId": userId
          }
        })
      );
      
      if (response.Items) {
        return response.Items as SavedLocation[];
      }
      
      return [];
    } catch (error) {
      console.error(`Error getting saved locations for user ${userId}:`, error);
      return [];
    }
  }
  
  /**
   * Save a location for a user
   */
  async saveLocation(userId: number, locationId: number): Promise<SavedLocation> {
    try {
      const id = savedLocationIdCounter++;
      const savedLocation: SavedLocation = {
        id,
        userId,
        locationId,
        createdAt: new Date().toISOString()
      };
      
      await docClient.send(
        new PutCommand({
          TableName: TABLES.SAVED_LOCATIONS,
          Item: savedLocation
        })
      );
      
      return savedLocation;
    } catch (error) {
      console.error(`Error saving location ${locationId} for user ${userId}:`, error);
      throw error;
    }
  }
  
  /**
   * Remove a saved location
   */
  async removeSavedLocation(id: number): Promise<void> {
    try {
      await docClient.send(
        new DeleteCommand({
          TableName: TABLES.SAVED_LOCATIONS,
          Key: { id }
        })
      );
    } catch (error) {
      console.error(`Error removing saved location ${id}:`, error);
      throw error;
    }
  }
}