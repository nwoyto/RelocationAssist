import { pgTable, text, serial, integer, boolean, decimal, jsonb } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

// Location schema
export const locations = pgTable("locations", {
  id: serial("id").primaryKey(),
  name: text("name").notNull(),
  state: text("state").notNull(),
  region: text("region").notNull(),
  population: integer("population").notNull(),
  medianAge: decimal("median_age").notNull(),
  medianIncome: integer("median_income").notNull(),
  costOfLiving: decimal("cost_of_living").notNull(), // Index relative to national average (100)
  averageCommute: integer("average_commute").notNull(), // in minutes
  climate: text("climate").notNull(),
  cbpFacilities: integer("cbp_facilities").notNull(),
  rating: decimal("rating").notNull(),
  lat: decimal("lat").notNull(),
  lng: decimal("lng").notNull(),
  housingData: jsonb("housing_data").notNull(),
  schoolData: jsonb("school_data").notNull(),
  safetyData: jsonb("safety_data").notNull(),
  lifestyleData: jsonb("lifestyle_data").notNull(),
  transportationData: jsonb("transportation_data").notNull(),
});

// Saved locations schema
export const savedLocations = pgTable("saved_locations", {
  id: serial("id").primaryKey(),
  userId: text("user_id").notNull(),
  locationId: integer("location_id").notNull(),
});

// User schema (extending the existing one)
export const users = pgTable("users", {
  id: serial("id").primaryKey(),
  username: text("username").notNull().unique(),
  password: text("password").notNull(),
  email: text("email"),
  firstName: text("first_name"),
  lastName: text("last_name"),
});

// Insert schemas
export const insertLocationSchema = createInsertSchema(locations);
export const insertSavedLocationSchema = createInsertSchema(savedLocations);
export const insertUserSchema = createInsertSchema(users).pick({
  username: true,
  password: true,
  email: true,
  firstName: true,
  lastName: true,
});

// Types
export type Location = typeof locations.$inferSelect;
export type InsertLocation = z.infer<typeof insertLocationSchema>;
export type SavedLocation = typeof savedLocations.$inferSelect;
export type InsertSavedLocation = z.infer<typeof insertSavedLocationSchema>;
export type User = typeof users.$inferSelect;
export type InsertUser = z.infer<typeof insertUserSchema>;
