import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAppSelector, useAppDispatch } from "@/store/hooks";
import { clearCart } from "@/store/cartThunk";
import SEOHead from "@/components/common/SEOHead";
import { CURRENCY } from "@/utils/constants";
import { toast } from "sonner";
import { CheckCircle } from "lucide-react";

const Checkout = () => {
  const { items } = useAppSelector((s) => s.cart);
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const [step, setStep] = useState(1);
  const [address, setAddress] = useState({ name: "", phone: "", line1: "", line2: "", city: "", state: "", pincode: "" });
  const [paymentMethod, setPaymentMethod] = useState("cod");
  const [orderPlaced, setOrderPlaced] = useState(false);

  const subtotal = items.reduce((sum, i) => sum + i.price * i.quantity, 0);
  const shipping = subtotal >= 5000 ? 0 : 299;
  const gst = Math.round(subtotal * 0.03);
  const total = subtotal + shipping + gst;

  const handlePlaceOrder = () => {
    setOrderPlaced(true);
    dispatch(clearCart());
    toast.success("Order placed successfully!");
  };

  if (orderPlaced) {
    return (
      <>
        <SEOHead title="Order Confirmed" />
        <div className="min-h-[60vh] flex flex-col items-center justify-center px-4 py-12 text-center">
          <CheckCircle size={64} className="text-green-500 mb-4" />
          <h1 className="font-display text-3xl font-bold text-foreground mb-2">Order Confirmed!</h1>
          <p className="text-muted-foreground font-body mb-6">Thank you for your purchase. Your order is being processed.</p>
          <button onClick={() => navigate("/")} className="gold-gradient text-primary-foreground px-8 py-3 rounded-sm font-body text-sm font-semibold uppercase shimmer">
            Continue Shopping
          </button>
        </div>
      </>
    );
  }

  if (items.length === 0) {
    navigate("/cart");
    return null;
  }

  return (
    <>
      <SEOHead title="Checkout" />
      <div className="container mx-auto px-4 py-6 lg:py-10">
        <h1 className="font-display text-2xl lg:text-3xl font-bold text-foreground mb-8">Checkout</h1>

        {/* Steps */}
        <div className="flex items-center justify-center gap-4 mb-10">
          {["Address", "Payment", "Review"].map((s, i) => (
            <div key={s} className="flex items-center gap-2">
              <div className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-body font-bold ${
                step > i + 1 ? "bg-green-500 text-primary-foreground" : step === i + 1 ? "gold-gradient text-primary-foreground" : "bg-muted text-muted-foreground"
              }`}>
                {i + 1}
              </div>
              <span className={`text-sm font-body hidden sm:block ${step === i + 1 ? "text-foreground font-semibold" : "text-muted-foreground"}`}>{s}</span>
              {i < 2 && <div className="w-8 lg:w-16 h-px bg-border" />}
            </div>
          ))}
        </div>

        <div className="flex flex-col lg:flex-row gap-8">
          <div className="flex-1">
            {step === 1 && (
              <div className="space-y-4">
                <h2 className="font-display text-xl font-semibold text-foreground mb-4">Shipping Address</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {[
                    { label: "Full Name", key: "name", type: "text" },
                    { label: "Phone", key: "phone", type: "tel" },
                    { label: "Address Line 1", key: "line1", type: "text", full: true },
                    { label: "Address Line 2", key: "line2", type: "text", full: true },
                    { label: "City", key: "city", type: "text" },
                    { label: "State", key: "state", type: "text" },
                    { label: "Pincode", key: "pincode", type: "text" },
                  ].map((field) => (
                    <div key={field.key} className={field.full ? "md:col-span-2" : ""}>
                      <label className="block text-sm font-body font-medium text-foreground mb-1.5">{field.label}</label>
                      <input
                        type={field.type}
                        value={(address as any)[field.key]}
                        onChange={(e) => setAddress({ ...address, [field.key]: e.target.value })}
                        className="w-full border border-border rounded-sm px-4 py-3 text-sm font-body bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary"
                        required
                      />
                    </div>
                  ))}
                </div>
                <button onClick={() => setStep(2)} className="gold-gradient text-primary-foreground px-8 py-3 rounded-sm font-body text-sm font-semibold uppercase mt-4 shimmer">
                  Continue to Payment
                </button>
              </div>
            )}

            {step === 2 && (
              <div>
                <h2 className="font-display text-xl font-semibold text-foreground mb-4">Payment Method</h2>
                <div className="space-y-3">
                  {[
                    { value: "cod", label: "Cash on Delivery" },
                    { value: "online", label: "Online Payment (UPI/Card)" },
                  ].map((opt) => (
                    <label key={opt.value} className={`flex items-center gap-3 p-4 border rounded-sm cursor-pointer transition-colors ${paymentMethod === opt.value ? "border-primary bg-primary/5" : "border-border"}`}>
                      <input type="radio" name="payment" value={opt.value} checked={paymentMethod === opt.value}
                        onChange={(e) => setPaymentMethod(e.target.value)} className="text-primary" />
                      <span className="text-sm font-body font-medium text-foreground">{opt.label}</span>
                    </label>
                  ))}
                </div>
                <div className="flex gap-3 mt-6">
                  <button onClick={() => setStep(1)} className="border border-border text-foreground px-6 py-3 rounded-sm font-body text-sm">Back</button>
                  <button onClick={() => setStep(3)} className="gold-gradient text-primary-foreground px-8 py-3 rounded-sm font-body text-sm font-semibold uppercase shimmer">
                    Review Order
                  </button>
                </div>
              </div>
            )}

            {step === 3 && (
              <div>
                <h2 className="font-display text-xl font-semibold text-foreground mb-4">Review Your Order</h2>
                <div className="bg-secondary/30 rounded-sm p-4 mb-4">
                  <p className="text-sm font-body font-semibold text-foreground mb-1">Shipping to:</p>
                  <p className="text-sm font-body text-muted-foreground">{address.name}, {address.line1}, {address.city} - {address.pincode}</p>
                </div>
                <div className="bg-secondary/30 rounded-sm p-4 mb-4">
                  <p className="text-sm font-body font-semibold text-foreground mb-1">Payment:</p>
                  <p className="text-sm font-body text-muted-foreground">{paymentMethod === "cod" ? "Cash on Delivery" : "Online Payment"}</p>
                </div>
                <div className="space-y-3 mb-6">
                  {items.map((item) => (
                    <div key={item.productId} className="flex items-center gap-3 p-3 bg-card border border-border rounded-sm">
                      <img src={item.image} alt={item.name} className="w-12 h-12 object-cover rounded-sm" />
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-body font-medium text-foreground line-clamp-1">{item.name}</p>
                        <p className="text-xs text-muted-foreground">Qty: {item.quantity}</p>
                      </div>
                      <p className="text-sm font-body font-semibold text-foreground">{CURRENCY}{(item.price * item.quantity).toLocaleString()}</p>
                    </div>
                  ))}
                </div>
                <div className="flex gap-3">
                  <button onClick={() => setStep(2)} className="border border-border text-foreground px-6 py-3 rounded-sm font-body text-sm">Back</button>
                  <button onClick={handlePlaceOrder} className="gold-gradient text-primary-foreground px-8 py-3 rounded-sm font-body text-sm font-semibold uppercase shimmer">
                    Place Order
                  </button>
                </div>
              </div>
            )}
          </div>

          {/* Summary */}
          <div className="lg:w-80">
            <div className="bg-card border border-border rounded-sm p-6 sticky top-28">
              <h3 className="font-display text-lg font-semibold text-foreground mb-4">Order Summary</h3>
              <div className="space-y-2 text-sm font-body">
                <div className="flex justify-between text-foreground/80"><span>Subtotal</span><span>{CURRENCY}{subtotal.toLocaleString()}</span></div>
                <div className="flex justify-between text-foreground/80"><span>GST (3%)</span><span>{CURRENCY}{gst.toLocaleString()}</span></div>
                <div className="flex justify-between text-foreground/80"><span>Shipping</span><span>{shipping === 0 ? "Free" : `${CURRENCY}${shipping}`}</span></div>
                <div className="border-t border-border pt-2 flex justify-between font-semibold text-foreground text-base"><span>Total</span><span>{CURRENCY}{total.toLocaleString()}</span></div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default Checkout;
