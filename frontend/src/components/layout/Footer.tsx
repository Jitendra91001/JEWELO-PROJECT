import React from "react";
import { Link } from "react-router-dom";
import {
  MapPin,
  Phone,
  Mail,
  Instagram,
  Facebook,
  Youtube,
  MessageSquare,
  ShieldCheck,
  Award,
  RotateCcw,
  Truck,
  Sparkles,
  Clock,
  ExternalLink,
} from "lucide-react";
import NewsletterSection from "./NewsletterSection";

// Pinterest custom icon SVG
const PinterestIcon = ({ size = 18 }: { size?: number }) => (
  <svg
    width={size}
    height={size}
    viewBox="0 0 24 24"
    fill="currentColor"
    stroke="none"
  >
    <path d="M12 0C5.373 0 0 5.372 0 12c0 5.084 3.163 9.426 7.627 11.174-.105-.949-.2-2.405.042-3.441.218-.937 1.407-5.965 1.407-5.965s-.359-.719-.359-1.782c0-1.668.967-2.914 2.171-2.914 1.023 0 1.518.769 1.518 1.69 0 1.029-.655 2.568-.994 3.995-.283 1.194.599 2.169 1.777 2.169 2.133 0 3.772-2.249 3.772-5.495 0-2.873-2.064-4.882-5.012-4.882-3.414 0-5.418 2.561-5.418 5.207 0 1.031.397 2.138.893 2.738.098.119.112.224.083.345-.09.375-.293 1.199-.334 1.365-.053.225-.177.271-.409.164-1.527-.711-2.481-2.943-2.481-4.736 0-3.857 2.803-7.4 8.086-7.4 4.246 0 7.546 3.025 7.546 7.07 0 4.218-2.66 7.614-6.353 7.614-1.241 0-2.408-.645-2.808-1.409l-.764 2.91c-.277 1.066-1.025 2.403-1.527 3.218C9.539 23.864 10.742 24 12 24c6.627 0 12-5.373 12-12 0-6.628-5.373-12-12-12z" />
  </svg>
);

