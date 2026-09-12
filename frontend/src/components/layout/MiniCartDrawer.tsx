import React from "react";
import { Link, useNavigate } from "react-router-dom";
import { X, ShoppingBag, Trash2, Plus, Minus, ArrowRight, ShieldCheck } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { useAppDispatch, useAppSelector } from "@/store/hooks";
import { updateCartQuantity, removeFromCart } from "@/store/cartThunk";

interface MiniCartDrawerProps {
  isOpen: boolean;
  onClose: () => void;
}

export const MiniCartDrawer: React.FC<MiniCartDrawerProps> = ({ isOpen, onClose }) => {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const cart = useAppSelector((state) => state.cart);
  const items = cart?.items || [];

  const subtotal = items.reduce((sum, item) => {
    const price = item.discountPrice || item.price || item.product?.price || 0;
    return sum + price * (item.quantity || 1);
  }, 0);

  const totalCount = items.reduce((sum, item) => sum + (item.quantity || 1), 0);
  const freeShippingThreshold = 25000;
  const progressToFreeShipping = Math.min(100, Math.round((subtotal / freeShippingThreshold) * 100));

  const handleUpdateQty = (item: any, delta: number) => {
    const newQty = (item.quantity || 1) + delta;
    if (newQty <= 0) {
      dispatch(removeFromCart(item.productId || item.id));
    } else {
      dispatch(updateCartQuantity({ productId: item.productId || item.id, quantity: newQty }));
    }
  };

  const handleRemove = (item: any) => {
    dispatch(removeFromCart(item.productId || item.id));
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-50 overflow-hidden">
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/60 backdrop-blur-sm transition-opacity"
            onClick={onClose}
          />

          {/* Drawer panel */}
          <div className="fixed inset-y-0 right-0 max-w-full flex pl-10 z-50">
            <motion.div
              initial={{ x: "100%" }}
              animate={{ x: 0 }}
              exit={{ x: "100%" }}
              transition={{ type: "spring", damping: 25, stiffness: 220 }}
              className="w-screen max-w-md bg-background border-l border-border flex flex-col shadow-2xl"
            >
              {/* Drawer Header */}
              <div className="px-5 py-4 border-b border-border flex items-center justify-between bg-card/40">
                <div className="flex items-center gap-2">
                  <ShoppingBag size={20} className="text-[#C5A880]" />
                  <h3 className="font-display text-lg font-bold tracking-wide text-foreground">
                    Your Shopping Bag
                  </h3>
                  <span className="text-xs font-semibold px-2 py-0.5 rounded-full bg-[#C5A880]/15 text-[#997D4D]">
                    {totalCount} {totalCount === 1 ? "item" : "items"}
                  </span>
                </div>
                <button
                  onClick={onClose}
                  className="p-1.5 rounded-md text-muted-foreground hover:text-foreground hover:bg-muted transition-colors"
                  aria-label="Close cart"
                >
                  <X size={20} />
                </button>
              </div>

              {/* Free Delivery Bar */}
              <div className="px-5 py-3 bg-[#FBF9F5] dark:bg-[#1A1816] border-b border-border/80">
                <div className="flex items-center justify-between text-xs font-medium text-foreground mb-1.5">
                  {subtotal >= freeShippingThreshold ? (
                    <span className="text-emerald-600 font-semibold flex items-center gap-1">
                      ✨ You have qualified for FREE Express Insured Shipping!
                    </span>
                  ) : (
                    <span>
                      Add{" "}
                      <strong className="text-[#997D4D]">
                        ₹{(freeShippingThreshold - subtotal).toLocaleString("en-IN")}
                      </strong>{" "}
                      more for FREE Express Delivery
                    </span>
                  )}
                  <span className="text-muted-foreground font-semibold">{progressToFreeShipping}%</span>
                </div>
                <div className="w-full bg-border rounded-full h-1.5 overflow-hidden">
                  <div
                    className="bg-[#C5A880] h-full rounded-full transition-all duration-500"
                    style={{ width: `${progressToFreeShipping}%` }}
                  />
                </div>
              </div>

              {/* Items List */}
              <div className="flex-1 overflow-y-auto p-5 space-y-4">
                {items.length === 0 ? (
                  <div className="h-full flex flex-col items-center justify-center text-center py-12">
                    <div className="w-20 h-20 rounded-full bg-secondary/80 flex items-center justify-center mb-4 border border-border">
                      <ShoppingBag size={32} className="text-[#C5A880]" />
                    </div>
                    <h4 className="font-display text-lg font-semibold text-foreground mb-1">
                      Your bag is empty
                    </h4>
                    <p className="text-xs text-muted-foreground max-w-xs mb-6 font-body">
                      Explore our handcrafted gold, solitaire diamonds, and heirloom collections to find your perfect piece.
                    </p>
                    <button
                      onClick={() => {
                        navigate("/products");
                        onClose();
                      }}
                      className="px-6 py-2.5 bg-[#C5A880] hover:bg-[#B39366] text-white text-xs font-semibold uppercase tracking-widest rounded transition-all shadow-md"
                    >
                      Discover Collections
                    </button>
                  </div>
                ) : (
                  items.map((item, index) => {
                    const price = item.discountPrice || item.price || item.product?.price || 0;
                    const image =
                      item.image ||
                      item.product?.thumbnail ||
                      "https://images.unsplash.com/photo-1605100804763-247f67b3557e?auto=format&fit=crop&w=200&q=80";
                    const name = item.name || item.product?.name || "Fine Jewellery Item";

                    return (
                      <div
                        key={item.id || item.productId || index}
                        className="flex gap-3 pb-4 border-b border-border/70 last:border-0"
                      >
                        <img
                          src={image}
                          alt={name}
                          className="w-20 h-20 object-cover rounded-lg border border-border flex-shrink-0"
                        />
                        <div className="flex-1 min-w-0">
                          <div className="flex items-start justify-between gap-1">
                            <h5 className="text-sm font-display font-medium text-foreground truncate">
                              {name}
                            </h5>
                            <button
                              onClick={() => handleRemove(item)}
                              className="text-muted-foreground hover:text-destructive p-1 transition-colors"
                              title="Remove item"
                            >
                              <Trash2 size={15} />
                            </button>
                          </div>

                          {(item.purity || item.weight) && (
                            <p className="text-[11px] text-muted-foreground mt-0.5">
                              {item.purity && <span>{item.purity} Gold</span>}
                              {item.purity && item.weight && <span> • </span>}
                              {item.weight && <span>{item.weight}</span>}
                            </p>
                          )}

                          <div className="flex items-center justify-between mt-3">
                            {/* Quantity buttons */}
                            <div className="flex items-center border border-border rounded">
                              <button
                                onClick={() => handleUpdateQty(item, -1)}
                                className="p-1 hover:bg-muted text-muted-foreground hover:text-foreground transition-colors"
                                aria-label="Decrease quantity"
                              >
                                <Minus size={12} />
                              </button>
                              <span className="px-2.5 text-xs font-semibold text-foreground">
                                {item.quantity || 1}
                              </span>
                              <button
                                onClick={() => handleUpdateQty(item, 1)}
                                className="p-1 hover:bg-muted text-muted-foreground hover:text-foreground transition-colors"
                                aria-label="Increase quantity"
                              >
                                <Plus size={12} />
                              </button>
                            </div>

                            {/* Price */}
                            <span className="text-sm font-semibold text-[#997D4D]">
                              ₹{(price * (item.quantity || 1)).toLocaleString("en-IN")}
                            </span>
                          </div>
                        </div>
                      </div>
                    );
                  })
                )}
              </div>

              {/* Drawer Footer (Summary & CTAs) */}
              {items.length > 0 && (
                <div className="p-5 border-t border-border bg-card/60 space-y-3">
                  <div className="space-y-1.5 text-xs font-body">
                    <div className="flex justify-between text-muted-foreground">
                      <span>Subtotal</span>
                      <span className="font-medium text-foreground">
                        ₹{subtotal.toLocaleString("en-IN")}
                      </span>
                    </div>
                    <div className="flex justify-between text-muted-foreground">
                      <span>Express Insured Shipping</span>
                      <span className="text-emerald-600 font-semibold">
                        {subtotal >= freeShippingThreshold ? "Complimentary" : "₹499"}
                      </span>
                    </div>
                    <div className="flex justify-between text-foreground text-sm font-semibold pt-2 border-t border-border">
                      <span>Estimated Total</span>
                      <span className="text-base text-[#997D4D]">
                        ₹{(subtotal >= freeShippingThreshold ? subtotal : subtotal + 499).toLocaleString("en-IN")}
                      </span>
                    </div>
                  </div>

                  <div className="pt-2 space-y-2">
                    <button
                      onClick={() => {
                        navigate("/checkout");
                        onClose();
                      }}
                      className="w-full py-3 bg-[#C5A880] hover:bg-[#B39366] text-white text-xs font-bold uppercase tracking-widest rounded flex items-center justify-center gap-2 shadow-lg transition-all"
                    >
                      <span>Proceed to Checkout</span>
                      <ArrowRight size={14} />
                    </button>

                    <button
                      onClick={() => {
                        navigate("/cart");
                        onClose();
                      }}
                      className="w-full py-2.5 border border-border hover:border-[#C5A880] text-foreground hover:text-[#997D4D] text-xs font-semibold uppercase tracking-wider rounded transition-colors"
                    >
                      View Shopping Bag
                    </button>
                  </div>

                  <div className="flex items-center justify-center gap-1.5 text-[11px] text-muted-foreground pt-1">
                    <ShieldCheck size={13} className="text-[#C5A880]" />
                    <span>100% Certified & Insured Transit Guarantee</span>
                  </div>
                </div>
              )}
            </motion.div>
          </div>
        </div>
      )}
    </AnimatePresence>
  );
};

export default MiniCartDrawer;
