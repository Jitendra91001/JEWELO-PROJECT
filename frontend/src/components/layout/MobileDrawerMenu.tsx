import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import {
  X,
  Search,
  ChevronDown,
  ChevronRight,
  Heart,
  ShoppingBag,
  User,
  Phone,
  MessageSquare,
  MapPin,
  Truck,
  Sparkles,
  LogOut,
  ShieldAlert,
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { NAVIGATION_CATEGORIES } from "./NavigationData";
import { useAppSelector, useAppDispatch } from "@/store/hooks";
import { logout } from "@/store/authSlice";

interface MobileDrawerMenuProps {
  isOpen: boolean;
  onClose: () => void;
  onOpenSearch: () => void;
  cartCount: number;
  wishlistCount: number;
}

export const MobileDrawerMenu: React.FC<MobileDrawerMenuProps> = ({
  isOpen,
  onClose,
  onOpenSearch,
  cartCount,
  wishlistCount,
}) => {
  const [expandedCategory, setExpandedCategory] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState("");
  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  const { user, isAuthenticated } = useAppSelector((state) => state.auth);

  const toggleCategory = (id: string) => {
    setExpandedCategory((prev) => (prev === id ? null : id));
  };

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      navigate(`/products?search=${encodeURIComponent(searchQuery.trim())}`);
      setSearchQuery("");
      onClose();
    }
  };

  const handleLogout = () => {
    dispatch(logout());
    onClose();
    navigate("/");
  };

  const isAdminUser =
    user?.role === "ADMIN" ||
    user?.role === ("SUPER_ADMIN" as any) ||
    user?.role === ("MANAGER" as any);

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-50 overflow-hidden lg:hidden">
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/60 backdrop-blur-sm"
            onClick={onClose}
          />

          {/* Drawer Left Panel */}
          <div className="fixed inset-y-0 left-0 max-w-full flex pr-10 z-50">
            <motion.div
              initial={{ x: "-100%" }}
              animate={{ x: 0 }}
              exit={{ x: "-100%" }}
              transition={{ type: "spring", damping: 26, stiffness: 240 }}
              className="w-screen max-w-xs sm:max-w-sm bg-background border-r border-border flex flex-col shadow-2xl overflow-hidden"
            >
              {/* Header */}
              <div className="px-5 py-4 border-b border-border flex items-center justify-between bg-card/50">
                <Link to="/" onClick={onClose} className="flex items-center gap-2">
                  <div className="w-8 h-8 rounded-full bg-[#1A1816] flex items-center justify-center border border-[#C5A880]/50">
                    <Sparkles size={16} className="text-[#D4AF37]" />
                  </div>
                  <div>
                    <h2 className="font-display text-xl font-bold tracking-wider gold-text">
                      JEWELO
                    </h2>
                    <p className="text-[9px] uppercase tracking-widest text-[#997D4D]">
                      Haute Joaillerie
                    </p>
                  </div>
                </Link>

                <button
                  onClick={onClose}
                  className="p-1.5 rounded-md text-muted-foreground hover:text-foreground hover:bg-muted transition-colors"
                  aria-label="Close navigation"
                >
                  <X size={20} />
                </button>
              </div>

              {/* Mobile Search Bar */}
              <div className="p-3 border-b border-border bg-card/20">
                <form onSubmit={handleSearchSubmit} className="relative">
                  <input
                    type="text"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    placeholder="Search jewellery, solitaire..."
                    className="w-full bg-secondary/80 text-foreground placeholder:text-muted-foreground text-xs py-2 pl-9 pr-8 rounded-md border border-border focus:border-[#C5A880] outline-none"
                  />
                  <Search
                    size={15}
                    className="absolute left-2.5 top-1/2 -translate-y-1/2 text-muted-foreground"
                  />
                  {searchQuery && (
                    <button
                      type="button"
                      onClick={() => setSearchQuery("")}
                      className="absolute right-2.5 top-1/2 -translate-y-1/2 text-muted-foreground"
                    >
                      <X size={13} />
                    </button>
                  )}
                </form>
              </div>

              {/* Navigation Categories List */}
              <div className="flex-1 overflow-y-auto px-4 py-3 divide-y divide-border/60">
                <div className="space-y-0.5 pb-3">
                  {NAVIGATION_CATEGORIES.map((cat) => {
                    const isExpanded = expandedCategory === cat.id;
                    const hasSub = !!cat.subCategories?.length;

                    return (
                      <div key={cat.id} className="py-1">
                        <div className="flex items-center justify-between rounded-md hover:bg-muted/50 px-2 py-1.5 transition-colors">
                          <Link
                            to={cat.href}
                            onClick={onClose}
                            className={`flex-1 text-xs font-semibold uppercase tracking-wider ${
                              cat.isSpecial
                                ? "text-[#B8860B] font-bold"
                                : "text-foreground hover:text-[#997D4D]"
                            }`}
                          >
                            <span className="flex items-center gap-1.5">
                              {cat.name}
                              {cat.badge && (
                                <span
                                  className={`text-[9px] px-1.5 py-0.2 rounded font-bold uppercase tracking-wider ${
                                    cat.badge === "Sale"
                                      ? "bg-destructive/15 text-destructive"
                                      : "bg-[#C5A880]/20 text-[#997D4D]"
                                  }`}
                                >
                                  {cat.badge}
                                </span>
                              )}
                            </span>
                          </Link>

                          {hasSub && (
                            <button
                              onClick={() => toggleCategory(cat.id)}
                              className="p-1 text-muted-foreground hover:text-foreground transition-transform"
                              aria-label={`Toggle ${cat.name} subcategories`}
                            >
                              <ChevronDown
                                size={14}
                                className={`transition-transform duration-200 ${
                                  isExpanded ? "rotate-180 text-[#C5A880]" : ""
                                }`}
                              />
                            </button>
                          )}
                        </div>

                        {/* Subcategories Accordion */}
                        <AnimatePresence>
                          {hasSub && isExpanded && (
                            <motion.div
                              initial={{ height: 0, opacity: 0 }}
                              animate={{ height: "auto", opacity: 1 }}
                              exit={{ height: 0, opacity: 0 }}
                              transition={{ duration: 0.2 }}
                              className="overflow-hidden pl-3 pr-1 py-1 space-y-2 bg-secondary/30 rounded-md my-1"
                            >
                              {cat.subCategories?.map((group) => (
                                <div key={group.groupTitle} className="space-y-1">
                                  <p className="text-[10px] font-semibold uppercase tracking-widest text-[#997D4D] pt-1">
                                    {group.groupTitle}
                                  </p>
                                  <div className="space-y-1 pl-1">
                                    {group.items.map((sub) => (
                                      <Link
                                        key={sub.title}
                                        to={sub.href}
                                        onClick={onClose}
                                        className="block text-xs text-muted-foreground hover:text-foreground py-1 transition-colors"
                                      >
                                        {sub.title}
                                      </Link>
                                    ))}
                                  </div>
                                </div>
                              ))}
                              <Link
                                to={cat.href}
                                onClick={onClose}
                                className="block text-[11px] font-semibold text-[#C5A880] hover:underline pt-1 pb-1"
                              >
                                View all {cat.name} →
                              </Link>
                            </motion.div>
                          )}
                        </AnimatePresence>
                      </div>
                    );
                  })}
                </div>

                {/* Account & Service Links */}
                <div className="pt-3 pb-3 space-y-1">
                  <p className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground px-2 pb-1">
                    My Account
                  </p>

                  {isAuthenticated ? (
                    <>
                      <div className="px-2 py-1.5 text-xs text-foreground bg-secondary/40 rounded flex items-center justify-between">
                        <span className="font-medium truncate">
                          {user?.name || user?.email || "Valued Patron"}
                        </span>
                        <span className="text-[10px] px-1.5 py-0.5 rounded bg-[#C5A880]/20 text-[#997D4D] font-bold">
                          {user?.role || "CUSTOMER"}
                        </span>
                      </div>

                      <Link
                        to="/profile"
                        onClick={onClose}
                        className="flex items-center gap-2.5 px-2 py-1.5 text-xs text-muted-foreground hover:text-foreground rounded transition-colors"
                      >
                        <User size={15} />
                        <span>My Profile</span>
                      </Link>

                      <Link
                        to="/orders"
                        onClick={onClose}
                        className="flex items-center gap-2.5 px-2 py-1.5 text-xs text-muted-foreground hover:text-foreground rounded transition-colors"
                      >
                        <Truck size={15} />
                        <span>My Orders</span>
                      </Link>

                      {isAdminUser && (
                        <Link
                          to="/admin"
                          onClick={onClose}
                          className="flex items-center gap-2.5 px-2 py-1.5 text-xs font-semibold text-[#B8860B] hover:text-[#997D4D] rounded transition-colors"
                        >
                          <ShieldAlert size={15} />
                          <span>Admin Control Panel</span>
                        </Link>
                      )}

                      <button
                        onClick={handleLogout}
                        className="w-full flex items-center gap-2.5 px-2 py-1.5 text-xs text-destructive hover:bg-destructive/10 rounded transition-colors"
                      >
                        <LogOut size={15} />
                        <span>Sign Out</span>
                      </button>
                    </>
                  ) : (
                    <div className="grid grid-cols-2 gap-2 p-1">
                      <Link
                        to="/login"
                        onClick={onClose}
                        className="py-2 text-center text-xs font-semibold bg-[#C5A880] text-white rounded transition-colors shadow"
                      >
                        Sign In
                      </Link>
                      <Link
                        to="/register"
                        onClick={onClose}
                        className="py-2 text-center text-xs font-semibold border border-border text-foreground rounded hover:border-[#C5A880] transition-colors"
                      >
                        Register
                      </Link>
                    </div>
                  )}
                </div>

                {/* Quick Assistance */}
                <div className="pt-3 pb-3 space-y-2">
                  <p className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground px-2">
                    Boutique Concierge
                  </p>

                  <a
                    href="tel:+918928519020"
                    className="flex items-center gap-2 px-2 py-1 text-xs text-muted-foreground hover:text-foreground transition-colors"
                  >
                    <Phone size={14} className="text-[#C5A880]" />
                    <span>+91 8928519020</span>
                  </a>

                  <a
                    href="https://wa.me/918928519020"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-2 px-2 py-1 text-xs text-emerald-600 hover:text-emerald-700 transition-colors"
                  >
                    <MessageSquare size={14} />
                    <span>Chat on WhatsApp</span>
                  </a>

                  <Link
                    to="/boutiques"
                    onClick={onClose}
                    className="flex items-center gap-2 px-2 py-1 text-xs text-muted-foreground hover:text-foreground transition-colors"
                  >
                    <MapPin size={14} className="text-[#C5A880]" />
                    <span>Store Locations</span>
                  </Link>
                </div>
              </div>

              {/* Footer quick action bar */}
              <div className="p-3 border-t border-border bg-card/60 grid grid-cols-2 gap-2 text-center">
                <Link
                  to="/wishlist"
                  onClick={onClose}
                  className="flex items-center justify-center gap-1.5 py-2 text-xs font-medium text-foreground bg-secondary/80 rounded hover:bg-secondary transition-colors"
                >
                  <Heart size={15} className="text-[#C5A880]" />
                  <span>Wishlist ({wishlistCount})</span>
                </Link>

                <Link
                  to="/cart"
                  onClick={onClose}
                  className="flex items-center justify-center gap-1.5 py-2 text-xs font-medium text-white bg-[#C5A880] rounded hover:bg-[#B39366] transition-colors shadow"
                >
                  <ShoppingBag size={15} />
                  <span>Bag ({cartCount})</span>
                </Link>
              </div>
            </motion.div>
          </div>
        </div>
      )}
    </AnimatePresence>
  );
};

export default MobileDrawerMenu;
