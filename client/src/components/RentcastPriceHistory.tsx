import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { apiRequest } from '@lib/queryClient';
import { Card } from '@components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@components/ui/tabs';
import { Skeleton } from '@components/ui/skeleton';
import { Button } from '@components/ui/button';
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
    if (!data || data.length < 2) return { value: 0, neutral: true };
    
    const firstPrice = data[0].price;
    const lastPrice = data[data.length - 1].price;
    const percentChange = ((lastPrice - firstPrice) / firstPrice) * 100;
    
    return {
      value: percentChange,
      neutral: Math.abs(percentChange) < 1,
      positive: percentChange >= 0
    };
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
      </Card>
    );
  }

  if (!data || data.length === 0) {
    return (
      <Card className="p-6 border-blue-200 bg-blue-50">
        <h3 className="text-lg font-medium text-blue-800">No price history available</h3>
        <p className="text-sm mt-1 text-blue-600">We don't have rental price history data for {city}, {state} at this time. Please check back later.</p>
      </Card>
    );
  }

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
            {data.length > 0 ? formatCurrency(data[data.length - 1].price) : 'N/A'}
          </p>
        </div>
      </div>
      
      <ResponsiveContainer width="100%" height={300}>
        <LineChart
          data={data.map(point => ({
            ...point,
            formattedDate: formatDate(point.date)
          }))}
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