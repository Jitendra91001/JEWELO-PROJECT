import { useEffect } from "react";
import { useAppDispatch, useAppSelector } from "@/store/hooks";
import { IndianRupee, ShoppingCart, Users, Package, ArrowUpRight } from "lucide-react";
import SEOHead from "@/components/common/SEOHead";
import { CURRENCY } from "@/utils/constants";
import { getDashboardStats } from "@/store/admin/adminThunk";
import { RootState } from "@/store";
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
  Legend,
} from "recharts";

const statusColors: Record<string, string> = {
  PENDING: "bg-yellow-100 text-yellow-700",
  CONFIRMED: "bg-blue-100 text-blue-700",
  SHIPPED: "bg-sky-100 text-sky-700",
  DELIVERED: "bg-green-100 text-green-700",
  CANCELLED: "bg-red-100 text-red-700",
};

const chartColors = ["#4f46e5", "#0f766e", "#c2410c", "#1d4ed8", "#16a34a"];

const Dashboard = () => {
  const dispatch = useAppDispatch();
  const { dashboard, loading } = useAppSelector((state: RootState) => state.admin);

  useEffect(() => {
    dispatch(getDashboardStats());
  }, [dispatch]);

  if (loading) {
    return <div className="flex justify-center items-center h-64">Loading...</div>;
  }

  const stats = [
    {
      label: "Total Revenue",
      value: `${CURRENCY}${dashboard?.data?.totalRevenue?.toLocaleString() || 0}`,
      change: "+12.5%",
      icon: IndianRupee,
      color: "text-emerald-600",
    },
    {
      label: "Total Orders",
      value: dashboard?.data?.totalOrders?.toString() || "0",
      change: "+8.2%",
      icon: ShoppingCart,
      color: "text-sky-600",
    },
    {
      label: "Total Users",
      value: dashboard?.data?.totalUsers?.toString() || "0",
      change: "+15.3%",
      icon: Users,
      color: "text-violet-600",
    },
    {
      label: "Categories",
      value: dashboard?.data?.totalCategories?.toString() || "0",
      change: "+4.8%",
      icon: Package,
      color: "text-amber-600",
    },
  ];

  const monthlyRevenue = dashboard?.data?.monthlyRevenue?.slice().reverse() || [];
  const orderStatusData = dashboard?.data?.orderStatusStats?.map((item: any) => ({
    name: item.status,
    value: item._count.status,
  })) || [];
  const productStatusData = dashboard?.data?.productStatusStats?.map((item: any) => ({
    name: item.isActive ? "Active" : "Inactive",
    value: item._count.isActive,
  })) || [];

  return (
    <>
      <SEOHead title="Admin Dashboard" />
      <div>
        <div className="flex flex-col gap-3 md:flex-row md:items-end md:justify-between mb-6">
          <div>
            <h1 className="font-display text-3xl font-bold text-foreground">Admin Dashboard</h1>
            <p className="text-sm text-muted-foreground mt-1">Live overview of orders, revenue and user activity.</p>
          </div>
          <div className="inline-flex items-center gap-2 rounded-full border border-border bg-background px-4 py-2 text-sm text-muted-foreground">
            <span className="h-2 w-2 rounded-full bg-emerald-500" /> Live sync enabled
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4 mb-8">
          {stats.map((stat) => (
            <div key={stat.label} className="bg-card border border-border rounded-xl p-5 shadow-sm">
              <div className="flex items-start gap-4">
                <div>
                  <p className="text-xs uppercase tracking-[0.2em] text-muted-foreground font-semibold">{stat.label}</p>
                  <p className="font-display text-3xl font-bold text-foreground mt-3">{stat.value}</p>
                </div>
                <div className="h-12 w-12 rounded-2xl bg-secondary/80 grid place-items-center text-primary">
                  <stat.icon size={20} />
                </div>
              </div>
              <div className="mt-4 inline-flex items-center gap-2 text-sm font-medium text-muted-foreground">
                <ArrowUpRight size={14} className={stat.color} />
                <span className={stat.color}>{stat.change}</span>
                <span>vs last month</span>
              </div>
            </div>
          ))}
        </div>

        <div className="grid grid-cols-1 gap-6 xl:grid-cols-[2fr_1fr] mb-6">
          <div className="bg-card border border-border rounded-3xl p-5 shadow-sm">
            <div className="flex items-center justify-between mb-4">
              <div>
                <h2 className="font-display text-xl font-semibold text-foreground">Monthly Revenue</h2>
                <p className="text-sm text-muted-foreground">Revenue from completed orders over the last 12 months.</p>
              </div>
              <span className="text-sm font-semibold text-foreground">{CURRENCY}{dashboard?.data?.totalRevenue?.toLocaleString() || 0}</span>
            </div>
            <div className="h-72">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={monthlyRevenue} margin={{ top: 10, right: 20, left: -10, bottom: 0 }}>
                  <defs>
                    <linearGradient id="revenueGradient" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#4f46e5" stopOpacity={0.35} />
                      <stop offset="95%" stopColor="#4f46e5" stopOpacity={0.05} />
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                  <XAxis dataKey="month" tick={{ fill: '#6b7280', fontSize: 12 }} />
                  <YAxis tick={{ fill: '#6b7280', fontSize: 12 }} />
                  <Tooltip formatter={(value: number) => [`${CURRENCY}${value.toLocaleString()}`, 'Revenue']} />
                  <Area type="monotone" dataKey="revenue" stroke="#4f46e5" fill="url(#revenueGradient)" strokeWidth={3} />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </div>

          <div className="grid gap-6">
            <div className="bg-card border border-border rounded-3xl p-5 shadow-sm">
              <div className="mb-4">
                <h2 className="font-display text-lg font-semibold text-foreground">Order Status</h2>
                <p className="text-sm text-muted-foreground">Distribution of order progress states.</p>
              </div>
              <div className="h-64">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie data={orderStatusData} dataKey="value" nameKey="name" outerRadius={90} innerRadius={45} stroke="transparent">
                      {orderStatusData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={chartColors[index % chartColors.length]} />
                      ))}
                    </Pie>
                    <Legend verticalAlign="bottom" height={36} iconType="circle" />
                  </PieChart>
                </ResponsiveContainer>
              </div>
            </div>

            <div className="bg-card border border-border rounded-3xl p-5 shadow-sm">
              <div className="mb-4">
                <h2 className="font-display text-lg font-semibold text-foreground">Products Active</h2>
                <p className="text-sm text-muted-foreground">Active vs inactive product inventory.</p>
              </div>
              <div className="h-44">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={productStatusData} margin={{ top: 10, right: 0, left: -10, bottom: 0 }}>
                    <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e5e7eb" />
                    <XAxis dataKey="name" tick={{ fill: '#6b7280', fontSize: 12 }} />
                    <YAxis tick={{ fill: '#6b7280', fontSize: 12 }} />
                    <Tooltip />
                    <Bar dataKey="value" radius={[8, 8, 0, 0]} fill="#0f766e" />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 xl:grid-cols-[2fr_1fr] gap-6">
          <div className="bg-card border border-border rounded-3xl p-5 shadow-sm">
            <div className="flex items-center justify-between mb-4">
              <div>
                <h2 className="font-display text-xl font-semibold text-foreground">Recent Orders</h2>
                <p className="text-sm text-muted-foreground">Latest orders placed by customers.</p>
              </div>
              <a href="/admin/orders" className="text-sm font-semibold text-primary hover:underline">View all orders</a>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full min-w-[680px]">
                <thead>
                  <tr className="border-b border-border bg-secondary/30">
                    <th className="text-left text-xs font-body font-semibold text-muted-foreground p-3">Order ID</th>
                    <th className="text-left text-xs font-body font-semibold text-muted-foreground p-3">Customer</th>
                    <th className="text-left text-xs font-body font-semibold text-muted-foreground p-3">Amount</th>
                    <th className="text-left text-xs font-body font-semibold text-muted-foreground p-3">Status</th>
                    <th className="text-left text-xs font-body font-semibold text-muted-foreground p-3">Date</th>
                  </tr>
                </thead>
                <tbody>
                  {dashboard?.data?.recentOrders?.map((order: any) => (
                    <tr key={order.id} className="border-b border-border/50 hover:bg-secondary/20">
                      <td className="text-sm font-body font-medium text-foreground p-3">{order.orderNumber}</td>
                      <td className="text-sm font-body text-foreground p-3">{order.user?.name || 'N/A'}</td>
                      <td className="text-sm font-body font-semibold text-foreground p-3">{CURRENCY}{order.total?.toLocaleString() || 0}</td>
                      <td className="p-3">
                        <span className={`text-[10px] font-body font-bold uppercase px-2 py-1 rounded-sm ${statusColors[order.status] || "bg-gray-100 text-gray-700"}`}>
                          {order.status}
                        </span>
                      </td>
                      <td className="text-sm font-body text-muted-foreground p-3">{new Date(order.createdAt).toLocaleDateString()}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          <div className="bg-card border border-border rounded-3xl p-5 shadow-sm">
            <div className="mb-4">
              <h2 className="font-display text-xl font-semibold text-foreground">Product & User Signals</h2>
              <p className="text-sm text-muted-foreground">Quick insights for fast admin decisions.</p>
            </div>
            <div className="space-y-4">
              <div className="rounded-3xl bg-secondary/70 p-4">
                <p className="text-sm text-muted-foreground">Active products</p>
                <p className="text-3xl font-bold text-foreground">{productStatusData.find((item) => item.name === 'Active')?.value || 0}</p>
              </div>
              <div className="rounded-3xl bg-secondary/70 p-4">
                <p className="text-sm text-muted-foreground">Order types</p>
                <p className="text-3xl font-bold text-foreground">{orderStatusData.reduce((sum, item) => sum + item.value, 0)}</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default Dashboard;
