import React, { lazy, Suspense } from 'react';
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Layout from "./components/common/Layout";
import ProtectedRoute from './authRoute/ProtectedRoute';
import { AuthProvider } from './authRoute/authContext';
import { PersistGate } from 'redux-persist/integration/react';
import { persistor, store } from './store';
import { ConfigProvider } from "antd";
import { antdLuxuryTheme } from "./theme/antdTheme";
import "antd/dist/reset.css";

// Customer Storefront & Auth Pages
const Home = lazy(() => import("./pages/Home"));
const Login = lazy(() => import("./pages/Login"));
const Register = lazy(() => import("./pages/Register"));
const ForgotPassword = lazy(() => import("./pages/ForgotPassword"));
const ResetPassword = lazy(() => import("./pages/ResetPassword"));
const OTPVerification = lazy(() => import("./pages/OTPVerification"));
const EmailVerification = lazy(() => import("./pages/EmailVerification"));
const ProductList = lazy(() => import("./pages/ProductList"));
const ProductDetails = lazy(() => import("./pages/ProductDetails"));
const SearchResults = lazy(() => import("./pages/SearchResults"));
const Cart = lazy(() => import("./pages/Cart"));
const Checkout = lazy(() => import("./pages/Checkout"));
const OrderConfirmation = lazy(() => import("./pages/OrderConfirmation"));
const Payment = lazy(() => import("./pages/Payment"));
const Profile = lazy(() => import("./pages/Profile"));
const Orders = lazy(() => import("./pages/Orders"));
const Wishlist = lazy(() => import("./pages/Wishlist"));
const Unauthorized = lazy(() => import("./pages/Unauthorized"));
const NotFound = lazy(() => import("./pages/NotFound"));

// Admin Management Pages
const AdminLayout = lazy(() => import("./pages/admin/AdminLayout"));
const Dashboard = lazy(() => import("./pages/admin/Dashboard"));
const AdminProducts = lazy(() => import("./pages/admin/AdminProducts"));
const AdminCategories = lazy(() => import("./pages/admin/AdminCategories"));
const AdminCollections = lazy(() => import("./pages/admin/AdminCollections"));
const AdminInventory = lazy(() => import("./pages/admin/AdminInventory"));
const AdminOrders = lazy(() => import("./pages/admin/AdminOrders"));
const AdminCustomers = lazy(() => import("./pages/admin/AdminCustomers"));
const AdminUsers = lazy(() => import("./pages/admin/AdminUsers"));
const AdminRoles = lazy(() => import("./pages/admin/AdminRoles"));
const AdminCoupons = lazy(() => import("./pages/admin/AdminCoupons"));
const AdminBanners = lazy(() => import("./pages/admin/AdminBanners"));
const AdminReviews = lazy(() => import("./pages/admin/AdminReviews"));
const AdminReports = lazy(() => import("./pages/admin/AdminReports"));
const AdminSettings = lazy(() => import("./pages/admin/AdminSettings"));
const AdminDesignSystem = lazy(() => import("./pages/admin/AdminDesignSystem"));

const queryClient = new QueryClient();

const Loader = () => (
  <div className="min-h-screen flex items-center justify-center bg-white text-sm text-slate-700 font-body">
    <div className="flex flex-col items-center gap-3">
      <div className="w-10 h-10 rounded-full border-2 border-[#C5A880] border-t-transparent animate-spin" />
      <span className="font-display font-bold text-foreground tracking-widest text-xs uppercase">
        Loading JEWELO...
      </span>
    </div>
  </div>
);

const App: React.FC = () => (
  <ConfigProvider theme={antdLuxuryTheme}>
    <AuthProvider>
      <QueryClientProvider client={queryClient}>
        <TooltipProvider>
          <Toaster />
          <Sonner position="top-right" richColors />
          <PersistGate loading={null} persistor={persistor}>
            <BrowserRouter>
              <Suspense fallback={<Loader />}>
                <Routes>
                  {/* Storefront Layout */}
                  <Route element={<Layout />}>
                    <Route path="/" element={<Home />} />
                    <Route path="/login" element={<Login />} />
                    <Route path="/register" element={<Register />} />
                    <Route path="/forgot-password" element={<ForgotPassword />} />
                    <Route path="/reset-password" element={<ResetPassword />} />
                    <Route path="/verify-otp" element={<OTPVerification />} />
                    <Route path="/email-verification" element={<EmailVerification />} />
                    <Route path="/products" element={<ProductList />} />
                    <Route path="/product/:id" element={<ProductDetails />} />
                    <Route path="/search" element={<SearchResults />} />
                    <Route path="/cart" element={<Cart />} />
                    <Route path="/checkout" element={<Checkout />} />
                    <Route path="/order-confirmation" element={<OrderConfirmation />} />
                    <Route path="/payment/:orderId" element={<Payment />} />
                    <Route path="/profile" element={<Profile />} />
                    <Route path="/orders" element={<Orders />} />
                    <Route path="/wishlist" element={<Wishlist />} />
                    <Route path="/unauthorized" element={<Unauthorized />} />
                  </Route>

                  {/* Protected Admin Routes */}
                  <Route element={<ProtectedRoute />}>
                    <Route path="/admin" element={<AdminLayout />}>
                      <Route index element={<Dashboard />} />
                      <Route path="products" element={<AdminProducts />} />
                      <Route path="categories" element={<AdminCategories />} />
                      <Route path="collections" element={<AdminCollections />} />
                      <Route path="inventory" element={<AdminInventory />} />
                      <Route path="orders" element={<AdminOrders />} />
                      <Route path="customers" element={<AdminCustomers />} />
                      <Route path="users" element={<AdminUsers />} />
                      <Route path="roles" element={<AdminRoles />} />
                      <Route path="coupons" element={<AdminCoupons />} />
                      <Route path="banners" element={<AdminBanners />} />
                      <Route path="reviews" element={<AdminReviews />} />
                      <Route path="reports" element={<AdminReports />} />
                      <Route path="settings" element={<AdminSettings />} />
                      <Route path="design-system" element={<AdminDesignSystem />} />
                    </Route>
                  </Route>

                  {/* Catch-all route */}
                  <Route path="*" element={<NotFound />} />
                </Routes>
              </Suspense>
            </BrowserRouter>
          </PersistGate>
        </TooltipProvider>
      </QueryClientProvider>
    </AuthProvider>
  </ConfigProvider>
);


export default App;