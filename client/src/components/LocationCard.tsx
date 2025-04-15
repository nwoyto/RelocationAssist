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
      className="p-4 hover:bg-neutral-50 border border-transparent hover:border-[#005ea2]/20 cursor-pointer transition-all rounded-lg shadow-sm hover:shadow" 
      onClick={onSelect}
    >
      <div className="flex justify-between items-start mb-2">
        <div>
          <h3 className="font-medium text-lg text-[#1a4480]">{location.name}, {location.state}</h3>
          <div className="text-xs text-neutral-500 flex items-center">
            <span className="inline-block w-2 h-2 rounded-full bg-[#1a4480]/60 mr-1.5"></span>
            {location.region} Region
          </div>
        </div>
        <button 
          onClick={(e) => {
            e.stopPropagation();
            onCompareToggle();
          }} 
          className={`p-1.5 hover:bg-[#005ea2]/10 rounded-full transition-colors ${
            isInCompare ? 'bg-[#005ea2]/10 text-[#005ea2]' : 'text-neutral-400'
          }`}
          title={isInCompare ? "Remove from comparison" : "Add to comparison"}
        >
          <span className="material-icons text-sm">
            {isInCompare ? 'compare' : 'add_circle_outline'}
          </span>
        </button>
      </div>
      
      <div className="grid grid-cols-2 gap-2 my-3 text-sm">
        <div className="bg-neutral-50 p-2 rounded">
          <div className="text-xs text-neutral-500">Median Home</div>
          <div className="font-medium">${formatPrice(location.housingData.medianHomePrice)}</div>
        </div>
        <div className="bg-neutral-50 p-2 rounded">
          <div className="text-xs text-neutral-500">Median Rent</div>
          <div className="font-medium">${formatPrice(location.housingData.medianRent)}/mo</div>
        </div>
      </div>

      <div className="flex items-center justify-between mt-3 border-t pt-2">
        <div className="flex items-center">
          <span className="text-xs font-medium mr-1">Rating:</span>
          <StarRating rating={location.rating} />
          <span className="ml-1 text-xs text-neutral-600">{location.rating}</span>
        </div>
        <div className="flex items-center text-[#005ea2] font-medium text-sm">
          <span>View Details</span>
          <span className="material-icons text-sm ml-1">chevron_right</span>
        </div>
      </div>
    </div>
  );
};

export default LocationCard;
