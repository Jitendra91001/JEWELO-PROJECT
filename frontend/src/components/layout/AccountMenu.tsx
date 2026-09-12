import React, { useState, useRef, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { User, LogOut, Package, Heart, Shield, Settings, Sparkles, ChevronRight } from "lucide-react";
import { useAppDispatch, useAppSelector } from "@/store/hooks";
import { logout } from "@/store/authSlice";
import { toast } from "sonner";

export const AccountMenu: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  const { user, isAuthenticated } = useAppSelector((state) => state.auth);

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) {
        setIsOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleLogout = () => {
    dispatch(logout());
    setIsOpen(false);
    toast.success("You have been securely signed out.");
    navigate("/");
  };

  const isAdminRole =
    user?.role === "ADMIN" ||
    user?.role === ("SUPER_ADMIN" as any) ||
    user?.role === ("MANAGER" as any) ||
    user?.role === ("STAFF" as any);

  return (
    <div className="relative" ref={dropdownRef}>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className={`p-2 rounded-full transition-all relative flex items-center justify-center ${
          isOpen
            ? "text-[#997D4D] bg-[#C5A880]/15"
            : "text-foreground/80 hover:text-[#997D4D] hover:bg-secondary/60"
        }`}
        aria-label="Account menu"
      >
        <User size={20} />
        {isAuthenticated && (
          <span className="absolute bottom-1 right-1 w-2 h-2 rounded-full bg-emerald-500 ring-2 ring-background" />
        )}
      </button>

      {isOpen && (
        <div className="absolute right-0 mt-2.5 w-64 bg-background border border-border rounded-xl shadow-2xl py-2 z-50 overflow-hidden animate-scale-in">
          {isAuthenticated ? (
            <div>
              {/* User info banner */}
              <div className="px-4 py-3 border-b border-border bg-card/50">
                <div className="flex items-center gap-2.5">
                  <div className="w-9 h-9 rounded-full bg-[#C5A880] text-white flex items-center justify-center font-display font-bold text-sm shadow">
                    {(user?.name || user?.email || "U").charAt(0).toUpperCase()}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-display font-semibold text-foreground truncate">
                      {user?.name || "Valued Patron"}
                    </p>
                    <p className="text-xs text-muted-foreground truncate">{user?.email}</p>
                    <span className="inline-block mt-0.5 text-[10px] font-bold uppercase tracking-wider px-1.5 py-0.2 rounded bg-[#C5A880]/20 text-[#997D4D]">
                      {user?.role || "CUSTOMER"}
                    </span>
                  </div>
                </div>
              </div>

              {/* Navigation links */}
              <div className="py-1">
                <Link
                  to="/profile"
                  onClick={() => setIsOpen(false)}
                  className="flex items-center gap-3 px-4 py-2 text-xs font-medium text-foreground hover:bg-[#C5A880]/10 hover:text-[#997D4D] transition-colors"
                >
                  <User size={15} className="text-[#C5A880]" />
                  <span>My Profile & Settings</span>
                </Link>

                <Link
                  to="/orders"
                  onClick={() => setIsOpen(false)}
                  className="flex items-center gap-3 px-4 py-2 text-xs font-medium text-foreground hover:bg-[#C5A880]/10 hover:text-[#997D4D] transition-colors"
                >
                  <Package size={15} className="text-[#C5A880]" />
                  <span>My Orders & Tracking</span>
                </Link>

                <Link
                  to="/wishlist"
                  onClick={() => setIsOpen(false)}
                  className="flex items-center gap-3 px-4 py-2 text-xs font-medium text-foreground hover:bg-[#C5A880]/10 hover:text-[#997D4D] transition-colors"
                >
                  <Heart size={15} className="text-[#C5A880]" />
                  <span>My Wishlist</span>
                </Link>

                {isAdminRole && (
                  <Link
                    to="/admin"
                    onClick={() => setIsOpen(false)}
                    className="flex items-center justify-between px-4 py-2 text-xs font-semibold text-[#B8860B] bg-[#B8860B]/10 hover:bg-[#B8860B]/20 transition-colors my-1"
                  >
                    <div className="flex items-center gap-3">
                      <Shield size={15} />
                      <span>Admin Control Panel</span>
                    </div>
                    <ChevronRight size={14} />
                  </Link>
                )}
              </div>

              {/* Sign out */}
              <div className="border-t border-border pt-1">
                <button
                  onClick={handleLogout}
                  className="w-full flex items-center gap-3 px-4 py-2 text-xs font-medium text-destructive hover:bg-destructive/10 transition-colors text-left"
                >
                  <LogOut size={15} />
                  <span>Sign Out</span>
                </button>
              </div>
            </div>
          ) : (
            <div className="p-4 space-y-3">
              <div className="text-center pb-2 border-b border-border">
                <Sparkles size={20} className="mx-auto text-[#C5A880] mb-1.5" />
                <h4 className="font-display font-bold text-sm text-foreground">
                  Welcome to Jewelo
                </h4>
                <p className="text-[11px] text-muted-foreground mt-0.5">
                  Sign in to access your bespoke wishlist, tracking & rewards.
                </p>
              </div>

              <div className="space-y-2">
                <button
                  onClick={() => {
                    navigate("/login");
                    setIsOpen(false);
                  }}
                  className="w-full py-2.5 bg-[#C5A880] hover:bg-[#B39366] text-white text-xs font-bold uppercase tracking-widest rounded shadow transition-all"
                >
                  Sign In
                </button>

                <button
                  onClick={() => {
                    navigate("/register");
                    setIsOpen(false);
                  }}
                  className="w-full py-2 border border-border hover:border-[#C5A880] text-foreground hover:text-[#997D4D] text-xs font-semibold uppercase tracking-wider rounded transition-colors"
                >
                  Create Account
                </button>
              </div>

              <div className="pt-2 border-t border-border space-y-1">
                <Link
                  to="/orders"
                  onClick={() => setIsOpen(false)}
                  className="block text-[11px] text-muted-foreground hover:text-foreground py-1 transition-colors"
                >
                  Track Existing Order
                </Link>
                <Link
                  to="/boutiques"
                  onClick={() => setIsOpen(false)}
                  className="block text-[11px] text-muted-foreground hover:text-foreground py-1 transition-colors"
                >
                  Boutique Appointments
                </Link>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default AccountMenu;
