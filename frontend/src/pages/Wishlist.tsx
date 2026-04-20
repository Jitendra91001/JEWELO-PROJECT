import { Link } from "react-router-dom";
import { Heart, ShoppingBag, ArrowRight, Trash2, Loader2 } from "lucide-react";
import { useAppSelector, useAppDispatch } from "@/store/hooks";
import { clearError } from "@/store/wishlistSlice";
import { addToCart } from "@/store/cartThunk";
import { removeFromWishlist, getWishlist } from "@/store/wishlistThunk";
import SEOHead from "@/components/common/SEOHead";
import { CURRENCY } from "@/utils/constants";
import { toast } from "sonner";
import { useEffect } from "react";

const Wishlist = () => {
  const { items, loading, error } = useAppSelector((s) => s.wishlist);
  const dispatch = useAppDispatch();

  useEffect(() => {
    dispatch(getWishlist());
  }, [dispatch]);

  useEffect(() => {
    if (error) {
      toast.error(error);
      dispatch(clearError());
    }
  }, [error, dispatch]);

  const handleMoveToCart = (item: typeof items[0]) => {
    dispatch(addToCart({
      productId: item.id,
      quantity: 1,
    }));
    dispatch(removeFromWishlist(item.id));
    toast.success("Moved to cart!");
  };

  const handleRemoveFromWishlist = (itemId: string) => {
    dispatch(removeFromWishlist(itemId));
    toast.info("Removed from wishlist");
  };

  if (items.length === 0) {
    return (
      <>
        <SEOHead title="Wishlist" description="Your wishlist is empty" />
        <div className="min-h-[60vh] flex flex-col items-center justify-center px-4 py-12">
          <Heart size={48} className="text-muted-foreground mb-4" />
          <h1 className="font-display text-2xl font-bold text-foreground mb-2">Your Wishlist is Empty</h1>
          <p className="text-muted-foreground font-body text-sm mb-6">Save your favourite pieces for later</p>
          <Link to="/products" className="gold-gradient text-primary-foreground px-8 py-3 rounded-sm font-body text-sm font-semibold tracking-wide uppercase inline-flex items-center gap-2 shimmer">
            Browse Collection <ArrowRight size={16} />
          </Link>
        </div>
      </>
    );
  }

  return (
    <>
      <SEOHead title="Wishlist" description="Your saved jewellery pieces" />
      <div className="container mx-auto px-4 py-6 lg:py-10">
        <h1 className="font-display text-2xl lg:text-3xl font-bold text-foreground mb-8">My Wishlist ({items.length} items)</h1>

        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 lg:gap-6">
          {items.map((item) => (
            <div key={item.id} className="group bg-card border border-border rounded-sm overflow-hidden">
              <Link to={`/product/${item.id}`} className="block relative aspect-square overflow-hidden bg-secondary">
                <img src={item.image} alt={item.name} className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110" loading="lazy" />
              </Link>
              <div className="p-3">
                {item.material && <p className="text-[11px] font-body uppercase tracking-wider text-muted-foreground">{item.material}</p>}
                <Link to={`/product/${item.id}`}>
                  <h3 className="font-body text-sm font-medium text-foreground group-hover:text-primary transition-colors line-clamp-1 mt-1">{item.name}</h3>
                </Link>
                <div className="flex items-center gap-2 mt-1">
                  <span className="font-body font-semibold text-foreground">{CURRENCY}{item.price.toLocaleString()}</span>
                  {item.originalPrice && <span className="text-xs text-muted-foreground line-through">{CURRENCY}{item.originalPrice.toLocaleString()}</span>}
                </div>
                <div className="flex gap-2 mt-3">
                  <button
                    onClick={() => handleMoveToCart(item)}
                    disabled={loading}
                    className="flex-1 gold-gradient text-primary-foreground py-2 rounded-sm font-body text-xs font-semibold uppercase inline-flex items-center justify-center gap-1 hover:opacity-90 transition-opacity disabled:opacity-50"
                  >
                    {loading ? <Loader2 size={12} className="animate-spin" /> : <ShoppingBag size={12} />} Add to Cart
                  </button>
                  <button
                    onClick={() => handleRemoveFromWishlist(item.id)}
                    disabled={loading}
                    className="p-2 border border-border rounded-sm text-muted-foreground hover:text-destructive hover:border-destructive/30 transition-colors disabled:opacity-50"
                  >
                    {loading ? <Loader2 size={14} className="animate-spin" /> : <Trash2 size={14} />}
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </>
  );
};

export default Wishlist;
