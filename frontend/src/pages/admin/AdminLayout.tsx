import { Link, Outlet, useLocation, useNavigate } from "react-router-dom";
import { LayoutDashboard, Package, Layers, ShoppingCart, Users, Tag, Settings, LogOut, BarChart3, Menu, X } from "lucide-react";
import { useState } from "react";
import { useAppSelector, useAppDispatch } from "@/store/hooks";
import { logout } from "@/store/authSlice";

const navItems = [
  { icon: LayoutDashboard, label: "Dashboard", path: "/admin" },
  { icon: Package, label: "Products", path: "/admin/products" },
  { icon: Layers, label: "Categories", path: "/admin/categories" },
  { icon: ShoppingCart, label: "Orders", path: "/admin/orders" },
  { icon: Users, label: "Users", path: "/admin/users" },
  { icon: Tag, label: "Coupons", path: "/admin/coupons" },
  { icon: BarChart3, label: "Reports", path: "/admin/reports" },
  { icon: Settings, label: "Settings", path: "/admin/settings" },
];

const AdminLayout = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const { user } = useAppSelector((s) => s.auth);

  const handleLogout = () => {
    dispatch(logout());
    navigate("/login");
  };

  return (
    <div className="min-h-screen bg-background flex">
      {/* Sidebar */}
      <aside className={`fixed inset-y-0 left-0 z-50 w-64 bg-card border-r border-border transform transition-transform duration-300 lg:relative lg:translate-x-0 ${sidebarOpen ? "translate-x-0" : "-translate-x-full"}`}>
        <div className="flex items-center justify-between h-16 px-6 border-b border-border">
          <Link to="/admin" className="font-display text-xl font-bold gold-text">JEWELO Admin</Link>
          <button onClick={() => setSidebarOpen(false)} className="lg:hidden text-foreground"><X size={20} /></button>
        </div>

        <nav className="p-4 space-y-1">
          {navItems.map(({ icon: Icon, label, path }) => {
            const active = location.pathname === path;
            return (
              <Link
                key={path}
                to={path}
                onClick={() => setSidebarOpen(false)}
                className={`flex items-center gap-3 px-3 py-2.5 rounded-sm text-sm font-body font-medium transition-colors ${active ? "gold-gradient text-primary-foreground" : "text-foreground/70 hover:bg-secondary hover:text-foreground"}`}
              >
                <Icon size={18} />
                {label}
              </Link>
            );
          })}
        </nav>

        <div className="absolute bottom-0 left-0 right-0 p-4 border-t border-border">
          <div className="flex items-center gap-3 px-3 py-2 mb-2">
            <div className="w-8 h-8 rounded-full gold-gradient flex items-center justify-center">
              <span className="text-primary-foreground text-xs font-bold">{user?.name?.charAt(0)?.toUpperCase() || "A"}</span>
            </div>
            <div>
              <p className="text-sm font-body font-semibold text-foreground">{user?.name || "Admin"}</p>
              <p className="text-[10px] text-muted-foreground font-body">Administrator</p>
            </div>
          </div>
          <button onClick={handleLogout}
            className="flex items-center gap-2 w-full px-3 py-2 text-sm font-body text-destructive hover:bg-destructive/5 rounded-sm transition-colors">
            <LogOut size={16} /> Sign Out
          </button>
        </div>
      </aside>

      {/* Overlay */}
      {sidebarOpen && <div className="fixed inset-0 bg-foreground/50 z-40 lg:hidden" onClick={() => setSidebarOpen(false)} />}

      {/* Main */}
      <div className="flex-1 flex flex-col min-w-0">
        <header className="h-16 border-b border-border flex items-center justify-between px-4 lg:px-6 bg-card">
          <button onClick={() => setSidebarOpen(true)} className="lg:hidden text-foreground"><Menu size={20} /></button>
          <div />
          <Link to="/" className="text-sm font-body text-primary hover:underline">View Store →</Link>
        </header>
        <main className="flex-1 p-4 lg:p-6 overflow-auto">
          <Outlet />
        </main>
      </div>
    </div>
  );
};

export default AdminLayout;
