import { Link } from "react-router-dom";
import { Trash2, Minus, Plus, ShoppingBag, ArrowRight, Loader2 } from "lucide-react";
import { useAppSelector, useAppDispatch } from "@/store/hooks";
import { clearError } from "@/store/cartSlice";
import { getCart, removeFromCart, updateCartQuantity } from "@/store/cartThunk";
import SEOHead from "@/components/common/SEOHead";
import { CURRENCY } from "@/utils/constants";
import { motion, AnimatePresence } from "framer-motion";
import { useEffect } from "react";
import { toast } from "sonner";

const Cart = () => {
  const { items, loading, error } = useAppSelector((s) => s.cart);
  const dispatch = useAppDispatch();

  useEffect(() => {
    dispatch(getCart());
  }, [dispatch]);

  useEffect(() => {
    if (error) {
      toast.error(error);
      dispatch(clearError());
    }
  }, [error, dispatch]);

  const handleUpdateQuantity = (itemId: string, quantity: number) => {
    if (quantity < 1) return;
    dispatch(updateCartQuantity({ itemId, quantity }));
  };

  const handleRemoveFromCart = (cartItemId: string) => {
    dispatch(removeFromCart(cartItemId));
  };

  const subtotal = items.reduce((sum, i) => sum + i.price * i.quantity, 0);
  const shipping = subtotal >= 5000 ? 0 : 299;
  const gst = Math.round(subtotal * 0.03);
  const total = subtotal + shipping + gst;

  if (items.length === 0) {
    return (
      <>
        <SEOHead title="Cart" description="Your shopping cart is empty" />
        <div className="min-h-[60vh] flex flex-col items-center justify-center px-4 py-12">
          <ShoppingBag size={48} className="text-muted-foreground mb-4" />
          <h1 className="font-display text-2xl font-bold text-foreground mb-2">Your Cart is Empty</h1>
          <p className="text-muted-foreground font-body text-sm mb-6">Discover our beautiful collection and add something special</p>
          <Link to="/products" className="gold-gradient text-primary-foreground px-8 py-3 rounded-sm font-body text-sm font-semibold tracking-wide uppercase inline-flex items-center gap-2 shimmer">
            Start Shopping <ArrowRight size={16} />
          </Link>
        </div>
      </>
    );
  }

  return (
    <>
      <SEOHead title="Cart" description="Review your selected jewellery items" />
      <div className="container mx-auto px-4 py-6 lg:py-10">
        <h1 className="font-display text-2xl lg:text-3xl font-bold text-foreground mb-8">Shopping Cart ({items.length} items)</h1>

        <div className="flex flex-col lg:flex-row gap-8">
          {/* Cart Items */}
          <div className="flex-1 space-y-4">
            <AnimatePresence>
              {items.map((item) => (
                <motion.div
                  key={item.productId}
                  layout
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, x: -100 }}
                  className="flex gap-4 p-4 bg-card border border-border rounded-sm"
                >
                  <Link to={`/product/${item.productId}`} className="w-24 h-24 flex-shrink-0 overflow-hidden rounded-sm bg-secondary">
                    <img src={item.image} alt={item.name} className="w-full h-full object-cover" />
                  </Link>

                  <div className="flex-1 min-w-0">
                    <Link to={`/product/${item.productId}`} className="font-body text-sm font-medium text-foreground hover:text-primary line-clamp-1">
                      {item.name}
                    </Link>
                    {item.weight && <p className="text-xs text-muted-foreground font-body mt-0.5">Weight: {item.weight}</p>}
                    <p className="font-body font-semibold text-foreground mt-2">{CURRENCY}{item.price.toLocaleString()}</p>

                    <div className="flex items-center justify-between mt-3">
                      <div className="flex items-center border border-border rounded-sm">
                        <button
                          onClick={() => handleUpdateQuantity(item.id, item.quantity - 1)}
                          disabled={loading}
                          className="p-1.5 text-foreground hover:text-primary disabled:opacity-50"
                        >
                          {loading ? <Loader2 size={12} className="animate-spin" /> : <Minus size={12} />}
                        </button>
                        <span className="px-3 text-xs font-body font-semibold text-foreground">{item.quantity}</span>
                        <button
                          onClick={() => handleUpdateQuantity(item.id, item.quantity + 1)}
                          disabled={loading}
                          className="p-1.5 text-foreground hover:text-primary disabled:opacity-50"
                        >
                          {loading ? <Loader2 size={12} className="animate-spin" /> : <Plus size={12} />}
                        </button>
                      </div>
                      <button
                        onClick={() => handleRemoveFromCart(item.id)}
                        disabled={loading}
                        className="text-muted-foreground hover:text-destructive transition-colors disabled:opacity-50"
                      >
                        {loading ? <Loader2 size={16} className="animate-spin" /> : <Trash2 size={16} />}
                      </button>
                    </div>
                  </div>
                </motion.div>
              ))}
            </AnimatePresence>
          </div>

          {/* Order Summary */}
          <div className="lg:w-80">
            <div className="bg-card border border-border rounded-sm p-6 sticky top-28">
              <h2 className="font-display text-lg font-semibold text-foreground mb-4">Order Summary</h2>

              <div className="space-y-3 text-sm font-body">
                <div className="flex justify-between text-foreground/80">
                  <span>Subtotal</span>
                  <span>{CURRENCY}{subtotal.toLocaleString()}</span>
                </div>
                <div className="flex justify-between text-foreground/80">
                  <span>GST (3%)</span>
                  <span>{CURRENCY}{gst.toLocaleString()}</span>
                </div>
                <div className="flex justify-between text-foreground/80">
                  <span>Shipping</span>
                  <span>{shipping === 0 ? <span className="text-green-600">Free</span> : `${CURRENCY}${shipping}`}</span>
                </div>
                <div className="border-t border-border pt-3 flex justify-between font-semibold text-foreground text-base">
                  <span>Total</span>
                  <span>{CURRENCY}{total.toLocaleString()}</span>
                </div>
              </div>

              <Link
                to="/checkout"
                className="w-full gold-gradient text-primary-foreground py-3.5 rounded-sm font-body text-sm font-semibold tracking-wide uppercase mt-6 inline-flex items-center justify-center gap-2 hover:opacity-90 transition-opacity shimmer"
              >
                Proceed to Checkout
              </Link>

              <Link to="/products" className="w-full text-center text-sm font-body text-primary hover:underline mt-4 block">
                Continue Shopping
              </Link>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default Cart;
