import { useState, useEffect } from "react";
import { useAppDispatch, useAppSelector } from "@/store/hooks";
import { Edit, Trash2 } from "lucide-react";
import { Tag } from "antd";
import type { ColumnsType } from "antd/es/table";
import { CustomTable, LuxuryButton, LuxuryBadge } from "@/components/elements";
import SEOHead from "@/components/common/SEOHead";
import { getCoupons, deleteCoupon } from "@/store/admin/adminThunk";
import { RootState } from "@/store";
import AdminAddCoupons from "./AdminAddCoupons";

const AdminCoupons = () => {
  const dispatch = useAppDispatch();
  const { coupons, loading } = useAppSelector((state: RootState) => state.admin);
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
      <SEOHead title="Admin - Coupons | JEWELO" />
      <div className="space-y-6 font-body">
        <CustomTable
          kicker="PRIVILEGE & PROMOTIONS"
          title="Boutique Promotional Coupons"
          subtitle="Manage VIP discount codes, cart value thresholds, and redemption expirations."
          columns={columns}
          dataSource={coupons}
          rowKey="id"
          loading={loading}
          onRefresh={handleRefresh}
          searchable
          searchPlaceholder="Search coupons..."
          actions={
            <LuxuryButton
              variant="primary-gold"
              size="sm"
              onClick={() => {
                setEditData(undefined);
                setAddOpen(true);
              }}
            >
              Add Coupon
            </LuxuryButton>
          }
          pagination={{ pageSize: 10, total: coupons.length }}
        />

        <AdminAddCoupons isOpen={addOpen} editData={editData} setOpen={setAddOpen} />
      </div>
    </>
  );
};

export default AdminCoupons;

