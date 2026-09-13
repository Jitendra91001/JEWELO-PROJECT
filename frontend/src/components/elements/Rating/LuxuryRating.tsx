import React from "react";
import { Star } from "lucide-react";
import { cn } from "@/lib/utils";

export interface LuxuryRatingProps {
  value: number; // e.g. 4.8
  max?: number;
  reviewsCount?: number;
  size?: "sm" | "md" | "lg";
  interactive?: boolean;
  onChange?: (val: number) => void;
  showScore?: boolean;
  className?: string;
}

export const LuxuryRating: React.FC<LuxuryRatingProps> = ({
  value = 5,
  max = 5,
  reviewsCount,
  size = "md",
  interactive = false,
  onChange,
  showScore = true,
  className,
}) => {
  const sizeMap = {
    sm: 11,
    md: 13,
    lg: 16,
  };

  const starSize = sizeMap[size];

  return (
    <div className={cn("inline-flex items-center gap-1.5 font-body", className)}>
      <div className="flex items-center gap-0.5">
        {Array.from({ length: max }).map((_, idx) => {
          const starVal = idx + 1;
          const isFilled = value >= starVal;
          const isHalf = !isFilled && value >= starVal - 0.5;

          return (
            <button
              key={idx}
              type="button"
              disabled={!interactive}
              onClick={() => interactive && onChange && onChange(starVal)}
              className={cn(
                "p-0 border-0 bg-transparent text-[#C5A880]",
                interactive && "cursor-pointer hover:scale-110 transition-transform",
                !interactive && "cursor-default"
              )}
            >
              <Star
                size={starSize}
                className={cn(
                  isFilled
                    ? "fill-[#C5A880] text-[#C5A880]"
                    : isHalf
                    ? "fill-[#C5A880]/50 text-[#C5A880]"
                    : "fill-transparent text-[#C5A880]/30"
                )}
              />
            </button>
          );
        })}
      </div>

      {showScore && (
        <span className="text-xs font-semibold text-foreground">
          {value.toFixed(1)}
        </span>
      )}

      {reviewsCount !== undefined && (
        <span className="text-[11px] text-muted-foreground font-light">
          ({reviewsCount.toLocaleString()})
        </span>
      )}
    </div>
  );
};

export default LuxuryRating;
