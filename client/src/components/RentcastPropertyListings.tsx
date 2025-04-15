import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { apiRequest } from '@/lib/queryClient';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Skeleton } from '@/components/ui/skeleton';

interface PropertyListing {
  id: string;
  address: string;
  city: string;
  state: string;
  zipCode: string;
  price: number;
  bedrooms: number;
  bathrooms: number;
  squareFootage: number;
  listedDate: string;
  status: string;
  propertyType: string;
  photos: string[];
}

interface RentcastPropertyListingsProps {
  city: string;
  state: string;
  limit?: number;
}

const RentcastPropertyListings = ({ city, state, limit = 5 }: RentcastPropertyListingsProps) => {
  const { data, isLoading, error } = useQuery({
    queryKey: ['/api/rentcast/property-listings', city, state, limit],
    queryFn: () => 
      apiRequest<PropertyListing[]>(`/api/rentcast/property-listings?city=${encodeURIComponent(city)}&state=${encodeURIComponent(state)}&limit=${limit}`, { on401: 'throw' }),
  });

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      maximumFractionDigits: 0,
    }).format(price);
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return new Intl.DateTimeFormat('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
    }).format(date);
  };

  if (isLoading) {
    return (
      <div className="space-y-4">
        <h3 className="text-xl font-semibold mb-4">Current Listings</h3>
        {[...Array(3)].map((_, i) => (
          <Card key={i} className="p-4 mb-4">
            <div className="flex flex-col md:flex-row gap-4">
              <Skeleton className="w-full md:w-1/3 h-48 rounded-md" />
              <div className="flex-1 space-y-2">
                <Skeleton className="h-6 w-3/4" />
                <Skeleton className="h-4 w-1/2" />
                <Skeleton className="h-4 w-1/4" />
                <div className="pt-2">
                  <Skeleton className="h-10 w-24" />
                </div>
              </div>
            </div>
          </Card>
        ))}
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-red-50 border border-red-200 text-red-800 rounded-md p-4 mt-4">
        <h3 className="text-lg font-medium">Unable to load property listings</h3>
        <p className="text-sm mt-1">We're having trouble connecting to our real estate data service. Please try again later.</p>
      </div>
    );
  }

  if (!data || data.length === 0) {
    return (
      <div className="bg-blue-50 border border-blue-200 text-blue-800 rounded-md p-4 mt-4">
        <h3 className="text-lg font-medium">No property listings available</h3>
        <p className="text-sm mt-1">There are currently no active property listings for {city}, {state}. Please check back later for updates.</p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center mb-4">
        <h3 className="text-xl font-semibold">Current Listings</h3>
        <Badge variant="outline" className="px-3 py-1">
          {data.length} properties
        </Badge>
      </div>
      
      <div className="grid gap-4">
        {data.map((property) => (
          <Card key={property.id} className="overflow-hidden shadow-md hover:shadow-lg transition-shadow">
            <div className="flex flex-col md:flex-row">
              <div className="md:w-1/3 h-48 relative">
                {property.photos && property.photos.length > 0 ? (
                  <img 
                    src={property.photos[0]} 
                    alt={`${property.address}`} 
                    className="object-cover w-full h-full"
                    onError={(e) => {
                      // Fallback image on error
                      e.currentTarget.src = `https://via.placeholder.com/400x300?text=Property+at+${encodeURIComponent(property.address)}`;
                    }}
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center bg-gray-200">
                    <span className="text-gray-500">No image available</span>
                  </div>
                )}
                <div className="absolute top-2 left-2">
                  <Badge className="bg-blue-600">
                    {property.propertyType}
                  </Badge>
                </div>
              </div>
              
              <div className="flex-1 p-4">
                <div className="flex justify-between">
                  <h3 className="text-lg font-semibold truncate">{property.address}</h3>
                  <p className="text-lg font-bold text-blue-700">{formatPrice(property.price)}</p>
                </div>
                
                <p className="text-gray-600 text-sm mb-2">{property.city}, {property.state} {property.zipCode}</p>
                
                <div className="flex gap-3 mb-2">
                  <div className="flex gap-1 items-center">
                    <span className="material-icons text-sm text-gray-600">bed</span>
                    <span>{property.bedrooms} beds</span>
                  </div>
                  <div className="flex gap-1 items-center">
                    <span className="material-icons text-sm text-gray-600">bathtub</span>
                    <span>{property.bathrooms} baths</span>
                  </div>
                  <div className="flex gap-1 items-center">
                    <span className="material-icons text-sm text-gray-600">square_foot</span>
                    <span>{property.squareFootage.toLocaleString()} sqft</span>
                  </div>
                </div>
                
                <div className="flex items-center mt-1 text-sm text-gray-600">
                  <span className="material-icons text-xs mr-1">calendar_today</span>
                  Listed {formatDate(property.listedDate)}
                </div>
                
                <div className="mt-3">
                  <Button variant="outline" className="text-blue-600 border-blue-600 hover:bg-blue-50 hover:text-blue-800">
                    View Details
                  </Button>
                </div>
              </div>
            </div>
          </Card>
        ))}
      </div>
    </div>
  );
};

export default RentcastPropertyListings;