# CBP Relocation Resources Platform

A comprehensive web platform designed to support CBP employees in making informed relocation decisions by providing detailed, integrated community and housing data analysis.

## Features

- Interactive location search and comparison
- Detailed housing market analysis with real estate data
- Education and school information
- Safety and crime statistics
- Interactive mapping with geographical visualization
- Side-by-side location comparison

## Technologies Used

- **Frontend**: React, TypeScript, TailwindCSS, shadcn/ui
- **Backend**: Node.js, Express
- **Database**: PostgreSQL with Drizzle ORM
- **Data Visualization**: Recharts, Leaflet for mapping
- **API Integration**: Data.gov APIs, Rentcast API for real estate data

## API Keys Required

To run this application, you will need to provide the following API keys in your environment variables:

- `RENTCAST_API_KEY` - For real estate data (property listings, market trends)
- `CENSUS_API_KEY` - For Census Bureau housing data
- `EDUCATION_DATA_API_KEY` - For education statistics
- `CRIME_DATA_API_KEY` - For crime data

## Getting Started

1. Clone the repository
2. Install dependencies: `npm install`
3. Create a `.env` file with the required API keys
4. Set up the PostgreSQL database
5. Run database migrations: `npm run db:push`
6. Start the development server: `npm run dev`

## Project Structure

- `/client` - Frontend React application
- `/server` - Backend Express server
- `/shared` - Shared types and utilities
- `/scripts` - Utility scripts

## License

This project is licensed under the MIT License - see the LICENSE file for details.

## Acknowledgments

- Data provided by data.gov and Rentcast API
- Icons from Lucide React
- Built with React, Express, and PostgreSQL