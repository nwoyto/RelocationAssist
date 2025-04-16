import { db, pool } from './db';
import { createTablesIfNotExist, docClient, TABLES } from './dynamodb';
import { PutCommand } from '@aws-sdk/lib-dynamodb';
import { locations, users, savedLocations } from '@shared/schema';
import { eq } from 'drizzle-orm';

/**
 * Migrate data from PostgreSQL to DynamoDB
 * This script will:
 * 1. Create the DynamoDB tables if they don't exist
 * 2. Export data from PostgreSQL
 * 3. Import data into DynamoDB
 */
async function migrateData() {
  try {
    console.log('Starting migration from PostgreSQL to DynamoDB...');

    // 1. Create DynamoDB tables if they don't exist
    await createTablesIfNotExist();

    // 2. Export data from PostgreSQL

    // Get all locations
    console.log('Exporting locations from PostgreSQL...');
    const locationRows = await db.select().from(locations);
    console.log(`Found ${locationRows.length} locations to migrate.`);

    // Get all users
    console.log('Exporting users from PostgreSQL...');
    const userRows = await db.select().from(users);
    console.log(`Found ${userRows.length} users to migrate.`);

    // Get all saved locations
    console.log('Exporting saved locations from PostgreSQL...');
    const savedLocationRows = await db.select().from(savedLocations);
    console.log(`Found ${savedLocationRows.length} saved locations to migrate.`);

    // 3. Import data into DynamoDB

    // Import locations
    console.log('Importing locations to DynamoDB...');
    for (const location of locationRows) {
      await docClient.send(
        new PutCommand({
          TableName: TABLES.LOCATIONS,
          Item: location
        })
      );
    }
    console.log('Locations migration complete.');

    // Import users
    console.log('Importing users to DynamoDB...');
    for (const user of userRows) {
      await docClient.send(
        new PutCommand({
          TableName: TABLES.USERS,
          Item: user
        })
      );
    }
    console.log('Users migration complete.');

    // Import saved locations
    console.log('Importing saved locations to DynamoDB...');
    for (const savedLocation of savedLocationRows) {
      await docClient.send(
        new PutCommand({
          TableName: TABLES.SAVED_LOCATIONS,
          Item: savedLocation
        })
      );
    }
    console.log('Saved locations migration complete.');

    console.log('Migration from PostgreSQL to DynamoDB completed successfully!');

  } catch (error) {
    console.error('Error during migration:', error);
  } finally {
    // Close PostgreSQL connection
    await pool.end();
  }
}

// Run the migration
migrateData().catch(console.error);