import { useState, useEffect } from "react";
import { useAppDispatch, useAppSelector } from "@/store/hooks";
import { Plus, Edit, Trash2, Search, Eye, EyeOff, Layers, RefreshCcw } from "lucide-react";
import { Table, Tag } from "antd";
import type { ColumnsType } from "antd/es/table";
import AdminAddCategory from "./AdminAddCategory/AdminAddCategory";
import AdminViewCategory from "./AdminAddCategory/AdminViewCategory";
import AdminDeleteConfirm from "./UtilsComponentAdmin/AdminDeleteConfirm";
import { getCategories, deleteCategory, toggleCategoryStatus } from "@/store/admin/adminThunk";
import { RootState } from "@/store";
import { toast } from "sonner";

interface AdminCategory {
  id: string;
  name: string;
  description?: string;
  slug?: string;
  image?: string;
  isActive: boolean;
  _count?: {
    products: number;
  };
  products?: number;
}

const AdminCategories = () => {
  const dispatch = useAppDispatch();
  const { categories, loading } = useAppSelector((state: RootState) => state.admin);
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("all"); // "all", "active", "inactive"
  const [addOpen, setAddOpen] = useState(false);
  const [editData, setEditData] = useState<AdminCategory | undefined>(undefined);
  const [viewOpen, setViewOpen] = useState(false);
  const [viewCategory, setViewCategory] = useState<AdminCategory | undefined>(undefined);
  const [deleteOpen, setDeleteOpen] = useState(false);
  const [deleteCategoryData, setDeleteCategoryData] = useState<AdminCategory | undefined>(undefined);

  useEffect(() => {
    const activeParam = statusFilter === "all" ? "false" : statusFilter === "active" ? "true" : "false";
    dispatch(getCategories({ search, active: activeParam }));
  }, [dispatch, search, statusFilter]);

  const handleDelete = () => {
    if (deleteCategoryData) {
      dispatch(deleteCategory(deleteCategoryData.id));
      setDeleteOpen(false);
      setDeleteCategoryData(undefined);
    }
  };

  const handleRefresh = () => {
    const activeParam = statusFilter === "all" ? "false" : statusFilter === "active" ? "true" : "false";
    dispatch(getCategories({ search, active: activeParam }));
  };

  const columns: ColumnsType<AdminCategory> = [
    {
      title: "Category",
      key: "category",
      render: (_, cat) => (
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-md bg-accent/50 flex items-center justify-center overflow-hidden">
            {cat.image ? (
              <img
                src={`${import.meta.env.VITE_API_URL || "http://localhost:5000"}${cat.image}`}
                alt={cat.name}
                className="w-full h-full object-cover"
              />
            ) : (
              <Layers size={18} className="text-primary" />
            )}
          </div>
          <div>
            <div className="font-semibold text-foreground">{cat.name}</div>
            <div className="text-xs text-muted-foreground">{cat._count?.products || 0} products</div>
          </div>
        </div>
      ),
    },
    {
      title: "Status",
      dataIndex: "isActive",
      key: "isActive",
      render: (isActive: boolean) => (
        <Tag color={isActive ? "green" : "default"}>
          {isActive ? "Active" : "Inactive"}
        </Tag>
      ),
    },
    {
      title: "Actions",
      key: "actions",
      render: (_, cat) => (
        <div className="flex items-center gap-2">
          <button
            onClick={() => { setViewCategory(cat); setViewOpen(true); }}
            className="p-1.5 rounded-md hover:bg-muted text-muted-foreground hover:text-primary transition-colors"
            title="View"
          >
            <Eye size={15} />
          </button>
          <button
            onClick={() => { setEditData(cat); setAddOpen(true); }}
            className="p-1.5 rounded-md hover:bg-muted text-muted-foreground hover:text-primary transition-colors"
            title="Edit"
          >
            <Edit size={15} />
          </button>
          <button
            onClick={() => { setDeleteCategoryData(cat); setDeleteOpen(true); }}
            className="p-1.5 rounded-md hover:bg-muted text-muted-foreground hover:text-destructive transition-colors"
            title="Delete"
          >
            <Trash2 size={15} />
          </button>
        </div>
      ),
    },
  ];

  return (
    <div className="min-h-screen bg-background p-4 md:p-8">
      <div className="max-w-7xl mx-auto space-y-6">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <h1 className="text-2xl font-bold text-foreground">Categories</h1>
          <button
            onClick={() => { setEditData(undefined); setAddOpen(true); }}
            className="gold-gradient text-primary-foreground px-4 py-2 rounded-md font-semibold text-sm inline-flex items-center gap-2 shimmer hover:opacity-90 transition-opacity"
          >
            <Plus size={16} /> Add Category
          </button>
        </div>

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
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="px-3 py-2 border border-input rounded-md text-sm bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-ring/30"
          >
            <option value="all">All Status</option>
            <option value="active">Active</option>
            <option value="inactive">Inactive</option>
          </select>
          <button
            type="button"
            onClick={handleRefresh}
            className="inline-flex items-center justify-center rounded-md border border-border px-3 py-2 text-muted-foreground hover:border-foreground hover:text-foreground transition"
            title="Refresh categories"
          >
            <RefreshCcw size={16} />
          </button>
        </div>

        <div className="bg-card rounded-lg border border-border overflow-hidden shadow-sm">
          <Table
            columns={columns}
            dataSource={categories}
            rowKey="id"
            loading={loading}
            pagination={{ pageSize: 10 }}
            className="rounded-b-lg"
          />
        </div>

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
