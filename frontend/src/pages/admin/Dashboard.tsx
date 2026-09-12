import React, { useState, useEffect } from "react";
import {
  IndianRupee,
  ShoppingCart,
  Users,
  Package,
  Clock,
  AlertTriangle,
  RotateCcw,
  TrendingUp,
  ArrowUpRight,
  Filter,
  Eye,
} from "lucide-react";
import SEOHead from "@/components/common/SEOHead";
import { adminService } from "@/services/admin.service";
import { MOCK_ORDERS, MOCK_PRODUCTS, MOCK_INVENTORY } from "@/services/mockData";
import {
  AreaChart,
  Area,
  BarChart,
  Bar,
  PieChart,
  Pie,
  Cell,
  ResponsiveContainer,
  CartesianGrid,
  XAxis,
  YAxis,
  Tooltip,
} from "recharts";

const PIE_COLORS = ["#C5A880", "#997D4D", "#3B82F6", "#10B981", "#8B5CF6"];

export const Dashboard: React.FC = () => {
  const [range, setRange] = useState<"today" | "week" | "month" | "year">("month");
  const [stats, setStats] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadStats = async () => {
      setLoading(true);
      const res = await adminService.getDashboardStats(range);
      setStats(res);
      setLoading(false);
    };
    loadStats();
  }, [range]);

  if (loading || !stats) {
    return (
      <div className="py-20 text-center">
        <div className="w-10 h-10 border-4 border-[#C5A880] border-t-transparent rounded-full animate-spin mx-auto mb-3" />
        <p className="text-xs text-muted-foreground font-body">Aggregating real-time vault analytics...</p>
      </div>
    );
  }

  // 8 Dashboard Cards
  const cards = [
    { label: "Total Revenue", value: `₹${(stats.revenue || 4850000).toLocaleString("en-IN")}`, change: "+14.8%", icon: IndianRupee, color: "text-emerald-600" },
    { label: "Total Orders", value: stats.totalOrders || 284, change: "+8.2%", icon: ShoppingCart, color: "text-blue-600" },
    { label: "Total Customers", value: (stats.totalCustomers || 1420).toLocaleString("en-IN"), change: "+12.5%", icon: Users, color: "text-purple-600" },
    { label: "Total Catalog Items", value: stats.totalProducts || MOCK_PRODUCTS.length, change: "Live", icon: Package, color: "text-[#C5A880]" },
    { label: "Pending Processing", value: stats.pendingOrders || 14, change: "Needs review", icon: Clock, color: "text-amber-600" },
    { label: "Low Stock Items", value: stats.lowStockCount || 2, change: "Critical", icon: AlertTriangle, color: "text-red-600" },
    { label: "Gross Sales (Month)", value: "₹52,40,000", change: "+16.2%", icon: TrendingUp, color: "text-emerald-600" },
    { label: "Return Requests", value: stats.returnsCount || 3, change: "Low 0.8%", icon: RotateCcw, color: "text-gray-500" },
  ];

  return (
    <div className="space-y-8 font-body">
      <SEOHead title="Admin Dashboard | JEWELO" description="Enterprise Jewellery Operations & Metrics." />

      {/* Header & Date Range Filter */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="font-display text-2xl sm:text-3xl font-bold tracking-tight text-foreground">
            Executive Operations Dashboard
          </h1>
          <p className="text-xs text-muted-foreground mt-1">
            Real-time bullion sales, orders, and vault inventory performance.
          </p>
        </div>

        {/* Date Filters */}
        <div className="flex items-center gap-1.5 p-1 rounded-xl bg-card border border-border shadow-sm">
          {[
            { id: "today", label: "Today" },
            { id: "week", label: "This Week" },
            { id: "month", label: "This Month" },
            { id: "year", label: "This Year" },
          ].map((f) => (
            <button
              key={f.id}
              onClick={() => setRange(f.id as any)}
              className={`px-3 py-1.5 text-xs font-semibold rounded-lg transition-all ${
                range === f.id
                  ? "bg-[#C5A880] text-white shadow-sm"
                  : "text-muted-foreground hover:text-foreground"
              }`}
            >
              {f.label}
            </button>
          ))}
        </div>
      </div>

      {/* 1. 8 STAT CARDS GRID */}
      <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
        {cards.map((c) => {
          const Icon = c.icon;
          return (
            <div
              key={c.label}
              className="p-5 rounded-2xl bg-card border border-border shadow-sm space-y-3 relative overflow-hidden"
            >
              <div className="flex items-center justify-between">
                <span className="text-xs text-muted-foreground font-semibold">{c.label}</span>
                <div className={`p-2 rounded-xl bg-secondary/80 ${c.color}`}>
                  <Icon size={18} />
                </div>
              </div>

              <div className="space-y-0.5">
                <span className="font-display font-bold text-xl sm:text-2xl text-foreground block">
                  {c.value}
                </span>
                <span className="text-[11px] font-semibold text-emerald-600 flex items-center gap-1">
                  <ArrowUpRight size={13} />
                  <span>{c.change}</span>
                </span>
              </div>
            </div>
          );
        })}
      </div>

      {/* 2. CHARTS ROW */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Revenue Overview Chart */}
        <div className="lg:col-span-8 p-6 rounded-2xl bg-card border border-border shadow-sm space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="font-display font-bold text-base text-foreground">Revenue & Order Trajectory</h3>
              <p className="text-xs text-muted-foreground">Historical vault revenue for {range}</p>
            </div>
            <span className="text-xs font-mono font-bold text-[#997D4D]">INR (₹)</span>
          </div>

          <div className="h-72 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={stats.revenueChart}>
                <defs>
                  <linearGradient id="goldGradient" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#C5A880" stopOpacity={0.4} />
                    <stop offset="95%" stopColor="#C5A880" stopOpacity={0.0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="#e5e0d8" opacity={0.3} />
                <XAxis dataKey="date" stroke="#888888" fontSize={11} tickLine={false} />
                <YAxis
                  stroke="#888888"
                  fontSize={11}
                  tickLine={false}
                  tickFormatter={(val) => `₹${val / 1000}k`}
                />
                <Tooltip
                  formatter={(value: any) => [`₹${Number(value).toLocaleString("en-IN")}`, "Revenue"]}
                />
                <Area
                  type="monotone"
                  dataKey="revenue"
                  stroke="#C5A880"
                  strokeWidth={2.5}
                  fillOpacity={1}
                  fill="url(#goldGradient)"
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Sales By Category Donut */}
        <div className="lg:col-span-4 p-6 rounded-2xl bg-card border border-border shadow-sm space-y-4 flex flex-col justify-between">
          <div>
            <h3 className="font-display font-bold text-base text-foreground">Sales by Category</h3>
            <p className="text-xs text-muted-foreground">Volume distribution percentage</p>
          </div>

          <div className="h-48 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={stats.salesByCategory}
                  cx="50%"
                  cy="50%"
                  innerRadius={50}
                  outerRadius={75}
                  paddingAngle={4}
                  dataKey="value"
                >
                  {stats.salesByCategory.map((_: any, index: number) => (
                    <Cell key={`cell-${index}`} fill={PIE_COLORS[index % PIE_COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip formatter={(value: any) => [`₹${Number(value).toLocaleString("en-IN")}`, "Sales"]} />
              </PieChart>
            </ResponsiveContainer>
          </div>

          <div className="space-y-1 text-xs">
            {stats.salesByCategory.map((cat: any, i: number) => (
              <div key={cat.name} className="flex items-center justify-between text-muted-foreground">
                <span className="flex items-center gap-2">
                  <span className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: PIE_COLORS[i] }} />
                  <span>{cat.name}</span>
                </span>
                <span className="font-semibold text-foreground">{cat.percentage}%</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* 3. TABLES ROW: RECENT ORDERS, BEST SELLERS & LOW STOCK */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Recent Orders Table */}
        <div className="lg:col-span-7 p-6 rounded-2xl bg-card border border-border shadow-sm space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="font-display font-bold text-base text-foreground">Recent Customer Orders</h3>
            <span className="text-xs font-semibold text-[#997D4D]">Live Feeds</span>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-xs text-left">
              <thead>
                <tr className="border-b border-border text-muted-foreground">
                  <th className="pb-3 font-semibold">Order ID</th>
                  <th className="pb-3 font-semibold">Client</th>
                  <th className="pb-3 font-semibold">Status</th>
                  <th className="pb-3 font-semibold text-right">Amount</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border/60">
                {MOCK_ORDERS.map((order) => (
                  <tr key={order.id} className="hover:bg-secondary/40">
                    <td className="py-3 font-mono font-bold">{order.orderNumber}</td>
                    <td className="py-3">{order.customer.name}</td>
                    <td className="py-3">
                      <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-blue-100 dark:bg-blue-950/40 text-blue-700">
                        {order.orderStatus}
                      </span>
                    </td>
                    <td className="py-3 text-right font-display font-bold text-[#997D4D]">
                      ₹{order.grandTotal.toLocaleString("en-IN")}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Low Stock Alerts Table */}
        <div className="lg:col-span-5 p-6 rounded-2xl bg-card border border-border shadow-sm space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="font-display font-bold text-base text-foreground">Critical Low Stock Alerts</h3>
            <span className="px-2 py-0.5 rounded bg-red-100 text-red-600 text-[10px] font-bold">Action Needed</span>
          </div>

          <div className="space-y-3 text-xs">
            {MOCK_INVENTORY.map((inv) => (
              <div
                key={inv.id}
                className="p-3 rounded-xl border border-border bg-secondary/30 flex items-center justify-between gap-3"
              >
                <img src={inv.image} alt={inv.productName} className="w-10 h-10 rounded-lg object-cover border" />
                <div className="flex-1 min-w-0">
                  <h5 className="font-bold truncate text-foreground">{inv.productName}</h5>
                  <p className="text-[10px] text-muted-foreground font-mono">{inv.sku}</p>
                </div>
                <div className="text-right">
                  <span className="font-bold text-red-600 block">{inv.currentStock} Units</span>
                  <span className="text-[10px] text-muted-foreground">Min {inv.threshold}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
