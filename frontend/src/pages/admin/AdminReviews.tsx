import React, { useState } from "react";
import { MessageSquare, Star, Check, X, EyeOff, Trash2, Search, CheckCircle2 } from "lucide-react";
import SEOHead from "@/components/common/SEOHead";
import { MOCK_REVIEWS } from "@/services/mockData";
import { ProductReview } from "@/types/product.types";
import { PermissionGuard } from "@/acl/PermissionGuard";
import { toast } from "sonner";

export const AdminReviews: React.FC = () => {
  const [reviews, setReviews] = useState<ProductReview[]>(MOCK_REVIEWS);
  const [statusFilter, setStatusFilter] = useState<string>("ALL");

  const filteredReviews =
    statusFilter === "ALL" ? reviews : reviews.filter((r) => r.status === statusFilter);

  const handleUpdateStatus = (id: string, status: "approved" | "rejected" | "hidden") => {
    setReviews(reviews.map((r) => (r.id === id ? { ...r, status } : r)));
    toast.success(`Review status updated to ${status}.`);
  };

  const handleDelete = (id: string) => {
    setReviews(reviews.filter((r) => r.id !== id));
    toast.success("Review permanently removed.");
  };

  return (
    <div className="space-y-8 font-body">
      <SEOHead title="Review Moderation | JEWELO Admin" description="Moderate customer product ratings and reviews." />

      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="font-display text-2xl sm:text-3xl font-bold tracking-tight text-foreground">
            Patron Review Moderation
          </h1>
          <p className="text-xs text-muted-foreground mt-1">
            Approve or moderate customer feedback before display on public product pages.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <span className="text-xs text-muted-foreground">Status:</span>
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="bg-card text-foreground text-xs rounded-lg px-3 py-1.5 border border-border"
          >
            <option value="ALL">All Reviews</option>
            <option value="pending">Pending Approval</option>
            <option value="approved">Approved & Public</option>
            <option value="rejected">Rejected</option>
            <option value="hidden">Hidden</option>
          </select>
        </div>
      </div>

      <div className="p-6 rounded-2xl bg-card border border-border shadow-sm space-y-4">
        <div className="overflow-x-auto">
          <table className="w-full text-xs text-left">
            <thead>
              <tr className="border-b border-border text-muted-foreground">
                <th className="pb-3 font-semibold">Product</th>
                <th className="pb-3 font-semibold">Patron</th>
                <th className="pb-3 font-semibold">Rating</th>
                <th className="pb-3 font-semibold">Review Snippet</th>
                <th className="pb-3 font-semibold">Date</th>
                <th className="pb-3 font-semibold">Status</th>
                <th className="pb-3 font-semibold text-right">Moderation</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border/60">
              {filteredReviews.map((rev) => (
                <tr key={rev.id} className="hover:bg-secondary/40">
                  <td className="py-3 font-semibold text-foreground max-w-xs truncate">
                    {rev.productName || "Fine Jewellery"}
                  </td>
                  <td className="py-3 text-foreground font-medium">{rev.customerName}</td>
                  <td className="py-3">
                    <div className="flex items-center gap-1 text-amber-500">
                      <Star size={12} className="fill-current" />
                      <span className="font-bold text-foreground">{rev.rating}</span>
                    </div>
                  </td>
                  <td className="py-3 max-w-sm">
                    <span className="font-bold text-foreground block truncate">{rev.title}</span>
                    <span className="text-muted-foreground line-clamp-1">{rev.comment}</span>
                  </td>
                  <td className="py-3 text-muted-foreground">{rev.createdAt}</td>
                  <td className="py-3">
                    <span
                      className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase ${
                        rev.status === "approved"
                          ? "bg-emerald-100 text-emerald-700"
                          : rev.status === "pending"
                          ? "bg-amber-100 text-amber-700 animate-pulse"
                          : "bg-destructive/15 text-destructive"
                      }`}
                    >
                      {rev.status}
                    </span>
                  </td>
                  <td className="py-3 text-right">
                    <PermissionGuard permission="reviews.update">
                      <div className="flex items-center justify-end gap-1.5">
                        {rev.status !== "approved" && (
                          <button
                            onClick={() => handleUpdateStatus(rev.id, "approved")}
                            className="p-1.5 rounded bg-emerald-100 text-emerald-700 hover:bg-emerald-200"
                            title="Approve Review"
                          >
                            <Check size={14} />
                          </button>
                        )}
                        {rev.status !== "rejected" && (
                          <button
                            onClick={() => handleUpdateStatus(rev.id, "rejected")}
                            className="p-1.5 rounded bg-red-100 text-red-700 hover:bg-red-200"
                            title="Reject Review"
                          >
                            <X size={14} />
                          </button>
                        )}
                        <button
                          onClick={() => handleDelete(rev.id)}
                          className="p-1.5 rounded text-muted-foreground hover:text-destructive"
                          title="Delete"
                        >
                          <Trash2 size={14} />
                        </button>
                      </div>
                    </PermissionGuard>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default AdminReviews;
