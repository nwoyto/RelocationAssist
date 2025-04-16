import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { 
  PieChart, Pie, Cell, 
  BarChart, Bar, 
  LineChart, Line,
  XAxis, YAxis, CartesianGrid, Tooltip, 
  Legend, ResponsiveContainer 
} from 'recharts';

// Interfaces for Census Data
interface ExpandedDemographics {
  totalPopulation: number;
  medianAge: number;
  ageDistribution: {
    under18: number;
    age18to24: number;
    age25to44: number;
    age45to64: number;
    age65Plus: number;
  };
  raceEthnicity: {
    white: number;
    black: number;
    asian: number;
    hispanic: number;
    other: number;
  };
  householdTypes: {
    familyHouseholds: number;
    nonFamilyHouseholds: number;
    averageHouseholdSize: number;
  };
}

interface IncomeEmploymentData {
  medianHouseholdIncome: number;
  perCapitaIncome: number;
  povertyRate: number;
  employmentRate: number;
  unemploymentRate: number;
  laborForceParticipation: number;
  occupations: {
    management: number;
    service: number;
    sales: number;
    construction: number;
    production: number;
  };
  industries: {
    agriculture: number;
    construction: number;
    manufacturing: number;
    wholesale: number;
    retail: number;
    transportation: number;
    information: number;
    finance: number;
    professional: number;
    education: number;
    arts: number;
    other: number;
    publicAdmin: number;
  };
}

interface ExpandedHousingData {
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

interface EducationData {
  highSchoolOrHigher: number;
  bachelorsOrHigher: number;
  graduateOrProfessional: number;
  schoolEnrollment: {
    preschool: number;
    kindergarten: number;
    elementary: number;
    highSchool: number;
    college: number;
  };
}

interface CommuteData {
  meanTravelTimeToWork: number;
  commuteType: {
    driveAlone: number;
    carpool: number;
    publicTransit: number;
    walk: number;
    other: number;
    workFromHome: number;
  };
  departureTime: {
    before7am: number;
    from7to8am: number;
    from8to9am: number;
    after9am: number;
  };
}

interface ExpandedCensusData {
  demographics: ExpandedDemographics;
  incomeEmployment: IncomeEmploymentData;
  housing: ExpandedHousingData;
  education: EducationData;
  commute: CommuteData;
  dataDate: string;
}

interface ExpandedCensusDataDisplayProps {
  city: string;
  state: string;
}

const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884d8'];

const ExpandedCensusDataDisplay: React.FC<ExpandedCensusDataDisplayProps> = ({ city, state }) => {
  const [censusData, setCensusData] = useState<ExpandedCensusData | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [activeSection, setActiveSection] = useState<
    'demographics' | 'income' | 'housing' | 'education' | 'commute'
  >('demographics');

  useEffect(() => {
    const fetchCensusData = async () => {
      try {
        setLoading(true);
        setError(null);
        
        const response = await axios.get<ExpandedCensusData>('/api/census/expanded', {
          params: { city, state }
        });
        
        setCensusData(response.data);
      } catch (err) {
        console.error('Error fetching census data:', err);
        setError('Unable to fetch census data. Please try again later.');
      } finally {
        setLoading(false);
      }
    };

    if (city && state) {
      fetchCensusData();
    }
  }, [city, state]);

  if (loading) {
    return (
      <div className="p-4 bg-gray-50 rounded-lg">
        <div className="flex items-center justify-center h-60">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500"></div>
          <span className="ml-2 text-gray-500">Loading census data...</span>
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

  if (!censusData) {
    return (
      <div className="p-4 bg-gray-50 rounded-lg">
        <div className="flex flex-col items-center justify-center h-60">
          <svg xmlns="http://www.w3.org/2000/svg" className="h-10 w-10 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
          <p className="mt-2 text-gray-500 text-center">No census data available for this location.</p>
        </div>
      </div>
    );
  }

  // Prepare data for charts
  const { demographics, incomeEmployment, housing, education, commute } = censusData;

  // Demographics - Age Distribution Data
  const ageDistributionData = [
    { name: 'Under 18', value: demographics.ageDistribution.under18 },
    { name: '18-24', value: demographics.ageDistribution.age18to24 },
    { name: '25-44', value: demographics.ageDistribution.age25to44 },
    { name: '45-64', value: demographics.ageDistribution.age45to64 },
    { name: '65+', value: demographics.ageDistribution.age65Plus }
  ];

  // Demographics - Race/Ethnicity Data
  const raceEthnicityData = [
    { name: 'White', value: demographics.raceEthnicity.white },
    { name: 'Black', value: demographics.raceEthnicity.black },
    { name: 'Asian', value: demographics.raceEthnicity.asian },
    { name: 'Hispanic', value: demographics.raceEthnicity.hispanic },
    { name: 'Other', value: demographics.raceEthnicity.other }
  ];

  // Income & Employment - Occupations Data
  const occupationsData = [
    { name: 'Management', value: incomeEmployment.occupations.management },
    { name: 'Service', value: incomeEmployment.occupations.service },
    { name: 'Sales', value: incomeEmployment.occupations.sales },
    { name: 'Construction', value: incomeEmployment.occupations.construction },
    { name: 'Production', value: incomeEmployment.occupations.production }
  ];

  // Housing - Housing Age Data
  const housingAgeData = [
    { name: 'Pre-1970', value: housing.housingAge.builtBefore1970 },
    { name: '1970-1999', value: housing.housingAge.built1970to1999 },
    { name: 'Post-2000', value: housing.housingAge.builtAfter2000 }
  ];

  // Education - Educational Attainment Data
  const educationAttainmentData = [
    { name: 'High School+', value: education.highSchoolOrHigher },
    { name: 'Bachelor\'s+', value: education.bachelorsOrHigher },
    { name: 'Graduate+', value: education.graduateOrProfessional }
  ];

  // Education - School Enrollment Data
  const schoolEnrollmentData = [
    { name: 'Preschool', value: education.schoolEnrollment.preschool },
    { name: 'Kindergarten', value: education.schoolEnrollment.kindergarten },
    { name: 'Elementary', value: education.schoolEnrollment.elementary },
    { name: 'High School', value: education.schoolEnrollment.highSchool },
    { name: 'College', value: education.schoolEnrollment.college }
  ];

  // Commute - Commute Type Data
  const commuteTypeData = [
    { name: 'Drive Alone', value: commute.commuteType.driveAlone },
    { name: 'Carpool', value: commute.commuteType.carpool },
    { name: 'Public Transit', value: commute.commuteType.publicTransit },
    { name: 'Walk', value: commute.commuteType.walk },
    { name: 'Other', value: commute.commuteType.other },
    { name: 'Work from Home', value: commute.commuteType.workFromHome }
  ];

  // Format currency
  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      maximumFractionDigits: 0
    }).format(value);
  };

  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-100">
      <div className="p-4 border-b border-gray-100">
        <h2 className="text-lg font-medium text-gray-900" style={{ letterSpacing: '-0.01em' }}>
          Census Data for {city}, {state}
        </h2>
        <div className="mt-1 text-sm text-gray-500">
          Population: {demographics.totalPopulation.toLocaleString()} | Median Age: {demographics.medianAge}
        </div>
      </div>

