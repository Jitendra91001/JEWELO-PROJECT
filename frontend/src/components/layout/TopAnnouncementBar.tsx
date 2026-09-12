import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { ChevronLeft, ChevronRight, MapPin, Truck, Phone, Sparkles } from "lucide-react";

const ANNOUNCEMENTS = [
  {
    id: 1,
    text: "✨ Complimentary Insured Express Delivery on Orders Above ₹25,000",
    linkText: "Shop New In",
    href: "/products?tag=new-arrivals",
  },
  {
    id: 2,
    text: "💎 100% BIS Hallmarked 22K/18K Gold & Certified Natural Diamonds",
    linkText: "Learn More",
    href: "/#certification",
  },
  {
    id: 3,
    text: "🎁 Festive Privé: Up to 25% Off Making Charges with Code JEWELO25",
    linkText: "Claim Offer",
    href: "/products?offer=special-offers",
  },
];

const CURRENCIES = [
  { code: "INR", symbol: "₹", label: "INR (₹)" },
  { code: "USD", symbol: "$", label: "USD ($)" },
  { code: "EUR", symbol: "€", label: "EUR (€)" },
  { code: "GBP", symbol: "£", label: "GBP (£)" },
  { code: "AED", symbol: "د.إ", label: "AED (AED)" },
];

export const TopAnnouncementBar: React.FC = () => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [selectedCurrency, setSelectedCurrency] = useState("INR");
  const [currencyOpen, setCurrencyOpen] = useState(false);

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % ANNOUNCEMENTS.length);
    }, 5000);
    return () => clearInterval(timer);
  }, []);

  const handlePrev = () => {
    setCurrentIndex((prev) => (prev === 0 ? ANNOUNCEMENTS.length - 1 : prev - 1));
  };

  const handleNext = () => {
    setCurrentIndex((prev) => (prev + 1) % ANNOUNCEMENTS.length);
  };

  const current = ANNOUNCEMENTS[currentIndex];

  return (
    <div className="bg-[#1A1816] text-[#E8DEC8] border-b border-[#2D2822] text-xs font-body tracking-wider transition-colors duration-300">
      <div className="container mx-auto px-4 py-2 flex items-center justify-between">
        {/* Left: Boutique & Concierge (Desktop) */}
        <div className="hidden lg:flex items-center gap-5 text-xs text-[#C2B7A3]">
          <Link
            to="/boutiques"
            className="flex items-center gap-1.5 hover:text-[#D4AF37] transition-colors"
          >
            <MapPin size={13} className="text-[#C5A880]" />
            <span>Flagship Boutiques</span>
          </Link>
          <span className="text-[#3F3931]">•</span>
          <a
            href="tel:+918928519020"
            className="flex items-center gap-1.5 hover:text-[#D4AF37] transition-colors"
          >
            <Phone size={13} className="text-[#C5A880]" />
            <span>Concierge: +91 8928519020</span>
          </a>
        </div>

        {/* Center: Rotating Announcements */}
        <div className="flex-1 flex items-center justify-center gap-2 max-w-2xl mx-auto px-2">
          <button
            onClick={handlePrev}
            className="p-1 text-[#8C8273] hover:text-[#E8DEC8] transition-colors"
            aria-label="Previous announcement"
          >
            <ChevronLeft size={13} />
          </button>

          <div className="text-center overflow-hidden h-4 flex items-center justify-center">
            <div
              key={current.id}
              className="animate-fade-in flex items-center gap-2 text-center truncate text-[11px] sm:text-xs font-medium text-[#F4EFE6]"
            >
              <span>{current.text}</span>
              <Link
                to={current.href}
                className="underline underline-offset-2 text-[#D4AF37] hover:text-[#E5C158] font-semibold hidden sm:inline"
              >
                {current.linkText}
              </Link>
            </div>
          </div>

          <button
            onClick={handleNext}
            className="p-1 text-[#8C8273] hover:text-[#E8DEC8] transition-colors"
            aria-label="Next announcement"
          >
            <ChevronRight size={13} />
          </button>
        </div>

        {/* Right: Track Order & Currency Selector */}
        <div className="hidden sm:flex items-center gap-4 text-xs text-[#C2B7A3]">
          <Link
            to="/orders"
            className="flex items-center gap-1.5 hover:text-[#D4AF37] transition-colors"
          >
            <Truck size={13} className="text-[#C5A880]" />
            <span>Track Order</span>
          </Link>

          {/* Currency Dropdown */}
          <div className="relative">
            <button
              onClick={() => setCurrencyOpen(!currencyOpen)}
              className="flex items-center gap-1 hover:text-[#D4AF37] transition-colors px-1 py-0.5 rounded"
            >
              <span className="font-semibold text-[#D4AF37]">{selectedCurrency}</span>
              <span className="text-[9px]">▼</span>
            </button>

            {currencyOpen && (
              <>
                <div
                  className="fixed inset-0 z-40"
                  onClick={() => setCurrencyOpen(false)}
                />
                <div className="absolute right-0 mt-1.5 w-28 bg-[#201D19] border border-[#3D352B] rounded shadow-xl py-1 z-50 text-left">
                  {CURRENCIES.map((curr) => (
                    <button
                      key={curr.code}
                      onClick={() => {
                        setSelectedCurrency(curr.code);
                        setCurrencyOpen(false);
                      }}
                      className={`w-full text-left px-3 py-1.5 text-xs transition-colors ${
                        selectedCurrency === curr.code
                          ? "bg-[#332D24] text-[#D4AF37] font-semibold"
                          : "text-[#D8CFBF] hover:bg-[#2A251F] hover:text-white"
                      }`}
                    >
                      {curr.label}
                    </button>
                  ))}
                </div>
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default TopAnnouncementBar;
