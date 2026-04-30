import { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Plus, Trash2, Tag, Edit, RefreshCcw } from "lucide-react";
import { Table } from "antd";
import type { ColumnsType } from "antd/es/table";
import SEOHead from "@/components/common/SEOHead";
import { getCoupons, deleteCoupon } from "@/store/admin/adminThunk";
import { RootState } from "@/store";
import AdminAddCoupons from "./AdminAddCoupons";

const AdminCoupons = () => {
  const dispatch = useDispatch();
  const { coupons, loading } = useSelector((state: RootState) => state.admin);
  const [addOpen, setAddOpen] = useState(false);
  const [editData, setEditData] = useState<any | undefined>(undefined);

  useEffect(() => {
    dispatch(getCoupons());
  }, [dispatch]);


  const handleDelete = (id: string) => {
    if (window.confirm("Are you sure you want to delete this coupon?")) {
      dispatch(deleteCoupon(id));
    }
  };

  const handleRefresh = () => {
    dispatch(getCoupons());
  };

  const columns: ColumnsType<any> = [
    {
      title: "Code",
      dataIndex: "code",
      key: "code",
      render: (code: string) => <strong>{code}</strong>,
    },
    {
      title: "Type",
      dataIndex: "discountType",
      key: "discountType",
      render: (type: string) => <span className="text-muted-foreground">{type}</span>,
    },
    {
      title: "Discount",
      key: "discountValue",
      render: (_, coupon) => (
        <span>
          {coupon.discountType === "PERCENTAGE" ? `${coupon.discountValue}%` : `₹${coupon.discountValue}`}
        </span>
      ),
    },
    {
      title: "Min Order",
      dataIndex: "minPurchase",
      key: "minPurchase",
      render: (minPurchase: number) => (minPurchase ? `₹${minPurchase.toLocaleString()}` : "-")
    },
    {
      title: "Usage Limit",
      dataIndex: "usageLimit",
      key: "usageLimit",
      render: (usageLimit: number) => usageLimit || "-",
    },
    {
      title: "Expiry",
      dataIndex: "validUpto",
      key: "validUpto",
      render: (validUpto: string) => new Date(validUpto).toLocaleDateString("en-IN"),
    },
    {
      title: "Status",
      dataIndex: "isActive",
      key: "isActive",
      render: (isActive: boolean) => (
        <Tag color={isActive ? "green" : "red"}>
          {isActive ? "Active" : "Inactive"}
        </Tag>
      ),
    },
    {
      title: "Actions",
      key: "actions",
      render: (_, coupon) => (
        <div className="flex items-center gap-2">
          <button
            onClick={() => { setEditData(coupon); setAddOpen(true); }}
            className="p-1.5 rounded-md hover:bg-muted text-muted-foreground hover:text-primary transition-colors"
            title="Edit"
          >
            <Edit size={14} />
          </button>
          <button
            onClick={() => handleDelete(coupon.id)}
            className="p-1.5 rounded-md hover:bg-muted text-muted-foreground hover:text-destructive transition-colors"
            title="Delete"
          >
            <Trash2 size={14} />
          </button>
        </div>
      ),
    },
  ];

  return (
    <>
      <SEOHead title="Admin - Coupons" />
      <div>
        <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-6 gap-3">
          <h1 className="font-display text-2xl font-bold text-foreground">Coupons</h1>
          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={handleRefresh}
              className="inline-flex items-center justify-center rounded-sm border border-border px-3 py-2 text-sm text-muted-foreground hover:text-foreground hover:border-foreground transition"
              title="Refresh coupons"
            >
              <RefreshCcw size={16} />
            </button>
            <button
              onClick={() => { setEditData(undefined); setAddOpen(true); }}
              className="gold-gradient text-primary-foreground px-4 py-2 rounded-sm font-body text-sm font-semibold inline-flex items-center gap-2 shimmer"
            >
              <Plus size={16} /> Add Coupon
            </button>
          </div>
        </div>

        <div className="bg-card rounded-lg border border-border overflow-hidden shadow-sm">
          <Table
            columns={columns}
            dataSource={coupons}
            rowKey="id"
            loading={loading}
            pagination={{ pageSize: 10 }}
            className="rounded-b-lg"
          />
        </div>

        <AdminAddCoupons isOpen={addOpen} editData={editData} setOpen={setAddOpen} />
      </div>
    </>
  );
};

export default AdminCoupons;
