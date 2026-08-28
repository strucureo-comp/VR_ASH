import { Star } from "lucide-react";

export function Stars({ rating, className = "" }: { rating: number; className?: string }) {
  return (
    <div
      className={`flex items-center gap-0.5 ${className}`}
      role="img"
      aria-label={`${rating} out of 5 stars`}
    >
      {Array.from({ length: 5 }, (_, i) => (
        <Star
          key={i}
          aria-hidden="true"
          className={
            i < rating
              ? "h-4 w-4 fill-[color:var(--gold)] text-[color:var(--gold)]"
              : "h-4 w-4 text-border"
          }
        />
      ))}
    </div>
  );
}
