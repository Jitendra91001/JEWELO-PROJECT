import React, { useState } from "react";
import { Link } from "react-router-dom";
import { Heart, ShoppingBag, Star, Eye, Sparkles } from "lucide-react";
import { motion } from "framer-motion";
import { Product } from "@/types/product.types";
import { useAppDispatch, useAppSelector } from "@/store/hooks";
import { addToCart } from "@/store/cartThunk";
import { addToWishlist, removeFromWishlist } from "@/store/wishlistThunk";
import { toast } from "sonner";
import QuickViewModal from "./QuickViewModal";

interface ProductCardProps {
  product: Product;
}

export const ProductCard: React.FC<ProductCardProps> = ({ product }) => {
  const dispatch = useAppDispatch();
  const wishlistItems = useAppSelector((s) => s.wishlist.items);
  const [quickViewOpen, setQuickViewOpen] = useState(false);
  const [isHovered, setIsHovered] = useState(false);

  const isWishlisted = wishlistItems.some((w) => w.productId === product.id);
  const discount = product.discountPercentage || 
    (product.comparePrice ? Math.round(((product.comparePrice - product.price) / product.comparePrice) * 100) : 0);

  const primaryImage = product.images[0] || "https://images.unsplash.com/photo-1605100804763-247f67b3557e?auto=format&fit=crop&w=600&q=80";
  const hoverImage = product.images[1] || primaryImage;

  const handleToggleWishlist = async (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();

    try {
      if (isWishlisted) {
        await dispatch(removeFromWishlist(product.id)).unwrap();
        toast.success("Removed from wishlist");
      } else {
        await dispatch(addToWishlist(product.id)).unwrap();
        toast.success("Added to wishlist!");
      }
    } catch {
      toast.error("Wishlist action failed");
    }
  };

  const handleAddToCart = async (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();

    try {
      await dispatch(
        addToCart({
          productId: product.id,
          quantity: 1,
        })
      ).unwrap();
      toast.success(`${product.name} added to shopping bag!`);
    } catch {
      toast.error("Failed to add to bag");
    }
  };

  const handleOpenQuickView = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setQuickViewOpen(true);
  };

  const isLowStock = product.stock > 0 && product.stock <= (product.lowStockThreshold || 3);

  return (
    <>
      <motion.div
        initial={{ opacity: 0, y: 15 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.4 }}
        className="group relative flex flex-col h-full bg-card border border-border/80 hover:border-[#C5A880]/60 rounded-xl overflow-hidden shadow-sm hover:shadow-xl transition-all duration-300"
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
      >
        {/* Product Image Area */}
        <Link to={`/product/${product.id}`} className="relative aspect-square w-full overflow-hidden bg-secondary/30 block">
          {/* Dual image hover transition */}
          <img
            src={primaryImage}
            alt={product.name}
            className={`w-full h-full object-cover transition-opacity duration-500 absolute inset-0 ${
              isHovered && product.images.length > 1 ? "opacity-0" : "opacity-100 group-hover:scale-105"
            }`}
            loading="lazy"
          />
          {product.images.length > 1 && (
            <img
              src={hoverImage}
              alt={`${product.name} alternate view`}
              className={`w-full h-full object-cover transition-all duration-500 absolute inset-0 ${
                isHovered ? "opacity-100 scale-105" : "opacity-0"
              }`}
              loading="lazy"
            />
          )}

          {/* Badges Top Left */}
          <div className="absolute top-2.5 left-2.5 flex flex-col gap-1.5 z-10">
            {discount > 0 && (
              <span className="px-2 py-0.5 bg-destructive text-white text-[10px] font-bold uppercase tracking-wider rounded shadow-sm">
                -{discount}%
              </span>
            )}
            {product.isNewArrival && (
              <span className="px-2 py-0.5 bg-[#C5A880] text-white text-[10px] font-bold uppercase tracking-wider rounded shadow-sm">
                New In
              </span>
            )}
            {product.purity && (
              <span className="px-2 py-0.5 bg-background/90 text-foreground text-[10px] font-semibold tracking-wider rounded backdrop-blur-sm border border-border">
                {product.purity}
              </span>
            )}
          </div>

          {/* Stock Tag Top Right */}
          <div className="absolute top-2.5 right-2.5 z-10">
            {product.stock === 0 ? (
              <span className="px-2 py-0.5 bg-muted text-muted-foreground text-[10px] font-bold uppercase tracking-wider rounded border border-border">
                Sold Out
              </span>
            ) : isLowStock ? (
              <span className="px-2 py-0.5 bg-amber-500/90 text-white text-[10px] font-bold uppercase tracking-wider rounded shadow-sm animate-pulse">
                Only {product.stock} Left
              </span>
            ) : null}
          </div>

          {/* Floating Hover Action Buttons */}
          <div className="absolute bottom-3 inset-x-3 flex items-center justify-center gap-2 opacity-0 group-hover:opacity-100 group-hover:translate-y-0 translate-y-3 transition-all duration-300 z-10">
            <button
              onClick={handleToggleWishlist}
              className={`p-2.5 rounded-full backdrop-blur-md shadow-lg transition-all ${
                isWishlisted
                  ? "bg-destructive text-white"
                  : "bg-background/90 text-foreground hover:bg-[#C5A880] hover:text-white"
              }`}
              title={isWishlisted ? "Remove from wishlist" : "Add to wishlist"}
            >
              <Heart size={16} className={isWishlisted ? "fill-current" : ""} />
            </button>

            <button
              onClick={handleOpenQuickView}
              className="p-2.5 rounded-full bg-background/90 text-foreground hover:bg-[#C5A880] hover:text-white backdrop-blur-md shadow-lg transition-all"
              title="Quick View"
            >
              <Eye size={16} />
            </button>

            <button
              onClick={handleAddToCart}
              disabled={product.stock === 0}
              className="flex-1 max-w-[130px] py-2 px-3 bg-[#C5A880] hover:bg-[#B39366] disabled:opacity-50 text-white text-[11px] font-bold uppercase tracking-wider rounded-full shadow-lg flex items-center justify-center gap-1.5 transition-all"
            >
              <ShoppingBag size={14} />
              <span>Add to Bag</span>
            </button>
          </div>
        </Link>

        {/* Product Information Details */}
        <div className="p-4 flex-1 flex flex-col justify-between">
          <div className="space-y-1">
            <div className="flex items-center justify-between text-[11px] text-muted-foreground">
              <span>{product.category}</span>
              <span className="font-mono text-[10px]">{product.sku}</span>
            </div>

            <Link to={`/product/${product.id}`} className="block">
              <h4 className="font-display text-sm font-semibold text-foreground group-hover:text-[#997D4D] transition-colors line-clamp-1">
                {product.name}
              </h4>
            </Link>

            {/* Rating Stars */}
            <div className="flex items-center gap-1.5 pt-0.5">
              <div className="flex items-center text-amber-500">
                <Star size={11} className="fill-current" />
              </div>
              <span className="text-xs font-semibold text-foreground">{product.rating}</span>
              <span className="text-[11px] text-muted-foreground">({product.reviewsCount})</span>
            </div>
          </div>

          {/* Pricing */}
          <div className="pt-3 border-t border-border/60 mt-3 flex items-baseline justify-between">
            <div className="flex items-baseline gap-2">
              <span className="font-display font-bold text-base text-[#997D4D]">
                ₹{product.price.toLocaleString("en-IN")}
              </span>
              {product.comparePrice && product.comparePrice > product.price && (
                <span className="text-xs text-muted-foreground line-through">
                  ₹{product.comparePrice.toLocaleString("en-IN")}
                </span>
              )}
            </div>

            <span className="text-[10px] text-muted-foreground font-semibold">
              {product.weight}g • {product.gemstone}
            </span>
          </div>
        </div>
      </motion.div>

      {/* Quick View Modal */}
      <QuickViewModal
        product={product}
        isOpen={quickViewOpen}
        onClose={() => setQuickViewOpen(false)}
      />
    </>
  );
};

export default ProductCard;
