import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend, BarChart, Bar } from 'recharts';

interface SeasonalData {
  season: string;
  avgTempF: number;
  totalPrecipitation: number;
}

interface ClimateSummary {
  annualAvgTempF: number;
  annualAvgMaxTempF: number;
  annualAvgMinTempF: number;
  annualPrecipitation: number;
  annualSnowfall: number;
  avgSunnyDays: number;
  avgRainyDays: number;
  avgSnowyDays: number;
  comfortIndex: number;
  climateType: string;
}

interface ExtremeWeatherEvents {
  annualTornadoes: number;
  annualHurricanes: number;
  annualFloods: number;
  annualBlizzards: number;
  annualDroughts: number;
  annualHeatWaves: number;
  riskLevel: {
    tornado: number;
    hurricane: number;
    flood: number;
    winterStorm: number;
    drought: number;
    heatWave: number;
  };
}

interface MonthlyTemperatureData {
  month: string;
  avgTempF: number;
  avgMaxTempF: number;
  avgMinTempF: number;
}

interface MonthlyPrecipitationData {
  month: string;
  avgPrecipitation: number;
  avgSnowfall: number;
}

interface ClimateData {
  locationName: string;
  state: string;
  latitude: number;
  longitude: number;
  elevation: number;
  summary: ClimateSummary;
  monthlyTemperature: MonthlyTemperatureData[];
  monthlyPrecipitation: MonthlyPrecipitationData[];
  seasonalData: SeasonalData[];
  extremeWeatherEvents: ExtremeWeatherEvents;
  dataDate: string;
}

interface ClimateDataDisplayProps {
  city: string;
  state: string;
}