export const Footer: React.FC = () => {
  return (
    <footer className="bg-[#121110] text-[#D8CFBF] border-t border-[#29241E] font-body">
      {/* 1. Newsletter Subscription Bar */}
      <NewsletterSection />

      {/* 2. Trust Badges Strip */}
      <div className="border-b border-[#29241E] bg-[#171513] py-8">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 text-center md:text-left">
            <div className="flex flex-col md:flex-row items-center gap-3">
              <div className="w-12 h-12 rounded-full bg-[#C5A880]/15 flex items-center justify-center text-[#D4AF37] flex-shrink-0">
                <Award size={22} />
              </div>
              <div>
                <h5 className="font-display font-bold text-sm text-[#F7F3EB]">
                  100% Certified Purity
                </h5>
                <p className="text-xs text-[#9E9484]">
                  BIS 916 Hallmarked Gold & IGI/GIA Natural Diamonds
                </p>
              </div>
            </div>

            <div className="flex flex-col md:flex-row items-center gap-3">
              <div className="w-12 h-12 rounded-full bg-[#C5A880]/15 flex items-center justify-center text-[#D4AF37] flex-shrink-0">
                <Truck size={22} />
              </div>
              <div>
                <h5 className="font-display font-bold text-sm text-[#F7F3EB]">
                  Free Insured Shipping
                </h5>
                <p className="text-xs text-[#9E9484]">
                  Complimentary tamper-proof door delivery on orders ₹25K+
                </p>
              </div>
            </div>

            <div className="flex flex-col md:flex-row items-center gap-3">
              <div className="w-12 h-12 rounded-full bg-[#C5A880]/15 flex items-center justify-center text-[#D4AF37] flex-shrink-0">
                <RotateCcw size={22} />
              </div>
              <div>
                <h5 className="font-display font-bold text-sm text-[#F7F3EB]">
                  Lifetime Exchange
                </h5>
                <p className="text-xs text-[#9E9484]">
                  30-Day returns & guaranteed lifetime buyback policy
                </p>
              </div>
            </div>

            <div className="flex flex-col md:flex-row items-center gap-3">
              <div className="w-12 h-12 rounded-full bg-[#C5A880]/15 flex items-center justify-center text-[#D4AF37] flex-shrink-0">
                <ShieldCheck size={22} />
              </div>
              <div>
                <h5 className="font-display font-bold text-sm text-[#F7F3EB]">
                  Secured Checkout
                </h5>
                <p className="text-xs text-[#9E9484]">
                  256-bit encrypted UPI, Cards, NetBanking & No-Cost EMI
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* 3. Main Footer Links Columns */}
      <div className="container mx-auto px-4 py-12 lg:py-16">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-8 lg:gap-10">
          {/* Column 1: Brand & Heritage */}
          <div className="lg:col-span-1 space-y-4">
            <Link to="/" className="inline-block">
              <h3 className="font-display text-2xl font-bold tracking-widest gold-text">
                JEWELO
              </h3>
              <span className="text-[9px] uppercase tracking-[0.25em] text-[#C5A880] font-semibold">
                Haute Joaillerie
              </span>
            </Link>

            <p className="text-xs text-[#9E9484] leading-relaxed">
              Curators and creators of timeless fine jewellery since 1990. Each creation unites ancient Indian goldsmithing traditions with contemporary architectural silhouette.
            </p>

            {/* Social Media Links */}
            <div className="pt-2">
              <p className="text-[11px] font-semibold uppercase tracking-wider text-[#C5A880] mb-2.5">
                Connect With Us
              </p>
              <div className="flex items-center gap-3 text-[#A89E8D]">
                <a
                  href="https://instagram.com"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-8 h-8 rounded-full bg-[#201D1A] flex items-center justify-center hover:text-[#D4AF37] hover:bg-[#2D2824] transition-all"
                  aria-label="Instagram"
                >
                  <Instagram size={15} />
                </a>
                <a
                  href="https://facebook.com"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-8 h-8 rounded-full bg-[#201D1A] flex items-center justify-center hover:text-[#D4AF37] hover:bg-[#2D2824] transition-all"
                  aria-label="Facebook"
                >
                  <Facebook size={15} />
                </a>
                <a
                  href="https://pinterest.com"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-8 h-8 rounded-full bg-[#201D1A] flex items-center justify-center hover:text-[#D4AF37] hover:bg-[#2D2824] transition-all"
                  aria-label="Pinterest"
                >
                  <PinterestIcon size={14} />
                </a>
                <a
                  href="https://youtube.com"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-8 h-8 rounded-full bg-[#201D1A] flex items-center justify-center hover:text-[#D4AF37] hover:bg-[#2D2824] transition-all"
                  aria-label="YouTube"
                >
                  <Youtube size={15} />
                </a>
                <a
                  href="https://wa.me/918928519020"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-8 h-8 rounded-full bg-[#201D1A] flex items-center justify-center hover:text-emerald-400 hover:bg-[#2D2824] transition-all"
                  aria-label="WhatsApp Concierge"
                >
                  <MessageSquare size={15} />
                </a>
              </div>
            </div>
          </div>

          {/* Column 2: Customer Service */}
          <div className="space-y-3">
            <h4 className="font-display font-semibold text-sm uppercase tracking-wider text-[#F7F3EB] pb-1 border-b border-[#29241E]">
              Customer Care
            </h4>
            <ul className="space-y-2 text-xs">
              <li>
                <Link to="/orders" className="text-[#9E9484] hover:text-[#D4AF37] transition-colors">
                  Track Your Consignment
                </Link>
              </li>
              <li>
                <Link to="/size-guide" className="text-[#9E9484] hover:text-[#D4AF37] transition-colors">
                  Ring & Bangle Size Guide
                </Link>
              </li>
              <li>
                <Link to="/care-guide" className="text-[#9E9484] hover:text-[#D4AF37] transition-colors">
                  Gold & Diamond Care Guide
                </Link>
              </li>
              <li>
                <Link to="/boutiques" className="text-[#9E9484] hover:text-[#D4AF37] transition-colors">
                  Book Virtual Video Consultation
                </Link>
              </li>
              <li>
                <Link to="/faqs" className="text-[#9E9484] hover:text-[#D4AF37] transition-colors">
                  Frequently Asked Questions
                </Link>
              </li>
              <li>
                <Link to="/custom-jewellery" className="text-[#9E9484] hover:text-[#D4AF37] transition-colors">
                  Bespoke Design Service
                </Link>
              </li>
            </ul>
          </div>

          {/* Column 3: Shipping & Returns */}
          <div className="space-y-3">
            <h4 className="font-display font-semibold text-sm uppercase tracking-wider text-[#F7F3EB] pb-1 border-b border-[#29241E]">
              Shipping & Returns
            </h4>
            <ul className="space-y-2 text-xs">
              <li>
                <Link to="/shipping-policy" className="text-[#9E9484] hover:text-[#D4AF37] transition-colors">
                  Domestic Insured Shipping
                </Link>
              </li>
              <li>
                <Link to="/international-shipping" className="text-[#9E9484] hover:text-[#D4AF37] transition-colors">
                  International Delivery (35+ Countries)
                </Link>
              </li>
              <li>
                <Link to="/returns-policy" className="text-[#9E9484] hover:text-[#D4AF37] transition-colors">
                  30-Day Return & Exchange Policy
                </Link>
              </li>
              <li>
                <Link to="/buyback-policy" className="text-[#9E9484] hover:text-[#D4AF37] transition-colors">
                  Lifetime Buyback Guarantee
                </Link>
              </li>
              <li>
                <Link to="/packaging" className="text-[#9E9484] hover:text-[#D4AF37] transition-colors">
                  Tamper-Evident Luxury Packaging
                </Link>
              </li>
              <li>
                <Link to="/certification" className="text-[#9E9484] hover:text-[#D4AF37] transition-colors">
                  BIS Hallmarking Verification
                </Link>
              </li>
            </ul>
          </div>

          {/* Column 4: Company & Legal */}
          <div className="space-y-3">
            <h4 className="font-display font-semibold text-sm uppercase tracking-wider text-[#F7F3EB] pb-1 border-b border-[#29241E]">
              About & Policies
            </h4>
            <ul className="space-y-2 text-xs">
              <li>
                <Link to="/about" className="text-[#9E9484] hover:text-[#D4AF37] transition-colors">
                  Our 35-Year Heritage
                </Link>
              </li>
              <li>
                <Link to="/ethical-sourcing" className="text-[#9E9484] hover:text-[#D4AF37] transition-colors">
                  Conflict-Free Diamond Promise
                </Link>
              </li>
              <li>
                <Link to="/privacy-policy" className="text-[#9E9484] hover:text-[#D4AF37] transition-colors">
                  Privacy & Data Protection Policy
                </Link>
              </li>
              <li>
                <Link to="/terms" className="text-[#9E9484] hover:text-[#D4AF37] transition-colors">
                  Terms of Service & Sales
                </Link>
              </li>
              <li>
                <Link to="/boutiques" className="text-[#9E9484] hover:text-[#D4AF37] transition-colors">
                  Flagship Store Directory
                </Link>
              </li>
              <li>
                <Link to="/careers" className="text-[#9E9484] hover:text-[#D4AF37] transition-colors">
                  Careers at Jewelo
                </Link>
              </li>
            </ul>
          </div>

          {/* Column 5: Contact Information */}
          <div className="space-y-3">
            <h4 className="font-display font-semibold text-sm uppercase tracking-wider text-[#F7F3EB] pb-1 border-b border-[#29241E]">
              Boutique Concierge
            </h4>
            <ul className="space-y-3 text-xs">
              <li className="flex items-start gap-2.5 text-[#9E9484]">
                <MapPin size={15} className="mt-0.5 text-[#C5A880] flex-shrink-0" />
                <span>
                  Boutique No. 04, Ground Floor, Grand Regal Tower, Bandra Kurla Complex (BKC), Mumbai, Maharashtra 400051
                </span>
              </li>

              <li className="flex items-center gap-2.5 text-[#9E9484]">
                <Phone size={15} className="text-[#C5A880] flex-shrink-0" />
                <a
                  href="tel:+918928519020"
                  className="hover:text-[#D4AF37] transition-colors"
                >
                  +91 8928519020
                </a>
              </li>

              <li className="flex items-center gap-2.5 text-[#9E9484]">
                <Mail size={15} className="text-[#C5A880] flex-shrink-0" />
                <a
                  href="mailto:concierge@jewelo.com"
                  className="hover:text-[#D4AF37] transition-colors"
                >
                  concierge@jewelo.com
                </a>
              </li>

              <li className="flex items-start gap-2.5 text-[#9E9484]">
                <Clock size={15} className="mt-0.5 text-[#C5A880] flex-shrink-0" />
                <div>
                  <p>Mon - Sun: 10:00 AM – 8:30 PM IST</p>
                  <p className="text-[10px] text-[#786E5F]">Boutique viewings by appointment</p>
                </div>
              </li>
            </ul>
          </div>
        </div>

        {/* 4. Payment Methods & Hallmarking Bar */}
        <div className="border-t border-[#29241E] mt-12 pt-8 flex flex-col md:flex-row items-center justify-between gap-6">
          {/* Payment Methods */}
          <div className="flex flex-wrap items-center justify-center md:justify-start gap-3">
            <span className="text-[11px] uppercase tracking-wider text-[#786E5F] font-semibold mr-1">
              Accepted Payments:
            </span>
            <span className="px-2.5 py-1 text-[11px] font-bold rounded bg-[#201D1A] border border-[#332D26] text-[#E0D8CA]">
              UPI
            </span>
            <span className="px-2.5 py-1 text-[11px] font-bold rounded bg-[#201D1A] border border-[#332D26] text-[#E0D8CA]">
              VISA
            </span>
            <span className="px-2.5 py-1 text-[11px] font-bold rounded bg-[#201D1A] border border-[#332D26] text-[#E0D8CA]">
              Mastercard
            </span>
            <span className="px-2.5 py-1 text-[11px] font-bold rounded bg-[#201D1A] border border-[#332D26] text-[#E0D8CA]">
              RuPay
            </span>
            <span className="px-2.5 py-1 text-[11px] font-bold rounded bg-[#201D1A] border border-[#332D26] text-[#E0D8CA]">
              Amex
            </span>
            <span className="px-2.5 py-1 text-[11px] font-bold rounded bg-[#201D1A] border border-[#332D26] text-[#E0D8CA]">
              NetBanking
            </span>
            <span className="px-2.5 py-1 text-[11px] font-bold rounded bg-[#201D1A] border border-[#332D26] text-[#D4AF37]">
              No-Cost EMI
            </span>
          </div>

          {/* Certifications */}
          <div className="flex items-center gap-3 text-[11px] text-[#9E9484]">
            <span className="inline-flex items-center gap-1">
              <Sparkles size={12} className="text-[#C5A880]" />
              <span>BIS Hallmarked 916</span>
            </span>
            <span>•</span>
            <span>IGI Certified</span>
            <span>•</span>
            <span>GIA Certified</span>
          </div>
        </div>

        {/* 5. Copyright Bar */}
        <div className="border-t border-[#201D1A] mt-8 pt-6 flex flex-col md:flex-row items-center justify-between gap-4 text-xs text-[#786E5F]">
          <p>© 2026 JEWELO Fine Jewellery Pvt. Ltd. All rights reserved.</p>

          <div className="flex flex-wrap items-center justify-center gap-5 text-xs">
            <Link to="/privacy-policy" className="hover:text-[#D4AF37] transition-colors">
              Privacy Policy
            </Link>
            <span>•</span>
            <Link to="/terms" className="hover:text-[#D4AF37] transition-colors">
              Terms of Sale
            </Link>
            <span>•</span>
            <Link to="/shipping-policy" className="hover:text-[#D4AF37] transition-colors">
              Shipping & Delivery
            </Link>
            <span>•</span>
            <Link to="/returns-policy" className="hover:text-[#D4AF37] transition-colors">
              Refund & Exchange
            </Link>
            <span>•</span>
            <Link to="/site-map" className="hover:text-[#D4AF37] transition-colors">
              Sitemap
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
