import { Link } from "react-router-dom";
import { Heart, ShoppingBag, Star, Loader2 } from "lucide-react";
import { motion } from "framer-motion";
import { CURRENCY } from "@/utils/constants";
import { useAppDispatch, useAppSelector } from "@/store/hooks";
import { addToCart } from "@/store/cartThunk";
import { addToWishlist, removeFromWishlist } from "@/store/wishlistThunk";
import { toast } from "sonner";
const baseUrl = import.meta.env.VITE_APP_BASE_URL;

interface ProductCardProps {
  id: string;
  name: string;
  price: number;
  originalPrice?: number;
  image: string;
  rating?: number;
  material?: string;
  isNew?: boolean;
}

const ProductCard = ({ id, name, price, originalPrice, image, rating, material, isNew }: ProductCardProps) => {
  const dispatch = useAppDispatch();
  const wishlistItems = useAppSelector((s) => s.wishlist.items);
  const { loading: cartLoading } = useAppSelector((s) => s.cart);
  const { loading: wishlistLoading } = useAppSelector((s) => s.wishlist);
  const isWishlisted = wishlistItems.some((w) => w.id === id);
  const discount = originalPrice ? Math.round(((originalPrice - price) / originalPrice) * 100) : 0;


  const handleToggleWishlist = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (isWishlisted) {
      dispatch(removeFromWishlist(id));
      toast.info("Removed from wishlist");
    } else {
      dispatch(addToWishlist({ productId: id }));
      toast.success("Added to wishlist!");
    }
  };

  const handleAddToCart = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    dispatch(addToCart({
      productId: id,
      quantity: 1,
    }));
    toast.success("Added to cart!");
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.5 }}
    >
      <Link to={`/product/${id}`} className="group block">
        <div className="relative aspect-square overflow-hidden rounded-sm bg-secondary mb-3">
          <img
            src={baseUrl + image}
            alt={name}
            className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
            loading="lazy"
          />
          {/* Overlay actions */}
          <div className="absolute inset-0 bg-foreground/0 group-hover:bg-foreground/10 transition-colors duration-300" />
          
          <div className="absolute top-3 right-3 flex flex-col gap-2 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
            <button
              className={`p-2 bg-background/90 rounded-full transition-colors shadow-sm ${isWishlisted ? "text-destructive" : "text-foreground hover:text-primary"} disabled:opacity-50`}
              aria-label="Add to wishlist"
              onClick={handleToggleWishlist}
              disabled={wishlistLoading}
            >
              {wishlistLoading ? <Loader2 size={16} className="animate-spin" /> : <Heart size={16} className={isWishlisted ? "fill-current" : ""} />}
            </button>
            <button
              className="p-2 bg-background/90 rounded-full text-foreground hover:text-primary transition-colors shadow-sm disabled:opacity-50"
              aria-label="Add to cart"
              onClick={handleAddToCart}
              disabled={cartLoading}
            >
              {cartLoading ? <Loader2 size={16} className="animate-spin" /> : <ShoppingBag size={16} />}
            </button>
          </div>

          {/* Badges */}
          <div className="absolute top-3 left-3 flex flex-col gap-1.5">
            {isNew && (
              <span className="px-2.5 py-1 bg-primary text-primary-foreground text-[10px] font-bold uppercase tracking-wider rounded-sm">
                New
              </span>
            )}
            {discount > 0 && (
              <span className="px-2.5 py-1 bg-destructive text-destructive-foreground text-[10px] font-bold uppercase tracking-wider rounded-sm">
                -{discount}%
              </span>
            )}
          </div>
        </div>

        <div className="space-y-1">
          {material && (
            <p className="text-[11px] font-body uppercase tracking-wider text-muted-foreground">{material}</p>
          )}
          <h3 className="font-body text-sm font-medium text-foreground group-hover:text-primary transition-colors line-clamp-1">
            {name}
          </h3>
          <div className="flex items-center gap-2">
            <span className="font-body font-semibold text-foreground">
              {CURRENCY}{price.toLocaleString()}
            </span>
            {originalPrice && originalPrice > price && (
              <span className="text-xs text-muted-foreground line-through">
                {CURRENCY}{originalPrice.toLocaleString()}
              </span>
            )}
          </div>
          {rating > 0 && (
            <div className="flex items-center gap-1">
              <Star size={12} className="fill-primary text-primary" />
              <span className="text-xs text-muted-foreground font-body">{rating}</span>
            </div>
          )}
        </div>
      </Link>
    </motion.div>
  );
};

export default ProductCard;