const ClimateDataDisplay: React.FC<ClimateDataDisplayProps> = ({ city, state }) => {
  const [climateData, setClimateData] = useState<ClimateData | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [activeSection, setActiveSection] = useState<'temperature' | 'precipitation' | 'seasonal' | 'extremeWeather'>('temperature');

  useEffect(() => {
    const fetchClimateData = async () => {
      try {
        setLoading(true);
        setError(null);
        
        const response = await axios.get<ClimateData>('/api/climate', {
          params: { city, state }
        });
        
        setClimateData(response.data);
      } catch (err) {
        console.error('Error fetching climate data:', err);
        setError('Unable to fetch climate data. Please try again later.');
      } finally {
        setLoading(false);
      }
    };

    if (city && state) {
      fetchClimateData();
    }
  }, [city, state]);

  if (loading) {
    return (
      <div className="p-4 bg-gray-50 rounded-lg">
        <div className="flex items-center justify-center h-60">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500"></div>
          <span className="ml-2 text-gray-500">Loading climate data...</span>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-4 bg-gray-50 rounded-lg">
        <div className="flex flex-col items-center justify-center h-60">
          <svg xmlns="http://www.w3.org/2000/svg" className="h-10 w-10 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
          <p className="mt-2 text-gray-500 text-center">{error}</p>
        </div>
      </div>
    );
  }

  if (!climateData) {
    return (
      <div className="p-4 bg-gray-50 rounded-lg">
        <div className="flex flex-col items-center justify-center h-60">
          <svg xmlns="http://www.w3.org/2000/svg" className="h-10 w-10 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
          <p className="mt-2 text-gray-500 text-center">No climate data available for this location.</p>
        </div>
      </div>
    );
  }

  const { summary, monthlyTemperature, monthlyPrecipitation, seasonalData, extremeWeatherEvents } = climateData;

  // Prepare data for seasonal chart
  const seasonalChartData = seasonalData.map(season => ({
    name: season.season,
    temperature: season.avgTempF,
    precipitation: season.totalPrecipitation
  }));

  // Prepare data for extreme weather risk chart
  const extremeWeatherRiskData = [
    { name: 'Tornado', risk: extremeWeatherEvents.riskLevel.tornado },
    { name: 'Hurricane', risk: extremeWeatherEvents.riskLevel.hurricane },
    { name: 'Flood', risk: extremeWeatherEvents.riskLevel.flood },
    { name: 'Winter Storm', risk: extremeWeatherEvents.riskLevel.winterStorm },
    { name: 'Drought', risk: extremeWeatherEvents.riskLevel.drought },
    { name: 'Heat Wave', risk: extremeWeatherEvents.riskLevel.heatWave }
  ];

  // Get comfort level description
  const getComfortLevelDescription = (index: number) => {
    if (index >= 9) return 'Excellent';
    if (index >= 7) return 'Very Good';
    if (index >= 5) return 'Good';
    if (index >= 3) return 'Fair';
    return 'Poor';
  };

  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-100">
      <div className="p-4 border-b border-gray-100">
        <h2 className="text-lg font-medium text-gray-900" style={{ letterSpacing: '-0.01em' }}>
          Climate Data for {city}, {state}
        </h2>
        <div className="mt-1 text-sm text-gray-500">
          Elevation: {climateData.elevation} ft | Climate Type: {summary.climateType}
        </div>
      </div>

      <div className="p-4">
        {/* Summary Section */}
        <div className="mb-6 grid grid-cols-2 md:grid-cols-4 gap-4">
          <div className="bg-gray-50 p-3 rounded-lg">
            <div className="text-xs text-gray-500 font-normal mb-1">Annual Average Temp</div>
            <div className="font-medium text-gray-900">{summary.annualAvgTempF}°F</div>
          </div>
          <div className="bg-gray-50 p-3 rounded-lg">
            <div className="text-xs text-gray-500 font-normal mb-1">Annual Precipitation</div>
            <div className="font-medium text-gray-900">{summary.annualPrecipitation}" per year</div>
          </div>
          <div className="bg-gray-50 p-3 rounded-lg">
            <div className="text-xs text-gray-500 font-normal mb-1">Sunny Days</div>
            <div className="font-medium text-gray-900">{summary.avgSunnyDays} days/year</div>
          </div>
          <div className="bg-gray-50 p-3 rounded-lg">
            <div className="text-xs text-gray-500 font-normal mb-1">Comfort Index</div>
            <div className="font-medium text-gray-900">
              {summary.comfortIndex}/10 ({getComfortLevelDescription(summary.comfortIndex)})
            </div>
          </div>
        </div>

        {/* Navigation Tabs */}
        <div className="flex border-b border-gray-200 mb-4">
          <button
            className={`px-4 py-2 text-sm font-medium ${
              activeSection === 'temperature'
                ? 'text-blue-600 border-b-2 border-blue-500'
                : 'text-gray-500 hover:text-gray-700 hover:border-gray-300'
            }`}
            onClick={() => setActiveSection('temperature')}
          >
            Temperature
          </button>
          <button
            className={`px-4 py-2 text-sm font-medium ${
              activeSection === 'precipitation'
                ? 'text-blue-600 border-b-2 border-blue-500'
                : 'text-gray-500 hover:text-gray-700 hover:border-gray-300'
            }`}
            onClick={() => setActiveSection('precipitation')}
          >
            Precipitation
          </button>
          <button
            className={`px-4 py-2 text-sm font-medium ${
              activeSection === 'seasonal'
                ? 'text-blue-600 border-b-2 border-blue-500'
                : 'text-gray-500 hover:text-gray-700 hover:border-gray-300'
            }`}
            onClick={() => setActiveSection('seasonal')}
          >
            Seasonal
          </button>
          <button
            className={`px-4 py-2 text-sm font-medium ${
              activeSection === 'extremeWeather'
                ? 'text-blue-600 border-b-2 border-blue-500'
                : 'text-gray-500 hover:text-gray-700 hover:border-gray-300'
            }`}
            onClick={() => setActiveSection('extremeWeather')}
          >
            Extreme Weather
          </button>
        </div>

        {/* Temperature Chart */}
        {activeSection === 'temperature' && (
          <div className="h-72">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart
                data={monthlyTemperature}
                margin={{ top: 10, right: 30, left: 0, bottom: 0 }}
              >
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="month" />
                <YAxis unit="°F" />
                <Tooltip formatter={(value) => [`${value}°F`, '']} />
                <Legend />
                <Area
                  type="monotone"
                  dataKey="avgMaxTempF"
                  name="Avg Max Temp"
                  stroke="#f97316"
                  fill="#fdba74"
                  activeDot={{ r: 6 }}
                />
                <Area
                  type="monotone"
                  dataKey="avgTempF"
                  name="Avg Temp"
                  stroke="#3b82f6"
                  fill="#93c5fd"
                  activeDot={{ r: 6 }}
                />
                <Area
                  type="monotone"
                  dataKey="avgMinTempF"
                  name="Avg Min Temp"
                  stroke="#0ea5e9"
                  fill="#bae6fd"
                  activeDot={{ r: 6 }}
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        )}

        {/* Precipitation Chart */}
        {activeSection === 'precipitation' && (
          <div className="h-72">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart
                data={monthlyPrecipitation}
                margin={{ top: 10, right: 30, left: 0, bottom: 0 }}
              >
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="month" />
                <YAxis yAxisId="left" orientation="left" unit='"' />
                <YAxis yAxisId="right" orientation="right" unit='"' />
                <Tooltip formatter={(value) => [`${value}"`, '']} />
                <Legend />
                <Bar
                  yAxisId="left"
                  dataKey="avgPrecipitation"
                  name="Rainfall"
                  fill="#3b82f6"
                />
                <Bar
                  yAxisId="right"
                  dataKey="avgSnowfall"
                  name="Snowfall"
                  fill="#94a3b8"
                />
              </BarChart>
            </ResponsiveContainer>
          </div>
        )}

        {/* Seasonal Chart */}
        {activeSection === 'seasonal' && (
          <div className="h-72">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart
                data={seasonalChartData}
                margin={{ top: 10, right: 30, left: 0, bottom: 0 }}
              >
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="name" />
                <YAxis yAxisId="left" orientation="left" unit="°F" />
                <YAxis yAxisId="right" orientation="right" unit='"' />
                <Tooltip />
                <Legend />
                <Bar
                  yAxisId="left"
                  dataKey="temperature"
                  name="Avg Temperature (°F)"
                  fill="#3b82f6"
                />
                <Bar
                  yAxisId="right"
                  dataKey="precipitation"
                  name="Total Precipitation (inches)"
                  fill="#94a3b8"
                />
              </BarChart>
            </ResponsiveContainer>
          </div>
        )}

        {/* Extreme Weather Risk Chart */}
        {activeSection === 'extremeWeather' && (
          <div>
            <div className="h-72">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart
                  data={extremeWeatherRiskData}
                  margin={{ top: 10, right: 30, left: 0, bottom: 0 }}
                >
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="name" />
                  <YAxis domain={[0, 5]} />
                  <Tooltip formatter={(value) => [`${value}/5`, 'Risk Level']} />
                  <Bar dataKey="risk" name="Risk Level (1-5)" fill="#ef4444" />
                </BarChart>
              </ResponsiveContainer>
            </div>
            
            <div className="mt-4 grid grid-cols-3 gap-4">
              <div className="bg-gray-50 p-3 rounded-lg">
                <div className="text-xs text-gray-500 font-normal mb-1">Annual Tornadoes</div>
                <div className="font-medium text-gray-900">{extremeWeatherEvents.annualTornadoes}</div>
              </div>
              <div className="bg-gray-50 p-3 rounded-lg">
                <div className="text-xs text-gray-500 font-normal mb-1">Annual Hurricanes</div>
                <div className="font-medium text-gray-900">{extremeWeatherEvents.annualHurricanes}</div>
              </div>
              <div className="bg-gray-50 p-3 rounded-lg">
                <div className="text-xs text-gray-500 font-normal mb-1">Annual Floods</div>
                <div className="font-medium text-gray-900">{extremeWeatherEvents.annualFloods}</div>
              </div>
              <div className="bg-gray-50 p-3 rounded-lg">
                <div className="text-xs text-gray-500 font-normal mb-1">Annual Blizzards</div>
                <div className="font-medium text-gray-900">{extremeWeatherEvents.annualBlizzards}</div>
              </div>
              <div className="bg-gray-50 p-3 rounded-lg">
                <div className="text-xs text-gray-500 font-normal mb-1">Annual Droughts</div>
                <div className="font-medium text-gray-900">{extremeWeatherEvents.annualDroughts}</div>
              </div>
              <div className="bg-gray-50 p-3 rounded-lg">
                <div className="text-xs text-gray-500 font-normal mb-1">Annual Heat Waves</div>
                <div className="font-medium text-gray-900">{extremeWeatherEvents.annualHeatWaves}</div>
              </div>
            </div>
          </div>
        )}
      </div>
      
      <div className="px-4 py-3 bg-gray-50 text-xs text-gray-500 border-t border-gray-100 rounded-b-lg">
        Data sourced from the National Oceanic and Atmospheric Administration (NOAA)
      </div>
    </div>
  );
};

export default ClimateDataDisplay;