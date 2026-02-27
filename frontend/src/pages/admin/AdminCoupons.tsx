import { Plus, Trash2, Tag } from "lucide-react";
import SEOHead from "@/components/common/SEOHead";

const mockCoupons = [
  { id: "1", code: "WELCOME10", type: "Percentage", value: 10, minOrder: 5000, maxDiscount: 2000, uses: 245, expiry: "2026-03-31", status: true },
  { id: "2", code: "FLAT500", type: "Flat", value: 500, minOrder: 10000, maxDiscount: 500, uses: 89, expiry: "2026-02-28", status: true },
  { id: "3", code: "GOLD20", type: "Percentage", value: 20, minOrder: 25000, maxDiscount: 5000, uses: 32, expiry: "2026-04-15", status: false },
];

const AdminCoupons = () => {
  return (
    <>
      <SEOHead title="Admin - Coupons" />
      <div>
        <div className="flex items-center justify-between mb-6">
          <h1 className="font-display text-2xl font-bold text-foreground">Coupons</h1>
          <button className="gold-gradient text-primary-foreground px-4 py-2 rounded-sm font-body text-sm font-semibold inline-flex items-center gap-2 shimmer">
            <Plus size={16} /> Add Coupon
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {mockCoupons.map((coupon) => (
            <div key={coupon.id} className="bg-card border border-border rounded-sm p-5">
              <div className="flex items-start justify-between mb-3">
                <div className="flex items-center gap-2">
                  <Tag size={16} className="text-primary" />
                  <code className="font-body text-sm font-bold text-foreground bg-secondary px-2 py-0.5 rounded">{coupon.code}</code>
                </div>
                <span className={`text-[10px] font-body font-bold uppercase px-2 py-1 rounded-sm ${coupon.status ? "bg-green-100 text-green-700" : "bg-red-100 text-red-700"}`}>
                  {coupon.status ? "Active" : "Inactive"}
                </span>
              </div>
              <div className="space-y-1.5 text-sm font-body text-foreground/80">
                <p>{coupon.type}: {coupon.type === "Percentage" ? `${coupon.value}%` : `₹${coupon.value}`}</p>
                <p>Min Order: ₹{coupon.minOrder.toLocaleString()}</p>
                <p>Used: {coupon.uses} times</p>
                <p>Expires: {new Date(coupon.expiry).toLocaleDateString("en-IN")}</p>
              </div>
              <button className="mt-3 flex items-center gap-1.5 text-xs font-body text-destructive hover:underline">
                <Trash2 size={12} /> Delete
              </button>
            </div>
          ))}
        </div>
      </div>
    </>
  );
};

export default AdminCoupons;
