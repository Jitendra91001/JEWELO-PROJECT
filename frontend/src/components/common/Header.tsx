import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Heart, ShoppingBag, User, Search, Menu, X, ChevronDown } from "lucide-react";
import { useAppSelector } from "@/store/hooks";
import { motion, AnimatePresence } from "framer-motion";

const categories = [
  { name: "Rings", path: "/products?category=rings" },
  { name: "Necklaces", path: "/products?category=necklaces" },
  { name: "Earrings", path: "/products?category=earrings" },
  { name: "Bangles", path: "/products?category=bangles" },
  { name: "Bracelets", path: "/products?category=bracelets" },
  { name: "Pendants", path: "/products?category=pendants" },
];

const Header = () => {
  const [mobileOpen, setMobileOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const cartItems = useAppSelector((s) => s.cart.items);
  const user = useAppSelector((s) => s.auth.user);
  const navigate = useNavigate();

  const cartCount = cartItems.reduce((sum, i) => sum + i.quantity, 0);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      navigate(`/products?search=${encodeURIComponent(searchQuery.trim())}`);
      setSearchOpen(false);
      setSearchQuery("");
    }
  };

  return (
    <header className="sticky top-0 z-50 bg-background/95 backdrop-blur-md border-b border-border">
      {/* Top bar */}
      <div className="bg-primary text-primary-foreground text-center py-1.5 text-xs tracking-widest font-body uppercase">
        Free Shipping on Orders Above ₹5,000 ✨
      </div>

      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-16 lg:h-20">
          {/* Mobile menu */}
          <button
            onClick={() => setMobileOpen(!mobileOpen)}
            className="lg:hidden p-2 text-foreground"
            aria-label="Toggle menu"
          >
            {mobileOpen ? <X size={22} /> : <Menu size={22} />}
          </button>

          {/* Logo */}
          <Link to="/" className="flex-shrink-0">
            <h1 className="font-display text-2xl lg:text-3xl font-bold tracking-wide gold-text">
              JEWELO
            </h1>
          </Link>

          {/* Desktop Nav */}
          <nav className="hidden lg:flex items-center gap-8">
            {categories.map((cat) => (
              <Link
                key={cat.name}
                to={cat.path}
                className="text-sm font-body font-medium tracking-wide uppercase text-foreground/80 hover:text-primary transition-colors"
              >
                {cat.name}
              </Link>
            ))}
          </nav>

          {/* Icons */}
          <div className="flex items-center gap-3">
            <button
              onClick={() => setSearchOpen(!searchOpen)}
              className="p-2 text-foreground/70 hover:text-primary transition-colors"
              aria-label="Search"
            >
              <Search size={20} />
            </button>

            <Link
              to="/wishlist"
              className="p-2 text-foreground/70 hover:text-primary transition-colors hidden sm:block"
              aria-label="Wishlist"
            >
              <Heart size={20} />
            </Link>

            <Link
              to={user ? "/profile" : "/login"}
              className="p-2 text-foreground/70 hover:text-primary transition-colors"
              aria-label="Account"
            >
              <User size={20} />
            </Link>

            <Link
              to="/cart"
              className="p-2 text-foreground/70 hover:text-primary transition-colors relative"
              aria-label="Cart"
            >
              <ShoppingBag size={20} />
              {cartCount > 0 && (
                <span className="absolute -top-0.5 -right-0.5 bg-primary text-primary-foreground text-[10px] font-bold rounded-full w-4 h-4 flex items-center justify-center">
                  {cartCount}
                </span>
              )}
            </Link>
          </div>
        </div>
      </div>

      {/* Search bar */}
      <AnimatePresence>
        {searchOpen && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            className="border-t border-border overflow-hidden"
          >
            <form onSubmit={handleSearch} className="container mx-auto px-4 py-3">
              <div className="flex items-center gap-3">
                <Search size={18} className="text-muted-foreground" />
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Search for rings, necklaces, earrings..."
                  className="flex-1 bg-transparent text-sm font-body outline-none text-foreground placeholder:text-muted-foreground"
                  autoFocus
                />
                <button type="button" onClick={() => setSearchOpen(false)} className="text-muted-foreground">
                  <X size={18} />
                </button>
              </div>
            </form>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Mobile menu */}
      <AnimatePresence>
        {mobileOpen && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            className="lg:hidden border-t border-border overflow-hidden bg-background"
          >
            <nav className="container mx-auto px-4 py-4 flex flex-col gap-3">
              {categories.map((cat) => (
                <Link
                  key={cat.name}
                  to={cat.path}
                  onClick={() => setMobileOpen(false)}
                  className="text-sm font-body font-medium tracking-wide uppercase text-foreground/80 hover:text-primary py-2 border-b border-border/50"
                >
                  {cat.name}
                </Link>
              ))}
              <Link
                to="/wishlist"
                onClick={() => setMobileOpen(false)}
                className="text-sm font-body font-medium tracking-wide uppercase text-foreground/80 hover:text-primary py-2"
              >
                Wishlist
              </Link>
            </nav>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
};

export default Header;
