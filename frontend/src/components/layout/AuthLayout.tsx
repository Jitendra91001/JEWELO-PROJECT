import React from "react";
import { Link } from "react-router-dom";
import { Sparkles, ShieldCheck } from "lucide-react";

interface AuthLayoutProps {
  title: string;
  subtitle: string;
  children: React.ReactNode;
}

export const AuthLayout: React.FC<AuthLayoutProps> = ({ title, subtitle, children }) => {
  return (
    <div className="min-h-[85vh] flex items-center justify-center py-12 px-4 bg-background font-body">
      <div className="w-full max-w-5xl grid grid-cols-1 lg:grid-cols-12 rounded-3xl overflow-hidden border border-border shadow-2xl bg-card">
        {/* Left: Luxury Editorial Imagery */}
        <div className="hidden lg:flex lg:col-span-5 relative bg-[#181614] text-white flex-col justify-between p-10">
          <div className="absolute inset-0 z-0">
            <img
              src="https://images.unsplash.com/photo-1599643477877-530eb83abc8e?auto=format&fit=crop&w=1000&q=80"
              alt="Jewelo Haute Joaillerie"
              className="w-full h-full object-cover brightness-[0.45]"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black via-black/40 to-transparent" />
          </div>

          <div className="relative z-10">
            <Link to="/" className="inline-flex items-center gap-2">
              <div className="w-7 h-7 rounded-full bg-[#C5A880] flex items-center justify-center text-white">
                <Sparkles size={14} />
              </div>
              <h2 className="font-display text-2xl font-bold tracking-widest text-[#FDFBF7]">
                JEWELO
              </h2>
            </Link>
          </div>

          <div className="relative z-10 space-y-3">
            <span className="text-[10px] font-bold uppercase tracking-[0.25em] text-[#D4AF37]">
              The Patron Experience
            </span>
            <h3 className="font-display text-2xl font-bold text-white leading-snug">
              Step Into The Sanctum of Indian Haute Joaillerie.
            </h3>
            <p className="text-xs text-white/70 font-light leading-relaxed">
              Sign in to manage your bespoke bridal appointments, track insured shipments, and access private jewellery vaults.
            </p>
            <div className="pt-2 flex items-center gap-2 text-[11px] text-[#D4AF37]">
              <ShieldCheck size={14} />
              <span>100% Certified 22K Hallmarked & IGI Diamonds</span>
            </div>
          </div>
        </div>

        {/* Right: Form Area */}
        <div className="lg:col-span-7 p-8 sm:p-12 flex flex-col justify-center">
          <div className="max-w-md w-full mx-auto space-y-6">
            <div className="space-y-1 text-center sm:text-left">
              <h2 className="font-display text-2xl sm:text-3xl font-bold text-foreground">
                {title}
              </h2>
              <p className="text-xs sm:text-sm text-muted-foreground">{subtitle}</p>
            </div>

            {children}
          </div>
        </div>
      </div>
    </div>
  );
};

export default AuthLayout;
