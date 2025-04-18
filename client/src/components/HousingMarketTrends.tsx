import { useState, useEffect } from 'react';
import axios from 'axios';
import { Card } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';
import { Badge } from '@/components/ui/badge';
import { Database } from 'lucide-react';

interface HousingMarketTrendsProps {
  city: string;
  state: string;
}

interface RentcastMarketData {
  city: string;
  state: string;
  medianRent: number;
  medianSalePrice: number;
  pricePerSqft: number;
  rentGrowth: {
    oneMonth: number;
    threeMonth: number;
    oneYear: number;
  };
  priceGrowth: {
    oneMonth: number;
    threeMonth: number;
    oneYear: number;
  };
  daysOnMarket: number;
  inventory: number;
  timestamp: string;
}

interface CensusHousingData {
  totalHousingUnits: number;
  occupiedHousingUnits: number;
  ownerOccupied: number;
  renterOccupied: number;
  vacancyRate: number;
  homeownershipRate: number;
  medianHomeValue: number;
  medianRent: number;
  housingAge: {
    builtBefore1970: number;
    built1970to1999: number;
    builtAfter2000: number;
  };
}

export default function HousingMarketTrends({ city, state }: HousingMarketTrendsProps) {
  const [loading, setLoading] = useState(true);
  const [rentcastData, setRentcastData] = useState<RentcastMarketData | null>(null);
  const [censusData, setCensusData] = useState<CensusHousingData | null>(null);
  const [dataSource, setDataSource] = useState<'rentcast' | 'census' | 'none'>('none');
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      setError(null);
      
      try {
        // Try Rentcast API first
        const rentcastResponse = await axios.get(`/api/rentcast/market-trends?city=${city}&state=${state}`);
        if (rentcastResponse.data && Object.keys(rentcastResponse.data).length > 0) {
          setRentcastData(rentcastResponse.data);
          setDataSource('rentcast');
          setLoading(false);
          return;
        }
        
        // If Rentcast doesn't have data, fallback to Census data
        const censusResponse = await axios.get(`/api/census/housing?city=${city}&state=${state}`);
        if (censusResponse.data) {
          setCensusData(censusResponse.data);
          setDataSource('census');
        } else {
          setDataSource('none');
          setError('No market data available for this location');
        }
      } catch (err) {
        console.error('Error fetching housing market data:', err);
        setError('Error loading market data');
        setDataSource('none');
      } finally {
        setLoading(false);
      }
    };
    
    fetchData();
  }, [city, state]);

  const formatCurrency = (value: number) => {
    return `$${value.toLocaleString()}`;
  };

  const formatPercentage = (value: number) => {
    const sign = value >= 0 ? '+' : '';
    return `${sign}${value.toFixed(1)}%`;
  };

  if (loading) {
    return (
      <div className="space-y-4">
        <Skeleton className="h-8 w-3/4" />
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <Skeleton className="h-28" />
          <Skeleton className="h-28" />
          <Skeleton className="h-28" />
        </div>
      </div>
    );
  }

  if (error && dataSource === 'none') {
    return (
      <Card className="p-6">
        <div className="text-center p-6">
          <h3 className="text-xl font-semibold mb-2">No market data available</h3>
          <p className="text-neutral-500 mb-4">
            We don't have market trend data for {city}, {state} at this time. Please check back later.
          </p>
          <div className="text-sm text-neutral-400">
            <h4 className="font-medium mb-2">Alternative Data Sources:</h4>
            <ul className="list-disc list-inside">
              <li>Census Bureau Housing Data</li>
              <li>HUD Market Reports</li>
              <li>Local MLS Listings</li>
            </ul>
          </div>
          <div className="mt-4 text-sm text-neutral-400">
            <p>Coming Soon:</p>
            <p className="text-xs">
              We're expanding our data sources to provide comprehensive real estate market information. 
              Check back for updates.
            </p>
          </div>
        </div>
      </Card>
    );
  }

  if (dataSource === 'rentcast' && rentcastData) {
    return (
      <Card className="p-6">
        <div className="flex justify-between items-center mb-6">
          <h3 className="text-xl font-semibold">Real Estate Market Trends</h3>
          <Badge variant="outline" className="text-xs">Rentcast Data</Badge>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
          <div className="bg-gray-50 p-4 rounded-lg">
            <p className="text-sm text-gray-500 mb-1">Median Home Price</p>
            <p className="text-2xl font-bold">{formatCurrency(rentcastData.medianSalePrice)}</p>
            <div className="flex items-center mt-2 text-sm">
              <span className={`font-medium ${rentcastData.priceGrowth.oneYear >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                {formatPercentage(rentcastData.priceGrowth.oneYear)}
              </span>
              <span className="text-gray-500 ml-1">year over year</span>
            </div>
          </div>
          
          <div className="bg-gray-50 p-4 rounded-lg">
            <p className="text-sm text-gray-500 mb-1">Median Rent</p>
            <p className="text-2xl font-bold">{formatCurrency(rentcastData.medianRent)}</p>
            <div className="flex items-center mt-2 text-sm">
              <span className={`font-medium ${rentcastData.rentGrowth.oneYear >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                {formatPercentage(rentcastData.rentGrowth.oneYear)}
              </span>
              <span className="text-gray-500 ml-1">year over year</span>
            </div>
          </div>
          
          <div className="bg-gray-50 p-4 rounded-lg">
            <p className="text-sm text-gray-500 mb-1">Price Per Sq Ft</p>
            <p className="text-2xl font-bold">{formatCurrency(rentcastData.pricePerSqft)}</p>
            <div className="flex items-center mt-2 text-sm">
              <span className="text-gray-500">Avg days on market: {rentcastData.daysOnMarket}</span>
            </div>
          </div>
        </div>
        
        <div className="text-xs text-gray-500 mt-3">
          <p>Last updated: {new Date(rentcastData.timestamp).toLocaleDateString()}</p>
        </div>
      </Card>
    );
  }

  if (dataSource === 'census' && censusData) {
    return (
      <Card className="p-6">
        <div className="flex justify-between items-center mb-6">
          <h3 className="text-xl font-semibold">Housing Market Data</h3>
          <div className="flex items-center">
            <Database className="h-4 w-4 mr-1 text-blue-600" />
            <Badge variant="outline" className="text-xs">Census Bureau Data</Badge>
          </div>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
          <div className="bg-gray-50 p-4 rounded-lg">
            <p className="text-sm text-gray-500 mb-1">Median Home Value</p>
            <p className="text-2xl font-bold">{formatCurrency(censusData.medianHomeValue)}</p>
            <div className="flex items-center mt-2 text-sm">
              <span className="text-gray-500">From American Community Survey</span>
            </div>
          </div>
          
          <div className="bg-gray-50 p-4 rounded-lg">
            <p className="text-sm text-gray-500 mb-1">Median Monthly Rent</p>
            <p className="text-2xl font-bold">{formatCurrency(censusData.medianRent)}</p>
            <div className="flex items-center mt-2 text-sm">
              <span className="text-gray-500">Census Bureau estimate</span>
            </div>
          </div>
          
          <div className="bg-gray-50 p-4 rounded-lg">
            <p className="text-sm text-gray-500 mb-1">Homeownership Rate</p>
            <p className="text-2xl font-bold">{censusData.homeownershipRate}%</p>
            <div className="flex items-center mt-2 text-sm">
              <span className="text-gray-500">Vacancy rate: {censusData.vacancyRate}%</span>
            </div>
          </div>
        </div>
        
        <div className="mt-4 mb-2">
          <h4 className="text-sm font-medium mb-3">Housing Age Distribution</h4>
          <div className="bg-gray-50 p-4 rounded-lg">
            <div className="grid grid-cols-3 gap-2">
              <div>
                <p className="text-xs text-gray-500 mb-1">Built before 1970</p>
                <p className="font-medium">{censusData.housingAge.builtBefore1970}%</p>
              </div>
              <div>
                <p className="text-xs text-gray-500 mb-1">Built 1970-1999</p>
                <p className="font-medium">{censusData.housingAge.built1970to1999}%</p>
              </div>
              <div>
                <p className="text-xs text-gray-500 mb-1">Built after 2000</p>
                <p className="font-medium">{censusData.housingAge.builtAfter2000}%</p>
              </div>
            </div>
          </div>
        </div>
        
        <div className="text-xs text-gray-500 mt-3">
          <p>Source: Census Bureau - American Community Survey (Last updated: 2021)</p>
        </div>
      </Card>
    );
  }

  return null;
}