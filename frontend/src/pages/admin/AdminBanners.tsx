import React, { useState } from "react";
import { Image as ImageIcon, Plus, Edit2, Trash2, Eye, X, Calendar, ArrowRight } from "lucide-react";
import SEOHead from "@/components/common/SEOHead";
import { MOCK_BANNERS } from "@/services/mockData";
import { CMSBanner } from "@/types/admin.types";
import { PermissionGuard } from "@/acl/PermissionGuard";
import { toast } from "sonner";
import { motion, AnimatePresence } from "framer-motion";

export const AdminBanners: React.FC = () => {
  const [banners, setBanners] = useState<CMSBanner[]>(MOCK_BANNERS);
  const [modalOpen, setModalOpen] = useState(false);
  const [previewBanner, setPreviewBanner] = useState<CMSBanner | null>(null);
  const [editingBanner, setEditingBanner] = useState<CMSBanner | null>(null);

  const [formData, setFormData] = useState<Partial<CMSBanner>>({
    title: "",
    subtitle: "",
    desktopImage: "https://images.unsplash.com/photo-1599643478518-a784e5dc4c8f?auto=format&fit=crop&w=1600&q=80",
    mobileImage: "https://images.unsplash.com/photo-1599643478518-a784e5dc4c8f?auto=format&fit=crop&w=800&q=80",
    ctaText: "Shop Now",
    ctaUrl: "/products",
    status: "published",
    placement: "hero",
  });

  const handleOpenModal = (ban?: CMSBanner) => {
    if (ban) {
      setEditingBanner(ban);
      setFormData(ban);
    } else {
      setEditingBanner(null);
      setFormData({
        title: "",
        subtitle: "",
        desktopImage: "https://images.unsplash.com/photo-1599643478518-a784e5dc4c8f?auto=format&fit=crop&w=1600&q=80",
        mobileImage: "https://images.unsplash.com/photo-1599643478518-a784e5dc4c8f?auto=format&fit=crop&w=800&q=80",
        ctaText: "Shop Now",
        ctaUrl: "/products",
        status: "published",
        placement: "hero",
      });
    }
    setModalOpen(true);
  };

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.title) return;

    if (editingBanner) {
      setBanners(
        banners.map((b) => (b.id === editingBanner.id ? ({ ...b, ...formData } as CMSBanner) : b))
      );
      toast.success(`Banner "${formData.title}" updated.`);
    } else {
      const created: CMSBanner = {
        id: `ban-${Date.now()}`,
        title: formData.title!,
        subtitle: formData.subtitle || "",
        desktopImage: formData.desktopImage || "",
        mobileImage: formData.mobileImage || "",
        ctaText: formData.ctaText || "Shop Now",
        ctaUrl: formData.ctaUrl || "/products",
        startDate: "2026-03-01",
        endDate: "2026-12-31",
        sortOrder: banners.length + 1,
        status: formData.status || "published",
        placement: formData.placement || "hero",
      };
      setBanners([created, ...banners]);
      toast.success(`New banner created.`);
    }
    setModalOpen(false);
  };

  const handleDelete = (id: string) => {
    setBanners(banners.filter((b) => b.id !== id));
    toast.success("Banner deleted.");
  };

  return (
    <div className="space-y-8 font-body">
      <SEOHead title="CMS & Banners Management | JEWELO Admin" description="Manage homepage and promotional banners." />

      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="font-display text-2xl sm:text-3xl font-bold tracking-tight text-foreground">
            CMS & Promotional Banners
          </h1>
          <p className="text-xs text-muted-foreground mt-1">
            Configure visual campaign banners for homepage hero, categories, and festive sales.
          </p>
        </div>

        <PermissionGuard permission="cms.update">
          <button
            onClick={() => handleOpenModal()}
            className="px-4 py-2.5 bg-[#C5A880] hover:bg-[#B39366] text-white text-xs font-bold uppercase tracking-wider rounded-lg shadow flex items-center gap-1.5"
          >
            <Plus size={15} />
            <span>Create Banner</span>
          </button>
        </PermissionGuard>
      </div>

      {/* Banners Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {banners.map((banner) => (
          <div
            key={banner.id}
            className="rounded-2xl bg-card border border-border overflow-hidden shadow-sm flex flex-col justify-between"
          >
            <div className="aspect-[16/9] relative overflow-hidden bg-secondary">
              <img src={banner.desktopImage} alt={banner.title} className="w-full h-full object-cover" />
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />
              <div className="absolute bottom-4 left-4 right-4 text-white">
                <span className="text-[10px] font-bold uppercase tracking-wider text-[#D4AF37] block">
                  {banner.placement} placement
                </span>
                <h3 className="font-display font-bold text-lg">{banner.title}</h3>
                <p className="text-xs text-white/80 line-clamp-1">{banner.subtitle}</p>
              </div>
            </div>

            <div className="p-4 border-t border-border flex items-center justify-between text-xs">
              <span
                className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase ${
                  banner.status === "published"
                    ? "bg-emerald-100 text-emerald-700"
                    : banner.status === "draft"
                    ? "bg-secondary text-muted-foreground"
                    : "bg-amber-100 text-amber-700"
                }`}
              >
                {banner.status}
              </span>

              <div className="flex items-center gap-2">
                <button
                  onClick={() => setPreviewBanner(banner)}
                  className="px-3 py-1.5 rounded-lg bg-secondary text-foreground text-xs font-semibold flex items-center gap-1"
                >
                  <Eye size={12} />
                  <span>Preview</span>
                </button>
                <PermissionGuard permission="cms.update">
                  <button
                    onClick={() => handleOpenModal(banner)}
                    className="p-1.5 rounded text-muted-foreground hover:text-foreground"
                  >
                    <Edit2 size={14} />
                  </button>
                  <button
                    onClick={() => handleDelete(banner.id)}
                    className="p-1.5 rounded text-muted-foreground hover:text-destructive"
                  >
                    <Trash2 size={14} />
                  </button>
                </PermissionGuard>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* CREATE / EDIT MODAL */}
      <AnimatePresence>
        {modalOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 bg-black/70 backdrop-blur-sm"
              onClick={() => setModalOpen(false)}
            />
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="relative bg-background border border-border rounded-2xl max-w-lg w-full z-50 p-6 space-y-4 shadow-2xl"
            >
              <div className="flex justify-between items-center pb-2 border-b border-border">
                <h3 className="font-display font-bold text-lg text-foreground">
                  {editingBanner ? "Edit Campaign Banner" : "New Campaign Banner"}
                </h3>
                <button onClick={() => setModalOpen(false)} className="p-1 text-muted-foreground">
                  <X size={18} />
                </button>
              </div>

              <form onSubmit={handleSave} className="space-y-3 text-xs">
                <div className="space-y-1">
                  <label className="font-semibold text-foreground">Banner Headline</label>
                  <input
                    type="text"
                    value={formData.title}
                    onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                    className="w-full py-2 px-3 rounded border bg-background"
                    required
                  />
                </div>

                <div className="space-y-1">
                  <label className="font-semibold text-foreground">Subtitle / Promotional Text</label>
                  <input
                    type="text"
                    value={formData.subtitle}
                    onChange={(e) => setFormData({ ...formData, subtitle: e.target.value })}
                    className="w-full py-2 px-3 rounded border bg-background"
                  />
                </div>

                <div className="space-y-1">
                  <label className="font-semibold text-foreground">Desktop Image URL</label>
                  <input
                    type="text"
                    value={formData.desktopImage}
                    onChange={(e) => setFormData({ ...formData, desktopImage: e.target.value })}
                    className="w-full py-2 px-3 rounded border bg-background"
                  />
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div className="space-y-1">
                    <label className="font-semibold text-foreground">CTA Text</label>
                    <input
                      type="text"
                      value={formData.ctaText}
                      onChange={(e) => setFormData({ ...formData, ctaText: e.target.value })}
                      className="w-full py-2 px-3 rounded border bg-background"
                    />
                  </div>
                  <div className="space-y-1">
                    <label className="font-semibold text-foreground">CTA Link URL</label>
                    <input
                      type="text"
                      value={formData.ctaUrl}
                      onChange={(e) => setFormData({ ...formData, ctaUrl: e.target.value })}
                      className="w-full py-2 px-3 rounded border bg-background"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div className="space-y-1">
                    <label className="font-semibold text-foreground">Placement</label>
                    <select
                      value={formData.placement}
                      onChange={(e) => setFormData({ ...formData, placement: e.target.value as any })}
                      className="w-full py-2 px-3 rounded border bg-background"
                    >
                      <option value="hero">Homepage Hero</option>
                      <option value="promo">Promotional Banner</option>
                      <option value="category">Category Banner</option>
                    </select>
                  </div>

                  <div className="space-y-1">
                    <label className="font-semibold text-foreground">Status</label>
                    <select
                      value={formData.status}
                      onChange={(e) => setFormData({ ...formData, status: e.target.value as any })}
                      className="w-full py-2 px-3 rounded border bg-background"
                    >
                      <option value="published">Published</option>
                      <option value="draft">Draft</option>
                      <option value="scheduled">Scheduled</option>
                      <option value="expired">Expired</option>
                    </select>
                  </div>
                </div>

                <div className="pt-2 flex justify-end gap-2">
                  <button type="button" onClick={() => setModalOpen(false)} className="px-4 py-2 border rounded">
                    Cancel
                  </button>
                  <button type="submit" className="px-5 py-2 bg-[#C5A880] text-white font-bold rounded shadow">
                    Save Banner
                  </button>
                </div>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* LIVE PREVIEW MODAL */}
      <AnimatePresence>
        {previewBanner && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 bg-black/80 backdrop-blur-sm"
              onClick={() => setPreviewBanner(null)}
            />
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="relative bg-background border border-border rounded-3xl max-w-4xl w-full z-50 overflow-hidden shadow-2xl"
            >
              <div className="aspect-[21/9] relative overflow-hidden bg-black text-white p-8 flex flex-col justify-end">
                <img
                  src={previewBanner.desktopImage}
                  alt="preview"
                  className="absolute inset-0 w-full h-full object-cover brightness-[0.6]"
                />
                <div className="relative z-10 space-y-2 max-w-lg">
                  <span className="text-[10px] font-bold uppercase tracking-[0.25em] text-[#D4AF37]">
                    Live Storefront Preview
                  </span>
                  <h2 className="font-display text-3xl font-bold text-white">{previewBanner.title}</h2>
                  <p className="text-xs text-white/80">{previewBanner.subtitle}</p>
                  <div className="pt-2">
                    <span className="inline-block px-6 py-2.5 bg-[#C5A880] text-white text-xs font-bold uppercase tracking-wider rounded shadow">
                      {previewBanner.ctaText}
                    </span>
                  </div>
                </div>
              </div>
              <div className="p-4 bg-card flex justify-end">
                <button
                  onClick={() => setPreviewBanner(null)}
                  className="px-5 py-2 border border-border text-xs font-semibold rounded-lg"
                >
                  Close Preview
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default AdminBanners;
