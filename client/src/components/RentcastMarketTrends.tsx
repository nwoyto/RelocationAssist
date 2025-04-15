import { useQuery } from '@tanstack/react-query';
import { apiRequest } from '@/lib/queryClient';
import { Card } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { Skeleton } from '@/components/ui/skeleton';
import { 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  Legend,
  ResponsiveContainer,
  LineChart,
  Line
} from 'recharts';

interface MarketTrends {
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

interface RentcastMarketTrendsProps {
  city: string;
  state: string;
}

const RentcastMarketTrends = ({ city, state }: RentcastMarketTrendsProps) => {
  const { data, isLoading, error } = useQuery({
    queryKey: ['/api/rentcast/market-trends', city, state],
    queryFn: () => 
      apiRequest<MarketTrends>(`/api/rentcast/market-trends?city=${encodeURIComponent(city)}&state=${encodeURIComponent(state)}`, { on401: 'throw' }),
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

  // Prepare growth data for chart
  const prepareGrowthData = (data: MarketTrends | undefined) => {
    if (!data) return [];
    
    return [
      {
        name: '1 Month',
        rentGrowth: data.rentGrowth.oneMonth,
        priceGrowth: data.priceGrowth.oneMonth,
      },
      {
        name: '3 Months',
        rentGrowth: data.rentGrowth.threeMonth,
        priceGrowth: data.priceGrowth.threeMonth,
      },
      {
        name: '1 Year',
        rentGrowth: data.rentGrowth.oneYear,
        priceGrowth: data.priceGrowth.oneYear,
      },
    ];
  };

  if (isLoading) {
    return (
      <Card className="p-6">
        <Skeleton className="h-7 w-48 mb-6" />
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <Skeleton className="h-24" />
          <Skeleton className="h-24" />
          <Skeleton className="h-24" />
        </div>
        <Skeleton className="h-64 mt-6" />
      </Card>
    );
  }

  if (error) {
    return (
      <Card className="p-6 border-red-200 bg-red-50">
        <h3 className="text-lg font-medium text-red-800">Unable to load market trends</h3>
        <p className="text-sm mt-1 text-red-600">We're having trouble connecting to our real estate data service. Please try again later.</p>
        <div className="mt-4 text-xs text-red-500">
          <p>Our real estate data service is currently experiencing technical difficulties. 
          This may be due to API endpoint changes or service availability issues.</p>
          <p className="mt-1">We're working to restore real-time market data as soon as possible.</p>
        </div>
      </Card>
    );
  }

  if (!data) {
    return (
      <Card className="p-6 border-blue-200 bg-blue-50">
        <h3 className="text-lg font-medium text-blue-800">No market data available</h3>
        <p className="text-sm mt-1 text-blue-600">We don't have market trend data for {city}, {state} at this time. Please check back later.</p>
        <div className="flex flex-col md:flex-row gap-4 mt-4">
          <div className="bg-white rounded p-4 flex-1">
            <p className="text-sm font-medium text-blue-800">Alternative Data Sources</p>
            <ul className="text-xs text-blue-600 mt-2 space-y-1">
              <li>• Census Bureau Housing Data</li>
              <li>• HUD Market Reports</li>
              <li>• Local MLS Listings</li>
            </ul>
          </div>
          <div className="bg-white rounded p-4 flex-1">
            <p className="text-sm font-medium text-blue-800">Coming Soon</p>
            <p className="text-xs text-blue-600 mt-2">We're expanding our data sources to provide comprehensive real estate market information. Check back for updates.</p>
          </div>
        </div>
      </Card>
    );
  }

  const growthData = prepareGrowthData(data);

  return (
    <Card className="p-6">
      <h3 className="text-xl font-semibold mb-6">Real Estate Market Trends</h3>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-6">
        <div className="bg-gray-50 p-4 rounded-lg">
          <p className="text-sm text-gray-500 mb-1">Median Home Price</p>
          <p className="text-2xl font-bold">{formatCurrency(data.medianSalePrice)}</p>
          <div className="flex items-center mt-2 text-sm">
            <span className={`font-medium ${data.priceGrowth.oneYear >= 0 ? 'text-green-600' : 'text-red-600'}`}>
              {formatPercentage(data.priceGrowth.oneYear)}
            </span>
            <span className="text-gray-500 ml-1">year over year</span>
          </div>
        </div>
        
        <div className="bg-gray-50 p-4 rounded-lg">
          <p className="text-sm text-gray-500 mb-1">Median Rent</p>
          <p className="text-2xl font-bold">{formatCurrency(data.medianRent)}</p>
          <div className="flex items-center mt-2 text-sm">
            <span className={`font-medium ${data.rentGrowth.oneYear >= 0 ? 'text-green-600' : 'text-red-600'}`}>
              {formatPercentage(data.rentGrowth.oneYear)}
            </span>
            <span className="text-gray-500 ml-1">year over year</span>
          </div>
        </div>
        
        <div className="bg-gray-50 p-4 rounded-lg">
          <p className="text-sm text-gray-500 mb-1">Price Per Sq Ft</p>
          <p className="text-2xl font-bold">${data.pricePerSqft.toFixed(2)}</p>
          <div className="mt-2 text-sm text-gray-500">
            <span>Average Days on Market: </span>
            <span className="font-medium">{data.daysOnMarket}</span>
          </div>
        </div>
      </div>
      
      <div className="mt-8">
        <h4 className="text-lg font-medium mb-4">Growth Trends</h4>
        <ResponsiveContainer width="100%" height={300}>
          <BarChart
            data={growthData}
            margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
          >
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="name" />
            <YAxis tickFormatter={(value) => `${value}%`} />
            <Tooltip 
              formatter={(value) => [`${value}%`, '']} 
              labelFormatter={(label) => `Period: ${label}`}
            />
            <Legend />
            <Bar dataKey="rentGrowth" name="Rent Growth" fill="#8884d8" />
            <Bar dataKey="priceGrowth" name="Price Growth" fill="#82ca9d" />
          </BarChart>
        </ResponsiveContainer>
      </div>
      
      <div className="mt-2 text-xs text-gray-500 text-right">
        Data as of {new Date(data.timestamp).toLocaleDateString()}
      </div>
    </Card>
  );
};

export default RentcastMarketTrends;