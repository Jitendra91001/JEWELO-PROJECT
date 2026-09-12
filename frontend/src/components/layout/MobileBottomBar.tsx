import React from "react";
import { Link, useLocation } from "react-router-dom";
import { Home, Compass, Heart, ShoppingBag, User } from "lucide-react";
import { useAppSelector } from "@/store/hooks";

export const MobileBottomBar: React.FC = () => {
  const location = useLocation();
  const cartState = useAppSelector((state) => state.cart);
  const wishlistState = useAppSelector((state) => state.wishlist);
  const isAuthenticated = useAppSelector((state) => state.auth.isAuthenticated);

  const cartCount = (cartState?.items || []).reduce(
    (sum, item) => sum + (item.quantity || 1),
    0
  );
  const wishlistCount = (wishlistState?.items || []).length;

  const pathname = location.pathname;

  const NAV_ITEMS = [
    {
      label: "Home",
      href: "/",
      icon: Home,
      isActive: pathname === "/",
    },
    {
      label: "Catalogue",
      href: "/products",
      icon: Compass,
      isActive: pathname.startsWith("/product"),
    },
    {
      label: "Wishlist",
      href: "/wishlist",
      icon: Heart,
      badge: wishlistCount,
      isActive: pathname === "/wishlist",
    },
    {
      label: "Bag",
      href: "/cart",
      icon: ShoppingBag,
      badge: cartCount,
      isActive: pathname === "/cart" || pathname === "/checkout",
    },
    {
      label: "Account",
      href: isAuthenticated ? "/profile" : "/login",
      icon: User,
      isActive: pathname === "/profile" || pathname === "/login" || pathname === "/register",
    },
  ];

  return (
    <div className="lg:hidden fixed bottom-0 left-0 right-0 z-40 bg-background/95 backdrop-blur-md border-t border-border shadow-lg px-2 py-1.5 safe-area-pb">
      <div className="grid grid-cols-5 items-center justify-items-center">
        {NAV_ITEMS.map((item) => {
          const Icon = item.icon;
          return (
            <Link
              key={item.label}
              to={item.href}
              className={`flex flex-col items-center justify-center py-1 px-2 rounded-lg transition-all relative ${
                item.isActive
                  ? "text-[#997D4D] font-bold"
                  : "text-muted-foreground hover:text-foreground"
              }`}
            >
              <div className="relative">
                <Icon size={19} />
                {Boolean(item.badge && item.badge > 0) && (
                  <span className="absolute -top-1.5 -right-2 bg-[#C5A880] text-white text-[9px] font-bold rounded-full min-w-3.5 h-3.5 px-0.5 flex items-center justify-center shadow">
                    {item.badge}
                  </span>
                )}
              </div>
              <span className="text-[10px] mt-1 font-body tracking-wider uppercase">
                {item.label}
              </span>
            </Link>
          );
        })}
      </div>
    </div>
  );
};

export default MobileBottomBar;
