import { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Plus, Trash2, Tag, Edit } from "lucide-react";
import SEOHead from "@/components/common/SEOHead";
import { getCoupons, deleteCoupon } from "@/store/admin/adminThunk";
import { RootState } from "@/store";
import AdminAddCoupons from "./AdminAddCoupons";

const mockCoupons = [
  { id: "1", code: "WELCOME10", type: "Percentage", value: 10, minOrder: 5000, maxDiscount: 2000, uses: 245, expiry: "2026-03-31", status: true },
  { id: "2", code: "FLAT500", type: "Flat", value: 500, minOrder: 10000, maxDiscount: 500, uses: 89, expiry: "2026-02-28", status: true },
  { id: "3", code: "GOLD20", type: "Percentage", value: 20, minOrder: 25000, maxDiscount: 5000, uses: 32, expiry: "2026-04-15", status: false },
];

const AdminCoupons = () => {
  const dispatch = useDispatch();
  const { coupons, loading } = useSelector((state: RootState) => state.admin);
  const [addOpen, setAddOpen] = useState(false);
  const [editData, setEditData] = useState<any | undefined>();

  useEffect(() => {
    dispatch(getCoupons());
  }, [dispatch]);

  const handleDelete = (id: string) => {
    if (window.confirm("Are you sure you want to delete this coupon?")) {
      dispatch(deleteCoupon(id));
    }
  };

  const handleEdit = (coupon: any) => {
    setEditData(coupon);
    setAddOpen(true);
  };

  return (
    <>
      <SEOHead title="Admin - Coupons" />
      <div>
        <div className="flex items-center justify-between mb-6">
          <h1 className="font-display text-2xl font-bold text-foreground">Coupons</h1>
          <button
            onClick={() => { setEditData(undefined); setAddOpen(true); }}
            className="gold-gradient text-primary-foreground px-4 py-2 rounded-sm font-body text-sm font-semibold inline-flex items-center gap-2 shimmer"
          >
            <Plus size={16} /> Add Coupon
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {coupons.map((coupon: any) => (
            <div key={coupon.id} className="bg-card border border-border rounded-sm p-5">
              <div className="flex items-start justify-between mb-3">
                <div className="flex items-center gap-2">
                  <Tag size={16} className="text-primary" />
                  <code className="font-body text-sm font-bold text-foreground bg-secondary px-2 py-0.5 rounded">{coupon.code}</code>
                </div>
                <span className={`text-[10px] font-body font-bold uppercase px-2 py-1 rounded-sm ${coupon.isActive ? "bg-green-100 text-green-700" : "bg-red-100 text-red-700"}`}>
                  {coupon.isActive ? "Active" : "Inactive"}
                </span>
              </div>
              <div className="space-y-1.5 text-sm font-body text-foreground/80">
                <p>{coupon.discountType}: {coupon.discountType === "PERCENTAGE" ? `${coupon.discountValue}%` : `₹${coupon.discountValue}`}</p>
                {coupon.minPurchase && <p>Min Order: ₹{coupon.minPurchase.toLocaleString()}</p>}
                {coupon.usageLimit && <p>Usage Limit: {coupon.usageLimit}</p>}
                <p>Expires: {new Date(coupon.validUpto).toLocaleDateString("en-IN")}</p>
              </div>
              <div className="flex items-center gap-2 mt-3">
                <button
                  onClick={() => handleEdit(coupon)}
                  className="flex items-center gap-1.5 text-xs font-body text-primary hover:underline"
                >
                  <Edit size={12} /> Edit
                </button>
                <button
                  onClick={() => handleDelete(coupon.id)}
                  className="flex items-center gap-1.5 text-xs font-body text-destructive hover:underline"
                >
                  <Trash2 size={12} /> Delete
                </button>
              </div>
            </div>
          ))}
          {coupons.length === 0 && !loading && (
            <div className="col-span-full text-center py-8 text-muted-foreground">No coupons found.</div>
          )}
          {loading && (
            <div className="col-span-full text-center py-8 text-muted-foreground">Loading coupons...</div>
          )}
        </div>

        <AdminAddCoupons isOpen={addOpen} editData={editData} setOpen={setAddOpen} />
      </div>
    </>
  );
};

export default AdminCoupons;
