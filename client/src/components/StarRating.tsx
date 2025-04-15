interface StarRatingProps {
  rating: number;
  maxStars?: number;
}

const StarRating = ({ rating, maxStars = 5 }: StarRatingProps) => {
  const roundedRating = Math.round(rating);
  
  return (
    <div className="flex">
      {Array.from({ length: maxStars }).map((_, i) => (
        <span 
          key={i} 
          className={`material-icons text-sm ${
            i < roundedRating ? 'text-[#ffbe2e]' : 'text-neutral-200'
          }`}
        >
          star
        </span>
      ))}
    </div>
  );
};

export default StarRating;
