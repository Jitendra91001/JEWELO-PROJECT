import { useState, useEffect } from "react";
import { useAppDispatch, useSelector } from "@/store/hooks";
import { Search, Eye, RefreshCcw } from "lucide-react";
import SEOHead from "@/components/common/SEOHead";
import { CURRENCY, ORDER_STATUS } from "@/utils/constants";
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
  Pending: "bg-gray-100 text-gray-700",
  Confirmed: "bg-yellow-100 text-yellow-700",
  Shipped: "bg-blue-100 text-blue-700",
  Delivered: "bg-green-100 text-green-700",
  Cancelled: "bg-red-100 text-red-700",
};

const AdminOrders = () => {
  const dispatch = useAppDispatch();
  const { orders, orderTotal, orderPage, orderLimit, loading } = useSelector((state: RootState) => state.admin);
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("");

  useEffect(() => {
    dispatch(getOrders({ search, status: statusFilter || undefined }));
  }, [dispatch, search, statusFilter]);

  const handleRefresh = () => {
    dispatch(getOrders({ search, status: statusFilter || undefined }));
  };

  const handleStatusChange = (orderId: string, newStatus: string) => {
    dispatch(updateOrderStatus({ id: orderId, status: newStatus }));
  };

  return (
    <>
      <SEOHead title="Admin - Orders" />
      <div>
        <h1 className="font-display text-2xl font-bold text-foreground mb-6">Orders</h1>

        <div className="bg-card border border-border rounded-sm">
          <div className="p-4 border-b border-border flex flex-col sm:flex-row items-start sm:items-center gap-3">
            <div className="flex items-center gap-2 flex-1 max-w-full">
              <div className="relative flex-1 max-w-sm">
                <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
                <input type="text" value={search} onChange={(e) => setSearch(e.target.value)}
                  className="w-full pl-9 pr-4 py-2 border border-border rounded-sm text-sm font-body bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-primary/30"
                  placeholder="Search orders..." />
              </div>
              <button
                type="button"
                onClick={handleRefresh}
                className="inline-flex items-center justify-center rounded-md border border-border px-3 py-2 text-muted-foreground hover:border-foreground hover:text-foreground transition"
                title="Refresh orders"
              >
                <RefreshCcw size={16} />
              </button>
            </div>
            <select value={statusFilter} onChange={(e) => setStatusFilter(e.target.value)}
              className="border border-border rounded-sm px-3 py-2 text-sm font-body bg-background text-foreground">
              <option value="">All Status</option>
              {Object.entries(ORDER_STATUS).map(([value, label]) => (
                <option key={value} value={value}>{label}</option>
              ))}
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
                {orders.map((order: any) => (
                  <tr key={order.id} className="border-b border-border/50 hover:bg-secondary/20">
                    <td className="text-sm font-body font-medium text-foreground p-3">{order.id}</td>
                    <td className="p-3">
                      <p className="text-sm font-body text-foreground">{order.user?.name || 'N/A'}</p>
                      <p className="text-xs text-muted-foreground font-body">{order.user?.email || ''}</p>
                    </td>
                    <td className="text-sm font-body text-foreground p-3">{order.items?.length || 0}</td>
                    <td className="text-sm font-body font-semibold text-foreground p-3">{CURRENCY}{order.total?.toLocaleString() || 0}</td>
                    <td className="p-3">
                      <select
                        value={order.status}
                        onChange={(e) => handleStatusChange(order.id, e.target.value)}
                        className={`text-[10px] font-body font-bold uppercase px-2 py-1 rounded-sm border-0 ${statusColors[ORDER_STATUS[order.status as keyof typeof ORDER_STATUS]] || ""}`}
                      >
                        {Object.entries(ORDER_STATUS).map(([value, label]) => (
                          <option key={value} value={value}>{label}</option>
                        ))}
                      </select>
                    </td>
                    <td className="text-sm font-body text-muted-foreground p-3">{new Date(order.createdAt).toLocaleDateString("en-IN")}</td>
                    <td className="p-3">
                      <button className="p-1.5 text-muted-foreground hover:text-primary transition-colors"><Eye size={14} /></button>
                    </td>
                  </tr>
                ))}
                {orders.length === 0 && !loading && (
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
