import { pgTable, text, serial, integer, boolean, decimal, jsonb, timestamp } from "drizzle-orm/pg-core";
import { relations } from "drizzle-orm";
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
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

// User schema
export const users = pgTable("users", {
  id: serial("id").primaryKey(),
  username: text("username").notNull().unique(),
  password: text("password").notNull(),
  email: text("email"),
  firstName: text("first_name"),
  lastName: text("last_name"),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

// Saved locations schema
export const savedLocations = pgTable("saved_locations", {
  id: serial("id").primaryKey(),
  userId: integer("user_id").notNull().references(() => users.id, { onDelete: 'cascade' }),
  locationId: integer("location_id").notNull().references(() => locations.id, { onDelete: 'cascade' }),
  createdAt: timestamp("created_at").defaultNow(),
});

// Define relationships between tables
export const locationsRelations = relations(locations, ({ many }) => ({
  savedLocations: many(savedLocations),
}));

export const usersRelations = relations(users, ({ many }) => ({
  savedLocations: many(savedLocations),
}));

export const savedLocationsRelations = relations(savedLocations, ({ one }) => ({
  user: one(users, {
    fields: [savedLocations.userId],
    references: [users.id],
  }),
  location: one(locations, {
    fields: [savedLocations.locationId],
    references: [locations.id],
  }),
}));

// Insert schemas
export const insertLocationSchema = createInsertSchema(locations).omit({
  id: true,
  createdAt: true,
  updatedAt: true,
});
export const insertSavedLocationSchema = createInsertSchema(savedLocations).omit({
  id: true,
  createdAt: true,
});
export const insertUserSchema = createInsertSchema(users).omit({
  id: true,
  createdAt: true,
  updatedAt: true,
});

// Types
export type Location = typeof locations.$inferSelect;
export type InsertLocation = z.infer<typeof insertLocationSchema>;
export type SavedLocation = typeof savedLocations.$inferSelect;
export type InsertSavedLocation = z.infer<typeof insertSavedLocationSchema>;
export type User = typeof users.$inferSelect;
export type InsertUser = z.infer<typeof insertUserSchema>;
