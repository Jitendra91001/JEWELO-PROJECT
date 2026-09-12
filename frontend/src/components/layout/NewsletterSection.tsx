import React, { useState } from "react";
import { Mail, Sparkles, Check, ArrowRight } from "lucide-react";
import { toast } from "sonner";

export const NewsletterSection: React.FC = () => {
  const [email, setEmail] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubscribed, setIsSubscribed] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!email.trim() || !email.includes("@")) {
      toast.error("Please provide a valid email address.");
      return;
    }

    setIsSubmitting(true);
    // Simulate immediate response (no backend call needed per requirements)
    setTimeout(() => {
      setIsSubmitting(false);
      setIsSubscribed(true);
      toast.success("Welcome to Jewelo Privé. Check your inbox for your welcome invitation.");
      setEmail("");
    }, 600);
  };

  return (
    <div className="bg-gradient-to-b from-[#1C1A17] to-[#121110] border-b border-[#2D2822] text-[#EAE2D3] py-12 lg:py-16">
      <div className="container mx-auto px-4">
        <div className="max-w-3xl mx-auto text-center space-y-4">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#C5A880]/15 border border-[#C5A880]/30 text-[#D4AF37] text-xs font-semibold uppercase tracking-widest">
            <Sparkles size={13} />
            <span>The Jewelo Privé Circle</span>
          </div>

          <h3 className="font-display text-2xl lg:text-4xl font-bold tracking-wide text-[#FBF8F2]">
            Enter a World of Rare Brilliance
          </h3>

          <p className="text-xs sm:text-sm text-[#B8AF9E] font-body max-w-xl mx-auto leading-relaxed">
            Subscribe to receive private invitations to high-jewellery showcases, curated previews of new solitaires, and bespoke festive privileges.
          </p>

          <form onSubmit={handleSubmit} className="pt-2 max-w-md mx-auto">
            {isSubscribed ? (
              <div className="flex items-center justify-center gap-2 p-3 rounded-lg bg-emerald-950/40 border border-emerald-500/40 text-emerald-300 text-xs font-medium">
                <Check size={16} />
                <span>You are on the VIP guestlist. Thank you!</span>
              </div>
            ) : (
              <div className="flex flex-col sm:flex-row gap-2">
                <div className="relative flex-1">
                  <Mail
                    size={16}
                    className="absolute left-3.5 top-1/2 -translate-y-1/2 text-[#8C8273]"
                  />
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="Enter your personal email address"
                    className="w-full bg-[#25221E] border border-[#3D352B] focus:border-[#C5A880] text-xs text-white placeholder:text-[#8C8273] pl-10 pr-4 py-3 rounded-lg outline-none transition-colors"
                    required
                  />
                </div>
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="px-6 py-3 bg-[#C5A880] hover:bg-[#B39366] disabled:opacity-50 text-white text-xs font-bold uppercase tracking-widest rounded-lg flex items-center justify-center gap-1.5 transition-all shadow-lg flex-shrink-0"
                >
                  <span>{isSubmitting ? "Subscribing..." : "Subscribe"}</span>
                  <ArrowRight size={14} />
                </button>
              </div>
            )}
          </form>

          <div className="pt-4 flex flex-wrap items-center justify-center gap-x-6 gap-y-2 text-[11px] text-[#8C8273]">
            <span>✓ Bespoke Concierge Previews</span>
            <span>✓ Private Festive Invitations</span>
            <span>✓ No spam. Unsubscribe anytime</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default NewsletterSection;
