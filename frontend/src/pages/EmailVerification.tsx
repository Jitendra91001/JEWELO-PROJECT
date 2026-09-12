import React from "react";
import { Link, useSearchParams } from "react-router-dom";
import { CheckCircle2, Sparkles, ArrowRight, ShieldCheck } from "lucide-react";
import AuthLayout from "@/components/layout/AuthLayout";

export const EmailVerification: React.FC = () => {
  const [searchParams] = useSearchParams();
  const status = searchParams.get("status") || "success";

  return (
    <AuthLayout
      title="Patron Verification"
      subtitle="Your security credentials and contact channels have been authenticated."
    >
      <div className="text-center py-6 space-y-6">
        <div className="w-20 h-20 mx-auto rounded-full bg-emerald-100 dark:bg-emerald-950/50 text-emerald-600 flex items-center justify-center ring-8 ring-emerald-50 dark:ring-emerald-900/20">
          <CheckCircle2 size={40} />
        </div>

        <div className="space-y-2">
          <h3 className="font-display text-2xl font-bold text-foreground">
            Account Successfully Activated
          </h3>
          <p className="text-xs text-muted-foreground max-w-sm mx-auto font-body leading-relaxed">
            Welcome to the Jewelo Privé Circle. You now enjoy full access to bespoke appointments, insured order tracking, and private jewellery previews.
          </p>
        </div>

        <div className="p-4 bg-secondary/40 rounded-xl border border-border/80 text-left text-xs space-y-2">
          <span className="font-semibold text-foreground flex items-center gap-1.5">
            <Sparkles size={14} className="text-[#C5A880]" />
            <span>Activated Patron Privileges:</span>
          </span>
          <p className="text-muted-foreground">✓ Complimentary Pan-India Insured Transit</p>
          <p className="text-muted-foreground">✓ Digital Hallmarking Certificates & Invoices</p>
          <p className="text-muted-foreground">✓ 30-Day Doorstep Returns & Lifetime Buyback</p>
        </div>

        <div className="pt-2">
          <Link
            to="/profile"
            className="w-full py-3.5 bg-[#C5A880] hover:bg-[#B39366] text-white text-xs font-bold uppercase tracking-widest rounded-lg flex items-center justify-center gap-2 shadow-lg transition-all"
          >
            <span>Proceed to Patron Dashboard</span>
            <ArrowRight size={14} />
          </Link>
        </div>
      </div>
    </AuthLayout>
  );
};

export default EmailVerification;
