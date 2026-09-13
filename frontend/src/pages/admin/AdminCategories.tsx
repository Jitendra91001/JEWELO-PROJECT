import { useState, useEffect } from "react";
import { useAppDispatch, useAppSelector } from "@/store/hooks";
import { Plus, Edit, Trash2, Search, Eye, EyeOff, Layers, RefreshCcw } from "lucide-react";
import { Tag } from "antd";
import type { ColumnsType } from "antd/es/table";
import { CustomTable, LuxuryButton, LuxuryBadge } from "@/components/elements";
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
                src={cat.image?.startsWith("http") ? cat.image : `${import.meta.env.VITE_APP_BASE_URL || "http://localhost:5000"}${cat.image}`}
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
    <div className="space-y-6 font-body">
      <CustomTable
        kicker="MAISON TAXONOMY"
        title="Boutique Collections & Categories"
        subtitle="Manage jewellery types, gemstone families, and catalogue navigation hierarchies."
        columns={columns}
        dataSource={categories}
        rowKey="id"
        loading={loading}
        onRefresh={handleRefresh}
        searchable
        searchValue={search}
        onSearch={setSearch}
        searchPlaceholder="Search categories..."
        filters={[
          {
            key: "status",
            label: "Status",
            value: statusFilter,
            onChange: setStatusFilter,
            options: [
              { label: "All Status", value: "all" },
              { label: "Active", value: "active" },
              { label: "Inactive", value: "inactive" },
            ],
          },
        ]}
        actions={
          <LuxuryButton
            variant="primary-gold"
            size="sm"
            onClick={() => {
              setEditData(undefined);
              setAddOpen(true);
            }}
            leftIcon={<Plus size={14} />}
          >
            Add Category
          </LuxuryButton>
        }
        pagination={{ pageSize: 10, total: categories.length }}
      />

      <AdminAddCategory isOpen={addOpen} editData={editData} setOpen={setAddOpen} />
      <AdminViewCategory isOpen={viewOpen} category={viewCategory} setOpen={setViewOpen} />
      <AdminDeleteConfirm
        isOpen={deleteOpen}
        productName={deleteCategoryData?.name || ""}
        onConfirm={handleDelete}
        onCancel={() => {
          setDeleteOpen(false);
          setDeleteCategoryData(undefined);
        }}
      />
    </div>
  );
};

export default AdminCategories;

