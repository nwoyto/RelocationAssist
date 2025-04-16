import { Location } from "@/lib/types";

export const additionalCities: Location[] = [
  {
    id: 7,
    name: "Seattle",
    state: "WA",
    region: "Coastal",
    population: 737015,
    medianAge: 35.5,
    medianIncome: 102486,
    costOfLiving: 172,
    averageCommute: 27,
    climate: "Mild Maritime",
    cbpFacilities: 1,
    rating: 4,
    lat: 47.6062,
    lng: -122.3321,
    housingData: {
      medianHomePrice: 825000,
      priceDiffFromAvg: 120,
      medianRent: 2150,
      rentDiffFromAvg: 53,
      priceGrowthLastYear: 8.5,
      estimatedMortgage: 3800,
      neighborhoods: [
        {
          name: "Queen Anne",
          medianPrice: 950000,
          homeTypes: "Single-family, Condos",
          rating: 5
        },
        {
          name: "Ballard",
          medianPrice: 875000,
          homeTypes: "Single-family, Townhomes",
          rating: 4
        },
        {
          name: "Columbia City",
          medianPrice: 750000,
          homeTypes: "Single-family, Townhomes",
          rating: 4
        }
      ],
      recentListings: [
        {
          price: 795000,
          bedrooms: 3,
          bathrooms: 2,
          sqft: 1750,
          address: "123 Pine Street",
          isNew: true
        },
        {
          price: 925000,
          bedrooms: 4,
          bathrooms: 2.5,
          sqft: 2100,
          address: "456 View Ridge Ave",
          isNew: false
        }
      ]
    },
    schoolData: {
      rating: 4,
      publicSchools: 102,
      privateSchools: 29,
      topSchools: [
        {
          name: "Roosevelt High School",
          type: "Public",
          grades: "9-12",
          rating: 4
        },
        {
          name: "The Bush School",
          type: "Private",
          grades: "K-12",
          rating: 5
        }
      ]
    },
    safetyData: {
      crimeIndex: 95,
      crimeIndexDiff: -5,
      violentCrime: 72,
      propertyCrime: 108
    },
    lifestyleData: {
      restaurants: 3200,
      parks: 485,
      shopping: 42,
      entertainment: 78
    },
    transportationData: {
      hasPublicTransit: true,
      transitScore: 74,
      walkScore: 73,
      bikeScore: 70,
      majorAirports: 1,
      interstateAccess: true
    }
  },
  {
    id: 8,
    name: "Miami",
    state: "FL",
    region: "Coastal",
    population: 467963,
    medianAge: 40.1,
    medianIncome: 44268,
    costOfLiving: 123,
    averageCommute: 29,
    climate: "Tropical Monsoon",
    cbpFacilities: 2,
    rating: 4,
    lat: 25.7617,
    lng: -80.1918,
    housingData: {
      medianHomePrice: 510000,
      priceDiffFromAvg: 36,
      medianRent: 2300,
      rentDiffFromAvg: 65,
      priceGrowthLastYear: 9.2,
      estimatedMortgage: 2300,
      neighborhoods: [
        {
          name: "Brickell",
          medianPrice: 650000,
          homeTypes: "Condos, Luxury",
          rating: 5
        },
        {
          name: "Coconut Grove",
          medianPrice: 725000,
          homeTypes: "Single-family, Luxury",
          rating: 5
        },
        {
          name: "Little Havana",
          medianPrice: 385000,
          homeTypes: "Single-family, Condos",
          rating: 3
        }
      ],
      recentListings: [
        {
          price: 495000,
          bedrooms: 2,
          bathrooms: 2,
          sqft: 1200,
          address: "888 Biscayne Blvd",
          isNew: true
        },
        {
          price: 775000,
          bedrooms: 3,
          bathrooms: 2.5,
          sqft: 1850,
          address: "333 Coral Way",
          isNew: false
        }
      ]
    },
    schoolData: {
      rating: 3,
      publicSchools: 56,
      privateSchools: 38,
      topSchools: [
        {
          name: "Design & Architecture High School",
          type: "Public Magnet",
          grades: "9-12",
          rating: 5
        },
        {
          name: "Ransom Everglades School",
          type: "Private",
          grades: "6-12",
          rating: 5
        }
      ]
    },
    safetyData: {
      crimeIndex: 105,
      crimeIndexDiff: 5,
      violentCrime: 86,
      propertyCrime: 115
    },
    lifestyleData: {
      restaurants: 2900,
      parks: 263,
      shopping: 54,
      entertainment: 92
    },
    transportationData: {
      hasPublicTransit: true,
      transitScore: 57,
      walkScore: 78,
      bikeScore: 64,
      majorAirports: 1,
      interstateAccess: true
    }
  },
  {
    id: 9,
    name: "Portland",
    state: "OR",
    region: "Coastal",
    population: 662549,
    medianAge: 37.5,
    medianIncome: 76231,
    costOfLiving: 130,
    averageCommute: 26,
    climate: "Temperate Oceanic",
    cbpFacilities: 1,
    rating: 4,
    lat: 45.5152,
    lng: -122.6784,
    housingData: {
      medianHomePrice: 540000,
      priceDiffFromAvg: 44,
      medianRent: 1750,
      rentDiffFromAvg: 25,
      priceGrowthLastYear: 6.8,
      estimatedMortgage: 2500,
      neighborhoods: [
        {
          name: "Pearl District",
          medianPrice: 685000,
          homeTypes: "Condos, Lofts",
          rating: 5
        },
        {
          name: "Hawthorne",
          medianPrice: 590000,
          homeTypes: "Single-family, Bungalows",
          rating: 4
        },
        {
          name: "St. Johns",
          medianPrice: 475000,
          homeTypes: "Single-family, Craftsman",
          rating: 3
        }
      ],
      recentListings: [
        {
          price: 525000,
          bedrooms: 3,
          bathrooms: 2,
          sqft: 1650,
          address: "2345 NE Alberta St",
          isNew: true
        },
        {
          price: 675000,
          bedrooms: 4,
          bathrooms: 2.5,
          sqft: 2200,
          address: "5678 SE Division St",
          isNew: false
        }
      ]
    },
    schoolData: {
      rating: 4,
      publicSchools: 78,
      privateSchools: 25,
      topSchools: [
        {
          name: "Lincoln High School",
          type: "Public",
          grades: "9-12",
          rating: 4
        },
        {
          name: "Catlin Gabel School",
          type: "Private",
          grades: "K-12",
          rating: 5
        }
      ]
    },
    safetyData: {
      crimeIndex: 94,
      crimeIndexDiff: -6,
      violentCrime: 64,
      propertyCrime: 110
    },
    lifestyleData: {
      restaurants: 2500,
      parks: 320,
      shopping: 38,
      entertainment: 65
    },
    transportationData: {
      hasPublicTransit: true,
      transitScore: 71,
      walkScore: 68,
      bikeScore: 83,
      majorAirports: 1,
      interstateAccess: true
    }
  },
  {
    id: 10,
    name: "Chicago",
    state: "IL",
    region: "Northern",
    population: 2746388,
    medianAge: 34.9,
    medianIncome: 62097,
    costOfLiving: 107,
    averageCommute: 35,
    climate: "Continental",
    cbpFacilities: 1,
    rating: 3,
    lat: 41.8781,
    lng: -87.6298,
    housingData: {
      medianHomePrice: 310000,
      priceDiffFromAvg: -17,
      medianRent: 1800,
      rentDiffFromAvg: 28,
      priceGrowthLastYear: 5.2,
      estimatedMortgage: 1400,
      neighborhoods: [
        {
          name: "Lincoln Park",
          medianPrice: 575000,
          homeTypes: "Condos, Townhomes",
          rating: 5
        },
        {
          name: "Logan Square",
          medianPrice: 425000,
          homeTypes: "Single-family, Multi-family",
          rating: 4
        },
        {
          name: "Pilsen",
          medianPrice: 335000,
          homeTypes: "Single-family, Multi-family",
          rating: 3
        }
      ],
      recentListings: [
        {
          price: 299000,
          bedrooms: 2,
          bathrooms: 2,
          sqft: 1200,
          address: "1212 N State Parkway",
          isNew: true
        },
        {
          price: 450000,
          bedrooms: 3,
          bathrooms: 2,
          sqft: 1750,
          address: "3434 W Diversey Ave",
          isNew: false
        }
      ]
    },
    schoolData: {
      rating: 3,
      publicSchools: 642,
      privateSchools: 124,
      topSchools: [
        {
          name: "Walter Payton College Prep",
          type: "Public Magnet",
          grades: "9-12",
          rating: 5
        },
        {
          name: "Latin School of Chicago",
          type: "Private",
          grades: "K-12",
          rating: 5
        }
      ]
    },
    safetyData: {
      crimeIndex: 120,
      crimeIndexDiff: 20,
      violentCrime: 132,
      propertyCrime: 112
    },
    lifestyleData: {
      restaurants: 7500,
      parks: 580,
      shopping: 165,
      entertainment: 240
    },
    transportationData: {
      hasPublicTransit: true,
      transitScore: 82,
      walkScore: 77,
      bikeScore: 72,
      majorAirports: 2,
      interstateAccess: true
    }
  },
  {
    id: 11,
    name: "Denver",
    state: "CO",
    region: "Southwest",
    population: 715522,
    medianAge: 34.5,
    medianIncome: 75646,
    costOfLiving: 128,
    averageCommute: 26,
    climate: "Semi-arid Continental",
    cbpFacilities: 1,
    rating: 4,
    lat: 39.7392,
    lng: -104.9903,
    housingData: {
      medianHomePrice: 585000,
      priceDiffFromAvg: 56,
      medianRent: 1850,
      rentDiffFromAvg: 32,
      priceGrowthLastYear: 7.1,
      estimatedMortgage: 2700,
      neighborhoods: [
        {
          name: "LoDo",
          medianPrice: 750000,
          homeTypes: "Condos, Lofts",
          rating: 5
        },
        {
          name: "Washington Park",
          medianPrice: 825000,
          homeTypes: "Single-family, Bungalows",
          rating: 5
        },
        {
          name: "Five Points",
          medianPrice: 495000,
          homeTypes: "Single-family, Townhomes",
          rating: 3
        }
      ],
      recentListings: [
        {
          price: 565000,
          bedrooms: 3,
          bathrooms: 2,
          sqft: 1800,
          address: "2222 Stout St",
          isNew: true
        },
        {
          price: 685000,
          bedrooms: 4,
          bathrooms: 2.5,
          sqft: 2400,
          address: "3333 E Kentucky Ave",
          isNew: false
        }
      ]
    },
    schoolData: {
      rating: 4,
      publicSchools: 205,
      privateSchools: 42,
      topSchools: [
        {
          name: "East High School",
          type: "Public",
          grades: "9-12",
          rating: 4
        },
        {
          name: "Kent Denver School",
          type: "Private",
          grades: "6-12",
          rating: 5
        }
      ]
    },
    safetyData: {
      crimeIndex: 92,
      crimeIndexDiff: -8,
      violentCrime: 80,
      propertyCrime: 99
    },
    lifestyleData: {
      restaurants: 2800,
      parks: 250,
      shopping: 45,
      entertainment: 88
    },
    transportationData: {
      hasPublicTransit: true,
      transitScore: 65,
      walkScore: 72,
      bikeScore: 71,
      majorAirports: 1,
      interstateAccess: true
    }
  },
  {
    id: 12,
    name: "New Orleans",
    state: "LA",
    region: "Coastal",
    population: 383997,
    medianAge: 38.1,
    medianIncome: 45615,
    costOfLiving: 96,
    averageCommute: 25,
    climate: "Humid Subtropical",
    cbpFacilities: 1,
    rating: 3,
    lat: 29.9511,
    lng: -90.0715,
    housingData: {
      medianHomePrice: 285000,
      priceDiffFromAvg: -24,
      medianRent: 1550,
      rentDiffFromAvg: 11,
      priceGrowthLastYear: 5.8,
      estimatedMortgage: 1300,
      neighborhoods: [
        {
          name: "Garden District",
          medianPrice: 725000,
          homeTypes: "Single-family, Historic",
          rating: 5
        },
        {
          name: "Uptown",
          medianPrice: 450000,
          homeTypes: "Single-family, Craftsman",
          rating: 4
        },
        {
          name: "Bywater",
          medianPrice: 325000,
          homeTypes: "Single-family, Shotgun",
          rating: 3
        }
      ],
      recentListings: [
        {
          price: 275000,
          bedrooms: 2,
          bathrooms: 2,
          sqft: 1400,
          address: "4545 Magazine St",
          isNew: true
        },
        {
          price: 495000,
          bedrooms: 3,
          bathrooms: 2.5,
          sqft: 2100,
          address: "7878 St Charles Ave",
          isNew: false
        }
      ]
    },
    schoolData: {
      rating: 2,
      publicSchools: 85,
      privateSchools: 45,
      topSchools: [
        {
          name: "Lusher Charter School",
          type: "Charter",
          grades: "K-12",
          rating: 4
        },
        {
          name: "Newman School",
          type: "Private",
          grades: "K-12",
          rating: 5
        }
      ]
    },
    safetyData: {
      crimeIndex: 140,
      crimeIndexDiff: 40,
      violentCrime: 148,
      propertyCrime: 136
    },
    lifestyleData: {
      restaurants: 1700,
      parks: 130,
      shopping: 28,
      entertainment: 125
    },
    transportationData: {
      hasPublicTransit: true,
      transitScore: 58,
      walkScore: 58,
      bikeScore: 65,
      majorAirports: 1,
      interstateAccess: true
    }
  },
  {
    id: 13,
    name: "Minneapolis",
    state: "MN",
    region: "Northern",
    population: 425336,
    medianAge: 32.6,
    medianIncome: 65889,
    costOfLiving: 108,
    averageCommute: 24,
    climate: "Continental",
    cbpFacilities: 1,
    rating: 4,
    lat: 44.9778,
    lng: -93.2650,
    housingData: {
      medianHomePrice: 325000,
      priceDiffFromAvg: -13,
      medianRent: 1525,
      rentDiffFromAvg: 9,
      priceGrowthLastYear: 6.2,
      estimatedMortgage: 1500,
      neighborhoods: [
        {
          name: "North Loop",
          medianPrice: 425000,
          homeTypes: "Condos, Lofts",
          rating: 5
        },
        {
          name: "Uptown",
          medianPrice: 385000,
          homeTypes: "Single-family, Condos",
          rating: 4
        },
        {
          name: "Powderhorn",
          medianPrice: 275000,
          homeTypes: "Single-family, Bungalows",
          rating: 3
        }
      ],
      recentListings: [
        {
          price: 310000,
          bedrooms: 3,
          bathrooms: 2,
          sqft: 1700,
          address: "5656 Lyndale Ave S",
          isNew: true
        },
        {
          price: 425000,
          bedrooms: 4,
          bathrooms: 2.5,
          sqft: 2200,
          address: "8989 Hennepin Ave",
          isNew: false
        }
      ]
    },
    schoolData: {
      rating: 4,
      publicSchools: 70,
      privateSchools: 25,
      topSchools: [
        {
          name: "Southwest High School",
          type: "Public",
          grades: "9-12",
          rating: 4
        },
        {
          name: "Blake School",
          type: "Private",
          grades: "K-12",
          rating: 5
        }
      ]
    },
    safetyData: {
      crimeIndex: 105,
      crimeIndexDiff: 5,
      violentCrime: 110,
      propertyCrime: 102
    },
    lifestyleData: {
      restaurants: 1800,
      parks: 180,
      shopping: 35,
      entertainment: 75
    },
    transportationData: {
      hasPublicTransit: true,
      transitScore: 68,
      walkScore: 71,
      bikeScore: 84,
      majorAirports: 1,
      interstateAccess: true
    }
  },
  {
    id: 14,
    name: "Philadelphia",
    state: "PA",
    region: "Northern",
    population: 1584064,
    medianAge: 34.5,
    medianIncome: 49127,
    costOfLiving: 101,
    averageCommute: 33,
    climate: "Humid Subtropical",
    cbpFacilities: 1,
    rating: 3,
    lat: 39.9526,
    lng: -75.1652,
    housingData: {
      medianHomePrice: 250000,
      priceDiffFromAvg: -33,
      medianRent: 1650,
      rentDiffFromAvg: 18,
      priceGrowthLastYear: 7.5,
      estimatedMortgage: 1150,
      neighborhoods: [
        {
          name: "Rittenhouse Square",
          medianPrice: 525000,
          homeTypes: "Condos, Brownstones",
          rating: 5
        },
        {
          name: "Fishtown",
          medianPrice: 350000,
          homeTypes: "Row homes, Townhomes",
          rating: 4
        },
        {
          name: "West Philadelphia",
          medianPrice: 225000,
          homeTypes: "Row homes, Victorian",
          rating: 3
        }
      ],
      recentListings: [
        {
          price: 240000,
          bedrooms: 3,
          bathrooms: 1.5,
          sqft: 1500,
          address: "1212 S Broad St",
          isNew: true
        },
        {
          price: 375000,
          bedrooms: 4,
          bathrooms: 2,
          sqft: 1950,
          address: "5656 Spruce St",
          isNew: false
        }
      ]
    },
    schoolData: {
      rating: 2,
      publicSchools: 216,
      privateSchools: 95,
      topSchools: [
        {
          name: "Central High School",
          type: "Public Magnet",
          grades: "9-12",
          rating: 4
        },
        {
          name: "Friends Select School",
          type: "Private",
          grades: "K-12",
          rating: 5
        }
      ]
    },
    safetyData: {
      crimeIndex: 125,
      crimeIndexDiff: 25,
      violentCrime: 136,
      propertyCrime: 118
    },
    lifestyleData: {
      restaurants: 4100,
      parks: 205,
      shopping: 68,
      entertainment: 115
    },
    transportationData: {
      hasPublicTransit: true,
      transitScore: 75,
      walkScore: 78,
      bikeScore: 68,
      majorAirports: 1,
      interstateAccess: true
    }
  },
  {
    id: 15,
    name: "Phoenix",
    state: "AZ",
    region: "Southwest",
    population: 1660272,
    medianAge: 33.8,
    medianIncome: 57459,
    costOfLiving: 103,
    averageCommute: 26,
    climate: "Hot Desert",
    cbpFacilities: 1,
    rating: 4,
    lat: 33.4484,
    lng: -112.0740,
    housingData: {
      medianHomePrice: 410000,
      priceDiffFromAvg: 9,
      medianRent: 1550,
      rentDiffFromAvg: 11,
      priceGrowthLastYear: 12.3,
      estimatedMortgage: 1900,
      neighborhoods: [
        {
          name: "Arcadia",
          medianPrice: 750000,
          homeTypes: "Single-family, Ranch",
          rating: 5
        },
        {
          name: "Downtown Phoenix",
          medianPrice: 450000,
          homeTypes: "Condos, Lofts",
          rating: 4
        },
        {
          name: "Laveen",
          medianPrice: 350000,
          homeTypes: "Single-family, New Construction",
          rating: 3
        }
      ],
      recentListings: [
        {
          price: 395000,
          bedrooms: 3,
          bathrooms: 2,
          sqft: 1850,
          address: "7878 N 7th St",
          isNew: true
        },
        {
          price: 525000,
          bedrooms: 4,
          bathrooms: 2.5,
          sqft: 2500,
          address: "9999 E Camelback Rd",
          isNew: false
        }
      ]
    },
    schoolData: {
      rating: 3,
      publicSchools: 325,
      privateSchools: 78,
      topSchools: [
        {
          name: "Basis Phoenix",
          type: "Charter",
          grades: "5-12",
          rating: 5
        },
        {
          name: "Brophy College Preparatory",
          type: "Private",
          grades: "9-12",
          rating: 5
        }
      ]
    },
    safetyData: {
      crimeIndex: 95,
      crimeIndexDiff: -5,
      violentCrime: 88,
      propertyCrime: 98
    },
    lifestyleData: {
      restaurants: 3800,
      parks: 185,
      shopping: 75,
      entertainment: 95
    },
    transportationData: {
      hasPublicTransit: true,
      transitScore: 42,
      walkScore: 40,
      bikeScore: 52,
      majorAirports: 1,
      interstateAccess: true
    }
  },
  {
    id: 16,
    name: "Boston",
    state: "MA",
    region: "Northern",
    population: 695506,
    medianAge: 32.0,
    medianIncome: 76298,
    costOfLiving: 162,
    averageCommute: 31,
    climate: "Continental",
    cbpFacilities: 1,
    rating: 4,
    lat: 42.3601,
    lng: -71.0589,
    housingData: {
      medianHomePrice: 750000,
      priceDiffFromAvg: 100,
      medianRent: 2800,
      rentDiffFromAvg: 100,
      priceGrowthLastYear: 6.8,
      estimatedMortgage: 3500,
      neighborhoods: [
        {
          name: "Back Bay",
          medianPrice: 1200000,
          homeTypes: "Condos, Brownstones",
          rating: 5
        },
        {
          name: "Cambridge",
          medianPrice: 950000,
          homeTypes: "Condos, Multi-family",
          rating: 5
        },
        {
          name: "Dorchester",
          medianPrice: 550000,
          homeTypes: "Triple-deckers, Single-family",
          rating: 3
        }
      ],
      recentListings: [
        {
          price: 725000,
          bedrooms: 2,
          bathrooms: 1,
          sqft: 950,
          address: "123 Commonwealth Ave",
          isNew: true
        },
        {
          price: 950000,
          bedrooms: 3,
          bathrooms: 2.5,
          sqft: 1650,
          address: "456 Beacon St",
          isNew: false
        }
      ]
    },
    schoolData: {
      rating: 4,
      publicSchools: 125,
      privateSchools: 78,
      topSchools: [
        {
          name: "Boston Latin School",
          type: "Public Exam",
          grades: "7-12",
          rating: 5
        },
        {
          name: "Phillips Academy",
          type: "Private",
          grades: "9-12",
          rating: 5
        }
      ]
    },
    safetyData: {
      crimeIndex: 88,
      crimeIndexDiff: -12,
      violentCrime: 82,
      propertyCrime: 92
    },
    lifestyleData: {
      restaurants: 2800,
      parks: 230,
      shopping: 65,
      entertainment: 150
    },
    transportationData: {
      hasPublicTransit: true,
      transitScore: 88,
      walkScore: 83,
      bikeScore: 76,
      majorAirports: 1,
      interstateAccess: true
    }
  },
  {
    id: 17,
    name: "Dallas",
    state: "TX",
    region: "Southwest",
    population: 1345047,
    medianAge: 32.9,
    medianIncome: 54747,
    costOfLiving: 101,
    averageCommute: 27,
    climate: "Subtropical",
    cbpFacilities: 1,
    rating: 4,
    lat: 32.7767,
    lng: -96.7970,
    housingData: {
      medianHomePrice: 380000,
      priceDiffFromAvg: 1,
      medianRent: 1650,
      rentDiffFromAvg: 18,
      priceGrowthLastYear: 11.2,
      estimatedMortgage: 1750,
      neighborhoods: [
        {
          name: "Uptown",
          medianPrice: 475000,
          homeTypes: "Condos, Townhomes",
          rating: 5
        },
        {
          name: "Lake Highlands",
          medianPrice: 425000,
          homeTypes: "Single-family, Ranch",
          rating: 4
        },
        {
          name: "Oak Cliff",
          medianPrice: 325000,
          homeTypes: "Single-family, Craftsman",
          rating: 3
        }
      ],
      recentListings: [
        {
          price: 375000,
          bedrooms: 3,
          bathrooms: 2,
          sqft: 2000,
          address: "5555 Mockingbird Ln",
          isNew: true
        },
        {
          price: 450000,
          bedrooms: 4,
          bathrooms: 2.5,
          sqft: 2800,
          address: "7777 Preston Rd",
          isNew: false
        }
      ]
    },
    schoolData: {
      rating: 3,
      publicSchools: 230,
      privateSchools: 68,
      topSchools: [
        {
          name: "School for the Talented and Gifted",
          type: "Public Magnet",
          grades: "9-12",
          rating: 5
        },
        {
          name: "St. Mark's School of Texas",
          type: "Private",
          grades: "K-12",
          rating: 5
        }
      ]
    },
    safetyData: {
      crimeIndex: 102,
      crimeIndexDiff: 2,
      violentCrime: 94,
      propertyCrime: 106
    },
    lifestyleData: {
      restaurants: 4800,
      parks: 390,
      shopping: 85,
      entertainment: 110
    },
    transportationData: {
      hasPublicTransit: true,
      transitScore: 55,
      walkScore: 46,
      bikeScore: 49,
      majorAirports: 1,
      interstateAccess: true
    }
  },
  {
    id: 18,
    name: "Atlanta",
    state: "GA",
    region: "Coastal",
    population: 498715,
    medianAge: 33.2,
    medianIncome: 64179,
    costOfLiving: 107,
    averageCommute: 32,
    climate: "Humid Subtropical",
    cbpFacilities: 1,
    rating: 4,
    lat: 33.7490,
    lng: -84.3880,
    housingData: {
      medianHomePrice: 390000,
      priceDiffFromAvg: 4,
      medianRent: 1750,
      rentDiffFromAvg: 25,
      priceGrowthLastYear: 9.8,
      estimatedMortgage: 1800,
      neighborhoods: [
        {
          name: "Midtown",
          medianPrice: 450000,
          homeTypes: "Condos, Lofts",
          rating: 5
        },
        {
          name: "Inman Park",
          medianPrice: 525000,
          homeTypes: "Victorian, Bungalows",
          rating: 4
        },
        {
          name: "East Atlanta",
          medianPrice: 350000,
          homeTypes: "Craftsman, Bungalows",
          rating: 3
        }
      ],
      recentListings: [
        {
          price: 375000,
          bedrooms: 3,
          bathrooms: 2.5,
          sqft: 1800,
          address: "123 Peachtree St",
          isNew: true
        },
        {
          price: 450000,
          bedrooms: 4,
          bathrooms: 3,
          sqft: 2200,
          address: "456 Piedmont Ave",
          isNew: false
        }
      ]
    },
    schoolData: {
      rating: 3,
      publicSchools: 106,
      privateSchools: 58,
      topSchools: [
        {
          name: "North Atlanta High School",
          type: "Public",
          grades: "9-12",
          rating: 4
        },
        {
          name: "The Westminster Schools",
          type: "Private",
          grades: "K-12",
          rating: 5
        }
      ]
    },
    safetyData: {
      crimeIndex: 118,
      crimeIndexDiff: 18,
      violentCrime: 102,
      propertyCrime: 128
    },
    lifestyleData: {
      restaurants: 3200,
      parks: 340,
      shopping: 65,
      entertainment: 95
    },
    transportationData: {
      hasPublicTransit: true,
      transitScore: 68,
      walkScore: 51,
      bikeScore: 54,
      majorAirports: 1,
      interstateAccess: true
    }
  },
  {
    id: 19,
    name: "Houston",
    state: "TX",
    region: "Southwest",
    population: 2320268,
    medianAge: 33.1,
    medianIncome: 52450,
    costOfLiving: 96,
    averageCommute: 27,
    climate: "Humid Subtropical",
    cbpFacilities: 1,
    rating: 3,
    lat: 29.7604,
    lng: -95.3698,
    housingData: {
      medianHomePrice: 295000,
      priceDiffFromAvg: -21,
      medianRent: 1450,
      rentDiffFromAvg: 4,
      priceGrowthLastYear: 7.9,
      estimatedMortgage: 1350,
      neighborhoods: [
        {
          name: "The Heights",
          medianPrice: 475000,
          homeTypes: "Bungalows, New Construction",
          rating: 4
        },
        {
          name: "Montrose",
          medianPrice: 525000,
          homeTypes: "Townhomes, Bungalows",
          rating: 4
        },
        {
          name: "Spring Branch",
          medianPrice: 350000,
          homeTypes: "Single-family, Ranch",
          rating: 3
        }
      ],
      recentListings: [
        {
          price: 285000,
          bedrooms: 3,
          bathrooms: 2,
          sqft: 1750,
          address: "1234 Heights Blvd",
          isNew: true
        },
        {
          price: 395000,
          bedrooms: 4,
          bathrooms: 2.5,
          sqft: 2300,
          address: "5678 Westheimer Rd",
          isNew: false
        }
      ]
    },
    schoolData: {
      rating: 3,
      publicSchools: 280,
      privateSchools: 150,
      topSchools: [
        {
          name: "Carnegie Vanguard High School",
          type: "Public Magnet",
          grades: "9-12",
          rating: 5
        },
        {
          name: "St. John's School",
          type: "Private",
          grades: "K-12",
          rating: 5
        }
      ]
    },
    safetyData: {
      crimeIndex: 108,
      crimeIndexDiff: 8,
      violentCrime: 115,
      propertyCrime: 105
    },
    lifestyleData: {
      restaurants: 10000,
      parks: 380,
      shopping: 120,
      entertainment: 150
    },
    transportationData: {
      hasPublicTransit: true,
      transitScore: 45,
      walkScore: 49,
      bikeScore: 48,
      majorAirports: 2,
      interstateAccess: true
    }
  },
  {
    id: 20,
    name: "Austin",
    state: "TX",
    region: "Southwest",
    population: 964254,
    medianAge: 33.3,
    medianIncome: 75752,
    costOfLiving: 119,
    averageCommute: 23,
    climate: "Humid Subtropical",
    cbpFacilities: 1,
    rating: 5,
    lat: 30.2672,
    lng: -97.7431,
    housingData: {
      medianHomePrice: 565000,
      priceDiffFromAvg: 51,
      medianRent: 1850,
      rentDiffFromAvg: 32,
      priceGrowthLastYear: 13.2,
      estimatedMortgage: 2600,
      neighborhoods: [
        {
          name: "South Congress",
          medianPrice: 725000,
          homeTypes: "Bungalows, New Construction",
          rating: 5
        },
        {
          name: "East Austin",
          medianPrice: 550000,
          homeTypes: "Bungalows, Townhomes",
          rating: 4
        },
        {
          name: "North Loop",
          medianPrice: 595000,
          homeTypes: "Bungalows, Craftsman",
          rating: 4
        }
      ],
      recentListings: [
        {
          price: 545000,
          bedrooms: 3,
          bathrooms: 2,
          sqft: 1600,
          address: "1111 East 6th St",
          isNew: true
        },
        {
          price: 650000,
          bedrooms: 4,
          bathrooms: 2.5,
          sqft: 2200,
          address: "2222 South Lamar Blvd",
          isNew: false
        }
      ]
    },
    schoolData: {
      rating: 4,
      publicSchools: 130,
      privateSchools: 75,
      topSchools: [
        {
          name: "Liberal Arts and Science Academy",
          type: "Public Magnet",
          grades: "9-12",
          rating: 5
        },
        {
          name: "St. Stephen's Episcopal School",
          type: "Private",
          grades: "K-12",
          rating: 5
        }
      ]
    },
    safetyData: {
      crimeIndex: 85,
      crimeIndexDiff: -15,
      violentCrime: 72,
      propertyCrime: 92
    },
    lifestyleData: {
      restaurants: 2500,
      parks: 300,
      shopping: 68,
      entertainment: 185
    },
    transportationData: {
      hasPublicTransit: true,
      transitScore: 55,
      walkScore: 48,
      bikeScore: 70,
      majorAirports: 1,
      interstateAccess: true
    }
  },
  {
    id: 21,
    name: "Cleveland",
    state: "OH",
    region: "Northern",
    population: 381009,
    medianAge: 36.2,
    medianIncome: 30907,
    costOfLiving: 78,
    averageCommute: 24,
    climate: "Continental",
    cbpFacilities: 1,
    rating: 3,
    lat: 41.4993,
    lng: -81.6944,
    housingData: {
      medianHomePrice: 105000,
      priceDiffFromAvg: -72,
      medianRent: 950,
      rentDiffFromAvg: -32,
      priceGrowthLastYear: 9.2,
      estimatedMortgage: 480,
      neighborhoods: [
        {
          name: "Ohio City",
          medianPrice: 225000,
          homeTypes: "Victorian, New Construction",
          rating: 4
        },
        {
          name: "Tremont",
          medianPrice: 195000,
          homeTypes: "Victorian, Townhomes",
          rating: 4
        },
        {
          name: "Detroit Shoreway",
          medianPrice: 165000,
          homeTypes: "Craftsman, Bungalows",
          rating: 3
        }
      ],
      recentListings: [
        {
          price: 95000,
          bedrooms: 3,
          bathrooms: 1.5,
          sqft: 1650,
          address: "7777 Detroit Ave",
          isNew: true
        },
        {
          price: 185000,
          bedrooms: 4,
          bathrooms: 2,
          sqft: 2100,
          address: "8888 Euclid Ave",
          isNew: false
        }
      ]
    },
    schoolData: {
      rating: 2,
      publicSchools: 102,
      privateSchools: 35,
      topSchools: [
        {
          name: "Early College High School",
          type: "Public Magnet",
          grades: "9-12",
          rating: 4
        },
        {
          name: "Hawken School",
          type: "Private",
          grades: "K-12",
          rating: 5
        }
      ]
    },
    safetyData: {
      crimeIndex: 135,
      crimeIndexDiff: 35,
      violentCrime: 145,
      propertyCrime: 130
    },
    lifestyleData: {
      restaurants: 850,
      parks: 150,
      shopping: 38,
      entertainment: 65
    },
    transportationData: {
      hasPublicTransit: true,
      transitScore: 60,
      walkScore: 54,
      bikeScore: 48,
      majorAirports: 1,
      interstateAccess: true
    }
  },
  {
    id: 22,
    name: "Las Vegas",
    state: "NV",
    region: "Southwest",
    population: 644644,
    medianAge: 37.8,
    medianIncome: 56354,
    costOfLiving: 103,
    averageCommute: 25,
    climate: "Hot Desert",
    cbpFacilities: 1,
    rating: 3,
    lat: 36.1699,
    lng: -115.1398,
    housingData: {
      medianHomePrice: 410000,
      priceDiffFromAvg: 9,
      medianRent: 1450,
      rentDiffFromAvg: 4,
      priceGrowthLastYear: 12.8,
      estimatedMortgage: 1900,
      neighborhoods: [
        {
          name: "Summerlin",
          medianPrice: 525000,
          homeTypes: "Single-family, Modern",
          rating: 5
        },
        {
          name: "Henderson",
          medianPrice: 465000,
          homeTypes: "Single-family, New Construction",
          rating: 4
        },
        {
          name: "Spring Valley",
          medianPrice: 375000,
          homeTypes: "Single-family, Ranch",
          rating: 3
        }
      ],
      recentListings: [
        {
          price: 385000,
          bedrooms: 3,
          bathrooms: 2,
          sqft: 1850,
          address: "5555 Sahara Ave",
          isNew: true
        },
        {
          price: 495000,
          bedrooms: 4,
          bathrooms: 2.5,
          sqft: 2400,
          address: "7777 Desert Inn Rd",
          isNew: false
        }
      ]
    },
    schoolData: {
      rating: 2,
      publicSchools: 350,
      privateSchools: 65,
      topSchools: [
        {
          name: "Advanced Technologies Academy",
          type: "Public Magnet",
          grades: "9-12",
          rating: 5
        },
        {
          name: "Bishop Gorman High School",
          type: "Private",
          grades: "9-12",
          rating: 5
        }
      ]
    },
    safetyData: {
      crimeIndex: 92,
      crimeIndexDiff: -8,
      violentCrime: 85,
      propertyCrime: 96
    },
    lifestyleData: {
      restaurants: 5000,
      parks: 180,
      shopping: 85,
      entertainment: 250
    },
    transportationData: {
      hasPublicTransit: true,
      transitScore: 42,
      walkScore: 39,
      bikeScore: 45,
      majorAirports: 1,
      interstateAccess: true
    }
  },
  {
    id: 23,
    name: "Albuquerque",
    state: "NM",
    region: "Southwest",
    population: 564559,
    medianAge: 36.3,
    medianIncome: 53063,
    costOfLiving: 92,
    averageCommute: 22,
    climate: "High Desert",
    cbpFacilities: 1,
    rating: 3,
    lat: 35.0844,
    lng: -106.6504,
    housingData: {
      medianHomePrice: 295000,
      priceDiffFromAvg: -21,
      medianRent: 1250,
      rentDiffFromAvg: -11,
      priceGrowthLastYear: 10.2,
      estimatedMortgage: 1350,
      neighborhoods: [
        {
          name: "Nob Hill",
          medianPrice: 375000,
          homeTypes: "Pueblo Revival, Bungalows",
          rating: 4
        },
        {
          name: "North Valley",
          medianPrice: 425000,
          homeTypes: "Single-family, Adobe",
          rating: 4
        },
        {
          name: "Rio Rancho",
          medianPrice: 260000,
          homeTypes: "Single-family, New Construction",
          rating: 3
        }
      ],
      recentListings: [
        {
          price: 285000,
          bedrooms: 3,
          bathrooms: 2,
          sqft: 1850,
          address: "1111 Central Ave NE",
          isNew: true
        },
        {
          price: 350000,
          bedrooms: 4,
          bathrooms: 2.5,
          sqft: 2200,
          address: "2222 Tramway Blvd NE",
          isNew: false
        }
      ]
    },
    schoolData: {
      rating: 2,
      publicSchools: 143,
      privateSchools: 35,
      topSchools: [
        {
          name: "La Cueva High School",
          type: "Public",
          grades: "9-12",
          rating: 4
        },
        {
          name: "Albuquerque Academy",
          type: "Private",
          grades: "6-12",
          rating: 5
        }
      ]
    },
    safetyData: {
      crimeIndex: 140,
      crimeIndexDiff: 40,
      violentCrime: 132,
      propertyCrime: 145
    },
    lifestyleData: {
      restaurants: 1200,
      parks: 290,
      shopping: 42,
      entertainment: 65
    },
    transportationData: {
      hasPublicTransit: true,
      transitScore: 40,
      walkScore: 42,
      bikeScore: 64,
      majorAirports: 1,
      interstateAccess: true
    }
  },
  {
    id: 24,
    name: "San Antonio",
    state: "TX",
    region: "Southwest",
    population: 1547253,
    medianAge: 33.6,
    medianIncome: 52455,
    costOfLiving: 92,
    averageCommute: 24,
    climate: "Subtropical",
    cbpFacilities: 1,
    rating: 4,
    lat: 29.4241,
    lng: -98.4936,
    housingData: {
      medianHomePrice: 270000,
      priceDiffFromAvg: -28,
      medianRent: 1250,
      rentDiffFromAvg: -11,
      priceGrowthLastYear: 8.8,
      estimatedMortgage: 1250,
      neighborhoods: [
        {
          name: "Alamo Heights",
          medianPrice: 550000,
          homeTypes: "Single-family, Spanish Colonial",
          rating: 5
        },
        {
          name: "King William",
          medianPrice: 425000,
          homeTypes: "Victorian, Historic",
          rating: 4
        },
        {
          name: "Stone Oak",
          medianPrice: 375000,
          homeTypes: "Single-family, New Construction",
          rating: 4
        }
      ],
      recentListings: [
        {
          price: 265000,
          bedrooms: 3,
          bathrooms: 2,
          sqft: 1950,
          address: "7777 Broadway St",
          isNew: true
        },
        {
          price: 350000,
          bedrooms: 4,
          bathrooms: 2.5,
          sqft: 2600,
          address: "8888 Loop 1604",
          isNew: false
        }
      ]
    },
    schoolData: {
      rating: 3,
      publicSchools: 440,
      privateSchools: 120,
      topSchools: [
        {
          name: "Health Careers High School",
          type: "Public Magnet",
          grades: "9-12",
          rating: 5
        },
        {
          name: "Keystone School",
          type: "Private",
          grades: "K-12",
          rating: 5
        }
      ]
    },
    safetyData: {
      crimeIndex: 95,
      crimeIndexDiff: -5,
      violentCrime: 92,
      propertyCrime: 97
    },
    lifestyleData: {
      restaurants: 3500,
      parks: 250,
      shopping: 62,
      entertainment: 110
    },
    transportationData: {
      hasPublicTransit: true,
      transitScore: 41,
      walkScore: 38,
      bikeScore: 45,
      majorAirports: 1,
      interstateAccess: true
    }
  },
  {
    id: 25,
    name: "Honolulu",
    state: "HI",
    region: "Coastal",
    population: 350964,
    medianAge: 41.5,
    medianIncome: 69274,
    costOfLiving: 196,
    averageCommute: 27,
    climate: "Tropical",
    cbpFacilities: 1,
    rating: 4,
    lat: 21.3069,
    lng: -157.8583,
    housingData: {
      medianHomePrice: 825000,
      priceDiffFromAvg: 120,
      medianRent: 2350,
      rentDiffFromAvg: 68,
      priceGrowthLastYear: 5.2,
      estimatedMortgage: 3800,
      neighborhoods: [
        {
          name: "Kahala",
          medianPrice: 1500000,
          homeTypes: "Single-family, Luxury",
          rating: 5
        },
        {
          name: "Waikiki",
          medianPrice: 550000,
          homeTypes: "Condos, High-rise",
          rating: 4
        },
        {
          name: "Kaimuki",
          medianPrice: 850000,
          homeTypes: "Single-family, Bungalows",
          rating: 4
        }
      ],
      recentListings: [
        {
          price: 795000,
          bedrooms: 2,
          bathrooms: 2,
          sqft: 1050,
          address: "2222 Ala Wai Blvd",
          isNew: true
        },
        {
          price: 975000,
          bedrooms: 3,
          bathrooms: 2,
          sqft: 1550,
          address: "3333 Kalakaua Ave",
          isNew: false
        }
      ]
    },
    schoolData: {
      rating: 3,
      publicSchools: 55,
      privateSchools: 32,
      topSchools: [
        {
          name: "President William McKinley High School",
          type: "Public",
          grades: "9-12",
          rating: 4
        },
        {
          name: "Punahou School",
          type: "Private",
          grades: "K-12",
          rating: 5
        }
      ]
    },
    safetyData: {
      crimeIndex: 75,
      crimeIndexDiff: -25,
      violentCrime: 58,
      propertyCrime: 85
    },
    lifestyleData: {
      restaurants: 1800,
      parks: 290,
      shopping: 48,
      entertainment: 120
    },
    transportationData: {
      hasPublicTransit: true,
      transitScore: 58,
      walkScore: 64,
      bikeScore: 51,
      majorAirports: 1,
      interstateAccess: true
    }
  },
  {
    id: 26,
    name: "Brownsville",
    state: "TX",
    region: "Southwest",
    population: 183392,
    medianAge: 29.5,
    medianIncome: 38588,
    costOfLiving: 80,
    averageCommute: 19,
    climate: "Subtropical",
    cbpFacilities: 2,
    rating: 3,
    lat: 25.9017,
    lng: -97.4975,
    housingData: {
      medianHomePrice: 175000,
      priceDiffFromAvg: -53,
      medianRent: 920,
      rentDiffFromAvg: -34,
      priceGrowthLastYear: 7.2,
      estimatedMortgage: 800,
      neighborhoods: [
        {
          name: "Palm Boulevard",
          medianPrice: 220000,
          homeTypes: "Single-family, Spanish",
          rating: 4
        },
        {
          name: "Southmost",
          medianPrice: 155000,
          homeTypes: "Single-family",
          rating: 3
        },
        {
          name: "Los Fresnos",
          medianPrice: 185000,
          homeTypes: "Single-family, Ranch",
          rating: 3
        }
      ],
      recentListings: [
        {
          price: 165000,
          bedrooms: 3,
          bathrooms: 2,
          sqft: 1650,
          address: "1234 International Blvd",
          isNew: true
        },
        {
          price: 195000,
          bedrooms: 4,
          bathrooms: 2.5,
          sqft: 2100,
          address: "5678 Paredes Line Rd",
          isNew: false
        }
      ]
    },
    schoolData: {
      rating: 3,
      publicSchools: 52,
      privateSchools: 8,
      topSchools: [
        {
          name: "Veterans Memorial Early College High School",
          type: "Public",
          grades: "9-12",
          rating: 4
        },
        {
          name: "St. Joseph Academy",
          type: "Private",
          grades: "9-12",
          rating: 4
        }
      ]
    },
    safetyData: {
      crimeIndex: 70,
      crimeIndexDiff: -30,
      violentCrime: 65,
      propertyCrime: 73
    },
    lifestyleData: {
      restaurants: 380,
      parks: 35,
      shopping: 15,
      entertainment: 18
    },
    transportationData: {
      hasPublicTransit: true,
      transitScore: 31,
      walkScore: 41,
      bikeScore: 45,
      majorAirports: 1,
      interstateAccess: true
    }
  },
  {
    id: 27,
    name: "San Diego",
    state: "CA",
    region: "Coastal",
    population: 1425976,
    medianAge: 35.6,
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
          homeTypes: "Single-family, Craftsman",
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
      publicSchools: 220,
      privateSchools: 65,
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
      crimeIndex: 85,
      crimeIndexDiff: -15,
      violentCrime: 75,
      propertyCrime: 91
    },
    lifestyleData: {
      restaurants: 4200,
      parks: 340,
      shopping: 78,
      entertainment: 145
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
    id: 28,
    name: "Spokane",
    state: "WA",
    region: "Northern",
    population: 222081,
    medianAge: 36.5,
    medianIncome: 50306,
    costOfLiving: 95,
    averageCommute: 21,
    climate: "Highland Continental",
    cbpFacilities: 1,
    rating: 4,
    lat: 47.6588,
    lng: -117.4260,
    housingData: {
      medianHomePrice: 385000,
      priceDiffFromAvg: 3,
      medianRent: 1250,
      rentDiffFromAvg: -11,
      priceGrowthLastYear: 13.8,
      estimatedMortgage: 1800,
      neighborhoods: [
        {
          name: "South Hill",
          medianPrice: 450000,
          homeTypes: "Craftsman, Victorian",
          rating: 5
        },
        {
          name: "Kendall Yards",
          medianPrice: 425000,
          homeTypes: "New Construction, Townhomes",
          rating: 4
        },
        {
          name: "Perry District",
          medianPrice: 350000,
          homeTypes: "Bungalows, Craftsman",
          rating: 4
        }
      ],
      recentListings: [
        {
          price: 375000,
          bedrooms: 3,
          bathrooms: 2,
          sqft: 1750,
          address: "5555 Grand Blvd",
          isNew: true
        },
        {
          price: 425000,
          bedrooms: 4,
          bathrooms: 2.5,
          sqft: 2200,
          address: "6666 Manito Blvd",
          isNew: false
        }
      ]
    },
    schoolData: {
      rating: 3,
      publicSchools: 54,
      privateSchools: 22,
      topSchools: [
        {
          name: "Lewis and Clark High School",
          type: "Public",
          grades: "9-12",
          rating: 4
        },
        {
          name: "Gonzaga Preparatory School",
          type: "Private",
          grades: "9-12",
          rating: 5
        }
      ]
    },
    safetyData: {
      crimeIndex: 105,
      crimeIndexDiff: 5,
      violentCrime: 98,
      propertyCrime: 110
    },
    lifestyleData: {
      restaurants: 650,
      parks: 120,
      shopping: 25,
      entertainment: 45
    },
    transportationData: {
      hasPublicTransit: true,
      transitScore: 48,
      walkScore: 45,
      bikeScore: 52,
      majorAirports: 1,
      interstateAccess: true
    }
  },
  {
    id: 29,
    name: "Grand Forks",
    state: "ND",
    region: "Northern",
    population: 57056,
    medianAge: 29.2,
    medianIncome: 51360,
    costOfLiving: 85,
    averageCommute: 15,
    climate: "Continental",
    cbpFacilities: 1,
    rating: 3,
    lat: 47.9253,
    lng: -97.0329,
    housingData: {
      medianHomePrice: 250000,
      priceDiffFromAvg: -33,
      medianRent: 950,
      rentDiffFromAvg: -32,
      priceGrowthLastYear: 5.8,
      estimatedMortgage: 1150,
      neighborhoods: [
        {
          name: "University District",
          medianPrice: 275000,
          homeTypes: "Single-family, Craftsman",
          rating: 4
        },
        {
          name: "Grand Cities",
          medianPrice: 240000,
          homeTypes: "Single-family, Ranch",
          rating: 3
        },
        {
          name: "Thompson",
          medianPrice: 225000,
          homeTypes: "Single-family, New Construction",
          rating: 3
        }
      ],
      recentListings: [
        {
          price: 235000,
          bedrooms: 3,
          bathrooms: 2,
          sqft: 1850,
          address: "1212 Belmont Road",
          isNew: true
        },
        {
          price: 285000,
          bedrooms: 4,
          bathrooms: 2.5,
          sqft: 2400,
          address: "3434 University Ave",
          isNew: false
        }
      ]
    },
    schoolData: {
      rating: 4,
      publicSchools: 18,
      privateSchools: 5,
      topSchools: [
        {
          name: "Red River High School",
          type: "Public",
          grades: "9-12",
          rating: 4
        },
        {
          name: "Sacred Heart School",
          type: "Private",
          grades: "K-12",
          rating: 4
        }
      ]
    },
    safetyData: {
      crimeIndex: 75,
      crimeIndexDiff: -25,
      violentCrime: 68,
      propertyCrime: 80
    },
    lifestyleData: {
      restaurants: 180,
      parks: 45,
      shopping: 12,
      entertainment: 18
    },
    transportationData: {
      hasPublicTransit: true,
      transitScore: 30,
      walkScore: 45,
      bikeScore: 62,
      majorAirports: 1,
      interstateAccess: true
    }
  },
  {
    id: 30,
    name: "Houlton",
    state: "ME",
    region: "Northern",
    population: 5873,
    medianAge: 43.8,
    medianIncome: 39245,
    costOfLiving: 82,
    averageCommute: 12,
    climate: "Continental",
    cbpFacilities: 1,
    rating: 3,
    lat: 46.1254,
    lng: -67.8401,
    housingData: {
      medianHomePrice: 125000,
      priceDiffFromAvg: -67,
      medianRent: 750,
      rentDiffFromAvg: -46,
      priceGrowthLastYear: 3.2,
      estimatedMortgage: 575,
      neighborhoods: [
        {
          name: "Downtown Houlton",
          medianPrice: 145000,
          homeTypes: "Victorian, Colonial",
          rating: 3
        },
        {
          name: "Littleton",
          medianPrice: 115000,
          homeTypes: "Single-family, Farmhouse",
          rating: 3
        },
        {
          name: "New Limerick",
          medianPrice: 135000,
          homeTypes: "Single-family, Rural",
          rating: 3
        }
      ],
      recentListings: [
        {
          price: 120000,
          bedrooms: 3,
          bathrooms: 1.5,
          sqft: 1750,
          address: "123 Main Street",
          isNew: true
        },
        {
          price: 165000,
          bedrooms: 4,
          bathrooms: 2,
          sqft: 2200,
          address: "456 North Road",
          isNew: false
        }
      ]
    },
    schoolData: {
      rating: 3,
      publicSchools: 4,
      privateSchools: 1,
      topSchools: [
        {
          name: "Houlton High School",
          type: "Public",
          grades: "9-12",
          rating: 3
        },
        {
          name: "Greater Houlton Christian Academy",
          type: "Private",
          grades: "K-12",
          rating: 3
        }
      ]
    },
    safetyData: {
      crimeIndex: 65,
      crimeIndexDiff: -35,
      violentCrime: 58,
      propertyCrime: 70
    },
    lifestyleData: {
      restaurants: 25,
      parks: 6,
      shopping: 4,
      entertainment: 5
    },
    transportationData: {
      hasPublicTransit: false,
      transitScore: 15,
      walkScore: 52,
      bikeScore: 45,
      majorAirports: 0,
      interstateAccess: true
    }
  },
  {
    id: 31,
    name: "Key West",
    state: "FL",
    region: "Coastal",
    population: 24565,
    medianAge: 42.1,
    medianIncome: 71345,
    costOfLiving: 154,
    averageCommute: 15,
    climate: "Tropical",
    cbpFacilities: 1,
    rating: 4,
    lat: 24.5551,
    lng: -81.7800,
    housingData: {
      medianHomePrice: 875000,
      priceDiffFromAvg: 133,
      medianRent: 2800,
      rentDiffFromAvg: 100,
      priceGrowthLastYear: 7.5,
      estimatedMortgage: 4000,
      neighborhoods: [
        {
          name: "Old Town",
          medianPrice: 1200000,
          homeTypes: "Conch Houses, Historic",
          rating: 5
        },
        {
          name: "New Town",
          medianPrice: 750000,
          homeTypes: "Single-family, Condos",
          rating: 4
        },
        {
          name: "Stock Island",
          medianPrice: 625000,
          homeTypes: "Single-family, Condos",
          rating: 3
        }
      ],
      recentListings: [
        {
          price: 850000,
          bedrooms: 2,
          bathrooms: 2,
          sqft: 1050,
          address: "1111 Duval Street",
          isNew: true
        },
        {
          price: 1100000,
          bedrooms: 3,
          bathrooms: 2.5,
          sqft: 1650,
          address: "2222 Simonton Street",
          isNew: false
        }
      ]
    },
    schoolData: {
      rating: 3,
      publicSchools: 8,
      privateSchools: 4,
      topSchools: [
        {
          name: "Key West High School",
          type: "Public",
          grades: "9-12",
          rating: 3
        },
        {
          name: "Montessori Children's School",
          type: "Private",
          grades: "K-8",
          rating: 4
        }
      ]
    },
    safetyData: {
      crimeIndex: 88,
      crimeIndexDiff: -12,
      violentCrime: 72,
      propertyCrime: 98
    },
    lifestyleData: {
      restaurants: 280,
      parks: 15,
      shopping: 85,
      entertainment: 95
    },
    transportationData: {
      hasPublicTransit: true,
      transitScore: 45,
      walkScore: 68,
      bikeScore: 75,
      majorAirports: 1,
      interstateAccess: false
    }
  }
];