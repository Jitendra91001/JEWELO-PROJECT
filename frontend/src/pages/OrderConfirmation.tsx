import React from "react";
import { Link, useSearchParams } from "react-router-dom";
import { CheckCircle2, Sparkles, Download, ArrowRight, Truck, ShieldCheck, MapPin } from "lucide-react";
import SEOHead from "@/components/common/SEOHead";
import { toast } from "sonner";

export const OrderConfirmation: React.FC = () => {
  const [searchParams] = useSearchParams();
  const orderId = searchParams.get("orderId") || "JWL-2026-9041";
  const total = searchParams.get("total") || "185400";

  const handleDownloadInvoice = () => {
    toast.success(`Downloading official GST invoice for ${orderId}...`);
  };

  return (
    <div className="w-full bg-background min-h-[80vh] py-12 lg:py-16 font-body text-foreground">
      <SEOHead title="Order Confirmed | JEWELO" description="Your acquisition has been confirmed." />

      <div className="container mx-auto px-4 max-w-3xl">
        <div className="rounded-3xl border border-border bg-card p-8 sm:p-12 text-center shadow-2xl space-y-6">
          {/* Gold Crest Icon */}
          <div className="w-20 h-20 mx-auto rounded-full bg-emerald-100 dark:bg-emerald-950/40 text-emerald-600 flex items-center justify-center ring-8 ring-emerald-50 dark:ring-emerald-900/20">
            <CheckCircle2 size={44} />
          </div>

          <div className="space-y-2">
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#C5A880]/15 border border-[#C5A880]/30 text-[#997D4D] text-xs font-bold uppercase tracking-widest">
              <Sparkles size={13} />
              <span>Acquisition Confirmed</span>
            </div>
            <h1 className="font-display text-3xl sm:text-4xl font-bold tracking-tight text-foreground">
              Thank You for Your Patronage
            </h1>
            <p className="text-xs sm:text-sm text-muted-foreground max-w-md mx-auto leading-relaxed">
              Your order <strong className="font-mono text-foreground font-bold">{orderId}</strong> has been allocated to our vault for hallmarking and armored transit.
            </p>
          </div>

          {/* Order Details Card */}
          <div className="p-6 rounded-2xl bg-secondary/40 border border-border/80 text-left text-xs space-y-4">
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 pb-4 border-b border-border/80 text-center sm:text-left">
              <div>
                <span className="text-muted-foreground block text-[11px]">Order Reference:</span>
                <span className="font-mono font-bold text-foreground text-sm">{orderId}</span>
              </div>
              <div>
                <span className="text-muted-foreground block text-[11px]">Payment Status:</span>
                <span className="font-bold text-emerald-600">PAID (UPI)</span>
              </div>
              <div>
                <span className="text-muted-foreground block text-[11px]">Grand Total:</span>
                <span className="font-display font-bold text-foreground text-base">
                  ₹{Number(total).toLocaleString("en-IN")}
                </span>
              </div>
              <div>
                <span className="text-muted-foreground block text-[11px]">Est. Delivery:</span>
                <span className="font-bold text-[#997D4D]">3-5 Business Days</span>
              </div>
            </div>

            <div className="space-y-2 pt-1 text-muted-foreground">
              <div className="flex items-center gap-2 text-foreground font-semibold">
                <Truck size={16} className="text-[#C5A880]" />
                <span>Armored Courier Partner: BlueDart Apex Insured Transit</span>
              </div>
              <p>
                An OTP confirmation SMS and official hallmarking documentation will be dispatched to your phone when the courier is out for delivery.
              </p>
            </div>
          </div>

          {/* Action CTAs */}
          <div className="flex flex-col sm:flex-row items-center justify-center gap-3 pt-4">
            <Link
              to="/orders"
              className="w-full sm:w-auto px-6 py-3 bg-[#C5A880] hover:bg-[#B39366] text-white text-xs font-bold uppercase tracking-widest rounded-lg shadow flex items-center justify-center gap-2 transition-all"
            >
              <Truck size={14} />
              <span>Track Consignment</span>
            </Link>

            <button
              onClick={handleDownloadInvoice}
              className="w-full sm:w-auto px-6 py-3 border border-border hover:border-[#C5A880] text-foreground text-xs font-semibold uppercase tracking-wider rounded-lg flex items-center justify-center gap-2 transition-colors"
            >
              <Download size={14} />
              <span>Download Tax Invoice</span>
            </button>

            <Link
              to="/"
              className="w-full sm:w-auto px-6 py-3 border border-border text-foreground hover:bg-secondary text-xs font-semibold uppercase tracking-wider rounded-lg transition-colors text-center"
            >
              Back to Home
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default OrderConfirmation;
