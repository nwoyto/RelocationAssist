import { Location } from "@/lib/types";
import StarRating from "@/components/StarRating";

interface LocationCardProps {
  location: Location;
  onSelect: () => void;
  isInCompare: boolean;
  onCompareToggle: () => void;
}

const LocationCard = ({ location, onSelect, isInCompare, onCompareToggle }: LocationCardProps) => {
  return (
    <div 
      className="p-3 hover:bg-neutral-50 cursor-pointer transition-colors" 
      onClick={onSelect}
    >
      <div className="flex justify-between items-start mb-1">
        <div>
          <h3 className="font-medium">{location.name}, {location.state}</h3>
          <div className="text-xs text-neutral-500">{location.region} Region</div>
        </div>
        <button 
          onClick={(e) => {
            e.stopPropagation();
            onCompareToggle();
          }} 
          className={`p-1 hover:bg-neutral-100 rounded ${
            isInCompare ? 'text-[#005ea2]' : 'text-neutral-400'
          }`}
        >
          <span className="material-icons text-sm">
            {isInCompare ? 'compare' : 'add'}
          </span>
        </button>
      </div>
      <div className="flex items-center mt-2">
        <div className="flex-1">
          <div className="flex items-center">
            <span className="text-xs font-medium mr-1">Rating:</span>
            <StarRating rating={location.rating} />
            <span className="ml-1 text-xs text-neutral-600">{location.rating}</span>
          </div>
        </div>
        <span className="material-icons text-neutral-300">chevron_right</span>
      </div>
    </div>
  );
};

export default LocationCard;
