import React, { useState, useEffect, useRef } from "react";
import { useNavigate, Link } from "react-router-dom";
import { Search, X, TrendingUp, Sparkles, ArrowRight, CornerDownLeft } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

interface SearchModalProps {
  isOpen: boolean;
  onClose: () => void;
}

// Mock popular search queries
const TRENDING_SEARCHES = [
  "Solitaire Diamond Ring",
  "22K Gold Temple Choker",
  "Tennis Bracelet 18K",
  "Kundan Jhumkas",
  "Men's Platinum Kada",
  "Rose Gold Solitaire Studs",
  "Emerald Eternity Band",
];

// Mock fast results for quick suggestion
const QUICK_MATCHES = [
  {
    id: "q1",
    name: "Celeste Solitaire Diamond Ring (1.20 ct)",
    category: "Rings",
    price: 145000,
    metal: "18K White Gold",
    image: "https://images.unsplash.com/photo-1605100804763-247f67b3557e?auto=format&fit=crop&w=200&q=80",
  },
  {
    id: "q2",
    name: "Royal Peacock 22K Temple Gold Choker",
    category: "Necklaces",
    price: 320000,
    metal: "22K Yellow Gold",
    image: "https://images.unsplash.com/photo-1599643477877-530eb83abc8e?auto=format&fit=crop&w=200&q=80",
  },
  {
    id: "q3",
    name: "Luminescence Diamond Tennis Bracelet",
    category: "Bracelets",
    price: 215000,
    metal: "18K Rose Gold",
    image: "https://images.unsplash.com/photo-1611591475829-063991207604?auto=format&fit=crop&w=200&q=80",
  },
  {
    id: "q4",
    name: "Heirloom Polki Chandbali Earrings",
    category: "Earrings",
    price: 185000,
    metal: "22K Gold & Polki",
    image: "https://images.unsplash.com/photo-1630019852942-f89202989a59?auto=format&fit=crop&w=200&q=80",
  },
];

