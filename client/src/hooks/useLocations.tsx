import { createContext, useContext, useState, useEffect, ReactNode } from "react";
import { useQuery } from "@tanstack/react-query";
import { Location } from "@/lib/types";

interface LocationContextType {
  locations: Location[];
  compareLocations: number[];
  addToCompare: (locationId: number) => void;
  removeFromCompare: (locationId: number) => void;
  isInCompare: (locationId: number) => boolean;
  clearCompare: () => void;
  getLocationById: (id: number) => Location | undefined;
}

const LocationContext = createContext<LocationContextType | undefined>(undefined);

export const LocationProvider = ({ children }: { children: ReactNode }) => {
  const [locations, setLocations] = useState<Location[]>([]);
  const [compareLocations, setCompareLocations] = useState<number[]>([]);

  // Fetch locations
  const { data, isSuccess } = useQuery({ 
    queryKey: ['/api/locations'],
  });

  useEffect(() => {
    if (isSuccess && data) {
      setLocations(data);
    }
  }, [isSuccess, data]);

  // Load compare locations from localStorage
  useEffect(() => {
    const savedCompare = localStorage.getItem('compareLocations');
    if (savedCompare) {
      try {
        setCompareLocations(JSON.parse(savedCompare));
      } catch (e) {
        console.error("Failed to parse saved compare locations");
      }
    }
  }, []);

  // Save compare locations to localStorage
  useEffect(() => {
    localStorage.setItem('compareLocations', JSON.stringify(compareLocations));
  }, [compareLocations]);

  const addToCompare = (locationId: number) => {
    if (!compareLocations.includes(locationId) && compareLocations.length < 3) {
      setCompareLocations([...compareLocations, locationId]);
    }
  };

  const removeFromCompare = (locationId: number) => {
    setCompareLocations(compareLocations.filter(id => id !== locationId));
  };

  const isInCompare = (locationId: number) => {
    return compareLocations.includes(locationId);
  };

  const clearCompare = () => {
    setCompareLocations([]);
  };

  const getLocationById = (id: number) => {
    return locations.find(location => location.id === id);
  };

  return (
    <LocationContext.Provider value={{
      locations,
      compareLocations,
      addToCompare,
      removeFromCompare,
      isInCompare,
      clearCompare,
      getLocationById
    }}>
      {children}
    </LocationContext.Provider>
  );
};

export const useLocations = () => {
  const context = useContext(LocationContext);
  if (context === undefined) {
    throw new Error("useLocations must be used within a LocationProvider");
  }
  return context;
};
