import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import {
  ShoppingBag,
  Trash2,
  Heart,
  Plus,
  Minus,
  ArrowRight,
  ShieldCheck,
  Tag,
  ArrowLeft,
  Sparkles,
} from "lucide-react";
import SEOHead from "@/components/common/SEOHead";
import { useAppDispatch, useAppSelector } from "@/store/hooks";
import { getCart, updateCartQuantity, removeFromCart, clearCart, applyCartCoupon, removeCartCoupon } from "@/store/cartThunk";
import { addToWishlist } from "@/store/wishlistThunk";
import { toast } from "sonner";

export const Cart: React.FC = () => {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const cart = useAppSelector((state) => state.cart);
  const items = cart?.items || [];

  React.useEffect(() => {
    dispatch(getCart());
  }, [dispatch]);

  const [couponCode, setCouponCode] = useState("");
  const [appliedCoupon, setAppliedCoupon] = useState<{ code: string; discount: number } | null>(null);
  const [applyingCoupon, setApplyingCoupon] = useState(false);

  // Subtotal & Grand Total calculation
  const computedSubtotal = items.reduce((sum, item) => {
    const price = item.discountPrice || item.price || item.product?.price || 0;
    return sum + price * (item.quantity || 1);
  }, 0);

  const subtotal = cart.subtotal || computedSubtotal;
  const discountAmount = cart.discountAmount || (appliedCoupon ? appliedCoupon.discount : 0);
  const tax = cart.taxAmount || Math.round((subtotal - discountAmount) * 0.03); // 3% GST on jewellery
  const shipping = subtotal >= 25000 || subtotal === 0 ? 0 : 499;
  const grandTotal = cart.totalAmount || Math.max(0, subtotal - discountAmount + tax + shipping);

  const handleUpdateQty = (item: any, delta: number) => {
    const currentQty = item.quantity || 1;
    const newQty = currentQty + delta;
    if (newQty <= 0) {
      dispatch(removeFromCart(item.productId || item.id));
      toast.success("Item removed from bag");
    } else {
      dispatch(updateCartQuantity({ productId: item.productId || item.id, quantity: newQty }));
    }
  };

  const handleRemove = (item: any) => {
    dispatch(removeFromCart(item.productId || item.id));
    toast.success("Item removed from shopping bag");
  };

  const handleMoveToWishlist = (item: any) => {
    const pId = item.productId || item.id;
    dispatch(addToWishlist(pId));
    dispatch(removeFromCart(pId));
    toast.success("Moved to your wishlist!");
  };

  const handleApplyCoupon = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!couponCode.trim()) return;

    setApplyingCoupon(true);
    const code = couponCode.trim().toUpperCase();
    try {
      const resultAction = await dispatch(applyCartCoupon(code));
      if (applyCartCoupon.fulfilled.match(resultAction)) {
        toast.success(`Coupon ${code} applied successfully!`);
      } else {
        // Local preview fallback if API has no active coupon seeded yet
        if (code === "ROYALTY10" || code === "JEWELO25") {
          const disc = Math.round(subtotal * 0.1);
          setAppliedCoupon({ code, discount: disc });
          toast.success("Privé VIP Coupon Applied: 10% Off!");
        } else {
          toast.error(resultAction.payload as string || "Invalid or expired promotional code.");
        }
      }
    } finally {
      setApplyingCoupon(false);
    }
  };

  return (
    <div className="w-full bg-background min-h-screen py-8 lg:py-12 font-body text-foreground">
      <SEOHead title="Your Shopping Bag | JEWELO" description="Review your selected fine jewellery pieces." />

      <div className="container mx-auto px-4">
        {/* Header */}
        <div className="flex items-center justify-between pb-6 border-b border-border mb-8">
          <div>
            <h1 className="font-display text-2xl sm:text-4xl font-bold tracking-tight">
              Your Shopping Bag
            </h1>
            <p className="text-xs sm:text-sm text-muted-foreground mt-1">
              {items.length} {items.length === 1 ? "creation" : "creations"} in your bag
            </p>
          </div>

          <Link
            to="/products"
            className="text-xs font-semibold text-[#997D4D] hover:underline flex items-center gap-1.5"
          >
            <ArrowLeft size={14} />
            <span>Continue Shopping</span>
          </Link>
        </div>

        {items.length === 0 ? (
          // Empty Cart State
          <div className="py-24 text-center rounded-2xl border border-dashed border-border bg-card/40 p-8 max-w-lg mx-auto space-y-4">
            <div className="w-20 h-20 mx-auto rounded-full bg-secondary flex items-center justify-center text-[#C5A880]">
              <ShoppingBag size={36} />
            </div>
            <h2 className="font-display text-2xl font-bold">Your shopping bag is empty</h2>
            <p className="text-xs text-muted-foreground font-body leading-relaxed">
              Discover our master-crafted 22K hallmarked gold and certified solitaire diamonds to add timeless brilliance to your collection.
            </p>
            <div className="pt-3">
              <Link
                to="/products"
                className="px-8 py-3.5 bg-[#C5A880] hover:bg-[#B39366] text-white text-xs font-bold uppercase tracking-widest rounded-lg shadow transition-all inline-block"
              >
                Discover Collections
              </Link>
            </div>
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-start">
            {/* Cart Items Table Left */}
            <div className="lg:col-span-8 space-y-4">
              <div className="divide-y divide-border rounded-2xl bg-card border border-border p-4 sm:p-6 shadow-sm">
                {items.map((item, idx) => {
                  const price = item.discountPrice || item.price || item.product?.price || 0;
                  const image =
                    item.image ||
                    item.product?.thumbnail ||
                    "https://images.unsplash.com/photo-1605100804763-247f67b3557e?auto=format&fit=crop&w=300&q=80";
                  const name = item.name || item.product?.name || "Fine Jewellery Item";
                  const sku = item.productId || `JWL-ITM-${idx + 1}`;

                  return (
                    <div
                      key={item.id || item.productId || idx}
                      className="py-5 first:pt-0 last:pb-0 flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between"
                    >
                      {/* Product Thumbnail & Details */}
                      <div className="flex gap-4 items-start flex-1 min-w-0">
                        <img
                          src={image}
                          alt={name}
                          className="w-20 h-20 sm:w-24 sm:h-24 rounded-xl object-cover border border-border flex-shrink-0"
                        />
                        <div className="space-y-1 min-w-0 flex-1">
                          <span className="font-mono text-[10px] text-muted-foreground uppercase">
                            SKU: {sku}
                          </span>
                          <h4 className="font-display font-semibold text-sm sm:text-base text-foreground truncate">
                            {name}
                          </h4>
                          <p className="text-xs text-muted-foreground">
                            {item.purity || "22K"} • {item.weight || "Pure Gold"}
                            {item.size && <span> • Size: {item.size}</span>}
                          </p>

                          <div className="flex items-center gap-4 pt-2">
                            <button
                              onClick={() => handleMoveToWishlist(item)}
                              className="text-[11px] font-semibold text-[#997D4D] hover:underline flex items-center gap-1"
                            >
                              <Heart size={12} />
                              <span>Move to Wishlist</span>
                            </button>
                            <button
                              onClick={() => handleRemove(item)}
                              className="text-[11px] font-semibold text-destructive hover:underline flex items-center gap-1"
                            >
                              <Trash2 size={12} />
                              <span>Remove</span>
                            </button>
                          </div>
                        </div>
                      </div>

                      {/* Quantity & Pricing */}
                      <div className="flex sm:flex-col items-center sm:items-end justify-between w-full sm:w-auto gap-3 pt-2 sm:pt-0">
                        {/* Quantity Buttons */}
                        <div className="flex items-center border border-border rounded-lg bg-background">
                          <button
                            onClick={() => handleUpdateQty(item, -1)}
                            className="px-2.5 py-1 text-muted-foreground hover:text-foreground font-bold"
                          >
                            <Minus size={13} />
                          </button>
                          <span className="px-3 py-1 font-bold text-xs">{item.quantity || 1}</span>
                          <button
                            onClick={() => handleUpdateQty(item, 1)}
                            className="px-2.5 py-1 text-muted-foreground hover:text-foreground font-bold"
                          >
                            <Plus size={13} />
                          </button>
                        </div>

                        {/* Price Breakdown */}
                        <div className="text-right">
                          <span className="font-display font-bold text-base sm:text-lg text-[#997D4D] block">
                            ₹{(price * (item.quantity || 1)).toLocaleString("en-IN")}
                          </span>
                          {(item.quantity || 1) > 1 && (
                            <span className="text-[10px] text-muted-foreground">
                              ₹{price.toLocaleString("en-IN")} each
                            </span>
                          )}
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>

              {/* Security & Transit Guarantees */}
              <div className="p-4 rounded-xl bg-secondary/30 border border-border flex flex-wrap items-center justify-around gap-3 text-xs text-muted-foreground text-center">
                <div className="flex items-center gap-1.5">
                  <ShieldCheck size={16} className="text-[#C5A880]" />
                  <span>100% Certified Hallmarked Purity</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <Sparkles size={16} className="text-[#C5A880]" />
                  <span>Free Armored Pan-India Transit</span>
                </div>
              </div>
            </div>

            {/* Order Summary & Coupon Card Right */}
            <div className="lg:col-span-4 space-y-6">
              {/* Coupon Code Box */}
              <div className="p-5 rounded-2xl bg-card border border-border shadow-sm space-y-3">
                <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-[#997D4D]">
                  <Tag size={14} />
                  <span>Apply Promotional Privilege</span>
                </div>

                <form onSubmit={handleApplyCoupon} className="flex gap-2">
                  <input
                    type="text"
                    value={couponCode}
                    onChange={(e) => setCouponCode(e.target.value)}
                    placeholder="e.g. JEWELO25"
                    className="flex-1 py-2 px-3 rounded-lg border border-border bg-background text-xs uppercase font-mono outline-none focus:border-[#C5A880]"
                  />
                  <button
                    type="submit"
                    disabled={applyingCoupon || !couponCode.trim()}
                    className="px-4 py-2 bg-[#C5A880] hover:bg-[#B39366] disabled:opacity-50 text-white text-xs font-bold uppercase tracking-wider rounded-lg shadow"
                  >
                    {applyingCoupon ? "..." : "Apply"}
                  </button>
                </form>

                {appliedCoupon && (
                  <div className="flex items-center justify-between p-2 rounded bg-emerald-50 dark:bg-emerald-950/30 border border-emerald-500/30 text-emerald-600 text-xs">
                    <span>Coupon <strong>{appliedCoupon.code}</strong> active</span>
                    <span>-₹{appliedCoupon.discount.toLocaleString("en-IN")}</span>
                  </div>
                )}
              </div>

              {/* Order Summary Breakdown */}
              <div className="p-6 rounded-2xl bg-card border border-border shadow-sm space-y-4 text-xs font-body">
                <h3 className="font-display text-lg font-bold pb-2 border-b border-border">
                  Order Summary
                </h3>

                <div className="space-y-2.5">
                  <div className="flex justify-between text-muted-foreground">
                    <span>Bag Subtotal</span>
                    <span className="font-semibold text-foreground">
                      ₹{subtotal.toLocaleString("en-IN")}
                    </span>
                  </div>

                  {discountAmount > 0 && (
                    <div className="flex justify-between text-emerald-600 font-semibold">
                      <span>Privé Savings</span>
                      <span>-₹{discountAmount.toLocaleString("en-IN")}</span>
                    </div>
                  )}

                  <div className="flex justify-between text-muted-foreground">
                    <span>Estimated GST (3%)</span>
                    <span className="font-semibold text-foreground">
                      ₹{tax.toLocaleString("en-IN")}
                    </span>
                  </div>

                  <div className="flex justify-between text-muted-foreground">
                    <span>Armored Express Shipping</span>
                    <span className="font-semibold text-emerald-600">
                      {shipping === 0 ? "Complimentary" : `₹${shipping}`}
                    </span>
                  </div>

                  <div className="pt-3 border-t border-border flex justify-between items-baseline">
                    <span className="text-sm font-bold text-foreground">Estimated Grand Total</span>
                    <span className="font-display text-2xl font-bold text-[#997D4D]">
                      ₹{grandTotal.toLocaleString("en-IN")}
                    </span>
                  </div>
                </div>

                <div className="pt-2">
                  <button
                    onClick={() => navigate("/checkout")}
                    className="w-full py-4 bg-[#C5A880] hover:bg-[#B39366] text-white text-xs font-bold uppercase tracking-[0.2em] rounded-xl flex items-center justify-center gap-2 shadow-xl transition-all"
                  >
                    <span>Proceed to Secure Checkout</span>
                    <ArrowRight size={15} />
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Cart;
