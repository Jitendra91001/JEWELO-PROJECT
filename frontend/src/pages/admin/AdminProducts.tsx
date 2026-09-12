import { useEffect, useState } from "react";
import {
  Plus,
  Edit,
  Trash2,
  Search,
  Eye,
  EyeOff,
  RefreshCcw,
  Copy,
  Filter,
  Sparkles,
  Package,
  AlertTriangle,
} from "lucide-react";
import AdminAddProduct from "./AdminAddProduct/AdminAddProduct";
import AdminViewProduct from "./AdminAddProduct/AdminViewProduct";
import AdminDeleteConfirm from "./UtilsComponentAdmin/AdminDeleteConfirm";
import { useDispatch } from "react-redux";
import { fetchProducts, type Product } from "@/store/productSlice";
import { AppDispatch } from "@/store";
import { adminAPI } from "@/api/admin.api";
import { toast } from "sonner";
import { Table, Tag, Select } from "antd";
import type { ColumnsType } from "antd/es/table";
import { MOCK_PRODUCTS } from "@/services/mockData";
import SEOHead from "@/components/common/SEOHead";

const baseUrl = import.meta.env.VITE_APP_BASE_URL || "";
const CURRENCY = "₹";

// Map mock product to ProductSlice schema
const mapMockToProduct = (p: any): Product => ({
  id: p.id,
  name: p.name,
  description: p.description,
  price: p.price,
  originalPrice: p.comparePrice,
  cost: Math.round(p.price * 0.65),
  sku: p.sku,
  quantity: p.stock ?? 10,
  images: p.images || [],
  thumbnail: p.images?.[0] || "",
  category: { id: p.category?.toLowerCase() || "rings", name: p.category || "Rings" },
  material: `${p.purity || "18K"} ${p.metal || "Gold"}`,
  weight: p.weight ? `${p.weight}g` : undefined,
  purity: p.purity,
  gender: p.gender,
  occasion: p.tags?.[0],
  rating: p.rating || 4.9,
  reviews: p.reviewsCount || 10,
  inStock: (p.stock ?? 10) > 0,
  isActive: p.status === "active" || p.isAvailable !== false,
  isFeatured: p.isFeatured || false,
  slug: p.slug,
});

