import React, { useState } from "react";
import { Link, Outlet, useLocation, useNavigate } from "react-router-dom";
import {
  LayoutDashboard,
  Package,
  Layers,
  Archive,
  ShoppingCart,
  Users,
  ShieldCheck,
  Tag,
  BarChart3,
  Settings,
  LogOut,
  Menu,
  X,
  Bell,
  Search,
  ChevronRight,
  Sun,
  Moon,
  ExternalLink,
  Sparkles,
  Sliders,
  Image,
  MessageSquare,
  ShieldAlert,
} from "lucide-react";
import { useAppSelector, useAppDispatch } from "@/store/hooks";
import { logout } from "@/store/authSlice";
import { useAcl } from "@/acl/useAcl";
import { PermissionAction } from "@/types/acl.types";
import { toast } from "sonner";

interface AdminNavItem {
  icon: any;
  label: string;
  path: string;
  permission?: PermissionAction;
  badge?: string;
}

const ADMIN_NAV_ITEMS: AdminNavItem[] = [
  { icon: LayoutDashboard, label: "Dashboard", path: "/admin" },
  { icon: Package, label: "Products", path: "/admin/products", permission: "product.view" },
  { icon: Layers, label: "Categories", path: "/admin/categories", permission: "category.view" },
  { icon: Sparkles, label: "Collections", path: "/admin/collections", permission: "category.view" },
  { icon: Archive, label: "Inventory", path: "/admin/inventory", permission: "inventory.view", badge: "Live" },
  { icon: ShoppingCart, label: "Orders", path: "/admin/orders", permission: "order.view" },
  { icon: Users, label: "Customers", path: "/admin/customers", permission: "customer.view" },
  { icon: Users, label: "Staff Users", path: "/admin/users", permission: "user.view" },
  { icon: ShieldCheck, label: "Roles & ACL", path: "/admin/roles", permission: "role.view" },
  { icon: Tag, label: "Coupons", path: "/admin/coupons", permission: "coupon.view" },
  { icon: Image, label: "CMS & Banners", path: "/admin/banners", permission: "cms.view" },
  { icon: MessageSquare, label: "Reviews", path: "/admin/reviews", permission: "reviews.view" },
  { icon: BarChart3, label: "Reports", path: "/admin/reports", permission: "reports.view" },
  { icon: Sparkles, label: "Design System", path: "/admin/design-system", badge: "20 UI" },
  { icon: Settings, label: "Settings", path: "/admin/settings" },
];

