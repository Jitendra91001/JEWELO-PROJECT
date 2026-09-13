import React from "react";
import { cn } from "@/lib/utils";

export interface PriceDisplayProps {
  amount: number;
  originalPrice?: number;
  currency?: string;
  size?: "sm" | "md" | "lg" | "xl";
  showEmi?: boolean;
  karatNote?: string;
  discountBadge?: boolean;
  className?: string;
}

export const PriceDisplay: React.FC<PriceDisplayProps> = ({
  amount,
  originalPrice,
  currency = "₹",
  size = "md",
  showEmi = false,
  karatNote,
  discountBadge = true,
  className,
}) => {
  const formattedAmount = (amount || 0).toLocaleString("en-IN");
  const formattedOriginal = originalPrice
    ? originalPrice.toLocaleString("en-IN")
    : null;

  const discountPercent =
    originalPrice && originalPrice > amount
      ? Math.round(((originalPrice - amount) / originalPrice) * 100)
      : null;

  const emiAmount = Math.round(amount / 6).toLocaleString("en-IN");

  const sizeClasses = {
    sm: "text-xs sm:text-sm font-semibold",
    md: "text-sm sm:text-base font-bold",
    lg: "text-lg sm:text-xl font-bold",
    xl: "text-2xl sm:text-3xl font-bold",
  };

  return (
    <div className={cn("font-body inline-flex flex-col", className)}>
      <div className="flex items-baseline gap-2 flex-wrap">
        <span className={cn("text-foreground font-display", sizeClasses[size])}>
          <span className="text-xs mr-0.5 font-normal text-muted-foreground">
            {currency}
          </span>
          {formattedAmount}
        </span>

        {formattedOriginal && (
          <span className="text-xs text-muted-foreground line-through font-light">
            {currency}{formattedOriginal}
          </span>
        )}

        {discountBadge && discountPercent && (
          <span className="text-[10px] font-bold text-emerald-700 bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-500/20 px-1.5 py-0.5 rounded-full uppercase tracking-wider">
            {discountPercent}% OFF
          </span>
        )}
      </div>

      {karatNote && (
        <span className="text-[10px] text-[#997D4D] font-medium mt-0.5 tracking-wide uppercase">
          {karatNote}
        </span>
      )}

      {showEmi && amount > 5000 && (
        <span className="text-[10px] text-muted-foreground font-light mt-0.5">
          Or 6 monthly payments of <span className="font-semibold text-foreground">{currency}{emiAmount}</span>
        </span>
      )}
    </div>
  );
};

export default PriceDisplay;
