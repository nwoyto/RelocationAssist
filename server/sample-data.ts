import { Location } from "@/lib/types";

export const sampleLocations: Location[] = [
  {
    id: 1,
    name: "El Paso",
    state: "TX",
    region: "Southwest",
    population: 682669,
    medianAge: 33.5,
    medianIncome: 48292,
    costOfLiving: 87,
    averageCommute: 24,
    climate: "Hot Desert",
    cbpFacilities: 2,
    rating: 4,
    lat: 31.7619,
    lng: -106.4850,
    housingData: {
      medianHomePrice: 225000,
      priceDiffFromAvg: -40,
      medianRent: 1050,
      rentDiffFromAvg: -25,
      priceGrowthLastYear: 7.2,
      estimatedMortgage: 1100,
      neighborhoods: [
        {
          name: "Sunset Heights",
          medianPrice: 245000,
          homeTypes: "Single-family, Historic",
          rating: 4
        },
        {
          name: "Kern Place",
          medianPrice: 350000,
          homeTypes: "Single-family, Townhomes",
          rating: 5
        },
        {
          name: "Northeast El Paso",
          medianPrice: 180000,
          homeTypes: "Single-family, Apartments",
          rating: 3
        }
      ],
      recentListings: [
        {
          price: 220000,
          bedrooms: 3,
          bathrooms: 2,
          sqft: 1800,
          address: "123 Desert Palm Dr",
          isNew: true
        },
        {
          price: 175000,
          bedrooms: 2,
          bathrooms: 1,
          sqft: 1200,
          address: "456 Frontier Ave",
          isNew: false
        }
      ]
    },
    schoolData: {
      rating: 3,
      publicSchools: 18,
      privateSchools: 6,
      topSchools: [
        {
          name: "Silva Health Magnet High School",
          type: "Public",
          grades: "9-12",
          rating: 4
        },
        {
          name: "El Paso High School",
          type: "Public",
          grades: "9-12",
          rating: 3
        }
      ]
    },
    safetyData: {
      crimeIndex: 42,
      crimeIndexDiff: -58,
      violentCrime: 35,
      propertyCrime: 48
    },
    lifestyleData: {
      restaurants: 650,
      parks: 48,
      shopping: 15,
      entertainment: 22
    },
    transportationData: {
      hasPublicTransit: true,
      transitScore: 47,
      walkScore: 42,
      bikeScore: 52,
      majorAirports: 1,
      interstateAccess: true
    }
  },
  {
    id: 2,
    name: "San Diego",
    state: "CA",
    region: "Coastal",
    population: 1423851,
    medianAge: 35.1,
    medianIncome: 83454,
    costOfLiving: 160,
    averageCommute: 26,
    climate: "Mediterranean",
    cbpFacilities: 3,
    rating: 5,
    lat: 32.7157,
    lng: -117.1611,
    housingData: {
      medianHomePrice: 825000,
      priceDiffFromAvg: 120,
      medianRent: 2400,
      rentDiffFromAvg: 70,
      priceGrowthLastYear: 10.5,
      estimatedMortgage: 3800,
      neighborhoods: [
        {
          name: "La Jolla",
          medianPrice: 1650000,
          homeTypes: "Single-family, Luxury",
          rating: 5
        },
        {
          name: "North Park",
          medianPrice: 750000,
          homeTypes: "Single-family, Condos",
          rating: 4
        },
        {
          name: "Chula Vista",
          medianPrice: 620000,
          homeTypes: "Single-family, Townhomes",
          rating: 4
        }
      ],
      recentListings: [
        {
          price: 789000,
          bedrooms: 3,
          bathrooms: 2,
          sqft: 1600,
          address: "789 Ocean View Terrace",
          isNew: true
        },
        {
          price: 1100000,
          bedrooms: 4,
          bathrooms: 3,
          sqft: 2400,
          address: "321 Coastal Highway",
          isNew: false
        }
      ]
    },
    schoolData: {
      rating: 4,
      publicSchools: 35,
      privateSchools: 22,
      topSchools: [
        {
          name: "Torrey Pines High School",
          type: "Public",
          grades: "9-12",
          rating: 5
        },
        {
          name: "La Jolla Country Day School",
          type: "Private",
          grades: "K-12",
          rating: 5
        }
      ]
    },
    safetyData: {
      crimeIndex: 96,
      crimeIndexDiff: -4,
      violentCrime: 85,
      propertyCrime: 102
    },
    lifestyleData: {
      restaurants: 2800,
      parks: 125,
      shopping: 45,
      entertainment: 65
    },
    transportationData: {
      hasPublicTransit: true,
      transitScore: 65,
      walkScore: 51,
      bikeScore: 48,
      majorAirports: 1,
      interstateAccess: true
    }
  },
  {
    id: 3,
    name: "Buffalo",
    state: "NY",
    region: "Northern",
    population: 255284,
    medianAge: 33.2,
    medianIncome: 37354,
    costOfLiving: 95,
    averageCommute: 22,
    climate: "Cold Continental",
    cbpFacilities: 2,
    rating: 3,
    lat: 42.8864,
    lng: -78.8784,
    housingData: {
      medianHomePrice: 189000,
      priceDiffFromAvg: -50,
      medianRent: 950,
      rentDiffFromAvg: -32,
      priceGrowthLastYear: 12.8,
      estimatedMortgage: 900,
      neighborhoods: [
        {
          name: "Elmwood Village",
          medianPrice: 275000,
          homeTypes: "Single-family, Historic",
          rating: 4
        },
        {
          name: "North Buffalo",
          medianPrice: 210000,
          homeTypes: "Single-family, Duplexes",
          rating: 3
        },
        {
          name: "South Buffalo",
          medianPrice: 135000,
          homeTypes: "Single-family, Townhomes",
          rating: 3
        }
      ],
      recentListings: [
        {
          price: 165000,
          bedrooms: 3,
          bathrooms: 1.5,
          sqft: 1700,
          address: "234 Maple Street",
          isNew: true
        },
        {
          price: 220000,
          bedrooms: 4,
          bathrooms: 2,
          sqft: 2100,
          address: "567 Parkside Avenue",
          isNew: false
        }
      ]
    },
    schoolData: {
      rating: 3,
      publicSchools: 18,
      privateSchools: 5,
      topSchools: [
        {
          name: "City Honors School",
          type: "Public",
          grades: "5-12",
          rating: 5
        },
        {
          name: "Nichols School",
          type: "Private",
          grades: "K-12",
          rating: 4
        }
      ]
    },
    safetyData: {
      crimeIndex: 115,
      crimeIndexDiff: 15,
      violentCrime: 120,
      propertyCrime: 112
    },
    lifestyleData: {
      restaurants: 480,
      parks: 32,
      shopping: 12,
      entertainment: 18
    },
    transportationData: {
      hasPublicTransit: true,
      transitScore: 52,
      walkScore: 48,
      bikeScore: 45,
      majorAirports: 1,
      interstateAccess: true
    }
  },
  {
    id: 4,
    name: "Tucson",
    state: "AZ",
    region: "Southwest",
    population: 545975,
    medianAge: 33.8,
    medianIncome: 43512,
    costOfLiving: 91,
    averageCommute: 23,
    climate: "Hot Desert",
    cbpFacilities: 1,
    rating: 4,
    lat: 32.2226,
    lng: -110.9747,
    housingData: {
      medianHomePrice: 305000,
      priceDiffFromAvg: -18,
      medianRent: 1100,
      rentDiffFromAvg: -22,
      priceGrowthLastYear: 11.5,
      estimatedMortgage: 1400,
      neighborhoods: [
        {
          name: "Catalina Foothills",
          medianPrice: 550000,
          homeTypes: "Single-family, Luxury",
          rating: 5
        },
        {
          name: "Sam Hughes",
          medianPrice: 375000,
          homeTypes: "Single-family, Historic",
          rating: 4
        },
        {
          name: "Armory Park",
          medianPrice: 285000,
          homeTypes: "Single-family, Townhomes",
          rating: 3
        }
      ],
      recentListings: [
        {
          price: 289000,
          bedrooms: 3,
          bathrooms: 2,
          sqft: 1750,
          address: "876 Desert View Road",
          isNew: true
        },
        {
          price: 375000,
          bedrooms: 4,
          bathrooms: 2.5,
          sqft: 2200,
          address: "432 Mountain Trail",
          isNew: false
        }
      ]
    },
    schoolData: {
      rating: 4,
      publicSchools: 25,
      privateSchools: 8,
      topSchools: [
        {
          name: "University High School",
          type: "Public",
          grades: "9-12",
          rating: 5
        },
        {
          name: "Basis Tucson North",
          type: "Charter",
          grades: "5-12",
          rating: 5
        }
      ]
    },
    safetyData: {
      crimeIndex: 88,
      crimeIndexDiff: -12,
      violentCrime: 75,
      propertyCrime: 95
    },
    lifestyleData: {
      restaurants: 850,
      parks: 65,
      shopping: 18,
      entertainment: 25
    },
    transportationData: {
      hasPublicTransit: true,
      transitScore: 42,
      walkScore: 41,
      bikeScore: 65,
      majorAirports: 1,
      interstateAccess: true
    }
  },
  {
    id: 5,
    name: "Laredo",
    state: "TX",
    region: "Southwest",
    population: 261639,
    medianAge: 28.5,
    medianIncome: 39724,
    costOfLiving: 83,
    averageCommute: 20,
    climate: "Hot Semi-Arid",
    cbpFacilities: 2,
    rating: 3,
    lat: 27.5306,
    lng: -99.4803,
    housingData: {
      medianHomePrice: 170000,
      priceDiffFromAvg: -55,
      medianRent: 850,
      rentDiffFromAvg: -40,
      priceGrowthLastYear: 6.8,
      estimatedMortgage: 800,
      neighborhoods: [
        {
          name: "Del Mar",
          medianPrice: 210000,
          homeTypes: "Single-family",
          rating: 4
        },
        {
          name: "Heights",
          medianPrice: 180000,
          homeTypes: "Single-family, Townhomes",
          rating: 3
        },
        {
          name: "North Laredo",
          medianPrice: 220000,
          homeTypes: "Single-family, New Construction",
          rating: 4
        }
      ],
      recentListings: [
        {
          price: 165000,
          bedrooms: 3,
          bathrooms: 2,
          sqft: 1650,
          address: "543 Border Avenue",
          isNew: true
        },
        {
          price: 195000,
          bedrooms: 4,
          bathrooms: 2.5,
          sqft: 2000,
          address: "789 International Blvd",
          isNew: false
        }
      ]
    },
    schoolData: {
      rating: 3,
      publicSchools: 32,
      privateSchools: 4,
      topSchools: [
        {
          name: "Early College High School",
          type: "Public",
          grades: "9-12",
          rating: 4
        },
        {
          name: "United High School",
          type: "Public",
          grades: "9-12",
          rating: 3
        }
      ]
    },
    safetyData: {
      crimeIndex: 72,
      crimeIndexDiff: -28,
      violentCrime: 65,
      propertyCrime: 76
    },
    lifestyleData: {
      restaurants: 320,
      parks: 28,
      shopping: 8,
      entertainment: 12
    },
    transportationData: {
      hasPublicTransit: true,
      transitScore: 28,
      walkScore: 36,
      bikeScore: 32,
      majorAirports: 1,
      interstateAccess: true
    }
  },
  {
    id: 6,
    name: "Detroit",
    state: "MI",
    region: "Northern",
    population: 670031,
    medianAge: 34.7,
    medianIncome: 30894,
    costOfLiving: 87,
    averageCommute: 26,
    climate: "Continental",
    cbpFacilities: 1,
    rating: 2,
    lat: 42.3314,
    lng: -83.0458,
    housingData: {
      medianHomePrice: 65000,
      priceDiffFromAvg: -83,
      medianRent: 950,
      rentDiffFromAvg: -32,
      priceGrowthLastYear: 15.2,
      estimatedMortgage: 350,
      neighborhoods: [
        {
          name: "Midtown",
          medianPrice: 250000,
          homeTypes: "Condos, Apartments",
          rating: 4
        },
        {
          name: "Corktown",
          medianPrice: 190000,
          homeTypes: "Single-family, Historic",
          rating: 3
        },
        {
          name: "East English Village",
          medianPrice: 95000,
          homeTypes: "Single-family",
          rating: 3
        }
      ],
      recentListings: [
        {
          price: 55000,
          bedrooms: 3,
          bathrooms: 1,
          sqft: 1200,
          address: "1234 Warren Avenue",
          isNew: true
        },
        {
          price: 220000,
          bedrooms: 2,
          bathrooms: 2,
          sqft: 1400,
          address: "567 Woodward Lofts",
          isNew: false
        }
      ]
    },
    schoolData: {
      rating: 2,
      publicSchools: 102,
      privateSchools: 25,
      topSchools: [
        {
          name: "Cass Technical High School",
          type: "Public",
          grades: "9-12",
          rating: 4
        },
        {
          name: "Detroit Edison Public School Academy",
          type: "Charter",
          grades: "K-12",
          rating: 3
        }
      ]
    },
    safetyData: {
      crimeIndex: 156,
      crimeIndexDiff: 56,
      violentCrime: 185,
      propertyCrime: 142
    },
    lifestyleData: {
      restaurants: 680,
      parks: 308,
      shopping: 15,
      entertainment: 32
    },
    transportationData: {
      hasPublicTransit: true,
      transitScore: 38,
      walkScore: 55,
      bikeScore: 57,
      majorAirports: 1,
      interstateAccess: true
    }
  }
];