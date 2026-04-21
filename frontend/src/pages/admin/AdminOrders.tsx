import { useState, useEffect } from "react";
import { useAppDispatch, useAppSelector } from "@/store/hooks";
import { Search, Eye, RefreshCcw } from "lucide-react";
import { Table, Tag } from "antd";
import type { ColumnsType } from "antd/es/table";
import SEOHead from "@/components/common/SEOHead";
import { CURRENCY, ORDER_STATUS } from "@/utils/constants";
import { getOrders, updateOrderStatus } from "@/store/admin/adminThunk";
import { RootState } from "@/store";
import { toast } from "sonner";

const statusColors: Record<string, string> = {
  Pending: "bg-gray-100 text-gray-700",
  Confirmed: "bg-yellow-100 text-yellow-700",
  Shipped: "bg-blue-100 text-blue-700",
  Delivered: "bg-green-100 text-green-700",
  Cancelled: "bg-red-100 text-red-700",
};

interface AdminOrder {
  id: string;
  orderNumber: string;
  user?: {
    name?: string;
    email?: string;
  };
  items?: unknown[];
  total?: number;
  status: string;
  createdAt: string;
}

const AdminOrders = () => {
  const dispatch = useAppDispatch();
  const { orders, orderTotal, loading } = useAppSelector((state: RootState) => state.admin);
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("");
  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(10);

  useEffect(() => {
    dispatch(getOrders({ search, status: statusFilter || undefined, page, limit }));
  }, [dispatch, search, statusFilter, page, limit]);

  const handleRefresh = () => {
    dispatch(getOrders({ search, status: statusFilter || undefined, page, limit }));
  };

  const handleStatusChange = async (orderId: string, newStatus: string) => {
    try {
      await dispatch(updateOrderStatus({ id: orderId, status: newStatus })).unwrap();
      toast.success(`Order status updated to ${ORDER_STATUS[newStatus as keyof typeof ORDER_STATUS] || newStatus}`);
      // Refresh the orders list after successful status update
      handleRefresh();
    } catch (error) {
      console.error("Failed to update order status:", error);
      toast.error("Failed to update order status. Please try again.");
    }
  };

  const columns: ColumnsType<AdminOrder> = [
    {
      title: "Order ID",
      dataIndex: "orderNumber",
      key: "orderNumber",
      render: (orderNumber: string) => <span className="font-medium">{orderNumber}</span>,
    },
    {
      title: "Customer",
      key: "customer",
      render: (_, order) => (
        <div>
          <div className="font-medium text-foreground">{order.user?.name || "N/A"}</div>
          <div className="text-xs text-muted-foreground">{order.user?.email || ""}</div>
        </div>
      ),
    },
    {
      title: "Items",
      key: "items",
      render: (_, order) => order.items?.length || 0,
    },
    {
      title: "Amount",
      dataIndex: "total",
      key: "total",
      render: (total: number) => (
        <span className="font-semibold">
          {CURRENCY}
          {total?.toLocaleString() || 0}
        </span>
      ),
    },
    {
      title: "Status",
      dataIndex: "status",
      key: "status",
      render: (status: string, order: AdminOrder) => (
        <select
          value={status}
          onChange={(e) => handleStatusChange(order.id, e.target.value)}
          className={`text-[10px] font-body font-bold uppercase px-2 py-1 rounded-sm border-0 ${statusColors[ORDER_STATUS[status as keyof typeof ORDER_STATUS]] || ""}`}
        >
          {Object.entries(ORDER_STATUS).map(([value, label]) => (
            <option key={value} value={value}>{label}</option>
          ))}
        </select>
      ),
    },
    {
      title: "Date",
      dataIndex: "createdAt",
      key: "createdAt",
      render: (createdAt: string) => new Date(createdAt).toLocaleDateString("en-IN"),
    },
    {
      title: "Actions",
      key: "actions",
      render: (_, order) => (
        <button className="p-1.5 text-muted-foreground hover:text-primary transition-colors" title="View">
          <Eye size={14} />
        </button>
      ),
    },
  ];

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
                <input
                  type="text"
                  value={search}
                  onChange={(e) => { setSearch(e.target.value); setPage(1); }}
                  className="w-full pl-9 pr-4 py-2 border border-border rounded-sm text-sm font-body bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-primary/30"
                  placeholder="Search orders..."
                />
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
            <select
              value={statusFilter}
              onChange={(e) => { setStatusFilter(e.target.value); setPage(1); }}
              className="border border-border rounded-sm px-3 py-2 text-sm font-body bg-background text-foreground"
            >
              <option value="">All Status</option>
              {Object.entries(ORDER_STATUS).map(([value, label]) => (
                <option key={value} value={value}>{label}</option>
              ))}
            </select>
          </div>

          <div className="overflow-x-auto">
            <Table
              columns={columns}
              dataSource={orders}
              rowKey="id"
              loading={loading}
              pagination={{
                current: page,
                pageSize: limit,
                total: orderTotal,
                showSizeChanger: true,
                pageSizeOptions: ["5", "10", "20"],
                onChange: (nextPage, nextPageSize) => {
                  setPage(nextPage);
                  setLimit(nextPageSize);
                },
              }}
              className="rounded-b-lg"
            />
          </div>
        </div>
      </div>
    </>
  );
};

export default AdminOrders;