      <div className="p-4">
        {/* Summary Stats */}
        <div className="mb-6 grid grid-cols-2 md:grid-cols-4 gap-4">
          <div className="bg-gray-50 p-3 rounded-lg">
            <div className="text-xs text-gray-500 font-normal mb-1">Median Household Income</div>
            <div className="font-medium text-gray-900">{formatCurrency(incomeEmployment.medianHouseholdIncome)}</div>
          </div>
          <div className="bg-gray-50 p-3 rounded-lg">
            <div className="text-xs text-gray-500 font-normal mb-1">Homeownership Rate</div>
            <div className="font-medium text-gray-900">{housing.homeownershipRate}%</div>
          </div>
          <div className="bg-gray-50 p-3 rounded-lg">
            <div className="text-xs text-gray-500 font-normal mb-1">Bachelor's Degree or Higher</div>
            <div className="font-medium text-gray-900">{education.bachelorsOrHigher}%</div>
          </div>
          <div className="bg-gray-50 p-3 rounded-lg">
            <div className="text-xs text-gray-500 font-normal mb-1">Mean Commute Time</div>
            <div className="font-medium text-gray-900">{commute.meanTravelTimeToWork} min</div>
          </div>
        </div>

        {/* Navigation Tabs */}
        <div className="flex border-b border-gray-200 mb-4 overflow-x-auto">
          <button
            className={`px-4 py-2 text-sm font-medium whitespace-nowrap ${
              activeSection === 'demographics'
                ? 'text-blue-600 border-b-2 border-blue-500'
                : 'text-gray-500 hover:text-gray-700 hover:border-gray-300'
            }`}
            onClick={() => setActiveSection('demographics')}
          >
            Demographics
          </button>
          <button
            className={`px-4 py-2 text-sm font-medium whitespace-nowrap ${
              activeSection === 'income'
                ? 'text-blue-600 border-b-2 border-blue-500'
                : 'text-gray-500 hover:text-gray-700 hover:border-gray-300'
            }`}
            onClick={() => setActiveSection('income')}
          >
            Income & Employment
          </button>
          <button
            className={`px-4 py-2 text-sm font-medium whitespace-nowrap ${
              activeSection === 'housing'
                ? 'text-blue-600 border-b-2 border-blue-500'
                : 'text-gray-500 hover:text-gray-700 hover:border-gray-300'
            }`}
            onClick={() => setActiveSection('housing')}
          >
            Housing
          </button>
          <button
            className={`px-4 py-2 text-sm font-medium whitespace-nowrap ${
              activeSection === 'education'
                ? 'text-blue-600 border-b-2 border-blue-500'
                : 'text-gray-500 hover:text-gray-700 hover:border-gray-300'
            }`}
            onClick={() => setActiveSection('education')}
          >
            Education
          </button>
          <button
            className={`px-4 py-2 text-sm font-medium whitespace-nowrap ${
              activeSection === 'commute'
                ? 'text-blue-600 border-b-2 border-blue-500'
                : 'text-gray-500 hover:text-gray-700 hover:border-gray-300'
            }`}
            onClick={() => setActiveSection('commute')}
          >
            Commute
          </button>
        </div>

