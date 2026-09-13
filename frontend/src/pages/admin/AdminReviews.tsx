import React, { useState } from "react";
import { MessageSquare, Star, Check, X, EyeOff, Trash2, Search, CheckCircle2 } from "lucide-react";
import SEOHead from "@/components/common/SEOHead";
import { MOCK_REVIEWS } from "@/services/mockData";
import { ProductReview } from "@/types/product.types";
import { PermissionGuard } from "@/acl/PermissionGuard";
import { toast } from "sonner";
import type { ColumnsType } from "antd/es/table";
import { CustomTable, LuxuryButton, LuxuryBadge, LuxuryRating } from "@/components/elements";

export const AdminReviews: React.FC = () => {
  const [reviews, setReviews] = useState<ProductReview[]>(MOCK_REVIEWS);
  const [statusFilter, setStatusFilter] = useState<string>("ALL");
  const [searchQuery, setSearchQuery] = useState("");

  const filteredReviews = reviews.filter((r) => {
    const matchesStatus = statusFilter === "ALL" || r.status === statusFilter;
    const matchesSearch =
      (r.productName || "").toLowerCase().includes(searchQuery.toLowerCase()) ||
      r.customerName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      r.comment.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesStatus && matchesSearch;
  });

  const handleUpdateStatus = (id: string, status: "approved" | "rejected" | "hidden") => {
    setReviews(reviews.map((r) => (r.id === id ? { ...r, status } : r)));
    toast.success(`Review status updated to ${status}.`);
  };

  const handleDelete = (id: string) => {
    setReviews(reviews.filter((r) => r.id !== id));
    toast.success("Review permanently removed.");
  };

  const reviewColumns: ColumnsType<ProductReview> = [
    {
      title: "Masterpiece",
      dataIndex: "productName",
      key: "productName",
      render: (p: string) => (
        <span className="font-display font-medium text-xs text-foreground block max-w-xs truncate">
          {p || "Fine Jewellery Piece"}
        </span>
      ),
    },
    {
      title: "Patron",
      dataIndex: "customerName",
      key: "customerName",
      render: (name: string) => <span className="font-semibold text-xs text-foreground">{name}</span>,
    },
    {
      title: "Rating",
      dataIndex: "rating",
      key: "rating",
      render: (rating: number) => <LuxuryRating value={rating} size="sm" showScore />,
    },
    {
      title: "Client Feedback",
      key: "comment",
      render: (_, rev) => (
        <div className="max-w-sm">
          <span className="font-semibold text-foreground text-xs block truncate">{rev.title}</span>
          <span className="text-muted-foreground text-xs font-light line-clamp-1">{rev.comment}</span>
        </div>
      ),
    },
    {
      title: "Date",
      dataIndex: "createdAt",
      key: "createdAt",
      render: (d: string) => <span className="text-xs text-muted-foreground font-mono">{d}</span>,
    },
    {
      title: "Status",
      key: "status",
      render: (_, rev) => (
        <LuxuryBadge
          variant={rev.status === "approved" ? "inStock" : rev.status === "pending" ? "lowStock" : "outOfStock"}
          dot
        >
          {rev.status}
        </LuxuryBadge>
      ),
    },
    {
      title: "Moderation",
      key: "actions",
      align: "right",
      render: (_, rev) => (
        <PermissionGuard permission="reviews.update">
          <div className="flex items-center justify-end gap-1.5">
            {rev.status !== "approved" && (
              <button
                type="button"
                onClick={() => handleUpdateStatus(rev.id, "approved")}
                className="p-1.5 rounded-lg bg-emerald-50 dark:bg-emerald-950/40 text-emerald-700 dark:text-emerald-400 hover:bg-emerald-100 transition"
                title="Approve & Publish"
              >
                <Check size={13} />
              </button>
            )}
            {rev.status !== "rejected" && (
              <button
                type="button"
                onClick={() => handleUpdateStatus(rev.id, "rejected")}
                className="p-1.5 rounded-lg bg-red-50 dark:bg-red-950/40 text-red-600 hover:bg-red-100 transition"
                title="Reject Review"
              >
                <X size={13} />
              </button>
            )}
            <button
              type="button"
              onClick={() => handleDelete(rev.id)}
              className="p-1.5 rounded-lg hover:bg-secondary text-muted-foreground hover:text-destructive transition"
              title="Delete"
            >
              <Trash2 size={13} />
            </button>
          </div>
        </PermissionGuard>
      ),
    },
  ];

  return (
    <div className="space-y-8 font-body">
      <SEOHead title="Review Moderation | JEWELO Admin" description="Moderate customer product ratings and reviews." />

      <CustomTable
        kicker="PATRON SENTIMENT"
        title="Patron Review Moderation"
        subtitle="Approve or moderate customer feedback and star ratings before public storefront display."
        columns={reviewColumns}
        dataSource={filteredReviews}
        rowKey="id"
        searchable
        searchValue={searchQuery}
        onSearch={setSearchQuery}
        searchPlaceholder="Search reviews by masterpiece, patron, or text..."
        filters={[
          {
            key: "status",
            label: "Status",
            value: statusFilter,
            onChange: setStatusFilter,
            options: [
              { label: "All Reviews", value: "ALL" },
              { label: "Pending Approval", value: "pending" },
              { label: "Approved & Public", value: "approved" },
              { label: "Rejected", value: "rejected" },
              { label: "Hidden", value: "hidden" },
            ],
          },
        ]}
        pagination={{ pageSize: 10, total: filteredReviews.length }}
      />
    </div>
  );
};

export default AdminReviews;

