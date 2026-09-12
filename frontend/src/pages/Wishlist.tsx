import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { Heart, ShoppingBag, Trash2, ArrowRight, Sparkles, Star } from "lucide-react";
import SEOHead from "@/components/common/SEOHead";
import { useAppDispatch, useAppSelector } from "@/store/hooks";
import { removeFromWishlist } from "@/store/wishlistThunk";
import { addToCart } from "@/store/cartThunk";
import { productService } from "@/services/product.service";
import { Product } from "@/types/product.types";
import { toast } from "sonner";

export const Wishlist: React.FC = () => {
  const dispatch = useAppDispatch();
  const wishlistItems = useAppSelector((state) => state.wishlist.items);
  const [wishlistProducts, setWishlistProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchWishlistProducts = async () => {
      setLoading(true);
      const res = await productService.getProducts();
      // Match wishlist IDs with mock catalogue
      const matched = res.products.filter((p) =>
        wishlistItems.some((w) => w.productId === p.id || w.id === p.id)
      );
      setWishlistProducts(matched);
      setLoading(false);
    };

    fetchWishlistProducts();
  }, [wishlistItems]);

  const handleRemove = async (productId: string) => {
    await dispatch(removeFromWishlist(productId));
    toast.success("Item removed from your wishlist");
  };

  const handleMoveToCart = async (product: Product) => {
    try {
      await dispatch(addToCart({ productId: product.id, quantity: 1 })).unwrap();
      await dispatch(removeFromWishlist(product.id));
      toast.success(`${product.name} moved to your shopping bag!`);
    } catch {
      toast.error("Failed to add to bag");
    }
  };

  return (
    <div className="w-full bg-background min-h-screen py-8 lg:py-12 font-body text-foreground">
      <SEOHead title="My Wishlist | JEWELO" description="Your curated selection of fine jewellery pieces." />

      <div className="container mx-auto px-4">
        {/* Header */}
        <div className="pb-6 border-b border-border mb-8 flex items-center justify-between">
          <div>
            <h1 className="font-display text-2xl sm:text-4xl font-bold tracking-tight">
              My Saved Wishlist
            </h1>
            <p className="text-xs sm:text-sm text-muted-foreground mt-1">
              {wishlistProducts.length} {wishlistProducts.length === 1 ? "creation" : "creations"} curated by you
            </p>
          </div>

          <Link
            to="/products"
            className="text-xs font-semibold text-[#997D4D] hover:underline flex items-center gap-1"
          >
            <span>Explore More Pieces</span>
            <ArrowRight size={13} />
          </Link>
        </div>

        {loading ? (
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-6">
            {[...Array(4)].map((_, i) => (
              <div key={i} className="aspect-square bg-muted rounded-xl animate-pulse" />
            ))}
          </div>
        ) : wishlistProducts.length === 0 ? (
          // Empty State
          <div className="py-24 text-center rounded-2xl border border-dashed border-border bg-card/40 p-8 max-w-md mx-auto space-y-4">
            <div className="w-20 h-20 mx-auto rounded-full bg-secondary flex items-center justify-center text-[#C5A880]">
              <Heart size={36} />
            </div>
            <h2 className="font-display text-2xl font-bold">Your wishlist is empty</h2>
            <p className="text-xs text-muted-foreground leading-relaxed">
              Bookmark your favorite solitaire rings, royal chokers, and diamond pieces to revisit them anytime.
            </p>
            <div className="pt-2">
              <Link
                to="/products"
                className="px-8 py-3.5 bg-[#C5A880] hover:bg-[#B39366] text-white text-xs font-bold uppercase tracking-widest rounded-lg shadow inline-block"
              >
                Browse Collections
              </Link>
            </div>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {wishlistProducts.map((prod) => (
              <div
                key={prod.id}
                className="rounded-2xl bg-card border border-border overflow-hidden shadow-sm hover:shadow-xl transition-all duration-300 flex flex-col justify-between group"
              >
                {/* Image */}
                <div className="relative aspect-square overflow-hidden bg-secondary/30">
                  <Link to={`/product/${prod.id}`}>
                    <img
                      src={prod.images[0]}
                      alt={prod.name}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    />
                  </Link>

                  <button
                    onClick={() => handleRemove(prod.id)}
                    className="absolute top-3 right-3 p-2 rounded-full bg-background/90 text-muted-foreground hover:text-destructive shadow transition-colors"
                    title="Remove from wishlist"
                  >
                    <Trash2 size={16} />
                  </button>

                  <div className="absolute top-3 left-3 flex flex-col gap-1">
                    {prod.discountPercentage && (
                      <span className="px-2 py-0.5 rounded bg-destructive text-white text-[10px] font-bold uppercase">
                        -{prod.discountPercentage}%
                      </span>
                    )}
                    <span className="px-2 py-0.5 rounded bg-background/90 text-[10px] font-semibold">
                      {prod.purity}
                    </span>
                  </div>
                </div>

                {/* Content */}
                <div className="p-4 space-y-3 flex-1 flex flex-col justify-between">
                  <div className="space-y-1">
                    <span className="text-[10px] text-muted-foreground font-mono uppercase">
                      {prod.sku}
                    </span>
                    <Link to={`/product/${prod.id}`}>
                      <h4 className="font-display font-semibold text-sm text-foreground line-clamp-1 hover:text-[#997D4D]">
                        {prod.name}
                      </h4>
                    </Link>

                    <div className="flex items-center gap-1 text-xs pt-0.5">
                      <Star size={12} className="fill-amber-500 text-amber-500" />
                      <span className="font-semibold">{prod.rating}</span>
                      <span className="text-muted-foreground">({prod.reviewsCount})</span>
                    </div>

                    <div className="flex items-baseline gap-2 pt-1">
                      <span className="font-display font-bold text-base text-[#997D4D]">
                        ₹{prod.price.toLocaleString("en-IN")}
                      </span>
                      {prod.comparePrice && (
                        <span className="text-xs text-muted-foreground line-through">
                          ₹{prod.comparePrice.toLocaleString("en-IN")}
                        </span>
                      )}
                    </div>
                  </div>

                  {/* Actions */}
                  <button
                    onClick={() => handleMoveToCart(prod)}
                    className="w-full py-2.5 bg-[#C5A880] hover:bg-[#B39366] text-white text-xs font-bold uppercase tracking-wider rounded-lg flex items-center justify-center gap-2 shadow transition-all"
                  >
                    <ShoppingBag size={14} />
                    <span>Move to Bag</span>
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default Wishlist;
