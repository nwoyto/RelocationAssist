import { DynamoDBClient } from "@aws-sdk/client-dynamodb";
import { DynamoDBDocumentClient, GetCommand, PutCommand, QueryCommand, ScanCommand, DeleteCommand } from "@aws-sdk/lib-dynamodb";

// Check for AWS credentials in environment variables
const hasAwsCredentials = process.env.AWS_ACCESS_KEY_ID && process.env.AWS_SECRET_ACCESS_KEY;

// Configure DynamoDB client
export const client = new DynamoDBClient({
  region: process.env.AWS_REGION || "us-east-1",
  
  // Use environment credentials if available, otherwise use local endpoint
  ...(hasAwsCredentials 
    ? {} 
    : { 
        endpoint: process.env.DYNAMODB_ENDPOINT || "http://localhost:8000",
        credentials: {
          accessKeyId: "LOCAL_MOCK_KEY",
          secretAccessKey: "LOCAL_MOCK_SECRET",
        }
      })
});

// Create a document client for easier interaction with DynamoDB
export const docClient = DynamoDBDocumentClient.from(client);

// DynamoDB table names
export const TABLES = {
  LOCATIONS: "cbp_locations",
  USERS: "cbp_users",
  SAVED_LOCATIONS: "cbp_saved_locations"
};

/**
 * Create the DynamoDB tables required for the application
 * This function should be called when the application starts
 */
export async function createTablesIfNotExist() {
  try {
    console.log('Checking and creating DynamoDB tables if needed...');
    
    // For actual implementation, use the full AWS SDK to create tables
    // as the client-dynamodb package doesn't include a CreateTable command
    const AWS = require('aws-sdk');
    
    const dynamodb = new AWS.DynamoDB({
      region: process.env.AWS_REGION || "us-east-1",
      ...(hasAwsCredentials 
        ? {} 
        : { 
            endpoint: process.env.DYNAMODB_ENDPOINT || "http://localhost:8000",
            credentials: {
              accessKeyId: "LOCAL_MOCK_KEY",
              secretAccessKey: "LOCAL_MOCK_SECRET",
            }
          })
    });
    
    // Define and create the locations table
    const locationsTableParams = {
      TableName: TABLES.LOCATIONS,
      KeySchema: [
        { AttributeName: "id", KeyType: "HASH" }
      ],
      AttributeDefinitions: [
        { AttributeName: "id", AttributeType: "N" },
        { AttributeName: "region", AttributeType: "S" }
      ],
      GlobalSecondaryIndexes: [
        {
          IndexName: "RegionIndex",
          KeySchema: [
            { AttributeName: "region", KeyType: "HASH" }
          ],
          Projection: {
            ProjectionType: "ALL"
          },
          ProvisionedThroughput: {
            ReadCapacityUnits: 5,
            WriteCapacityUnits: 5
          }
        }
      ],
      ProvisionedThroughput: {
        ReadCapacityUnits: 5,
        WriteCapacityUnits: 5
      }
    };
    
    // Define and create the users table
    const usersTableParams = {
      TableName: TABLES.USERS,
      KeySchema: [
        { AttributeName: "id", KeyType: "HASH" }
      ],
      AttributeDefinitions: [
        { AttributeName: "id", AttributeType: "N" },
        { AttributeName: "username", AttributeType: "S" }
      ],
      GlobalSecondaryIndexes: [
        {
          IndexName: "UsernameIndex",
          KeySchema: [
            { AttributeName: "username", KeyType: "HASH" }
          ],
          Projection: {
            ProjectionType: "ALL"
          },
          ProvisionedThroughput: {
            ReadCapacityUnits: 5,
            WriteCapacityUnits: 5
          }
        }
      ],
      ProvisionedThroughput: {
        ReadCapacityUnits: 5,
        WriteCapacityUnits: 5
      }
    };
    
    // Define and create the saved locations table
    const savedLocationsTableParams = {
      TableName: TABLES.SAVED_LOCATIONS,
      KeySchema: [
        { AttributeName: "id", KeyType: "HASH" }
      ],
      AttributeDefinitions: [
        { AttributeName: "id", AttributeType: "N" },
        { AttributeName: "userId", AttributeType: "N" }
      ],
      GlobalSecondaryIndexes: [
        {
          IndexName: "UserIdIndex",
          KeySchema: [
            { AttributeName: "userId", KeyType: "HASH" }
          ],
          Projection: {
            ProjectionType: "ALL"
          },
          ProvisionedThroughput: {
            ReadCapacityUnits: 5,
            WriteCapacityUnits: 5
          }
        }
      ],
      ProvisionedThroughput: {
        ReadCapacityUnits: 5,
        WriteCapacityUnits: 5
      }
    };
    
    // Create tables if they don't exist
    try {
      await createTableIfNotExists(dynamodb, locationsTableParams);
      await createTableIfNotExists(dynamodb, usersTableParams);
      await createTableIfNotExists(dynamodb, savedLocationsTableParams);
      console.log('DynamoDB tables setup complete.');
    } catch (error) {
      console.error('Error setting up DynamoDB tables:', error);
    }
    
  } catch (error) {
    console.error('Error in createTablesIfNotExist:', error);
  }
}

/**
 * Helper function to create a table if it doesn't exist
 */
async function createTableIfNotExists(dynamodb: any, params: any) {
  try {
    // Check if table exists
    await dynamodb.describeTable({ TableName: params.TableName }).promise();
    console.log(`Table ${params.TableName} already exists.`);
  } catch (error: any) {
    // If error is TableNotFound, create the table
    if (error.code === 'ResourceNotFoundException') {
      console.log(`Creating table ${params.TableName}...`);
      await dynamodb.createTable(params).promise();
      console.log(`Table ${params.TableName} created.`);
      
      // Wait for table to be active
      console.log(`Waiting for table ${params.TableName} to be active...`);
      await dynamodb.waitFor('tableExists', { TableName: params.TableName }).promise();
      console.log(`Table ${params.TableName} is now active.`);
    } else {
      throw error;
    }
  }
}