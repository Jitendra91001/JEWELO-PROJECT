import React, { useState } from "react";
import { Sparkles, Plus, Edit2, Trash2, Eye, X, Calendar } from "lucide-react";
import SEOHead from "@/components/common/SEOHead";
import { MOCK_COLLECTIONS } from "@/services/mockData";
import { Collection } from "@/types/product.types";
import { PermissionGuard } from "@/acl/PermissionGuard";
import { toast } from "sonner";
import { motion, AnimatePresence } from "framer-motion";

export const AdminCollections: React.FC = () => {
  const [collections, setCollections] = useState<Collection[]>(MOCK_COLLECTIONS);
  const [modalOpen, setModalOpen] = useState(false);
  const [editingCollection, setEditingCollection] = useState<Collection | null>(null);

  const [formData, setFormData] = useState<Partial<Collection>>({
    name: "",
    slug: "",
    banner: "https://images.unsplash.com/photo-1599643478518-a784e5dc4c8f?auto=format&fit=crop&w=1200&q=80",
    description: "",
    status: "active",
  });

  const handleOpenModal = (col?: Collection) => {
    if (col) {
      setEditingCollection(col);
      setFormData(col);
    } else {
      setEditingCollection(null);
      setFormData({
        name: "",
        slug: "",
        banner: "https://images.unsplash.com/photo-1599643478518-a784e5dc4c8f?auto=format&fit=crop&w=1200&q=80",
        description: "",
        status: "active",
      });
    }
    setModalOpen(true);
  };

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name) return;

    if (editingCollection) {
      setCollections(
        collections.map((c) =>
          c.id === editingCollection.id ? ({ ...c, ...formData } as Collection) : c
        )
      );
      toast.success(`Collection "${formData.name}" updated.`);
    } else {
      const created: Collection = {
        id: `col-${Date.now()}`,
        name: formData.name!,
        slug: formData.slug || formData.name!.toLowerCase().replace(/\s+/g, "-"),
        banner: formData.banner || "",
        description: formData.description || "",
        productsCount: 0,
        status: formData.status || "active",
      };
      setCollections([created, ...collections]);
      toast.success(`New collection "${created.name}" created.`);
    }
    setModalOpen(false);
  };

  const handleDelete = (id: string) => {
    setCollections(collections.filter((c) => c.id !== id));
    toast.success("Collection removed.");
  };

  return (
    <div className="space-y-8 font-body">
      <SEOHead title="Collections Management | JEWELO Admin" description="Curate royal thematic collections." />

      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="font-display text-2xl sm:text-3xl font-bold tracking-tight text-foreground">
            Thematic Collections Management
          </h1>
          <p className="text-xs text-muted-foreground mt-1">
            Curate signature bridal, polki, and solitaire master collections.
          </p>
        </div>

        <PermissionGuard permission="category.create">
          <button
            onClick={() => handleOpenModal()}
            className="px-4 py-2.5 bg-[#C5A880] hover:bg-[#B39366] text-white text-xs font-bold uppercase tracking-wider rounded-lg shadow flex items-center gap-1.5"
          >
            <Plus size={15} />
            <span>Create Collection</span>
          </button>
        </PermissionGuard>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {collections.map((col) => (
          <div
            key={col.id}
            className="rounded-2xl bg-card border border-border overflow-hidden shadow-sm hover:shadow-xl transition-all duration-300 flex flex-col justify-between"
          >
            <div className="aspect-[16/9] relative overflow-hidden bg-secondary">
              <img src={col.banner} alt={col.name} className="w-full h-full object-cover" />
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent" />
              <span className="absolute bottom-3 left-3 px-2 py-0.5 rounded bg-background/90 text-foreground font-bold text-[10px] uppercase">
                {col.productsCount || 20}+ Pieces
              </span>
            </div>

            <div className="p-5 space-y-3 flex-1 flex flex-col justify-between">
              <div className="space-y-1">
                <h3 className="font-display font-bold text-base text-foreground">{col.name}</h3>
                <p className="text-xs text-muted-foreground line-clamp-2">{col.description}</p>
              </div>

              <div className="pt-3 border-t border-border flex items-center justify-between">
                <span
                  className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase ${
                    col.status === "active" ? "bg-emerald-100 text-emerald-700" : "bg-muted text-muted-foreground"
                  }`}
                >
                  {col.status}
                </span>

                <div className="flex items-center gap-1">
                  <PermissionGuard permission="category.update">
                    <button
                      onClick={() => handleOpenModal(col)}
                      className="p-1.5 rounded text-muted-foreground hover:text-foreground"
                    >
                      <Edit2 size={14} />
                    </button>
                  </PermissionGuard>
                  <PermissionGuard permission="category.delete">
                    <button
                      onClick={() => handleDelete(col.id)}
                      className="p-1.5 rounded text-muted-foreground hover:text-destructive"
                    >
                      <Trash2 size={14} />
                    </button>
                  </PermissionGuard>
                </div>
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
              className="relative bg-background border border-border rounded-2xl max-w-md w-full z-50 p-6 space-y-4 shadow-2xl"
            >
              <div className="flex justify-between items-center pb-2 border-b border-border">
                <h3 className="font-display font-bold text-lg text-foreground">
                  {editingCollection ? "Edit Collection" : "Create New Collection"}
                </h3>
                <button onClick={() => setModalOpen(false)} className="p-1 text-muted-foreground">
                  <X size={18} />
                </button>
              </div>

              <form onSubmit={handleSave} className="space-y-3 text-xs">
                <div className="space-y-1">
                  <label className="font-semibold text-foreground">Collection Title</label>
                  <input
                    type="text"
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    className="w-full py-2 px-3 rounded border bg-background"
                    required
                  />
                </div>

                <div className="space-y-1">
                  <label className="font-semibold text-foreground">Banner Image URL</label>
                  <input
                    type="text"
                    value={formData.banner}
                    onChange={(e) => setFormData({ ...formData, banner: e.target.value })}
                    className="w-full py-2 px-3 rounded border bg-background"
                  />
                </div>

                <div className="space-y-1">
                  <label className="font-semibold text-foreground">Story / Description</label>
                  <textarea
                    value={formData.description}
                    onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                    rows={3}
                    className="w-full py-2 px-3 rounded border bg-background"
                  />
                </div>

                <div className="pt-2 flex justify-end gap-2">
                  <button type="button" onClick={() => setModalOpen(false)} className="px-4 py-2 border rounded">
                    Cancel
                  </button>
                  <button type="submit" className="px-5 py-2 bg-[#C5A880] text-white font-bold rounded shadow">
                    Save Collection
                  </button>
                </div>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default AdminCollections;
