import { Star, StarHalf } from "lucide-react";

export function RatingStars({ rating, className = "" }: { rating: number; className?: string }) {
  const full = Math.floor(rating);
  const half = rating - full >= 0.25 && rating - full < 0.75;
  const rounded = half ? full : Math.round(rating);
  return (
    <span className={`inline-flex items-center gap-0.5 ${className}`} aria-label={`${rating} out of 5 stars`}>
      {Array.from({ length: 5 }).map((_, i) => {
        if (i < (half ? full : rounded)) {
          return <Star key={i} className="size-3.5 fill-deal text-deal" />;
        }
        if (i === full && half) {
          return (
            <span key={i} className="relative inline-flex">
              <Star className="size-3.5 text-border" />
              <StarHalf className="absolute inset-0 size-3.5 fill-deal text-deal" />
            </span>
          );
        }
        return <Star key={i} className="size-3.5 text-border" />;
      })}
    </span>
  );
}