export const AdminLayout: React.FC = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  const { user } = useAppSelector((s) => s.auth);
  const { role, can, isRole } = useAcl();

  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [collapsed, setCollapsed] = useState(false);
  const [notificationsOpen, setNotificationsOpen] = useState(false);

  const handleLogout = () => {
    dispatch(logout());
    toast.success("Admin session terminated.");
    navigate("/login");
  };

  // Filter nav items based on user's granular permissions
  const accessibleNavItems = ADMIN_NAV_ITEMS.filter((item) => {
    if (!item.permission) return true;
    return can(item.permission);
  });

  const currentNavItem = ADMIN_NAV_ITEMS.find((i) => i.path === location.pathname);

  return (
    <div className="min-h-screen bg-background flex font-body text-foreground">
      {/* SIDEBAR */}
      <aside
        className={`fixed inset-y-0 left-0 z-50 bg-card border-r border-border transform transition-all duration-300 lg:relative lg:translate-x-0 flex flex-col justify-between ${
          sidebarOpen ? "translate-x-0" : "-translate-x-full"
        } ${collapsed ? "w-20" : "w-64"}`}
      >
        {/* Sidebar Header */}
        <div>
          <div className="flex items-center justify-between h-16 px-4 border-b border-border">
            {!collapsed && (
              <Link to="/admin" className="flex items-center gap-2">
                <div className="w-7 h-7 rounded-full bg-[#C5A880] text-white flex items-center justify-center font-bold">
                  J
                </div>
                <div>
                  <span className="font-display font-bold text-base gold-text tracking-wider block leading-none">
                    JEWELO
                  </span>
                  <span className="text-[9px] uppercase tracking-widest text-[#997D4D] font-bold">
                    Control Panel
                  </span>
                </div>
              </Link>
            )}

            {collapsed && (
              <div className="w-8 h-8 rounded-full bg-[#C5A880] text-white flex items-center justify-center font-bold mx-auto">
                J
              </div>
            )}

            <button
              onClick={() => setSidebarOpen(false)}
              className="lg:hidden text-muted-foreground hover:text-foreground"
            >
              <X size={20} />
            </button>
          </div>

          {/* Navigation Items List */}
          <nav className="p-3 space-y-1 overflow-y-auto max-h-[calc(100vh-140px)]">
            {accessibleNavItems.map((item) => {
              const Icon = item.icon;
              const isActive =
                item.path === "/admin"
                  ? location.pathname === "/admin"
                  : location.pathname.startsWith(item.path);

              return (
                <Link
                  key={item.path}
                  to={item.path}
                  onClick={() => setSidebarOpen(false)}
                  className={`flex items-center gap-3 px-3 py-2.5 rounded-xl text-xs font-semibold transition-all ${
                    isActive
                      ? "bg-[#C5A880] text-white shadow"
                      : "text-muted-foreground hover:text-foreground hover:bg-secondary/60"
                  } ${collapsed ? "justify-center px-2" : ""}`}
                  title={collapsed ? item.label : undefined}
                >
                  <Icon size={17} className={isActive ? "text-white" : "text-[#C5A880]"} />
                  {!collapsed && (
                    <div className="flex-1 flex items-center justify-between">
                      <span>{item.label}</span>
                      {item.badge && (
                        <span className="text-[9px] px-1.5 py-0.2 rounded-full bg-emerald-500/20 text-emerald-600 font-bold">
                          {item.badge}
                        </span>
                      )}
                    </div>
                  )}
                </Link>
              );
            })}
          </nav>
        </div>

        {/* Sidebar Footer User Card */}
        <div className="p-3 border-t border-border bg-secondary/20">
          {!collapsed ? (
            <div className="space-y-3">
              <div className="flex items-center gap-2.5 px-2">
                <div className="w-8 h-8 rounded-full bg-[#C5A880] text-white flex items-center justify-center font-bold text-xs">
                  {(user?.name || "A").charAt(0).toUpperCase()}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-xs font-bold text-foreground truncate">{user?.name || "Admin User"}</p>
                  <span className="text-[9px] px-1.5 py-0.2 rounded bg-[#C5A880]/20 text-[#997D4D] font-bold uppercase tracking-wider">
                    {role}
                  </span>
                </div>
              </div>

              <button
                onClick={handleLogout}
                className="w-full flex items-center gap-2 px-3 py-2 text-xs font-semibold text-destructive hover:bg-destructive/10 rounded-lg transition-colors"
              >
                <LogOut size={15} />
                <span>Sign Out</span>
              </button>
            </div>
          ) : (
            <button
              onClick={handleLogout}
              className="p-2 text-destructive hover:bg-destructive/10 rounded-lg mx-auto block"
              title="Sign Out"
            >
              <LogOut size={16} />
            </button>
          )}
        </div>
      </aside>

      {/* Mobile Overlay */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 bg-black/50 z-40 lg:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* MAIN ADMIN CONTENT WRAPPER */}
      <div className="flex-1 flex flex-col min-w-0">
        {/* Admin Header */}
        <header className="h-16 border-b border-border flex items-center justify-between px-4 lg:px-8 bg-card shadow-sm sticky top-0 z-30">
          <div className="flex items-center gap-3">
            <button
              onClick={() => setSidebarOpen(true)}
              className="lg:hidden p-2 text-foreground rounded-md hover:bg-secondary"
            >
              <Menu size={20} />
            </button>

            {/* Breadcrumb Header */}
            <div className="hidden sm:flex items-center gap-2 text-xs text-muted-foreground">
              <span className="font-semibold text-foreground">Admin</span>
              <ChevronRight size={13} />
              <span className="capitalize">{currentNavItem?.label || "Workspace"}</span>
            </div>
          </div>

          {/* Right Header Actions */}
          <div className="flex items-center gap-3">
            {/* Storefront preview shortcut */}
            <Link
              to="/"
              target="_blank"
              className="text-xs font-semibold text-[#997D4D] hover:underline hidden sm:flex items-center gap-1.5"
            >
              <span>View Storefront</span>
              <ExternalLink size={13} />
            </Link>

            {/* Notifications Dropdown Trigger */}
            <div className="relative">
              <button
                onClick={() => setNotificationsOpen(!notificationsOpen)}
                className="p-2 rounded-full text-foreground/80 hover:bg-secondary relative"
              >
                <Bell size={18} />
                <span className="absolute top-1 right-1 w-2 h-2 rounded-full bg-[#C5A880] ring-2 ring-background" />
              </button>

              {notificationsOpen && (
                <div className="absolute right-0 mt-2 w-80 bg-card border border-border rounded-xl shadow-2xl p-4 z-50 space-y-3 animate-scale-in text-xs">
                  <div className="flex justify-between items-center pb-2 border-b border-border">
                    <span className="font-bold text-foreground">System Alerts</span>
                    <span className="text-[10px] text-[#997D4D] font-semibold cursor-pointer">Mark all read</span>
                  </div>
                  <div className="space-y-2">
                    <div className="p-2 rounded bg-secondary/50 space-y-0.5">
                      <p className="font-bold text-foreground">New Order #JWL-2026-9041</p>
                      <p className="text-muted-foreground text-[11px]">₹1,85,400 received via UPI.</p>
                    </div>
                    <div className="p-2 rounded bg-secondary/50 space-y-0.5">
                      <p className="font-bold text-foreground">Low Stock Alert</p>
                      <p className="text-muted-foreground text-[11px]">Nizam Choker has 2 units remaining.</p>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        </header>

        {/* Dynamic Admin Page Outlet */}
        <main className="flex-1 p-4 lg:p-8 overflow-auto bg-background/50">
          <Outlet />
        </main>
      </div>
    </div>
  );
};

export default AdminLayout;
