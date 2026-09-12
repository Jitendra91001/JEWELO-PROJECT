import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import {
  ShieldCheck,
  CreditCard,
  Truck,
  CheckCircle2,
  Lock,
  ArrowRight,
  Sparkles,
  MapPin,
  Building2,
  QrCode,
  Smartphone,
  Check,
} from "lucide-react";
import SEOHead from "@/components/common/SEOHead";
import { useAppDispatch, useAppSelector } from "@/store/hooks";
import { clearCart } from "@/store/cartThunk";
import { ShippingAddress, PaymentMethod } from "@/types/order.types";
import { toast } from "sonner";

export const Checkout: React.FC = () => {
  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  const cart = useAppSelector((state) => state.cart);
  const items = cart?.items || [];
  const user = useAppSelector((state) => state.auth.user);

  // Stepper State (1: Address, 2: Delivery, 3: Payment)
  const [step, setStep] = useState<1 | 2 | 3>(1);

  // Address Form State
  const [address, setAddress] = useState<ShippingAddress>({
    fullName: user?.name || "Aarav Sharma",
    phone: "+91 9820011223",
    addressLine1: "B-402, Imperial Heights, Lokhandwala Complex",
    addressLine2: "Opposite Celebration Club, Andheri West",
    landmark: "Near Grand Mall",
    city: "Mumbai",
    state: "Maharashtra",
    country: "India",
    pincode: "400053",
    isDefault: true,
    type: "home",
  });

  // Delivery Method State
  const [deliveryMethod, setDeliveryMethod] = useState<"express" | "boutique">("express");

  // Payment Method State
  const [paymentMethod, setPaymentMethod] = useState<PaymentMethod>("UPI");
  const [upiId, setUpiId] = useState("aarav@okhdfcbank");
  const [cardDetails, setCardDetails] = useState({
    number: "4532 •••• •••• 8821",
    name: user?.name || "Aarav Sharma",
    expiry: "09/29",
    cvv: "•••",
  });

  const [processing, setProcessing] = useState(false);

  // Pricing
  const subtotal = items.reduce((sum, item) => {
    const price = item.discountPrice || item.price || item.product?.price || 0;
    return sum + price * (item.quantity || 1);
  }, 0);
  const tax = Math.round(subtotal * 0.03);
  const shipping = deliveryMethod === "express" ? 0 : 0; // Complimentary
  const grandTotal = subtotal + tax + shipping;

  const handlePlaceOrder = () => {
    setProcessing(true);
    setTimeout(() => {
      setProcessing(false);
      dispatch(clearCart());
      toast.success("Order confirmed successfully!");
      navigate(`/order-confirmation?orderId=JWL-${Date.now().toString().slice(-6)}&total=${grandTotal}`);
    }, 1200);
  };

  return (
    <div className="w-full bg-background min-h-screen py-8 lg:py-12 font-body text-foreground">
      <SEOHead title="Secure Checkout | JEWELO" description="Complete your fine jewellery acquisition." />

      <div className="container mx-auto px-4">
        {/* Checkout Stepper Header */}
        <div className="max-w-3xl mx-auto mb-10">
          <div className="flex items-center justify-between relative">
            <div className="absolute left-0 right-0 top-1/2 -translate-y-1/2 h-0.5 bg-border -z-10" />

            {[
              { num: 1, title: "Shipping Address" },
              { num: 2, title: "Delivery Mode" },
              { num: 3, title: "Payment & Order" },
            ].map((s) => (
              <div
                key={s.num}
                onClick={() => {
                  if (step > s.num) setStep(s.num as any);
                }}
                className={`flex items-center gap-2 bg-background px-3 cursor-pointer ${
                  step >= s.num ? "text-[#997D4D] font-bold" : "text-muted-foreground"
                }`}
              >
                <div
                  className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold transition-all ${
                    step === s.num
                      ? "bg-[#C5A880] text-white ring-4 ring-[#C5A880]/20"
                      : step > s.num
                      ? "bg-emerald-600 text-white"
                      : "bg-secondary text-muted-foreground border border-border"
                  }`}
                >
                  {step > s.num ? <Check size={14} /> : s.num}
                </div>
                <span className="text-xs uppercase tracking-wider hidden sm:inline">{s.title}</span>
              </div>
            ))}
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-start max-w-6xl mx-auto">
          {/* Main Checkout Steps Form Left */}
          <div className="lg:col-span-8 space-y-6">
            {/* STEP 1: SHIPPING ADDRESS */}
            {step === 1 && (
              <div className="p-6 sm:p-8 rounded-2xl bg-card border border-border shadow-sm space-y-6 animate-fade-in">
                <div className="flex items-center justify-between pb-3 border-b border-border">
                  <div className="flex items-center gap-2">
                    <MapPin size={20} className="text-[#C5A880]" />
                    <h2 className="font-display text-xl font-bold">1. Delivery Address</h2>
                  </div>
                  <span className="text-xs text-muted-foreground">Insured Pan-India Transit</span>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
                  <div className="space-y-1 sm:col-span-2">
                    <label className="font-semibold text-foreground">Recipient Full Name *</label>
                    <input
                      type="text"
                      value={address.fullName}
                      onChange={(e) => setAddress({ ...address, fullName: e.target.value })}
                      className="w-full py-2.5 px-3 rounded-lg border border-border bg-background outline-none focus:border-[#C5A880]"
                    />
                  </div>

                  <div className="space-y-1">
                    <label className="font-semibold text-foreground">Mobile Phone (for Delivery OTP) *</label>
                    <input
                      type="tel"
                      value={address.phone}
                      onChange={(e) => setAddress({ ...address, phone: e.target.value })}
                      className="w-full py-2.5 px-3 rounded-lg border border-border bg-background outline-none focus:border-[#C5A880]"
                    />
                  </div>

                  <div className="space-y-1">
                    <label className="font-semibold text-foreground">PIN Code *</label>
                    <input
                      type="text"
                      value={address.pincode}
                      onChange={(e) => setAddress({ ...address, pincode: e.target.value })}
                      className="w-full py-2.5 px-3 rounded-lg border border-border bg-background outline-none focus:border-[#C5A880]"
                    />
                  </div>

                  <div className="space-y-1 sm:col-span-2">
                    <label className="font-semibold text-foreground">Street Address / House / Suite *</label>
                    <input
                      type="text"
                      value={address.addressLine1}
                      onChange={(e) => setAddress({ ...address, addressLine1: e.target.value })}
                      className="w-full py-2.5 px-3 rounded-lg border border-border bg-background outline-none focus:border-[#C5A880]"
                    />
                  </div>

                  <div className="space-y-1 sm:col-span-2">
                    <label className="font-semibold text-foreground">Landmark / Building Name</label>
                    <input
                      type="text"
                      value={address.landmark}
                      onChange={(e) => setAddress({ ...address, landmark: e.target.value })}
                      className="w-full py-2.5 px-3 rounded-lg border border-border bg-background outline-none focus:border-[#C5A880]"
                    />
                  </div>

                  <div className="space-y-1">
                    <label className="font-semibold text-foreground">City *</label>
                    <input
                      type="text"
                      value={address.city}
                      onChange={(e) => setAddress({ ...address, city: e.target.value })}
                      className="w-full py-2.5 px-3 rounded-lg border border-border bg-background outline-none focus:border-[#C5A880]"
                    />
                  </div>

                  <div className="space-y-1">
                    <label className="font-semibold text-foreground">State *</label>
                    <input
                      type="text"
                      value={address.state}
                      onChange={(e) => setAddress({ ...address, state: e.target.value })}
                      className="w-full py-2.5 px-3 rounded-lg border border-border bg-background outline-none focus:border-[#C5A880]"
                    />
                  </div>
                </div>

                <div className="pt-2">
                  <button
                    onClick={() => setStep(2)}
                    className="px-8 py-3.5 bg-[#C5A880] hover:bg-[#B39366] text-white text-xs font-bold uppercase tracking-widest rounded-lg flex items-center gap-2 shadow"
                  >
                    <span>Continue to Delivery Method</span>
                    <ArrowRight size={14} />
                  </button>
                </div>
              </div>
            )}

            {/* STEP 2: DELIVERY METHOD */}
            {step === 2 && (
              <div className="p-6 sm:p-8 rounded-2xl bg-card border border-border shadow-sm space-y-6 animate-fade-in">
                <div className="flex items-center justify-between pb-3 border-b border-border">
                  <div className="flex items-center gap-2">
                    <Truck size={20} className="text-[#C5A880]" />
                    <h2 className="font-display text-xl font-bold">2. Delivery Method</h2>
                  </div>
                  <button onClick={() => setStep(1)} className="text-xs text-[#997D4D] hover:underline font-semibold">
                    Edit Address
                  </button>
                </div>

                <div className="space-y-3 text-xs">
                  {/* Option 1: Armored Courier */}
                  <label
                    className={`flex items-start gap-4 p-4 rounded-xl border cursor-pointer transition-all ${
                      deliveryMethod === "express"
                        ? "border-[#C5A880] bg-[#C5A880]/10 shadow-sm"
                        : "border-border hover:border-border/80"
                    }`}
                  >
                    <input
                      type="radio"
                      name="delivery"
                      checked={deliveryMethod === "express"}
                      onChange={() => setDeliveryMethod("express")}
                      className="mt-1 accent-[#C5A880]"
                    />
                    <div className="space-y-1 flex-1">
                      <div className="flex justify-between items-center">
                        <span className="font-display font-bold text-sm text-foreground">
                          Complimentary Insured Armored Express
                        </span>
                        <span className="text-emerald-600 font-bold uppercase text-[10px]">Free</span>
                      </div>
                      <p className="text-muted-foreground">
                        Dispatched via Sequel Logistics or BlueDart Apex with armed security guards and door delivery OTP requirement. Estimated delivery in 2-3 business days.
                      </p>
                    </div>
                  </label>

                  {/* Option 2: Boutique Pickup */}
                  <label
                    className={`flex items-start gap-4 p-4 rounded-xl border cursor-pointer transition-all ${
                      deliveryMethod === "boutique"
                        ? "border-[#C5A880] bg-[#C5A880]/10 shadow-sm"
                        : "border-border hover:border-border/80"
                    }`}
                  >
                    <input
                      type="radio"
                      name="delivery"
                      checked={deliveryMethod === "boutique"}
                      onChange={() => setDeliveryMethod("boutique")}
                      className="mt-1 accent-[#C5A880]"
                    />
                    <div className="space-y-1 flex-1">
                      <div className="flex justify-between items-center">
                        <span className="font-display font-bold text-sm text-foreground">
                          Pick up at BKC Flagship Boutique (Mumbai)
                        </span>
                        <span className="text-emerald-600 font-bold uppercase text-[10px]">Free</span>
                      </div>
                      <p className="text-muted-foreground">
                        Boutique No. 04, Grand Regal Tower, BKC, Mumbai. Includes personal fitting and champagne concierge viewing.
                      </p>
                    </div>
                  </label>
                </div>

                <div className="flex items-center gap-3 pt-2">
                  <button
                    onClick={() => setStep(1)}
                    className="px-5 py-3 border border-border text-xs font-semibold rounded-lg"
                  >
                    Back
                  </button>
                  <button
                    onClick={() => setStep(3)}
                    className="px-8 py-3.5 bg-[#C5A880] hover:bg-[#B39366] text-white text-xs font-bold uppercase tracking-widest rounded-lg flex items-center gap-2 shadow"
                  >
                    <span>Proceed to Payment</span>
                    <ArrowRight size={14} />
                  </button>
                </div>
              </div>
            )}

            {/* STEP 3: PAYMENT UI (Mock Only) */}
            {step === 3 && (
              <div className="p-6 sm:p-8 rounded-2xl bg-card border border-border shadow-sm space-y-6 animate-fade-in">
                <div className="flex items-center justify-between pb-3 border-b border-border">
                  <div className="flex items-center gap-2">
                    <Lock size={20} className="text-[#C5A880]" />
                    <h2 className="font-display text-xl font-bold">3. Select Payment Instrument</h2>
                  </div>
                  <span className="text-[11px] font-mono text-emerald-600 font-semibold flex items-center gap-1">
                    <ShieldCheck size={14} />
                    <span>256-Bit SSL Encrypted</span>
                  </span>
                </div>

                {/* Payment Option Tabs */}
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 text-xs font-semibold">
                  {[
                    { id: "UPI", label: "Instant UPI", icon: Smartphone },
                    { id: "CREDIT_CARD", label: "Credit / Debit", icon: CreditCard },
                    { id: "NET_BANKING", label: "Net Banking", icon: Building2 },
                    { id: "COD", label: "Doorstep COD", icon: Truck },
                  ].map((p) => {
                    const Icon = p.icon;
                    return (
                      <button
                        key={p.id}
                        onClick={() => setPaymentMethod(p.id as any)}
                        className={`p-3 rounded-xl border flex flex-col items-center justify-center gap-1.5 transition-all ${
                          paymentMethod === p.id
                            ? "border-[#C5A880] bg-[#C5A880]/15 text-[#997D4D] shadow-sm font-bold"
                            : "border-border text-foreground hover:bg-secondary/40"
                        }`}
                      >
                        <Icon size={18} />
                        <span>{p.label}</span>
                      </button>
                    );
                  })}
                </div>

                {/* Payment Form Box */}
                <div className="p-5 rounded-xl bg-secondary/30 border border-border space-y-4 text-xs">
                  {paymentMethod === "UPI" && (
                    <div className="space-y-3">
                      <p className="font-semibold text-foreground">Pay via Unified Payments Interface (UPI)</p>
                      <div className="space-y-1">
                        <label className="text-muted-foreground">Enter UPI VPA ID (GPay / PhonePe / Paytm):</label>
                        <input
                          type="text"
                          value={upiId}
                          onChange={(e) => setUpiId(e.target.value)}
                          className="w-full py-2.5 px-3 rounded-lg border border-border bg-background outline-none font-mono text-xs focus:border-[#C5A880]"
                        />
                      </div>
                      <p className="text-[11px] text-muted-foreground">
                        A payment collect request for ₹{grandTotal.toLocaleString("en-IN")} will be approved in your UPI app.
                      </p>
                    </div>
                  )}

                  {paymentMethod === "CREDIT_CARD" && (
                    <div className="space-y-3">
                      <p className="font-semibold text-foreground">Credit or Debit Card</p>
                      <div className="space-y-2">
                        <input
                          type="text"
                          value={cardDetails.number}
                          onChange={(e) => setCardDetails({ ...cardDetails, number: e.target.value })}
                          placeholder="Card Number"
                          className="w-full py-2.5 px-3 rounded-lg border border-border bg-background font-mono text-xs"
                        />
                        <div className="grid grid-cols-2 gap-2">
                          <input
                            type="text"
                            value={cardDetails.expiry}
                            onChange={(e) => setCardDetails({ ...cardDetails, expiry: e.target.value })}
                            placeholder="MM / YY"
                            className="w-full py-2.5 px-3 rounded-lg border border-border bg-background font-mono text-xs"
                          />
                          <input
                            type="password"
                            value={cardDetails.cvv}
                            onChange={(e) => setCardDetails({ ...cardDetails, cvv: e.target.value })}
                            placeholder="CVV"
                            maxLength={3}
                            className="w-full py-2.5 px-3 rounded-lg border border-border bg-background font-mono text-xs"
                          />
                        </div>
                      </div>
                    </div>
                  )}

                  {paymentMethod === "NET_BANKING" && (
                    <div className="space-y-3">
                      <p className="font-semibold text-foreground">Select Net Banking Gateway</p>
                      <div className="grid grid-cols-3 gap-2">
                        {["HDFC Bank", "ICICI Bank", "SBI", "Axis Bank", "Kotak", "Yes Bank"].map((b) => (
                          <div
                            key={b}
                            className="p-2.5 rounded-lg border border-border bg-background text-center font-semibold cursor-pointer hover:border-[#C5A880]"
                          >
                            {b}
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  {paymentMethod === "COD" && (
                    <div className="space-y-2">
                      <p className="font-semibold text-foreground">Cash on Armored Delivery</p>
                      <p className="text-muted-foreground text-xs leading-relaxed">
                        Valid for orders up to ₹2,00,000 under RBI high-value transaction guidelines. Please ensure exact payment or draft upon receipt.
                      </p>
                    </div>
                  )}
                </div>

                <div className="pt-2">
                  <button
                    onClick={handlePlaceOrder}
                    disabled={processing}
                    className="w-full py-4 bg-[#C5A880] hover:bg-[#B39366] disabled:opacity-50 text-white text-xs font-bold uppercase tracking-[0.2em] rounded-xl flex items-center justify-center gap-2 shadow-2xl transition-all"
                  >
                    <span>{processing ? "Authorizing Security Handshake..." : `Confirm & Pay ₹${grandTotal.toLocaleString("en-IN")}`}</span>
                    <ShieldCheck size={16} />
                  </button>
                </div>
              </div>
            )}
          </div>

          {/* Checkout Order Summary Right */}
          <div className="lg:col-span-4 space-y-6">
            <div className="p-6 rounded-2xl bg-card border border-border shadow-sm space-y-4 text-xs font-body">
              <h3 className="font-display text-base font-bold pb-2 border-b border-border">
                Acquisition Summary ({items.length} Items)
              </h3>

              <div className="space-y-3 max-h-64 overflow-y-auto pr-1">
                {items.map((item, idx) => {
                  const price = item.discountPrice || item.price || item.product?.price || 0;
                  return (
                    <div key={idx} className="flex items-center gap-3">
                      <img
                        src={item.image || "https://images.unsplash.com/photo-1605100804763-247f67b3557e?auto=format&fit=crop&w=100&q=80"}
                        alt={item.name}
                        className="w-12 h-12 rounded-lg object-cover border border-border flex-shrink-0"
                      />
                      <div className="flex-1 min-w-0">
                        <h5 className="font-display font-medium text-foreground truncate">{item.name}</h5>
                        <p className="text-[10px] text-muted-foreground">Qty: {item.quantity || 1}</p>
                      </div>
                      <span className="font-bold text-foreground font-display">
                        ₹{(price * (item.quantity || 1)).toLocaleString("en-IN")}
                      </span>
                    </div>
                  );
                })}
              </div>

              <div className="pt-3 border-t border-border space-y-2">
                <div className="flex justify-between text-muted-foreground">
                  <span>Subtotal</span>
                  <span className="font-semibold text-foreground">₹{subtotal.toLocaleString("en-IN")}</span>
                </div>
                <div className="flex justify-between text-muted-foreground">
                  <span>GST (3%)</span>
                  <span className="font-semibold text-foreground">₹{tax.toLocaleString("en-IN")}</span>
                </div>
                <div className="flex justify-between text-muted-foreground">
                  <span>Armored Insured Transit</span>
                  <span className="text-emerald-600 font-semibold">Complimentary</span>
                </div>
                <div className="pt-2 border-t border-border flex justify-between items-baseline">
                  <span className="text-sm font-bold text-foreground">Final Payable</span>
                  <span className="font-display text-2xl font-bold text-[#997D4D]">
                    ₹{grandTotal.toLocaleString("en-IN")}
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Checkout;
