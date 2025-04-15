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
      className="p-4 hover:bg-[#f8fafc] border border-[#e2e8f0] cursor-pointer transition-all shadow-sm hover:shadow-md" 
      onClick={onSelect}
      style={{ borderRadius: '4px' }}
    >
      <div className="flex justify-between items-start mb-3">
        <div>
          <h3 className="font-semibold text-lg text-[#0f172a]">{location.name}, {location.state}</h3>
          <div className="text-xs text-[#64748b] flex items-center">
            <span className="inline-block w-2 h-2 bg-[#0ea5e9] mr-1.5" style={{ borderRadius: '0px' }}></span>
            {location.region} Region
          </div>
        </div>
        <button 
          onClick={(e) => {
            e.stopPropagation();
            onCompareToggle();
          }} 
          className={`p-1.5 hover:bg-[#e0f2fe] transition-colors ${
            isInCompare ? 'bg-[#e0f2fe] text-[#0284c7]' : 'text-[#94a3b8]'
          }`}
          style={{ borderRadius: '2px' }}
          title={isInCompare ? "Remove from comparison" : "Add to comparison"}
        >
          <span className="material-icons text-sm">
            {isInCompare ? 'compare' : 'add_circle_outline'}
          </span>
        </button>
      </div>
      
      <div className="grid grid-cols-2 gap-2 my-3 text-sm">
        <div className="bg-[#f1f5f9] p-2" style={{ borderRadius: '2px' }}>
          <div className="text-xs text-[#64748b] font-medium tracking-wide">MEDIAN HOME</div>
          <div className="font-semibold text-[#334155]">${formatPrice(location.housingData.medianHomePrice)}</div>
        </div>
        <div className="bg-[#f1f5f9] p-2" style={{ borderRadius: '2px' }}>
          <div className="text-xs text-[#64748b] font-medium tracking-wide">MEDIAN RENT</div>
          <div className="font-semibold text-[#334155]">${formatPrice(location.housingData.medianRent)}/mo</div>
        </div>
      </div>

      <div className="flex items-center justify-between mt-3 border-t border-[#e2e8f0] pt-3">
        <div className="flex items-center">
          <span className="text-xs font-medium mr-1 text-[#64748b]">RATING</span>
          <StarRating rating={location.rating} />
          <span className="ml-1 text-xs text-[#64748b] font-medium">{location.rating}</span>
        </div>
        <div className="flex items-center text-[#0284c7] font-medium text-sm">
          <span>VIEW DETAILS</span>
          <span className="material-icons text-sm ml-1">arrow_forward</span>
        </div>
      </div>
    </div>
  );
};

export default LocationCard;