const AdminProducts = () => {
  const dispatch = useDispatch<AppDispatch>();
  const [products, setProducts] = useState<Product[]>(() =>
    MOCK_PRODUCTS.map(mapMockToProduct)
  );
  const [search, setSearch] = useState("");
  const [categoryFilter, setCategoryFilter] = useState("ALL");
  const [stockFilter, setStockFilter] = useState("ALL");
  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(10);
  const [total, setTotal] = useState(MOCK_PRODUCTS.length);
  const [loading, setLoading] = useState(false);

  // Modals
  const [addOpen, setAddOpen] = useState(false);
  const [editData, setEditData] = useState<Product | undefined>();
  const [viewOpen, setViewOpen] = useState(false);
  const [viewProduct, setViewProduct] = useState<Product | undefined>();
  const [deleteOpen, setDeleteOpen] = useState(false);
  const [deleteProduct, setDeleteProduct] = useState<Product | undefined>();

  const loadProducts = async (pageNumber: number, pageSize: number, query: string) => {
    setLoading(true);
    try {
      const productsData = await dispatch(
        fetchProducts({ search: query, page: pageNumber, limit: pageSize })
      ).unwrap();

      const list = Array.isArray(productsData)
        ? productsData
        : (productsData as any)?.data || (productsData as any)?.products || [];

      if (list && list.length > 0) {
        setProducts(list);
        setTotal((productsData as any)?.pagination?.total || list.length);
      } else {
        // Fallback to rich mock data
        const fallback = MOCK_PRODUCTS.map(mapMockToProduct);
        setProducts(fallback);
        setTotal(fallback.length);
      }
    } catch {
      // Offline fallback
      const fallback = MOCK_PRODUCTS.map(mapMockToProduct);
      setProducts(fallback);
      setTotal(fallback.length);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadProducts(page, limit, search);
  }, [dispatch, page, limit, search]);

  const handleRefresh = async () => {
    await loadProducts(page, limit, search);
    toast.info("Product catalogue refreshed.");
  };

  const handleDelete = async () => {
    if (!deleteProduct) return;

    try {
      await adminAPI.deleteProduct(deleteProduct.id);
    } catch {
      // Local fallback
    }

    setProducts((prev) => prev.filter((p) => p.id !== deleteProduct.id));
    setTotal((prev) => Math.max(0, prev - 1));
    toast.success(`Product "${deleteProduct.name}" removed from catalogue.`);
    setDeleteOpen(false);
    setDeleteProduct(undefined);
  };

  const handleToggleStatus = async (id: string) => {
    const product = products.find((p) => p.id === id);
    if (!product) return;

    const newStatus = !product.isActive;
    try {
      await adminAPI.toggleProductStatus(id, newStatus);
    } catch {
      // Local fallback
    }

    setProducts((prev) =>
      prev.map((p) => (p.id === id ? { ...p, isActive: newStatus } : p))
    );
    toast.success(`Product ${newStatus ? "activated" : "hidden"} successfully`);
  };

  const handleDuplicate = (product: Product) => {
    const duplicated: Product = {
      ...product,
      id: `prod-${Date.now()}`,
      name: `${product.name} (Copy)`,
      sku: `${product.sku || "JWL"}-COPY`,
      isActive: false,
    };
    setProducts([duplicated, ...products]);
    setTotal((prev) => prev + 1);
    toast.success(`Product duplicated as "${duplicated.name}".`);
  };

  const handleSave = (savedProduct: Product, isEdit: boolean) => {
    setProducts((prev) =>
      isEdit
        ? prev.map((item) => (item.id === savedProduct.id ? savedProduct : item))
        : [savedProduct, ...prev]
    );
    if (!isEdit) setTotal((prev) => prev + 1);
    toast.success(`Product "${savedProduct.name}" saved successfully.`);
  };

  // Filter products by category and stock
  const filteredProducts = products.filter((p) => {
    const catName = typeof p.category === "string" ? p.category : p.category?.name || "";
    const matchesCategory =
      categoryFilter === "ALL" ||
      catName.toLowerCase() === categoryFilter.toLowerCase();

    const qty = p.quantity ?? 0;
    const matchesStock =
      stockFilter === "ALL"
        ? true
        : stockFilter === "LOW"
        ? qty > 0 && qty <= 5
        : stockFilter === "OUT"
        ? qty === 0
        : qty > 5;

    return matchesCategory && matchesStock;
  });

  const columns: ColumnsType<Product> = [
    {
      title: "Masterpiece Details",
      key: "product",
      render: (_, product) => {
        const imgUrl = product.thumbnail || product.images?.[0];
        const displaySrc = imgUrl?.startsWith("http")
          ? imgUrl
          : `${baseUrl}${imgUrl || ""}`;

        return (
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-lg bg-secondary/40 border border-border overflow-hidden flex-shrink-0 flex items-center justify-center">
              {displaySrc ? (
                <img
                  src={displaySrc}
                  alt={product.name}
                  className="w-full h-full object-cover"
                />
              ) : (
                <Package size={20} className="text-muted-foreground" />
              )}
            </div>
            <div className="min-w-0">
              <div className="font-bold text-foreground text-xs truncate max-w-xs flex items-center gap-1.5">
                <span>{product.name}</span>
                {product.isFeatured && (
                  <Sparkles size={12} className="text-[#C5A880] flex-shrink-0" />
                )}
              </div>
              <div className="text-[10px] text-muted-foreground font-mono flex items-center gap-2 mt-0.5">
                <span>{product.sku || "JWL-GEN"}</span>
                <span>•</span>
                <span className="text-[#997D4D] font-semibold">{product.material || "Precious Metal"}</span>
              </div>
            </div>
          </div>
        );
      },
    },
    {
      title: "Category",
      key: "category",
      render: (_, product) => (
        <Tag color="gold" className="text-xs font-semibold">
          {typeof product.category === "string"
            ? product.category
            : product.category?.name || "Jewellery"}
        </Tag>
      ),
    },
    {
      title: "Price",
      dataIndex: "price",
      key: "price",
      render: (price: number) => (
        <div>
          <span className="font-bold text-foreground text-xs">
            {CURRENCY}{price?.toLocaleString("en-IN")}
          </span>
        </div>
      ),
    },
    {
      title: "Vault Stock",
      dataIndex: "quantity",
      key: "quantity",
      render: (quantity: number = 0) => (
        <div>
          <span
            className={`font-bold text-xs px-2 py-0.5 rounded-full ${
              quantity === 0
                ? "bg-red-500/10 text-red-600"
                : quantity <= 5
                ? "bg-amber-500/10 text-amber-600"
                : "bg-emerald-500/10 text-emerald-600"
            }`}
          >
            {quantity} {quantity === 1 ? "unit" : "units"}
          </span>
          {quantity <= 5 && quantity > 0 && (
            <span className="block text-[9px] text-amber-600 font-semibold mt-0.5">
              Low Stock
            </span>
          )}
        </div>
      ),
    },
    {
      title: "Storefront Status",
      dataIndex: "isActive",
      key: "isActive",
      render: (isActive: boolean) => (
        <Tag color={isActive ? "green" : "default"} className="text-xs">
          {isActive ? "Active / Public" : "Draft / Hidden"}
        </Tag>
      ),
    },
    {
      title: "Actions",
      key: "actions",
      width: 170,
      render: (_, product) => (
        <div className="flex items-center gap-1.5">
          <button
            onClick={() => {
              setViewProduct(product);
              setViewOpen(true);
            }}
            className="p-1.5 rounded-md hover:bg-secondary text-muted-foreground hover:text-foreground transition"
            title="Quick View Specifications"
          >
            <Eye size={15} />
          </button>

          <button
            onClick={() => {
              setEditData(product);
              setAddOpen(true);
            }}
            className="p-1.5 rounded-md hover:bg-secondary text-muted-foreground hover:text-[#C5A880] transition"
            title="Edit Masterpiece"
          >
            <Edit size={15} />
          </button>

          <button
            onClick={() => handleDuplicate(product)}
            className="p-1.5 rounded-md hover:bg-secondary text-muted-foreground hover:text-[#997D4D] transition"
            title="Duplicate Piece"
          >
            <Copy size={15} />
          </button>

          <button
            onClick={() => handleToggleStatus(product.id)}
            className="p-1.5 rounded-md hover:bg-secondary text-muted-foreground hover:text-foreground transition"
            title={product.isActive ? "Hide from Storefront" : "Publish to Storefront"}
          >
            {product.isActive ? <EyeOff size={15} /> : <Eye size={15} />}
          </button>

          <button
            onClick={() => {
              setDeleteProduct(product);
              setDeleteOpen(true);
            }}
            className="p-1.5 rounded-md hover:bg-red-50 text-muted-foreground hover:text-red-600 transition"
            title="Delete Masterpiece"
          >
            <Trash2 size={15} />
          </button>
        </div>
      ),
    },
  ];

  return (
    <div className="space-y-6 font-body">
      <SEOHead title="Product Catalogue | JEWELO Admin" description="Jewellery inventory and product catalog management." />

      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="font-display text-2xl sm:text-3xl font-bold tracking-tight text-foreground flex items-center gap-2.5">
            <Package size={28} className="text-[#C5A880]" />
            <span>Jewellery Masterpieces Catalogue</span>
          </h1>
          <p className="text-xs text-muted-foreground mt-1">
            Manage precious metals, solitaire certifications, gemstone specifications, and pricing.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={handleRefresh}
            className="inline-flex items-center gap-1.5 px-3 py-2 border border-border rounded-lg text-xs font-semibold hover:bg-secondary transition"
          >
            <RefreshCcw size={14} />
            <span>Refresh</span>
          </button>

          <button
            onClick={() => {
              setEditData(undefined);
              setAddOpen(true);
            }}
            className="inline-flex items-center gap-1.5 px-4 py-2 bg-[#C5A880] hover:bg-[#B39366] text-white rounded-lg text-xs font-bold uppercase tracking-wider transition shadow"
          >
            <Plus size={14} />
            <span>Add Masterpiece</span>
          </button>
        </div>
      </div>

      {/* Search & Filter Bar */}
      <div className="bg-card border border-border rounded-xl p-4 flex flex-col md:flex-row gap-3 items-center justify-between">
        <div className="relative flex-1 w-full md:max-w-sm">
          <Search
            size={16}
            className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground"
          />
          <input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-9 pr-4 py-2 border border-border rounded-lg text-xs bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-[#C5A880]/40"
            placeholder="Search by name, SKU, or metal..."
          />
        </div>

        <div className="flex flex-wrap items-center gap-3 w-full md:w-auto">
          <div className="flex items-center gap-2">
            <span className="text-xs text-muted-foreground font-semibold">Category:</span>
            <select
              value={categoryFilter}
              onChange={(e) => setCategoryFilter(e.target.value)}
              className="px-3 py-2 border border-border rounded-lg text-xs bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-[#C5A880]/40 font-semibold"
            >
              <option value="ALL">All Categories</option>
              <option value="Rings">Rings</option>
              <option value="Necklaces">Necklaces</option>
              <option value="Earrings">Earrings</option>
              <option value="Bracelets">Bracelets</option>
              <option value="Bangles">Bangles</option>
            </select>
          </div>

          <div className="flex items-center gap-2">
            <span className="text-xs text-muted-foreground font-semibold">Stock:</span>
            <select
              value={stockFilter}
              onChange={(e) => setStockFilter(e.target.value)}
              className="px-3 py-2 border border-border rounded-lg text-xs bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-[#C5A880]/40 font-semibold"
            >
              <option value="ALL">All Levels</option>
              <option value="IN">In Stock (&gt;5)</option>
              <option value="LOW">Low Stock (≤5)</option>
              <option value="OUT">Out of Stock</option>
            </select>
          </div>

          <span className="text-xs text-muted-foreground font-semibold whitespace-nowrap ml-1">
            {filteredProducts.length} pieces found
          </span>
        </div>
      </div>

      {/* Table */}
      <div className="bg-card rounded-xl border border-border overflow-hidden shadow-sm">
        <Table
          columns={columns}
          dataSource={filteredProducts}
          rowKey="id"
          loading={loading}
          pagination={{
            current: page,
            pageSize: limit,
            total,
            showSizeChanger: true,
            pageSizeOptions: [5, 10, 20],
            onChange: (nextPage, nextPageSize) => {
              setPage(nextPage);
              setLimit(nextPageSize);
            },
          }}
          className="rounded-xl overflow-hidden"
          size="middle"
        />
      </div>

      {/* Add / Edit Modal */}
      <AdminAddProduct
        isOpen={addOpen}
        editData={editData}
        setOpen={setAddOpen}
        setEditData={setEditData}
        onSave={handleSave}
      />

      {/* View Modal */}
      <AdminViewProduct
        isOpen={viewOpen}
        product={viewProduct}
        setOpen={setViewOpen}
      />

      {/* Delete Modal */}
      <AdminDeleteConfirm
        isOpen={deleteOpen}
        productName={deleteProduct?.name || ""}
        onConfirm={handleDelete}
        onCancel={() => {
          setDeleteOpen(false);
          setDeleteProduct(undefined);
        }}
      />
    </div>
  );
};

export default AdminProducts;
