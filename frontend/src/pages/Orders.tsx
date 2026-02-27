import { useState } from "react";
import { Link } from "react-router-dom";
import { Package, ChevronRight, Truck, CheckCircle, Clock, XCircle } from "lucide-react";
import SEOHead from "@/components/common/SEOHead";
import { CURRENCY } from "@/utils/constants";

import categoryRings from "@/assets/category-rings.jpg";
import categoryNecklaces from "@/assets/category-necklaces.jpg";
import categoryEarrings from "@/assets/category-earrings.jpg";

const mockOrders = [
  {
    id: "ORD-2026-001",
    date: "2026-02-08",
    status: "Delivered",
    total: 45999,
    items: [
      { name: "Royal Diamond Solitaire Ring", image: categoryRings, price: 45999, quantity: 1 },
    ],
  },
  {
    id: "ORD-2026-002",
    date: "2026-02-05",
    status: "Shipped",
    total: 51499,
    items: [
      { name: "Celestial Pearl Necklace", image: categoryNecklaces, price: 32500, quantity: 1 },
      { name: "Teardrop Crystal Earrings", image: categoryEarrings, price: 18999, quantity: 1 },
    ],
  },
  {
    id: "ORD-2026-003",
    date: "2026-01-20",
    status: "Cancelled",
    total: 28999,
    items: [
      { name: "Infinity Diamond Band", image: categoryRings, price: 28999, quantity: 1 },
    ],
  },
];

const statusConfig: Record<string, { icon: any; color: string }> = {
  Placed: { icon: Clock, color: "text-yellow-600" },
  Confirmed: { icon: CheckCircle, color: "text-blue-600" },
  Shipped: { icon: Truck, color: "text-primary" },
  Delivered: { icon: CheckCircle, color: "text-green-600" },
  Cancelled: { icon: XCircle, color: "text-destructive" },
};

const Orders = () => {
  const [selectedOrder, setSelectedOrder] = useState<string | null>(null);

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

        {mockOrders.length === 0 ? (
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
            {mockOrders.map((order) => {
              const StatusIcon = statusConfig[order.status]?.icon || Clock;
              const statusColor = statusConfig[order.status]?.color || "text-muted-foreground";

              return (
                <div key={order.id} className="bg-card border border-border rounded-sm overflow-hidden">
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between p-4 border-b border-border bg-secondary/30">
                    <div className="flex items-center gap-4">
                      <div>
                        <p className="text-sm font-body font-semibold text-foreground">{order.id}</p>
                        <p className="text-xs text-muted-foreground font-body">Placed on {new Date(order.date).toLocaleDateString("en-IN", { day: "numeric", month: "long", year: "numeric" })}</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-4 mt-2 sm:mt-0">
                      <div className={`flex items-center gap-1.5 ${statusColor}`}>
                        <StatusIcon size={14} />
                        <span className="text-sm font-body font-semibold">{order.status}</span>
                      </div>
                      <span className="text-sm font-body font-bold text-foreground">{CURRENCY}{order.total.toLocaleString()}</span>
                    </div>
                  </div>

                  <div className="p-4">
                    {order.items.map((item, i) => (
                      <div key={i} className="flex items-center gap-3 py-2">
                        <img src={item.image} alt={item.name} className="w-14 h-14 object-cover rounded-sm" />
                        <div className="flex-1 min-w-0">
                          <p className="text-sm font-body font-medium text-foreground line-clamp-1">{item.name}</p>
                          <p className="text-xs text-muted-foreground font-body">Qty: {item.quantity}</p>
                        </div>
                        <p className="text-sm font-body font-semibold text-foreground">{CURRENCY}{item.price.toLocaleString()}</p>
                      </div>
                    ))}
                  </div>

                  {/* Order Status Tracker */}
                  {order.status !== "Cancelled" && (
                    <div className="px-4 pb-4">
                      <div className="flex items-center justify-between">
                        {["Placed", "Confirmed", "Shipped", "Delivered"].map((step, i) => {
                          const steps = ["Placed", "Confirmed", "Shipped", "Delivered"];
                          const currentIdx = steps.indexOf(order.status);
                          const isActive = i <= currentIdx;
                          return (
                            <div key={step} className="flex items-center flex-1">
                              <div className="flex flex-col items-center">
                                <div className={`w-6 h-6 rounded-full flex items-center justify-center text-[10px] font-bold ${isActive ? "gold-gradient text-primary-foreground" : "bg-muted text-muted-foreground"}`}>
                                  {i + 1}
                                </div>
                                <span className={`text-[10px] font-body mt-1 ${isActive ? "text-foreground font-semibold" : "text-muted-foreground"}`}>{step}</span>
                              </div>
                              {i < 3 && <div className={`flex-1 h-0.5 mx-1 ${i < currentIdx ? "bg-primary" : "bg-muted"}`} />}
                            </div>
                          );
                        })}
                      </div>
                    </div>
                  )}
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