        {/* Demographics Section */}
        {activeSection === 'demographics' && (
          <div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Age Distribution */}
              <div>
                <h3 className="text-base font-medium text-gray-900 mb-3">Age Distribution</h3>
                <div className="h-64">
                  <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                      <Pie
                        data={ageDistributionData}
                        cx="50%"
                        cy="50%"
                        labelLine={false}
                        label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                        outerRadius={80}
                        fill="#8884d8"
                        dataKey="value"
                      >
                        {ageDistributionData.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                        ))}
                      </Pie>
                      <Tooltip formatter={(value) => `${value}%`} />
                    </PieChart>
                  </ResponsiveContainer>
                </div>
              </div>

              {/* Race/Ethnicity */}
              <div>
                <h3 className="text-base font-medium text-gray-900 mb-3">Race/Ethnicity</h3>
                <div className="h-64">
                  <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                      <Pie
                        data={raceEthnicityData}
                        cx="50%"
                        cy="50%"
                        labelLine={false}
                        label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                        outerRadius={80}
                        fill="#8884d8"
                        dataKey="value"
                      >
                        {raceEthnicityData.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                        ))}
                      </Pie>
                      <Tooltip formatter={(value) => `${value}%`} />
                    </PieChart>
                  </ResponsiveContainer>
                </div>
              </div>
            </div>

            {/* Additional Demographics */}
            <div className="mt-6 grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="bg-gray-50 p-3 rounded-lg">
                <div className="text-xs text-gray-500 font-normal mb-1">Total Population</div>
                <div className="font-medium text-gray-900">{demographics.totalPopulation.toLocaleString()}</div>
              </div>
              <div className="bg-gray-50 p-3 rounded-lg">
                <div className="text-xs text-gray-500 font-normal mb-1">Median Age</div>
                <div className="font-medium text-gray-900">{demographics.medianAge} years</div>
              </div>
              <div className="bg-gray-50 p-3 rounded-lg">
                <div className="text-xs text-gray-500 font-normal mb-1">Average Household Size</div>
                <div className="font-medium text-gray-900">{demographics.householdTypes.averageHouseholdSize.toFixed(2)} people</div>
              </div>
            </div>
          </div>
        )}

        {/* Income & Employment Section */}
        {activeSection === 'income' && (
          <div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Income Stats */}
              <div>
                <h3 className="text-base font-medium text-gray-900 mb-3">Income Statistics</h3>
                <div className="grid grid-cols-1 gap-4">
                  <div className="bg-gray-50 p-3 rounded-lg">
                    <div className="text-xs text-gray-500 font-normal mb-1">Median Household Income</div>
                    <div className="font-medium text-gray-900">{formatCurrency(incomeEmployment.medianHouseholdIncome)}</div>
                  </div>
                  <div className="bg-gray-50 p-3 rounded-lg">
                    <div className="text-xs text-gray-500 font-normal mb-1">Per Capita Income</div>
                    <div className="font-medium text-gray-900">{formatCurrency(incomeEmployment.perCapitaIncome)}</div>
                  </div>
                  <div className="bg-gray-50 p-3 rounded-lg">
                    <div className="text-xs text-gray-500 font-normal mb-1">Poverty Rate</div>
                    <div className="font-medium text-gray-900">{incomeEmployment.povertyRate}%</div>
                  </div>
                </div>
              </div>

              {/* Employment Stats */}
              <div>
                <h3 className="text-base font-medium text-gray-900 mb-3">Employment Statistics</h3>
                <div className="grid grid-cols-1 gap-4">
                  <div className="bg-gray-50 p-3 rounded-lg">
                    <div className="text-xs text-gray-500 font-normal mb-1">Employment Rate</div>
                    <div className="font-medium text-gray-900">{incomeEmployment.employmentRate}%</div>
                  </div>
                  <div className="bg-gray-50 p-3 rounded-lg">
                    <div className="text-xs text-gray-500 font-normal mb-1">Unemployment Rate</div>
                    <div className="font-medium text-gray-900">{incomeEmployment.unemploymentRate}%</div>
                  </div>
                  <div className="bg-gray-50 p-3 rounded-lg">
                    <div className="text-xs text-gray-500 font-normal mb-1">Labor Force Participation</div>
                    <div className="font-medium text-gray-900">{incomeEmployment.laborForceParticipation}%</div>
                  </div>
                </div>
              </div>
            </div>

            {/* Occupations */}
            <div className="mt-6">
              <h3 className="text-base font-medium text-gray-900 mb-3">Occupations</h3>
              <div className="h-64">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart
                    layout="vertical"
                    data={occupationsData}
                    margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
                  >
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis type="number" unit="%" />
                    <YAxis dataKey="name" type="category" width={100} />
                    <Tooltip formatter={(value) => `${value}%`} />
                    <Bar dataKey="value" fill="#3b82f6" />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </div>
          </div>
        )}

        {/* Housing Section */}
        {activeSection === 'housing' && (
          <div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Housing Stats */}
              <div>
                <h3 className="text-base font-medium text-gray-900 mb-3">Housing Statistics</h3>
                <div className="grid grid-cols-1 gap-4">
                  <div className="bg-gray-50 p-3 rounded-lg">
                    <div className="text-xs text-gray-500 font-normal mb-1">Median Home Value</div>
                    <div className="font-medium text-gray-900">{formatCurrency(housing.medianHomeValue)}</div>
                  </div>
                  <div className="bg-gray-50 p-3 rounded-lg">
                    <div className="text-xs text-gray-500 font-normal mb-1">Median Monthly Rent</div>
                    <div className="font-medium text-gray-900">{formatCurrency(housing.medianRent)}</div>
                  </div>
                  <div className="bg-gray-50 p-3 rounded-lg">
                    <div className="text-xs text-gray-500 font-normal mb-1">Homeownership Rate</div>
                    <div className="font-medium text-gray-900">{housing.homeownershipRate}%</div>
                  </div>
                  <div className="bg-gray-50 p-3 rounded-lg">
                    <div className="text-xs text-gray-500 font-normal mb-1">Vacancy Rate</div>
                    <div className="font-medium text-gray-900">{housing.vacancyRate}%</div>
                  </div>
                </div>
              </div>

              {/* Housing Age */}
              <div>
                <h3 className="text-base font-medium text-gray-900 mb-3">Housing Age</h3>
                <div className="h-64">
                  <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                      <Pie
                        data={housingAgeData}
                        cx="50%"
                        cy="50%"
                        labelLine={false}
                        label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                        outerRadius={80}
                        fill="#8884d8"
                        dataKey="value"
                      >
                        {housingAgeData.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                        ))}
                      </Pie>
                      <Tooltip formatter={(value) => `${value}%`} />
                    </PieChart>
                  </ResponsiveContainer>
                </div>
              </div>
            </div>

            {/* Housing Units */}
            <div className="mt-6 grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="bg-gray-50 p-3 rounded-lg">
                <div className="text-xs text-gray-500 font-normal mb-1">Total Housing Units</div>
                <div className="font-medium text-gray-900">{housing.totalHousingUnits.toLocaleString()}</div>
              </div>
              <div className="bg-gray-50 p-3 rounded-lg">
                <div className="text-xs text-gray-500 font-normal mb-1">Owner-Occupied Units</div>
                <div className="font-medium text-gray-900">{housing.ownerOccupied.toLocaleString()}</div>
              </div>
              <div className="bg-gray-50 p-3 rounded-lg">
                <div className="text-xs text-gray-500 font-normal mb-1">Renter-Occupied Units</div>
                <div className="font-medium text-gray-900">{housing.renterOccupied.toLocaleString()}</div>
              </div>
            </div>
          </div>
        )}

        {/* Education Section */}
        {activeSection === 'education' && (
          <div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Educational Attainment */}
              <div>
                <h3 className="text-base font-medium text-gray-900 mb-3">Educational Attainment</h3>
                <div className="h-64">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart
                      data={educationAttainmentData}
                      margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
                    >
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="name" />
                      <YAxis unit="%" />
                      <Tooltip formatter={(value) => `${value}%`} />
                      <Bar dataKey="value" fill="#3b82f6" />
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              </div>

              {/* School Enrollment */}
              <div>
                <h3 className="text-base font-medium text-gray-900 mb-3">School Enrollment</h3>
                <div className="h-64">
                  <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                      <Pie
                        data={schoolEnrollmentData}
                        cx="50%"
                        cy="50%"
                        labelLine={false}
                        label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                        outerRadius={80}
                        fill="#8884d8"
                        dataKey="value"
                      >
                        {schoolEnrollmentData.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                        ))}
                      </Pie>
                      <Tooltip formatter={(value) => `${value}%`} />
                    </PieChart>
                  </ResponsiveContainer>
                </div>
              </div>
            </div>

            {/* Additional Education Stats */}
            <div className="mt-6 grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="bg-gray-50 p-3 rounded-lg">
                <div className="text-xs text-gray-500 font-normal mb-1">High School Graduate or Higher</div>
                <div className="font-medium text-gray-900">{education.highSchoolOrHigher}%</div>
              </div>
              <div className="bg-gray-50 p-3 rounded-lg">
                <div className="text-xs text-gray-500 font-normal mb-1">Bachelor's Degree or Higher</div>
                <div className="font-medium text-gray-900">{education.bachelorsOrHigher}%</div>
              </div>
              <div className="bg-gray-50 p-3 rounded-lg">
                <div className="text-xs text-gray-500 font-normal mb-1">Graduate or Professional Degree</div>
                <div className="font-medium text-gray-900">{education.graduateOrProfessional}%</div>
              </div>
            </div>
          </div>
        )}

        {/* Commute Section */}
        {activeSection === 'commute' && (
          <div>
            <div className="grid grid-cols-1 gap-6">
              {/* Commute Type */}
              <div>
                <h3 className="text-base font-medium text-gray-900 mb-3">Commute Type</h3>
                <div className="h-64">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart
                      data={commuteTypeData}
                      margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
                    >
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="name" />
                      <YAxis unit="%" />
                      <Tooltip formatter={(value) => `${value}%`} />
                      <Bar dataKey="value" fill="#3b82f6" />
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              </div>
            </div>

            {/* Commute Time */}
            <div className="mt-6 grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="bg-gray-50 p-3 rounded-lg">
                <div className="text-xs text-gray-500 font-normal mb-1">Mean Travel Time to Work</div>
                <div className="font-medium text-gray-900">{commute.meanTravelTimeToWork} minutes</div>
              </div>
              <div className="bg-gray-50 p-3 rounded-lg">
                <div className="text-xs text-gray-500 font-normal mb-1">Work from Home</div>
                <div className="font-medium text-gray-900">{commute.commuteType.workFromHome}% of workers</div>
              </div>
            </div>

            {/* Departure Times */}
            <div className="mt-4">
              <h3 className="text-base font-medium text-gray-900 mb-3">Departure Times</h3>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <div className="bg-gray-50 p-3 rounded-lg">
                  <div className="text-xs text-gray-500 font-normal mb-1">Before 7am</div>
                  <div className="font-medium text-gray-900">{commute.departureTime.before7am}%</div>
                </div>
                <div className="bg-gray-50 p-3 rounded-lg">
                  <div className="text-xs text-gray-500 font-normal mb-1">7-8am</div>
                  <div className="font-medium text-gray-900">{commute.departureTime.from7to8am}%</div>
                </div>
                <div className="bg-gray-50 p-3 rounded-lg">
                  <div className="text-xs text-gray-500 font-normal mb-1">8-9am</div>
                  <div className="font-medium text-gray-900">{commute.departureTime.from8to9am}%</div>
                </div>
                <div className="bg-gray-50 p-3 rounded-lg">
                  <div className="text-xs text-gray-500 font-normal mb-1">After 9am</div>
                  <div className="font-medium text-gray-900">{commute.departureTime.after9am}%</div>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
      
      <div className="px-4 py-3 bg-gray-50 text-xs text-gray-500 border-t border-gray-100 rounded-b-lg">
        Data sourced from the U.S. Census Bureau American Community Survey
      </div>
    </div>
  );
};

export default ExpandedCensusDataDisplay;