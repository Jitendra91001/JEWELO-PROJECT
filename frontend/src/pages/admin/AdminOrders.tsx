import { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Search, Eye } from "lucide-react";
import SEOHead from "@/components/common/SEOHead";
import { CURRENCY } from "@/utils/constants";
import { getOrders, updateOrderStatus } from "@/store/admin/adminThunk";
import { RootState } from "@/store";

const mockOrders = [
  { id: "ORD-001", customer: "Priya Sharma", email: "priya@email.com", amount: 45999, status: "Delivered", date: "2026-02-10", items: 1 },
  { id: "ORD-002", customer: "Rahul Verma", email: "rahul@email.com", amount: 32500, status: "Shipped", date: "2026-02-09", items: 2 },
  { id: "ORD-003", customer: "Ananya Patel", email: "ananya@email.com", amount: 18999, status: "Processing", date: "2026-02-09", items: 1 },
  { id: "ORD-004", customer: "Meera Gupta", email: "meera@email.com", amount: 65000, status: "Placed", date: "2026-02-08", items: 3 },
  { id: "ORD-005", customer: "Vikash Singh", email: "vikash@email.com", amount: 28999, status: "Cancelled", date: "2026-02-07", items: 1 },
];

const statusColors: Record<string, string> = {
  Delivered: "bg-green-100 text-green-700",
  Shipped: "bg-blue-100 text-blue-700",
  Processing: "bg-yellow-100 text-yellow-700",
  Placed: "bg-gray-100 text-gray-700",
  Cancelled: "bg-red-100 text-red-700",
};

const AdminOrders = () => {
  const dispatch = useDispatch();
  const { orders, orderTotal, orderPage, orderLimit, loading } = useSelector((state: RootState) => state.admin);
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("");

  useEffect(() => {
    dispatch(getOrders({}));
  }, [dispatch]);

  const filtered = orders
    .filter((o: any) => !search || o.user?.name?.toLowerCase().includes(search.toLowerCase()) || o.id.toLowerCase().includes(search.toLowerCase()))
    .filter((o: any) => !statusFilter || o.status === statusFilter);

  const handleStatusChange = (orderId: string, newStatus: string) => {
    dispatch(updateOrderStatus({ id: orderId, status: newStatus }));
  };

  return (
    <>
      <SEOHead title="Admin - Orders" />
      <div>
        <h1 className="font-display text-2xl font-bold text-foreground mb-6">Orders</h1>

        <div className="bg-card border border-border rounded-sm">
          <div className="p-4 border-b border-border flex flex-col sm:flex-row gap-3">
            <div className="relative flex-1 max-w-sm">
              <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
              <input type="text" value={search} onChange={(e) => setSearch(e.target.value)}
                className="w-full pl-9 pr-4 py-2 border border-border rounded-sm text-sm font-body bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-primary/30"
                placeholder="Search orders..." />
            </div>
            <select value={statusFilter} onChange={(e) => setStatusFilter(e.target.value)}
              className="border border-border rounded-sm px-3 py-2 text-sm font-body bg-background text-foreground">
              <option value="">All Status</option>
              {["Placed", "Processing", "Shipped", "Delivered", "Cancelled"].map((s) => <option key={s} value={s}>{s}</option>)}
            </select>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-border bg-secondary/30">
                  <th className="text-left text-xs font-body font-semibold text-muted-foreground p-3">Order ID</th>
                  <th className="text-left text-xs font-body font-semibold text-muted-foreground p-3">Customer</th>
                  <th className="text-left text-xs font-body font-semibold text-muted-foreground p-3">Items</th>
                  <th className="text-left text-xs font-body font-semibold text-muted-foreground p-3">Amount</th>
                  <th className="text-left text-xs font-body font-semibold text-muted-foreground p-3">Status</th>
                  <th className="text-left text-xs font-body font-semibold text-muted-foreground p-3">Date</th>
                  <th className="text-left text-xs font-body font-semibold text-muted-foreground p-3">Actions</th>
                </tr>
              </thead>
              <tbody>
                {filtered.map((order: any) => (
                  <tr key={order.id} className="border-b border-border/50 hover:bg-secondary/20">
                    <td className="text-sm font-body font-medium text-foreground p-3">{order.id}</td>
                    <td className="p-3">
                      <p className="text-sm font-body text-foreground">{order.user?.name || 'N/A'}</p>
                      <p className="text-xs text-muted-foreground font-body">{order.user?.email || ''}</p>
                    </td>
                    <td className="text-sm font-body text-foreground p-3">{order.orderItems?.length || 0}</td>
                    <td className="text-sm font-body font-semibold text-foreground p-3">{CURRENCY}{order.totalAmount?.toLocaleString() || 0}</td>
                    <td className="p-3">
                      <select
                        value={order.status}
                        onChange={(e) => handleStatusChange(order.id, e.target.value)}
                        className={`text-[10px] font-body font-bold uppercase px-2 py-1 rounded-sm border-0 ${statusColors[order.status] || ""}`}
                      >
                        {["Placed", "Processing", "Shipped", "Delivered", "Cancelled"].map((s) => <option key={s} value={s}>{s}</option>)}
                      </select>
                    </td>
                    <td className="text-sm font-body text-muted-foreground p-3">{new Date(order.createdAt).toLocaleDateString("en-IN")}</td>
                    <td className="p-3">
                      <button className="p-1.5 text-muted-foreground hover:text-primary transition-colors"><Eye size={14} /></button>
                    </td>
                  </tr>
                ))}
                {filtered.length === 0 && !loading && (
                  <tr>
                    <td colSpan={7} className="text-center py-8 text-muted-foreground">No orders found.</td>
                  </tr>
                )}
                {loading && (
                  <tr>
                    <td colSpan={7} className="text-center py-8 text-muted-foreground">Loading orders...</td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </>
  );
};

export default AdminOrders;