export const SearchModal: React.FC<SearchModalProps> = ({ isOpen, onClose }) => {
  const [query, setQuery] = useState("");
  const inputRef = useRef<HTMLInputElement>(null);
  const navigate = useNavigate();

  useEffect(() => {
    if (isOpen) {
      setTimeout(() => inputRef.current?.focus(), 100);
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
      setQuery("");
    }
    return () => {
      document.body.style.overflow = "";
    };
  }, [isOpen]);

  // Keyboard shortcut: Escape to close
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape" && isOpen) {
        onClose();
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isOpen, onClose]);

  const handleSearchSubmit = (searchWord: string) => {
    const term = searchWord.trim();
    if (term) {
      navigate(`/products?search=${encodeURIComponent(term)}`);
      onClose();
    }
  };

  const filteredMatches = query.trim()
    ? QUICK_MATCHES.filter(
        (m) =>
          m.name.toLowerCase().includes(query.toLowerCase()) ||
          m.category.toLowerCase().includes(query.toLowerCase()) ||
          m.metal.toLowerCase().includes(query.toLowerCase())
      )
    : QUICK_MATCHES;

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-50 flex flex-col justify-start">
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="fixed inset-0 bg-black/70 backdrop-blur-sm"
            onClick={onClose}
          />

          {/* Search Container */}
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.25, ease: "easeOut" }}
            className="relative w-full max-w-4xl mx-auto mt-6 sm:mt-16 px-4 z-50"
          >
            <div className="bg-background border border-[#D4AF37]/30 rounded-xl shadow-2xl overflow-hidden">
              {/* Header / Input Field */}
              <div className="flex items-center gap-3 px-5 py-4 border-b border-border bg-card/50">
                <Search size={22} className="text-[#C5A880] flex-shrink-0" />
                <form
                  onSubmit={(e) => {
                    e.preventDefault();
                    handleSearchSubmit(query);
                  }}
                  className="flex-1 flex items-center"
                >
                  <input
                    ref={inputRef}
                    type="text"
                    value={query}
                    onChange={(e) => setQuery(e.target.value)}
                    placeholder="Search gold necklaces, solitaire diamond rings, bangles..."
                    className="w-full bg-transparent text-base sm:text-lg font-body text-foreground placeholder:text-muted-foreground outline-none tracking-wide"
                  />
                </form>

                {query && (
                  <button
                    type="button"
                    onClick={() => setQuery("")}
                    className="p-1 text-muted-foreground hover:text-foreground transition-colors"
                  >
                    <X size={18} />
                  </button>
                )}

                <button
                  type="button"
                  onClick={onClose}
                  className="px-2.5 py-1 text-xs font-semibold uppercase tracking-wider bg-muted text-muted-foreground hover:text-foreground rounded transition-colors"
                >
                  ESC
                </button>
              </div>

              {/* Content Panel */}
              <div className="p-5 max-h-[70vh] overflow-y-auto space-y-6">
                {/* Trending Searches */}
                <div>
                  <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-widest text-[#C5A880] mb-3">
                    <TrendingUp size={14} />
                    <span>Trending Searches</span>
                  </div>
                  <div className="flex flex-wrap gap-2">
                    {TRENDING_SEARCHES.map((term) => (
                      <button
                        key={term}
                        onClick={() => handleSearchSubmit(term)}
                        className="px-3 py-1.5 text-xs font-body bg-secondary/80 hover:bg-[#C5A880]/15 text-foreground hover:text-[#997D4D] border border-border/80 hover:border-[#C5A880]/40 rounded-full transition-all flex items-center gap-1.5"
                      >
                        <Sparkles size={11} className="text-[#C5A880]" />
                        <span>{term}</span>
                      </button>
                    ))}
                  </div>
                </div>

                {/* Instant Results or Recommendations */}
                <div>
                  <div className="flex items-center justify-between text-xs font-semibold uppercase tracking-widest text-muted-foreground mb-3">
                    <span>{query.trim() ? "Matching Masterpieces" : "Curated Highlights"}</span>
                    {query.trim() && (
                      <button
                        onClick={() => handleSearchSubmit(query)}
                        className="text-[#997D4D] hover:underline flex items-center gap-1 normal-case font-medium text-xs"
                      >
                        View all for &quot;{query}&quot;
                        <ArrowRight size={13} />
                      </button>
                    )}
                  </div>

                  {filteredMatches.length > 0 ? (
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                      {filteredMatches.map((item) => (
                        <div
                          key={item.id}
                          onClick={() => {
                            navigate(`/product/${item.id}`);
                            onClose();
                          }}
                          className="group flex items-center gap-3 p-2.5 rounded-lg border border-border/60 hover:border-[#C5A880] bg-card hover:bg-[#C5A880]/5 cursor-pointer transition-all"
                        >
                          <img
                            src={item.image}
                            alt={item.name}
                            className="w-14 h-14 object-cover rounded-md border border-border flex-shrink-0"
                          />
                          <div className="flex-1 min-w-0">
                            <h4 className="text-sm font-display font-medium text-foreground truncate group-hover:text-[#997D4D] transition-colors">
                              {item.name}
                            </h4>
                            <p className="text-xs text-muted-foreground">{item.metal}</p>
                            <p className="text-xs font-semibold text-[#997D4D] mt-0.5">
                              ₹{item.price.toLocaleString("en-IN")}
                            </p>
                          </div>
                          <ArrowRight
                            size={16}
                            className="text-muted-foreground group-hover:text-[#997D4D] group-hover:translate-x-1 transition-all mr-2"
                          />
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div className="text-center py-8 text-muted-foreground">
                      <p className="text-sm">No items found matching &quot;{query}&quot;</p>
                      <button
                        onClick={() => handleSearchSubmit(query)}
                        className="mt-3 text-xs font-medium text-[#997D4D] underline hover:text-[#C5A880]"
                      >
                        Search all products for &quot;{query}&quot;
                      </button>
                    </div>
                  )}
                </div>

                {/* Footer hint */}
                <div className="pt-3 border-t border-border/60 flex items-center justify-between text-xs text-muted-foreground">
                  <span className="flex items-center gap-1.5">
                    <CornerDownLeft size={13} />
                    <span>Press Enter to search entire catalogue</span>
                  </span>
                  <Link
                    to="/products"
                    onClick={onClose}
                    className="text-[#997D4D] hover:underline font-medium"
                  >
                    Browse all collections →
                  </Link>
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
};

export default SearchModal;
