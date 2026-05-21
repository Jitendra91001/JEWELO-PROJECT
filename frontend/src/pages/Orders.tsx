import { useEffect, useState, type ComponentType, type SVGProps } from "react";
import { Link } from "react-router-dom";
import { Package, ChevronRight, Truck, CheckCircle, Clock, XCircle } from "lucide-react";
import SEOHead from "@/components/common/SEOHead";
import { CURRENCY } from "@/utils/constants";
import { orderAPI } from "@/api/order.api";
import { toast } from "sonner";
const baseUrl = import.meta.env.VITE_APP_BASE_URL;

interface OrderProduct {
  id: string;
  name?: string;
  thumbnail?: string;
}

interface OrderItem {
  id: string;
  productId?: string;
  quantity: number;
  price: number;
  discount: number;
  product?: OrderProduct;
}

interface Order {
  id: string;
  orderNumber: string;
  status: string;
  paymentStatus: string;
  total: number;
  createdAt: string;
  updatedAt: string;
  items: OrderItem[];
}

const statusConfig: Record<string, { icon: ComponentType<SVGProps<SVGSVGElement>>; color: string; label: string }> = {
  PENDING: { icon: Clock, color: "text-yellow-600", label: "Placed" },
  CONFIRMED: { icon: CheckCircle, color: "text-blue-600", label: "Confirmed" },
  SHIPPED: { icon: Truck, color: "text-primary", label: "Shipped" },
  DELIVERED: { icon: CheckCircle, color: "text-green-600", label: "Delivered" },
  CANCELLED: { icon: XCircle, color: "text-destructive", label: "Cancelled" },
};

const Orders = () => {
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadOrders = async () => {
      try {
        setLoading(true);
        const response = await orderAPI.getMyOrders();
        setOrders(response.data?.data || []);
      } catch (error: unknown) {
        const err = error as { response?: { data?: { message?: string } }; message?: string };
        toast.error(err.response?.data?.message || err.message || "Unable to load orders.");
      } finally {
        setLoading(false);
      }
    };

    loadOrders();
  }, []);

  return (
    <>
      <SEOHead title="My Orders" description="Track your jewellery orders" />
      <div className="container mx-auto px-4 py-6 lg:py-10">
        <nav className="flex items-center gap-2 text-xs font-body text-muted-foreground mb-6">
          <Link to="/" className="hover:text-primary">Home</Link>
          <ChevronRight size={12} />
          <span className="text-foreground">My Orders</span>
        </nav>

        <h1 className="font-display text-2xl lg:text-3xl font-bold text-foreground mb-8">My Orders</h1>

        {loading ? (
          <div className="min-h-[40vh] flex items-center justify-center">
            <p className="text-sm text-muted-foreground">Loading orders…</p>
          </div>
        ) : orders.length === 0 ? (
          <div className="min-h-[40vh] flex flex-col items-center justify-center">
            <Package size={48} className="text-muted-foreground mb-4" />
            <h2 className="font-display text-xl font-bold text-foreground mb-2">No Orders Yet</h2>
            <p className="text-muted-foreground font-body text-sm mb-6">Start shopping to see your orders here</p>
            <Link to="/products" className="gold-gradient text-primary-foreground px-8 py-3 rounded-sm font-body text-sm font-semibold uppercase shimmer">
              Shop Now
            </Link>
          </div>
        ) : (
          <div className="space-y-4">
            {orders.map((order) => {
              const status = order.status || "PENDING";
              const statusMeta = statusConfig[status] || { icon: Clock, color: "text-muted-foreground", label: status };
              const StatusIcon = statusMeta.icon;
              const steps = ["PENDING", "CONFIRMED", "SHIPPED", "DELIVERED"];
              const currentIdx = steps.indexOf(status);

              return (
                <div key={order.id} className="bg-card border border-border rounded-sm overflow-hidden">
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between p-4 border-b border-border bg-secondary/30 gap-4">
                    <div>
                      <p className="text-sm font-body font-semibold text-foreground">{order.orderNumber || order.id}</p>
                      <p className="text-xs text-muted-foreground font-body">Placed on {new Date(order.createdAt).toLocaleDateString("en-IN", { day: "numeric", month: "long", year: "numeric" })}</p>
                    </div>
                    <div className="flex flex-wrap items-center gap-3">
                      <div className={`flex items-center gap-1.5 ${statusMeta.color}`}>
                        <StatusIcon size={14} />
                        <span className="text-sm font-body font-semibold">{statusMeta.label}</span>
                      </div>
                      <span className="text-sm font-body font-bold text-foreground">{CURRENCY}{order.total.toLocaleString()}</span>
                    </div>
                  </div>

                  <div className="p-4 border-b border-border">
                    {order.items.map((item) => (
                      <div key={item.id} className="flex items-center gap-3 py-2 border-b border-border/50 last:border-none">
                        <img
                          src={baseUrl+item.product?.thumbnail || "/placeholder.png"}
                          alt={item.product?.name || "Product"}
                          className="w-14 h-14 object-cover rounded-sm bg-secondary"
                        />
                        <div className="flex-1 min-w-0">
                          <p className="text-sm font-body font-medium text-foreground line-clamp-1">{item.product?.name || "Product"}</p>
                          <p className="text-xs text-muted-foreground font-body">Qty: {item.quantity}</p>
                        </div>
                        <p className="text-sm font-body font-semibold text-foreground">{CURRENCY}{item.price.toLocaleString()}</p>
                      </div>
                    ))}
                  </div>

                  <div className="px-4 py-5">
                    <div className="flex flex-col gap-4">
                      <div className="grid grid-cols-4 gap-3 items-center text-center text-[10px] uppercase tracking-[0.25em] text-muted-foreground">
                        {steps.map((step) => (
                          <div key={step} className="flex flex-col items-center gap-2">
                            <div className={`w-8 h-8 rounded-full flex items-center justify-center ${steps.indexOf(step) <= currentIdx ? "bg-primary text-primary-foreground" : "bg-muted"}`}>
                              {steps.indexOf(step) + 1}
                            </div>
                            <span>{step.charAt(0) + step.slice(1).toLowerCase()}</span>
                          </div>
                        ))}
                      </div>
                      <div className="relative h-1 bg-muted rounded-full overflow-hidden">
                        <div className="absolute left-0 top-0 h-full bg-primary transition-all" style={{ width: `${((currentIdx + 1) / steps.length) * 100}%` }} />
                      </div>
                      <div className="text-xs text-muted-foreground">
                        Last updated: {new Date(order.updatedAt).toLocaleString("en-IN")}
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </>
  );
};

export default Orders;
