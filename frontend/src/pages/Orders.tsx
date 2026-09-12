import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import {
  Package,
  Truck,
  CheckCircle2,
  Clock,
  XCircle,
  Eye,
  Download,
  RotateCcw,
  ShoppingBag,
  ArrowRight,
  Filter,
  X,
} from "lucide-react";
import SEOHead from "@/components/common/SEOHead";
import { MOCK_ORDERS } from "@/services/mockData";
import { Order, OrderStatus } from "@/types/order.types";
import { useAppDispatch } from "@/store/hooks";
import { addToCart } from "@/store/cartThunk";
import { toast } from "sonner";
import { motion, AnimatePresence } from "framer-motion";

export const Orders: React.FC = () => {
  const dispatch = useAppDispatch();
  const [orders, setOrders] = useState<Order[]>(MOCK_ORDERS);
  const [selectedStatus, setSelectedStatus] = useState<string>("ALL");
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);

  const filteredOrders =
    selectedStatus === "ALL"
      ? orders
      : orders.filter((o) => o.orderStatus === selectedStatus);

  const handleDownloadInvoice = (orderNumber: string) => {
    toast.success(`Tax invoice for ${orderNumber} downloaded successfully.`);
  };

  const handleCancelOrder = (orderId: string) => {
    setOrders((prev) =>
      prev.map((o) => (o.id === orderId ? { ...o, orderStatus: "CANCELLED" as OrderStatus } : o))
    );
    if (selectedOrder && selectedOrder.id === orderId) {
      setSelectedOrder({ ...selectedOrder, orderStatus: "CANCELLED" as OrderStatus });
    }
    toast.success("Order cancellation request submitted.");
  };

  const handleReturnOrder = (orderId: string) => {
    toast.success("Return pickup scheduled with armored courier.");
  };

  const handleReorder = async (order: Order) => {
    for (const item of order.items) {
      await dispatch(addToCart({ productId: item.productId, quantity: item.quantity }));
    }
    toast.success("All items from this order re-added to your shopping bag!");
  };

  return (
    <div className="w-full bg-background min-h-screen py-8 lg:py-12 font-body text-foreground">
      <SEOHead title="My Orders & Tracking | JEWELO" description="Track your fine jewellery acquisitions." />

      <div className="container mx-auto px-4 max-w-6xl">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-6 border-b border-border mb-8 gap-4">
          <div>
            <h1 className="font-display text-2xl sm:text-4xl font-bold tracking-tight">
              My Orders & Acquisitions
            </h1>
            <p className="text-xs sm:text-sm text-muted-foreground mt-1">
              Track delivery progress and download digital invoices.
            </p>
          </div>

          {/* Status Filter */}
          <div className="flex items-center gap-2">
            <span className="text-xs text-muted-foreground">Filter:</span>
            <select
              value={selectedStatus}
              onChange={(e) => setSelectedStatus(e.target.value)}
              className="bg-card text-foreground text-xs rounded-lg px-3 py-1.5 border border-border outline-none focus:border-[#C5A880]"
            >
              <option value="ALL">All Orders</option>
              <option value="CONFIRMED">Confirmed</option>
              <option value="PROCESSING">Processing</option>
              <option value="SHIPPED">Shipped (In Transit)</option>
              <option value="DELIVERED">Delivered</option>
              <option value="CANCELLED">Cancelled</option>
            </select>
          </div>
        </div>

        {filteredOrders.length === 0 ? (
          <div className="py-20 text-center rounded-2xl border border-dashed border-border bg-card/40 p-8 max-w-md mx-auto space-y-4">
            <div className="w-16 h-16 mx-auto rounded-full bg-secondary flex items-center justify-center text-[#C5A880]">
              <Package size={32} />
            </div>
            <h3 className="font-display text-xl font-bold">No orders found</h3>
            <p className="text-xs text-muted-foreground">
              You haven&apos;t placed any orders matching the selected status.
            </p>
            <Link
              to="/products"
              className="px-6 py-2.5 bg-[#C5A880] text-white text-xs font-bold uppercase tracking-widest rounded-lg shadow inline-block"
            >
              Explore Creations
            </Link>
          </div>
        ) : (
          <div className="space-y-6">
            {filteredOrders.map((order) => (
              <div
                key={order.id}
                className="p-6 rounded-2xl bg-card border border-border shadow-sm space-y-5"
              >
                {/* Order Top Bar */}
                <div className="flex flex-wrap items-center justify-between gap-4 pb-4 border-b border-border/80 text-xs">
                  <div className="space-y-0.5">
                    <span className="font-mono font-bold text-foreground text-sm">
                      #{order.orderNumber}
                    </span>
                    <span className="text-muted-foreground block text-[11px]">
                      Commissioned on {new Date(order.createdAt).toLocaleDateString("en-IN", { dateStyle: "long" })}
                    </span>
                  </div>

                  <div className="flex flex-wrap items-center gap-3">
                    <span
                      className={`px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider ${
                        order.orderStatus === "DELIVERED"
                          ? "bg-emerald-100 dark:bg-emerald-950/40 text-emerald-700 dark:text-emerald-400"
                          : order.orderStatus === "SHIPPED"
                          ? "bg-blue-100 dark:bg-blue-950/40 text-blue-700 dark:text-blue-400"
                          : order.orderStatus === "CANCELLED"
                          ? "bg-destructive/15 text-destructive"
                          : "bg-amber-100 dark:bg-amber-950/40 text-amber-700 dark:text-amber-400"
                      }`}
                    >
                      {order.orderStatus}
                    </span>

                    <span className="font-display font-bold text-base text-[#997D4D]">
                      ₹{order.grandTotal.toLocaleString("en-IN")}
                    </span>
                  </div>
                </div>

                {/* Items in this order */}
                <div className="space-y-3">
                  {order.items.map((item) => (
                    <div key={item.id} className="flex items-center gap-4">
                      <img
                        src={item.image}
                        alt={item.name}
                        className="w-16 h-16 rounded-xl object-cover border border-border flex-shrink-0"
                      />
                      <div className="flex-1 min-w-0">
                        <h4 className="font-display font-semibold text-sm text-foreground truncate">
                          {item.name}
                        </h4>
                        <p className="text-xs text-muted-foreground">
                          {item.metal} ({item.purity}) • Qty: {item.quantity}
                          {item.size && <span> • Size: {item.size}</span>}
                        </p>
                      </div>
                      <span className="font-semibold text-sm text-foreground">
                        ₹{item.totalPrice.toLocaleString("en-IN")}
                      </span>
                    </div>
                  ))}
                </div>

                {/* Order Footer Actions */}
                <div className="pt-4 border-t border-border/80 flex flex-wrap items-center justify-between gap-3 text-xs">
                  <div className="text-muted-foreground flex items-center gap-2">
                    <Truck size={15} className="text-[#C5A880]" />
                    <span>
                      {order.orderStatus === "DELIVERED"
                        ? `Delivered on ${order.actualDeliveryDate || "recent"}`
                        : `Estimated Delivery: ${order.estimatedDeliveryDate}`}
                    </span>
                  </div>

                  <div className="flex items-center gap-2 flex-wrap">
                    <button
                      onClick={() => setSelectedOrder(order)}
                      className="px-4 py-2 rounded-lg bg-secondary text-foreground hover:bg-secondary/80 font-semibold flex items-center gap-1.5"
                    >
                      <Eye size={13} />
                      <span>View Timeline</span>
                    </button>

                    <button
                      onClick={() => handleDownloadInvoice(order.orderNumber)}
                      className="px-4 py-2 rounded-lg border border-border hover:border-[#C5A880] text-foreground font-semibold flex items-center gap-1.5"
                    >
                      <Download size={13} />
                      <span>Tax Invoice</span>
                    </button>

                    <button
                      onClick={() => handleReorder(order)}
                      className="px-4 py-2 rounded-lg bg-[#C5A880] text-white font-semibold hover:bg-[#B39366] flex items-center gap-1.5"
                    >
                      <ShoppingBag size={13} />
                      <span>Reorder</span>
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* ORDER DETAILS & TRACKING TIMELINE MODAL */}
        <AnimatePresence>
          {selectedOrder && (
            <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="fixed inset-0 bg-black/70 backdrop-blur-sm"
                onClick={() => setSelectedOrder(null)}
              />

              <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.95 }}
                className="relative bg-background border border-border rounded-2xl max-w-2xl w-full z-50 shadow-2xl p-6 sm:p-8 space-y-6 max-h-[90vh] overflow-y-auto"
              >
                <div className="flex items-center justify-between pb-3 border-b border-border">
                  <div>
                    <h3 className="font-display font-bold text-xl text-foreground">
                      Consignment #{selectedOrder.orderNumber}
                    </h3>
                    <p className="text-xs text-muted-foreground">
                      Carrier: BlueDart Apex Insured Transit ({selectedOrder.trackingNumber || "N/A"})
                    </p>
                  </div>
                  <button onClick={() => setSelectedOrder(null)} className="p-1 text-muted-foreground hover:text-foreground">
                    <X size={20} />
                  </button>
                </div>

                {/* Timeline */}
                <div className="space-y-4 text-xs font-body">
                  <h4 className="font-display font-bold text-sm uppercase tracking-wider text-[#997D4D]">
                    Consignment Tracking Events
                  </h4>

                  <div className="relative pl-6 space-y-6 before:absolute before:left-2 before:top-2 before:bottom-2 before:w-0.5 before:bg-border">
                    {selectedOrder.timeline.map((event, idx) => (
                      <div key={idx} className="relative">
                        <div
                          className={`absolute -left-6 top-0 w-4 h-4 rounded-full border-2 bg-background flex items-center justify-center ${
                            event.isCompleted ? "border-emerald-600 text-emerald-600" : "border-border text-muted-foreground"
                          }`}
                        >
                          {event.isCompleted && <div className="w-1.5 h-1.5 rounded-full bg-emerald-600" />}
                        </div>
                        <div className="space-y-0.5">
                          <div className="flex justify-between items-center">
                            <span className="font-bold text-foreground">{event.title}</span>
                            <span className="text-[10px] text-muted-foreground font-mono">{event.timestamp}</span>
                          </div>
                          <p className="text-muted-foreground">{event.description}</p>
                          {event.location && (
                            <span className="text-[10px] text-[#997D4D]">📍 {event.location}</span>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Delivery Address & Actions */}
                <div className="p-4 rounded-xl bg-secondary/30 border border-border text-xs space-y-1">
                  <span className="font-bold text-foreground block">Armored Delivery Destination:</span>
                  <p className="text-muted-foreground">
                    {selectedOrder.shippingAddress.fullName} • {selectedOrder.shippingAddress.phone}
                  </p>
                  <p className="text-muted-foreground">
                    {selectedOrder.shippingAddress.addressLine1}, {selectedOrder.shippingAddress.city},{" "}
                    {selectedOrder.shippingAddress.state} - {selectedOrder.shippingAddress.pincode}
                  </p>
                </div>

                {/* Cancellation & Return Actions */}
                <div className="flex justify-between items-center pt-2">
                  {selectedOrder.orderStatus !== "CANCELLED" && selectedOrder.orderStatus !== "DELIVERED" && (
                    <button
                      onClick={() => handleCancelOrder(selectedOrder.id)}
                      className="text-xs font-semibold text-destructive hover:underline"
                    >
                      Cancel Acquisition
                    </button>
                  )}
                  {selectedOrder.orderStatus === "DELIVERED" && (
                    <button
                      onClick={() => handleReturnOrder(selectedOrder.id)}
                      className="text-xs font-semibold text-[#997D4D] hover:underline flex items-center gap-1"
                    >
                      <RotateCcw size={12} />
                      <span>Request 30-Day Doorstep Return</span>
                    </button>
                  )}

                  <button
                    onClick={() => setSelectedOrder(null)}
                    className="ml-auto px-5 py-2.5 bg-[#C5A880] text-white text-xs font-bold uppercase rounded-lg"
                  >
                    Close Tracking
                  </button>
                </div>
              </motion.div>
            </div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
};

export default Orders;
