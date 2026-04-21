import { useState, useEffect } from "react";
import { useAppDispatch, useSelector } from "@/store/hooks";
import { Plus, Edit, Trash2, Search, Eye, EyeOff, Layers, RefreshCcw } from "lucide-react";
import AdminAddCategory from "./AdminAddCategory/AdminAddCategory";
import AdminViewCategory from "./AdminAddCategory/AdminViewCategory";
import AdminDeleteConfirm from "./UtilsComponentAdmin/AdminDeleteConfirm";
import { getCategories, deleteCategory, toggleCategoryStatus } from "@/store/admin/adminThunk";
import { RootState } from "@/store";

interface Category {
  id: string;
  name: string;
  products: number;
  status: boolean;
}

const initialCategories: Category[] = [
  { id: "1", name: "Rings", products: 45, status: true },
  { id: "2", name: "Necklaces", products: 32, status: true },
  { id: "3", name: "Earrings", products: 56, status: true },
  { id: "4", name: "Bangles", products: 28, status: true },
  { id: "5", name: "Bracelets", products: 18, status: false },
  { id: "6", name: "Pendants", products: 22, status: true },
];

const AdminCategories = () => {
  const dispatch = useAppDispatch();
  const { categories, loading } = useSelector((state: RootState) => state.admin);
  const [search, setSearch] = useState("");
  const [addOpen, setAddOpen] = useState(false);
  const [editData, setEditData] = useState<any | undefined>();
  const [viewOpen, setViewOpen] = useState(false);
  const [viewCategory, setViewCategory] = useState<any | undefined>();
  const [deleteOpen, setDeleteOpen] = useState(false);
  const [deleteCategoryData, setDeleteCategoryData] = useState<any | undefined>();

  useEffect(() => {
    dispatch(getCategories({ search, active: "false" }));
  }, [dispatch, search]);

  const handleDelete = () => {
    if (deleteCategoryData) {
      dispatch(deleteCategory(deleteCategoryData.id));
      setDeleteOpen(false);
      setDeleteCategoryData(undefined);
    }
  };

  const handleRefresh = () => {
    dispatch(getCategories({ search, active: "false" }));
  };

  const handleToggleStatus = (id: string) => {
    dispatch(toggleCategoryStatus(id)).then(() => {
      dispatch(getCategories({ search, active: "false" }));
    });
  };

  return (
    <div className="min-h-screen bg-background p-4 md:p-8">
      <div className="max-w-7xl mx-auto space-y-6">
        {/* Header */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <h1 className="text-2xl font-bold text-foreground">Categories</h1>
          <button
            onClick={() => { setEditData(undefined); setAddOpen(true); }}
            className="gold-gradient text-primary-foreground px-4 py-2 rounded-md font-semibold text-sm inline-flex items-center gap-2 shimmer hover:opacity-90 transition-opacity"
          >
            <Plus size={16} /> Add Category
          </button>
        </div>

        {/* Search */}
        <div className="flex items-center gap-2 max-w-sm">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" size={16} />
            <input
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full pl-9 pr-4 py-2 border border-input rounded-md text-sm bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-ring/30"
              placeholder="Search categories..."
            />
          </div>
          <button
            type="button"
            onClick={handleRefresh}
            className="inline-flex items-center justify-center rounded-md border border-border px-3 py-2 text-muted-foreground hover:border-foreground hover:text-foreground transition"
            title="Refresh categories"
          >
            <RefreshCcw size={16} />
          </button>
        </div>

        {/* Card Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {categories.map((cat: any) => (
            <div key={cat.id} className="bg-card rounded-lg border border-border p-5 shadow-sm hover:shadow-md transition-shadow">
              <div className="flex items-start justify-between mb-4">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-md bg-accent/50 flex items-center justify-center overflow-hidden">
                    {cat.image ? (
                      <img
                        src={`${import.meta.env.VITE_API_URL || 'http://localhost:5000'}${cat.image}`}
                        alt={cat.name}
                        className="w-full h-full object-cover"
                        onError={(e) => {
                          e.currentTarget.style.display = 'none';
                          e.currentTarget.nextElementSibling?.classList.remove('hidden');
                        }}
                      />
                    ) : null}
                    <Layers size={18} className={`text-primary ${cat.image ? 'hidden' : ''}`} />
                  </div>
                  <div>
                    <h3 className="font-semibold text-foreground">{cat.name}</h3>
                    <p className="text-xs text-muted-foreground">{cat._count?.products || cat.products || 0} products</p>
                  </div>
                </div>
                <span className={`inline-block px-2 py-0.5 rounded-full text-xs font-medium ${cat.isActive ? "bg-accent text-accent-foreground" : "bg-muted text-muted-foreground"}`}>
                  {cat.isActive ? "Active" : "Inactive"}
                </span>
              </div>

              <div className="flex items-center gap-2 pt-3 border-t border-border">
                <button
                  onClick={() => { setEditData(cat); setAddOpen(true); }}
                  className="p-1.5 rounded-md hover:bg-muted text-muted-foreground hover:text-primary transition-colors"
                  title="Edit"
                >
                  <Edit size={15} />
                </button>
                <button
                  onClick={() => handleToggleStatus(cat.id)}
                  className="p-1.5 rounded-md hover:bg-muted text-muted-foreground hover:text-primary transition-colors"
                  title={cat.isActive ? "Active" : "Inactive"}
                >
                  {cat.isActive ? <Eye size={15} /> : <EyeOff size={15} />}
                </button>
                <button
                  onClick={() => { setDeleteCategoryData(cat); setDeleteOpen(true); }}
                  className="p-1.5 rounded-md hover:bg-muted text-muted-foreground hover:text-destructive transition-colors"
                  title="Delete"
                >
                  <Trash2 size={15} />
                </button>
              </div>
            </div>
          ))}
          {categories.length === 0 && !loading && (
            <div className="col-span-full text-center py-8 text-muted-foreground">No categories found.</div>
          )}
          {loading && (
            <div className="col-span-full text-center py-8 text-muted-foreground">Loading categories...</div>
          )}
        </div>

        {/* Modals */}
        <AdminAddCategory isOpen={addOpen} editData={editData} setOpen={setAddOpen} />
        <AdminViewCategory isOpen={viewOpen} category={viewCategory} setOpen={setViewOpen} />
        <AdminDeleteConfirm
          isOpen={deleteOpen}
          productName={deleteCategoryData?.name || ""}
          onConfirm={handleDelete}
          onCancel={() => { setDeleteOpen(false); setDeleteCategoryData(undefined); }}
        />
      </div>
    </div>
  );
};

export default AdminCategories;
