import { db } from "../server/db";
import { locations, users, savedLocations } from "../shared/schema";
import { sql } from "drizzle-orm";

async function main() {
  console.log("Creating database tables...");

  try {
    // Create tables
    await db.execute(sql`
      CREATE TABLE IF NOT EXISTS "users" (
        "id" SERIAL PRIMARY KEY,
        "username" TEXT NOT NULL UNIQUE,
        "password" TEXT NOT NULL,
        "email" TEXT,
        "first_name" TEXT,
        "last_name" TEXT,
        "created_at" TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        "updated_at" TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      );

      CREATE TABLE IF NOT EXISTS "locations" (
        "id" SERIAL PRIMARY KEY,
        "name" TEXT NOT NULL,
        "state" TEXT NOT NULL,
        "region" TEXT NOT NULL,
        "population" INTEGER NOT NULL,
        "median_age" DECIMAL NOT NULL,
        "median_income" INTEGER NOT NULL,
        "cost_of_living" DECIMAL NOT NULL,
        "average_commute" INTEGER NOT NULL,
        "climate" TEXT NOT NULL,
        "cbp_facilities" INTEGER NOT NULL,
        "rating" DECIMAL NOT NULL,
        "lat" DECIMAL NOT NULL,
        "lng" DECIMAL NOT NULL,
        "housing_data" JSONB NOT NULL,
        "school_data" JSONB NOT NULL,
        "safety_data" JSONB NOT NULL,
        "lifestyle_data" JSONB NOT NULL,
        "transportation_data" JSONB NOT NULL,
        "created_at" TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        "updated_at" TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      );

      CREATE TABLE IF NOT EXISTS "saved_locations" (
        "id" SERIAL PRIMARY KEY,
        "user_id" INTEGER NOT NULL REFERENCES "users"("id") ON DELETE CASCADE,
        "location_id" INTEGER NOT NULL REFERENCES "locations"("id") ON DELETE CASCADE,
        "created_at" TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      );
    `);

    console.log("Database tables created successfully!");
  } catch (error) {
    console.error("Error creating database tables:", error);
  } finally {
    process.exit(0);
  }
}

main();