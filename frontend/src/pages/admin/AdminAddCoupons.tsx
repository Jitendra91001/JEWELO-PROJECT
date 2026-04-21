import React, { useState, useEffect } from "react";
import { useAppDispatch } from "@/store/hooks";
import { createCoupon, updateCoupon } from "@/store/admin/adminThunk";

interface Coupon {
  id?: string;
  code?: string;
  description?: string;
  discountType?: 'PERCENTAGE' | 'FIXED';
  discountValue?: number;
  minPurchase?: number;
  maxDiscount?: number;
  usageLimit?: number;
  validFrom?: string;
  validUpto?: string;
}

interface AdminAddCouponsProps {
  isOpen: boolean;
  editData?: Coupon;
  setOpen: (value: boolean) => void;
}

const AdminAddCoupons: React.FC<AdminAddCouponsProps> = ({
  isOpen,
  editData,
  setOpen,
}) => {
  const dispatch = useAppDispatch();
  const [formData, setFormData] = useState({
    code: "",
    description: "",
    discountType: "PERCENTAGE" as 'PERCENTAGE' | 'FIXED',
    discountValue: "",
    minPurchase: "",
    maxDiscount: "",
    usageLimit: "",
    validFrom: "",
    validUpto: "",
  });

  useEffect(() => {
    if (editData) {
      setFormData({
        code: editData.code || "",
        description: editData.description || "",
        discountType: editData.discountType || "PERCENTAGE",
        discountValue: editData.discountValue?.toString() || "",
        minPurchase: editData.minPurchase?.toString() || "",
        maxDiscount: editData.maxDiscount?.toString() || "",
        usageLimit: editData.usageLimit?.toString() || "",
        validFrom: editData.validFrom ? new Date(editData.validFrom).toISOString().split('T')[0] : "",
        validUpto: editData.validUpto ? new Date(editData.validUpto).toISOString().split('T')[0] : "",
      });
    } else {
      setFormData({
        code: "",
        description: "",
        discountType: "PERCENTAGE",
        discountValue: "",
        minPurchase: "",
        maxDiscount: "",
        usageLimit: "",
        validFrom: "",
        validUpto: "",
      });
    }
  }, [editData, isOpen]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    const data = {
      ...formData,
      discountValue: parseFloat(formData.discountValue),
      minPurchase: formData.minPurchase ? parseFloat(formData.minPurchase) : undefined,
      maxDiscount: formData.maxDiscount ? parseFloat(formData.maxDiscount) : undefined,
      usageLimit: formData.usageLimit ? parseInt(formData.usageLimit) : undefined,
      validFrom: new Date(formData.validFrom).toISOString(),
      validUpto: new Date(formData.validUpto).toISOString(),
    };

    if (editData?.id) {
      dispatch(updateCoupon({ id: editData.id, data }));
    } else {
      dispatch(createCoupon(data));
    }

    setOpen(false);
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      <div
        className="absolute inset-0 bg-black/50 backdrop-blur-sm"
        onClick={() => setOpen(false)}
      ></div>

      <div className="relative bg-card w-full max-w-2xl mx-4 rounded-xl shadow-2xl animate-fadeIn">
        <div className="flex justify-between items-center px-6 py-4 border-b border-border">
          <h2 className="text-xl font-semibold text-foreground">
            {editData?.id ? "Edit Coupon" : "Add New Coupon"}
          </h2>
          <button
            onClick={() => setOpen(false)}
            className="text-muted-foreground hover:text-destructive text-xl"
          >
            ✕
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-foreground">Coupon Code</label>
              <input
                type="text"
                name="code"
                required
                value={formData.code}
                onChange={handleChange}
                className="mt-1 w-full border border-border rounded-md px-3 py-2 bg-background text-foreground outline-none focus:ring-2 focus:ring-ring"
                placeholder="SUMMER2024"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-foreground">Discount Type</label>
              <select
                name="discountType"
                value={formData.discountType}
                onChange={handleChange}
                className="mt-1 w-full border border-border rounded-md px-3 py-2 bg-background text-foreground outline-none focus:ring-2 focus:ring-ring"
              >
                <option value="PERCENTAGE">Percentage</option>
                <option value="FIXED">Fixed Amount</option>
              </select>
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-foreground">Description</label>
            <textarea
              name="description"
              value={formData.description}
              onChange={handleChange}
              className="mt-1 w-full border border-border rounded-md px-3 py-2 bg-background text-foreground outline-none focus:ring-2 focus:ring-ring"
              placeholder="Optional description"
              rows={3}
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-foreground">
                Discount Value ({formData.discountType === 'PERCENTAGE' ? '%' : '₹'})
              </label>
              <input
                type="number"
                name="discountValue"
                required
                min="0"
                step={formData.discountType === 'PERCENTAGE' ? '0.01' : '0.01'}
                value={formData.discountValue}
                onChange={handleChange}
                className="mt-1 w-full border border-border rounded-md px-3 py-2 bg-background text-foreground outline-none focus:ring-2 focus:ring-ring"
                placeholder={formData.discountType === 'PERCENTAGE' ? '10.00' : '100.00'}
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-foreground">Minimum Purchase (₹)</label>
              <input
                type="number"
                name="minPurchase"
                min="0"
                step="0.01"
                value={formData.minPurchase}
                onChange={handleChange}
                className="mt-1 w-full border border-border rounded-md px-3 py-2 bg-background text-foreground outline-none focus:ring-2 focus:ring-ring"
                placeholder="500.00"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-foreground">Max Discount (₹)</label>
              <input
                type="number"
                name="maxDiscount"
                min="0"
                step="0.01"
                value={formData.maxDiscount}
                onChange={handleChange}
                className="mt-1 w-full border border-border rounded-md px-3 py-2 bg-background text-foreground outline-none focus:ring-2 focus:ring-ring"
                placeholder="500.00"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-foreground">Usage Limit</label>
              <input
                type="number"
                name="usageLimit"
                min="1"
                value={formData.usageLimit}
                onChange={handleChange}
                className="mt-1 w-full border border-border rounded-md px-3 py-2 bg-background text-foreground outline-none focus:ring-2 focus:ring-ring"
                placeholder="100"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-foreground">Valid From</label>
              <input
                type="date"
                name="validFrom"
                required
                value={formData.validFrom}
                onChange={handleChange}
                className="mt-1 w-full border border-border rounded-md px-3 py-2 bg-background text-foreground outline-none focus:ring-2 focus:ring-ring"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-foreground">Valid Upto</label>
              <input
                type="date"
                name="validUpto"
                required
                value={formData.validUpto}
                onChange={handleChange}
                className="mt-1 w-full border border-border rounded-md px-3 py-2 bg-background text-foreground outline-none focus:ring-2 focus:ring-ring"
              />
            </div>
          </div>

          {/* Footer Buttons */}
          <div className="flex justify-end gap-3 pt-4 border-t border-border">
            <button
              type="button"
              onClick={() => setOpen(false)}
              className="px-5 py-2 rounded-md border border-border text-muted-foreground hover:bg-muted"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-6 py-2 rounded-md gold-gradient text-primary-foreground font-semibold hover:opacity-90 transition-opacity"
            >
              {editData?.id ? "Update Coupon" : "Create Coupon"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AdminAddCoupons;
