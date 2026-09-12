import React, { useState } from "react";
import { Link } from "react-router-dom";
import { Search, Heart, ShoppingBag, Menu, Sparkles } from "lucide-react";
import { useAppSelector } from "@/store/hooks";
import TopAnnouncementBar from "./TopAnnouncementBar";
import DesktopNav from "./DesktopNav";
import SearchModal from "./SearchModal";
import MobileDrawerMenu from "./MobileDrawerMenu";
import MiniCartDrawer from "./MiniCartDrawer";
import AccountMenu from "./AccountMenu";

export const Header: React.FC = () => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [searchModalOpen, setSearchModalOpen] = useState(false);
  const [miniCartOpen, setMiniCartOpen] = useState(false);

  const cartState = useAppSelector((state) => state.cart);
  const wishlistState = useAppSelector((state) => state.wishlist);

  const cartCount = (cartState?.items || []).reduce(
    (sum, item) => sum + (item.quantity || 1),
    0
  );
  const wishlistCount = (wishlistState?.items || []).length;

  return (
    <>
      {/* Sticky Header Wrapper */}
      <header className="sticky top-0 z-40 w-full bg-background/95 backdrop-blur-md border-b border-border shadow-sm transition-all">
        {/* Top Announcement Bar */}
        <TopAnnouncementBar />

        {/* Main Header Bar */}
        <div className="container mx-auto px-4">
          <div className="flex items-center justify-between h-16 lg:h-20">
            {/* Left: Mobile Menu Trigger & Boutique Icon */}
            <div className="flex items-center gap-2 lg:hidden">
              <button
                onClick={() => setMobileMenuOpen(true)}
                className="p-2 -ml-2 text-foreground/80 hover:text-foreground rounded-md hover:bg-secondary/60 transition-colors"
                aria-label="Open mobile menu"
              >
                <Menu size={22} />
              </button>

              <button
                onClick={() => setSearchModalOpen(true)}
                className="p-2 text-foreground/80 hover:text-foreground rounded-md hover:bg-secondary/60 transition-colors"
                aria-label="Search"
              >
                <Search size={19} />
              </button>
            </div>

            {/* Left: Search Trigger on Desktop */}
            <div className="hidden lg:flex items-center">
              <button
                onClick={() => setSearchModalOpen(true)}
                className="flex items-center gap-3 px-3.5 py-2 rounded-full border border-border bg-secondary/40 hover:bg-secondary/80 hover:border-[#C5A880]/50 text-muted-foreground hover:text-foreground transition-all text-xs font-body w-60 xl:w-72"
              >
                <Search size={15} className="text-[#C5A880]" />
                <span className="truncate">Search fine jewellery, rings...</span>
                <kbd className="ml-auto text-[10px] uppercase font-mono px-1.5 py-0.5 rounded bg-background border border-border text-muted-foreground">
                  ⌘K
                </kbd>
              </button>
            </div>

            {/* Center: Brand Jewellery Logo */}
            <div className="flex-1 lg:flex-initial flex justify-center text-center">
              <Link to="/" className="group inline-flex flex-col items-center">
                <div className="flex items-center gap-2">
                  {/* Subtle Gold Monogram Icon */}
                  <div className="w-6 h-6 rounded-full bg-gradient-to-tr from-[#997D4D] via-[#C5A880] to-[#E6D5B8] flex items-center justify-center p-0.5 shadow-sm group-hover:scale-105 transition-transform">
                    <div className="w-full h-full rounded-full bg-[#1A1816] flex items-center justify-center">
                      <Sparkles size={11} className="text-[#D4AF37]" />
                    </div>
                  </div>
                  <h1 className="font-display text-2xl lg:text-3xl font-extrabold tracking-widest gold-text group-hover:opacity-90 transition-opacity">
                    JEWELO
                  </h1>
                </div>
                <span className="text-[8px] lg:text-[9px] font-body tracking-[0.3em] uppercase text-[#997D4D] font-semibold">
                  Haute Joaillerie • 1990
                </span>
              </Link>
            </div>

            {/* Right: Actions (Wishlist, Cart, Account) */}
            <div className="flex items-center gap-1 sm:gap-2">
              {/* Wishlist */}
              <Link
                to="/wishlist"
                className="p-2 rounded-full text-foreground/80 hover:text-[#997D4D] hover:bg-secondary/60 transition-colors relative"
                aria-label="Wishlist"
              >
                <Heart size={20} />
                {wishlistCount > 0 && (
                  <span className="absolute 0 top-0.5 right-0.5 bg-[#C5A880] text-white text-[10px] font-bold rounded-full min-w-4 h-4 px-1 flex items-center justify-center shadow">
                    {wishlistCount}
                  </span>
                )}
              </Link>

              {/* Shopping Bag / MiniCart */}
              <button
                onClick={() => setMiniCartOpen(true)}
                className="p-2 rounded-full text-foreground/80 hover:text-[#997D4D] hover:bg-secondary/60 transition-colors relative"
                aria-label="Shopping bag"
              >
                <ShoppingBag size={20} />
                {cartCount > 0 && (
                  <span className="absolute top-0.5 right-0.5 bg-[#C5A880] text-white text-[10px] font-bold rounded-full min-w-4 h-4 px-1 flex items-center justify-center shadow animate-pulse">
                    {cartCount}
                  </span>
                )}
              </button>

              {/* Account Dropdown */}
              <AccountMenu />
            </div>
          </div>
        </div>

        {/* Desktop Navigation Menu Bar */}
        <DesktopNav />
      </header>

      {/* Interactive Drawers & Modals */}
      <SearchModal
        isOpen={searchModalOpen}
        onClose={() => setSearchModalOpen(false)}
      />

      <MobileDrawerMenu
        isOpen={mobileMenuOpen}
        onClose={() => setMobileMenuOpen(false)}
        onOpenSearch={() => {
          setMobileMenuOpen(false);
          setSearchModalOpen(true);
        }}
        cartCount={cartCount}
        wishlistCount={wishlistCount}
      />

      <MiniCartDrawer
        isOpen={miniCartOpen}
        onClose={() => setMiniCartOpen(false)}
      />
    </>
  );
};

export default Header;
