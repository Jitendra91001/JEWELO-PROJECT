import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { IndianRupee, ShoppingCart, Users, Package, TrendingUp, ArrowUpRight } from "lucide-react";
import SEOHead from "@/components/common/SEOHead";
import { CURRENCY } from "@/utils/constants";
import { getDashboardStats } from "@/store/admin/adminThunk";
import { RootState } from "@/store";

const statusColors: Record<string, string> = {
  Delivered: "bg-green-100 text-green-700",
  Shipped: "bg-blue-100 text-blue-700",
  Processing: "bg-yellow-100 text-yellow-700",
  Placed: "bg-gray-100 text-gray-700",
  Cancelled: "bg-red-100 text-red-700",
};

const Dashboard = () => {
  const dispatch = useDispatch();
  const { dashboard, loading } = useSelector((state: RootState) => state.admin);

  useEffect(() => {
    dispatch(getDashboardStats());
  }, [dispatch]);

  if (loading) {
    return <div className="flex justify-center items-center h-64">Loading...</div>;
  }

  const stats = [
    {
      label: "Total Revenue",
      value: dashboard ? `${CURRENCY}${dashboard.totalRevenue?.toLocaleString() || 0}` : `${CURRENCY}0`,
      change: "+12.5%",
      icon: IndianRupee,
      color: "text-green-600"
    },
    {
      label: "Total Orders",
      value: dashboard?.totalOrders?.toString() || "0",
      change: "+8.2%",
      icon: ShoppingCart,
      color: "text-blue-600"
    },
    {
      label: "Total Users",
      value: dashboard?.totalUsers?.toString() || "0",
      change: "+15.3%",
      icon: Users,
      color: "text-purple-600"
    },
    {
      label: "Total Products",
      value: dashboard?.totalProducts?.toString() || "0",
      change: "+3.1%",
      icon: Package,
      color: "text-primary"
    },
  ];

  return (
    <>
      <SEOHead title="Admin Dashboard" />
      <div>
        <h1 className="font-display text-2xl font-bold text-foreground mb-6">Dashboard</h1>

        {/* Stats */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          {stats.map((stat) => (
            <div key={stat.label} className="bg-card border border-border rounded-sm p-5">
              <div className="flex items-start justify-between">
                <div>
                  <p className="text-sm font-body text-muted-foreground">{stat.label}</p>
                  <p className="font-display text-2xl font-bold text-foreground mt-1">{stat.value}</p>
                </div>
                <div className="p-2 bg-secondary rounded-sm">
                  <stat.icon size={20} className="text-primary" />
                </div>
              </div>
              <div className="flex items-center gap-1 mt-3">
                <ArrowUpRight size={14} className={stat.color} />
                <span className={`text-xs font-body font-semibold ${stat.color}`}>{stat.change}</span>
                <span className="text-xs text-muted-foreground font-body">vs last month</span>
              </div>
            </div>
          ))}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Recent Orders */}
          <div className="lg:col-span-2 bg-card border border-border rounded-sm">
            <div className="flex items-center justify-between p-4 border-b border-border">
              <h2 className="font-display text-lg font-semibold text-foreground">Recent Orders</h2>
              <a href="/admin/orders" className="text-xs font-body text-primary hover:underline">View All</a>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full">
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
                  {dashboard?.recentOrders?.map((order: any) => (
                    <tr key={order.id} className="border-b border-border/50 hover:bg-secondary/20">
                      <td className="text-sm font-body font-medium text-foreground p-3">{order.id}</td>
                      <td className="text-sm font-body text-foreground p-3">{order.user?.name || 'N/A'}</td>
                      <td className="text-sm font-body font-semibold text-foreground p-3">{CURRENCY}{order.totalAmount?.toLocaleString() || 0}</td>
                      <td className="p-3">
                        <span className={`text-[10px] font-body font-bold uppercase px-2 py-1 rounded-sm ${statusColors[order.status] || ""}`}>
                          {order.status}
                        </span>
                      </td>
                      <td className="text-sm font-body text-muted-foreground p-3">{new Date(order.createdAt).toLocaleDateString()}</td>
                    </tr>
                  )) || []}
                </tbody>
              </table>
            </div>
          </div>

          {/* Top Products - Placeholder for now */}
          <div className="bg-card border border-border rounded-sm">
            <div className="flex items-center justify-between p-4 border-b border-border">
              <h2 className="font-display text-lg font-semibold text-foreground">Top Products</h2>
            </div>
            <div className="p-4 space-y-4">
              <p className="text-sm text-muted-foreground">Top products data will be implemented</p>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default Dashboard;
