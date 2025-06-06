import { Location } from "@/lib/types";
import StarRating from "@/components/StarRating";

interface LocationCardProps {
  location: Location;
  onSelect: () => void;
  isInCompare: boolean;
  onCompareToggle: () => void;
}

const LocationCard = ({ location, onSelect, isInCompare, onCompareToggle }: LocationCardProps) => {
  // Format dollar amounts with commas
  const formatPrice = (price: number) => {
    return price.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
  };

  return (
    <div 
      className="p-5 mb-3 hover:bg-gray-50 border border-gray-100 transition-all shadow-sm hover:shadow-md bg-white rounded-xl" 
    >
      <div className="flex justify-between items-start mb-4">
        <div>
          <h3 className="font-medium text-lg text-gray-900">{location.name}, {location.state}</h3>
          <div className="text-sm text-gray-500 flex items-center mt-1">
            <span className="inline-block w-3 h-3 bg-blue-500 mr-1.5 rounded"></span>
            {location.region} Region
          </div>
        </div>
        <button 
          onClick={(e) => {
            e.stopPropagation();
            onCompareToggle();
          }} 
          className={`p-2.5 transition-colors rounded-lg ${
            isInCompare ? 'bg-blue-50 text-blue-500' : 'text-gray-400 hover:text-gray-500'
          }`}
          aria-label={isInCompare ? "Remove from comparison" : "Add to comparison"}
        >
          <span className="material-icons text-xl">
            {isInCompare ? 'compare' : 'add_circle_outline'}
          </span>
        </button>
      </div>
      
      <div className="grid grid-cols-2 gap-3 my-4">
        <div className="bg-gray-50 p-3 rounded-lg">
          <div className="text-sm text-gray-500 font-normal mb-1">Median Home</div>
          <div className="font-medium text-gray-900">${formatPrice(location.housingData.medianHomePrice)}</div>
        </div>
        <div className="bg-gray-50 p-3 rounded-lg">
          <div className="text-sm text-gray-500 font-normal mb-1">Median Rent</div>
          <div className="font-medium text-gray-900">${formatPrice(location.housingData.medianRent)}/mo</div>
        </div>
      </div>

      <div className="flex items-center justify-between mt-4 border-t border-gray-100 pt-4">
        <div className="flex items-center">
          <span className="text-sm text-gray-500 font-normal mr-1">Rating</span>
          <StarRating rating={location.rating} />
          <span className="ml-1 text-sm text-gray-500 font-medium">{location.rating}</span>
        </div>
        
        <button 
          onClick={onSelect}
          className="flex items-center text-blue-500 font-medium text-base bg-white hover:bg-blue-50 py-2 px-3 rounded-lg transition-colors"
        >
          <span>View Details</span>
          <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="ml-1">
            <line x1="5" y1="12" x2="19" y2="12"></line>
            <polyline points="12 5 19 12 12 19"></polyline>
          </svg>
        </button>
      </div>
    </div>
  );
};

export default LocationCard;
