export interface ExternalDataSource {
  source: string;
  fetched: string;
  data: any;
}

export interface ExternalData {
  housing: ExternalDataSource | null;
  education: ExternalDataSource | null;
  safety: ExternalDataSource | null;
  lastUpdated: string;
}

export interface Location {
  id: number;
  name: string;
  state: string;
  region: string;
  population: number;
  medianAge: number;
  medianIncome: number;
  costOfLiving: number; // Index relative to national average (100)
  averageCommute: number; // in minutes
  climate: string;
  cbpFacilities: number;
  rating: number;
  lat: number;
  lng: number;
  housingData: HousingData;
  schoolData: SchoolData;
  safetyData: SafetyData;
  lifestyleData: LifestyleData;
  transportationData: TransportationData;
  externalData?: ExternalData;
  createdAt?: string;
  updatedAt?: string;
}

export interface HousingData {
  medianHomePrice: number;
  priceDiffFromAvg: number; // percentage difference from national average
  medianRent: number;
  rentDiffFromAvg: number; // percentage difference from national average
  priceGrowthLastYear: number; // percentage growth
  estimatedMortgage: number; // estimated monthly mortgage payment
  neighborhoods: Neighborhood[];
  recentListings: Listing[];
}

export interface Neighborhood {
  name: string;
  medianPrice: number;
  homeTypes: string;
  rating: number;
}

export interface Listing {
  price: number;
  bedrooms: number;
  bathrooms: number;
  sqft: number;
  address: string;
  isNew: boolean;
}

export interface SchoolData {
  rating: number;
  publicSchools: number;
  privateSchools: number;
  topSchools: School[];
}

export interface School {
  name: string;
  type: string;
  grades: string;
  rating: number;
}

export interface SafetyData {
  crimeIndex: number; // national average = 100
  crimeIndexDiff: number; // percentage difference from national average
  violentCrime: number;
  propertyCrime: number;
}

export interface LifestyleData {
  restaurants: number;
  parks: number;
  shopping: number;
  entertainment: number;
}

export interface TransportationData {
  hasPublicTransit: boolean;
  transitScore: number;
  walkScore: number;
  bikeScore: number;
  majorAirports: number;
  interstateAccess: boolean;
}

export interface SavedLocation {
  id: number;
  userId: string;
  locationId: number;
}
