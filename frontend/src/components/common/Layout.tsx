import React, { useEffect } from "react";
import { Outlet, useLocation } from "react-router-dom";
import Header from "./Header";
import Footer from "./Footer";
import MobileBottomBar from "@/components/layout/MobileBottomBar";
import { useAppDispatch, useAppSelector } from "@/store/hooks";
import { getCart } from "@/store/cartThunk";

export const Layout: React.FC = () => {
  const dispatch = useAppDispatch();
  const location = useLocation();
  const isAuthenticated = useAppSelector((state) => state.auth.isAuthenticated);

  // Auto fetch cart on authentication
  useEffect(() => {
    if (isAuthenticated) {
      dispatch(getCart());
    }
  }, [dispatch, isAuthenticated]);

  // Scroll to top on route change
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  }, [location.pathname]);

  return (
    <div className="min-h-screen flex flex-col bg-background text-foreground selection:bg-[#C5A880]/30 selection:text-foreground">
      {/* Sticky Header with Announcement, Navigation, Search, Drawers */}
      <Header />

      {/* Main Content Area */}
      <main className="flex-1 w-full pb-16 lg:pb-0">
        <Outlet />
      </main>

      {/* Comprehensive Luxury Footer */}
      <Footer />

      {/* Responsive Mobile Bottom Navigation Bar */}
      <MobileBottomBar />
    </div>
  );
};

export default Layout;
