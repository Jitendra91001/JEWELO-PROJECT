import React, { useState } from "react";
import { Heart, Eye, Sparkles, ShoppingBag } from "lucide-react";
import { cn } from "@/lib/utils";
import LuxuryBadge from "../Badge/LuxuryBadge";
import PriceDisplay from "../Price/PriceDisplay";
import LuxuryRating from "../Rating/LuxuryRating";

export interface LuxuryProductCardProps {
  id: string;
  name: string;
  price: number;
  originalPrice?: number;
  image: string;
  secondaryImage?: string;
  purity?: string; // e.g. "18K Gold", "Platinum"
  material?: string;
  category?: string;
  rating?: number;
  reviewsCount?: number;
  inStock?: boolean;
  isNew?: boolean;
  isWishlisted?: boolean;
  onWishlistToggle?: (id: string) => void;
  onQuickView?: (id: string) => void;
  onAddToCart?: (id: string) => void;
  onClick?: () => void;
  className?: string;
}

export const LuxuryProductCard: React.FC<LuxuryProductCardProps> = ({
  id,
  name,
  price,
  originalPrice,
  image,
  secondaryImage,
  purity = "18K Gold",
  material,
  category,
  rating = 4.9,
  reviewsCount = 12,
  inStock = true,
  isNew = false,
  isWishlisted = false,
  onWishlistToggle,
  onQuickView,
  onAddToCart,
  onClick,
  className,
}) => {
  const [isHovered, setIsHovered] = useState(false);
  const [wishlistActive, setWishlistActive] = useState(isWishlisted);

  const handleWishlistClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    setWishlistActive(!wishlistActive);
    if (onWishlistToggle) onWishlistToggle(id);
  };

  const handleQuickViewClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (onQuickView) onQuickView(id);
  };

  const handleAddToCartClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (onAddToCart) onAddToCart(id);
  };

  return (
    <div
      onClick={onClick}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      className={cn(
        "group relative bg-card text-card-foreground rounded-2xl overflow-hidden border border-[#EAE4DC] dark:border-[#2B2B2B]",
        "transition-all duration-500 hover:shadow-[0_10px_30px_-5px_rgba(197,168,128,0.2)] hover:border-[#C5A880]/50",
        "flex flex-col cursor-pointer font-body",
        className
      )}
    >
      {/* Media Container */}
      <div className="relative aspect-square w-full bg-[#FAF7F2] dark:bg-[#181818] overflow-hidden flex items-center justify-center">
        <img
          src={isHovered && secondaryImage ? secondaryImage : image}
          alt={name}
          className="w-full h-full object-cover transition-transform duration-700 ease-out group-hover:scale-105"
          loading="lazy"
        />

        {/* Top Badges */}
        <div className="absolute top-3 left-3 flex flex-col gap-1.5 z-10">
          {purity && <LuxuryBadge variant="karat">{purity}</LuxuryBadge>}
          {isNew && <LuxuryBadge variant="gold">Maison New</LuxuryBadge>}
          {!inStock && <LuxuryBadge variant="outOfStock">Vault Sold Out</LuxuryBadge>}
        </div>

        {/* Wishlist Button */}
        <button
          type="button"
          onClick={handleWishlistClick}
          className={cn(
            "absolute top-3 right-3 p-2 rounded-full backdrop-blur-md transition-all duration-300 z-10",
            wishlistActive
              ? "bg-red-50 text-red-500 shadow-sm"
              : "bg-white/80 dark:bg-black/60 text-muted-foreground hover:text-red-500 hover:bg-white"
          )}
          title={wishlistActive ? "Remove from Wishlist" : "Save to Wishlist"}
        >
          <Heart size={15} className={wishlistActive ? "fill-red-500" : ""} />
        </button>

        {/* Quick View Hover Action */}
        <div
          className={cn(
            "absolute inset-x-3 bottom-3 flex items-center justify-center gap-2 transition-all duration-300 z-10",
            isHovered
              ? "opacity-100 translate-y-0"
              : "opacity-0 translate-y-2 pointer-events-none"
          )}
        >
          {onQuickView && (
            <button
              type="button"
              onClick={handleQuickViewClick}
              className="flex-1 py-2 px-3 rounded-lg bg-white/95 dark:bg-black/90 text-foreground text-xs font-semibold shadow-md hover:bg-[#C5A880] hover:text-white transition flex items-center justify-center gap-1.5 backdrop-blur-sm"
            >
              <Eye size={13} />
              <span>Quick View</span>
            </button>
          )}

          {onAddToCart && inStock && (
            <button
              type="button"
              onClick={handleAddToCartClick}
              className="p-2 rounded-lg bg-[#C5A880] text-white shadow-md hover:bg-[#B39366] transition flex items-center justify-center"
              title="Add to Vault Cart"
            >
              <ShoppingBag size={14} />
            </button>
          )}
        </div>
      </div>

      {/* Details Container */}
      <div className="p-4 sm:p-5 flex-1 flex flex-col justify-between space-y-3">
        <div>
          {category && (
            <span className="text-[10px] uppercase tracking-[0.18em] text-[#C5A880] font-bold block mb-1">
              {category}
            </span>
          )}

          <h3 className="font-display font-medium text-sm sm:text-base text-foreground line-clamp-1 group-hover:text-[#997D4D] transition-colors">
            {name}
          </h3>

          {material && (
            <p className="text-[11px] text-muted-foreground font-light mt-0.5">
              {material}
            </p>
          )}
        </div>

        <div className="pt-2 border-t border-border/50 flex items-end justify-between gap-2">
          <PriceDisplay amount={price} originalPrice={originalPrice} size="md" />

          {rating !== undefined && (
            <LuxuryRating value={rating} reviewsCount={reviewsCount} size="sm" />
          )}
        </div>
      </div>
    </div>
  );
};

export default LuxuryProductCard;
