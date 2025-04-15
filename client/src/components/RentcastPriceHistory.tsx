import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { apiRequest } from '@/lib/queryClient';
import { Card } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Skeleton } from '@/components/ui/skeleton';
import { Button } from '@/components/ui/button';
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer
} from 'recharts';

interface RentalPricePoint {
  date: string;
  price: number;
  change: number;
}

interface RentcastPriceHistoryProps {
  city: string;
  state: string;
  months?: number;
}

const RentcastPriceHistory = ({ city, state, months = 12 }: RentcastPriceHistoryProps) => {
  const [timeRange, setTimeRange] = useState(months);
  
  const { data, isLoading, error } = useQuery({
    queryKey: ['/api/rentcast/rental-history', city, state, timeRange],
    queryFn: () => 
      apiRequest<RentalPricePoint[]>(`/api/rentcast/rental-history?city=${encodeURIComponent(city)}&state=${encodeURIComponent(state)}&months=${timeRange}`, { on401: 'throw' }),
  });

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      maximumFractionDigits: 0,
    }).format(value);
  };

  const formatPercentage = (value: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'percent',
      signDisplay: 'exceptZero',
      maximumFractionDigits: 1,
    }).format(value / 100);
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { month: 'short', year: 'numeric' });
  };

  // Calculate overall trend
  const calculateTrend = () => {
    if (!data || !Array.isArray(data) || data.length < 2) return { value: 0, neutral: true };
    
    try {
      const firstPrice = typeof data[0].price === 'number' ? data[0].price : 0;
      const lastPrice = typeof data[data.length - 1].price === 'number' ? data[data.length - 1].price : 0;
      
      if (firstPrice === 0) return { value: 0, neutral: true };
      
      const percentChange = ((lastPrice - firstPrice) / firstPrice) * 100;
      
      return {
        value: percentChange,
        neutral: Math.abs(percentChange) < 1,
        positive: percentChange >= 0
      };
    } catch (error) {
      console.error("Error calculating trend:", error);
      return { value: 0, neutral: true };
    }
  };

  const trend = calculateTrend();

  if (isLoading) {
    return (
      <Card className="p-6">
        <Skeleton className="h-7 w-48 mb-6" />
        <Skeleton className="h-64" />
        <div className="flex justify-center mt-4">
          <Skeleton className="h-10 w-64" />
        </div>
      </Card>
    );
  }

  if (error) {
    return (
      <Card className="p-6 border-red-200 bg-red-50">
        <h3 className="text-lg font-medium text-red-800">Unable to load rental price history</h3>
        <p className="text-sm mt-1 text-red-600">We're having trouble connecting to our real estate data service. Please try again later.</p>
        <div className="mt-4 text-xs text-red-500">
          <p>Our rental price history data service is temporarily unavailable. 
          This may be due to API endpoint changes or service availability issues.</p>
          <p className="mt-1">We apologize for the inconvenience and are working to restore this feature.</p>
        </div>
      </Card>
    );
  }

  if (!data) {
    return (
      <Card className="p-6 border-blue-200 bg-blue-50">
        <h3 className="text-lg font-medium text-blue-800">No price history available</h3>
        <p className="text-sm mt-1 text-blue-600">We don't have rental price history data for {city}, {state} at this time. Please check back later.</p>
        
        <div className="bg-white rounded p-4 mt-4">
          <h4 className="text-sm font-medium text-blue-800 mb-2">About Rental Price History</h4>
          <p className="text-xs text-blue-600">When available, this feature shows rental price trends over time based on authentic data from multiple listing services and the Rentcast API.</p>
          
          <div className="mt-4">
            <h5 className="text-xs font-medium text-blue-800">Alternative sources:</h5>
            <ul className="text-xs text-blue-600 mt-1 space-y-1">
              <li>• Department of Housing and Urban Development (HUD)</li>
              <li>• Census Bureau Housing Data</li>
              <li>• Local real estate association reports</li>
            </ul>
          </div>
        </div>
      </Card>
    );
  }

  // Verify we have properly structured data array
  if (!Array.isArray(data)) {
    return (
      <Card className="p-6 border-blue-200 bg-blue-50">
        <h3 className="text-lg font-medium text-blue-800">Invalid rental price history data</h3>
        <p className="text-sm mt-1 text-blue-600">We received an unexpected data format for {city}, {state}. Our team has been notified.</p>
      </Card>
    );
  }

  // Make sure we have enough data points
  if (data.length === 0) {
    return (
      <Card className="p-6 border-blue-200 bg-blue-50">
        <h3 className="text-lg font-medium text-blue-800">No price history available</h3>
        <p className="text-sm mt-1 text-blue-600">We don't have rental price history data for {city}, {state} at this time. Please check back later.</p>
      </Card>
    );
  }

  // Ensure data is properly formatted for the chart
  const chartData = data.map(point => {
    if (!point || typeof point !== 'object') {
      return { date: new Date().toISOString(), price: 0, change: 0 };
    }
    return {
      ...point,
      formattedDate: typeof point.date === 'string' ? formatDate(point.date) : '',
      price: typeof point.price === 'number' ? point.price : 0,
      change: typeof point.change === 'number' ? point.change : 0
    };
  });

  const latestPrice = chartData.length > 0 ? chartData[chartData.length - 1].price : 0;

  return (
    <Card className="p-6">
      <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center mb-6">
        <h3 className="text-xl font-semibold mb-2 sm:mb-0">Rental Price History</h3>
        
        <div className="flex space-x-2">
          <Button 
            variant={timeRange === 6 ? "default" : "outline"} 
            size="sm" 
            onClick={() => setTimeRange(6)}
          >
            6 Months
          </Button>
          <Button 
            variant={timeRange === 12 ? "default" : "outline"} 
            size="sm" 
            onClick={() => setTimeRange(12)}
          >
            1 Year
          </Button>
          <Button 
            variant={timeRange === 24 ? "default" : "outline"} 
            size="sm" 
            onClick={() => setTimeRange(24)}
          >
            2 Years
          </Button>
        </div>
      </div>
      
      <div className="mb-4 flex items-center justify-between bg-gray-50 p-4 rounded-lg">
        <div>
          <p className="text-sm text-gray-500">Overall trend ({timeRange} months)</p>
          <div className="flex items-center mt-1">
            <span className={`text-lg font-bold ${trend.neutral ? 'text-gray-700' : (trend.positive ? 'text-green-600' : 'text-red-600')}`}>
              {formatPercentage(trend.value)}
            </span>
            {!trend.neutral && (
              <span className="material-icons text-lg ml-1">
                {trend.positive ? 'trending_up' : 'trending_down'}
              </span>
            )}
          </div>
        </div>
        
        <div className="text-right">
          <p className="text-sm text-gray-500">Current median rent</p>
          <p className="text-lg font-bold">
            {latestPrice > 0 ? formatCurrency(latestPrice) : 'N/A'}
          </p>
        </div>
      </div>
      
      <ResponsiveContainer width="100%" height={300}>
        <LineChart
          data={chartData}
          margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
        >
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="formattedDate" />
          <YAxis 
            domain={['auto', 'auto']}
            tickFormatter={(value) => `$${value}`}
          />
          <Tooltip
            formatter={(value) => [formatCurrency(value as number), 'Median Rent']}
            labelFormatter={(label) => `Date: ${label}`}
          />
          <Legend />
          <Line
            type="monotone"
            dataKey="price"
            name="Median Rent"
            stroke="#1a4480"
            activeDot={{ r: 8 }}
            strokeWidth={2}
          />
        </LineChart>
      </ResponsiveContainer>
      
      <p className="mt-4 text-xs text-gray-500 text-right">
        Data sourced from authentic rental listings for {city}, {state}
      </p>
    </Card>
  );
};

export default RentcastPriceHistory;