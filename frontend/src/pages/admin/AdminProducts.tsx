import { useEffect, useState } from "react";
import { Plus, Edit, Trash2, Search, Eye, EyeOff } from "lucide-react";
import AdminAddProduct from "./AdminAddProduct/AdminAddProduct";
import AdminViewProduct from "./AdminAddProduct/AdminViewProduct";
import AdminDeleteConfirm from "./UtilsComponentAdmin/AdminDeleteConfirm";
import { useDispatch } from "react-redux";
import { fetchProducts } from "@/store/productSlice";
import { Table, Tag } from "antd";
import type { ColumnsType } from "antd/es/table";
const baseUrl = import.meta.env.VITE_APP_BASE_URL;

const CURRENCY = "₹";

interface Product {
  id: string;
  name: string;
  price: number;
  stock: number;
  category: {
    name: string;
  };
  material: string;
  status: boolean;
  thumbnail: string;
}

// const initialProducts: Product[] = [
//   {
//     id: "1",
//     name: "Royal Diamond Solitaire Ring",
//     price: 45999,
//     stock: 25,
//     category: "Rings",
//     material: "18K Gold",
//     status: true,
//     image: categoryRings,
//   },
//   {
//     id: "2",
//     name: "Celestial Pearl Necklace",
//     price: 32500,
//     stock: 18,
//     category: "Necklaces",
//     material: "22K Gold",
//     status: true,
//     image: categoryNecklaces,
//   },
//   {
//     id: "3",
//     name: "Teardrop Crystal Earrings",
//     price: 18999,
//     stock: 42,
//     category: "Earrings",
//     material: "Rose Gold",
//     status: true,
//     image: categoryEarrings,
//   },
//   {
//     id: "4",
//     name: "Heritage Gold Bangle Set",
//     price: 65000,
//     stock: 8,
//     category: "Bangles",
//     material: "22K Gold",
//     status: false,
//     image: categoryBangles,
//   },
//   {
//     id: "5",
//     name: "Infinity Diamond Band",
//     price: 28999,
//     stock: 15,
//     category: "Rings",
//     material: "Platinum",
//     status: true,
//     image: categoryRings,
//   },
// ];

const AdminProducts = () => {
  const dispatch = useDispatch();
  const [products, setProducts] = useState<Product[]>([]);
  const [search, setSearch] = useState("");
  const [addOpen, setAddOpen] = useState(false);
  const [editData, setEditData] = useState<Product | undefined>();
  const [viewOpen, setViewOpen] = useState(false);
  const [viewProduct, setViewProduct] = useState<Product | undefined>();
  const [deleteOpen, setDeleteOpen] = useState(false);
  const [deleteProduct, setDeleteProduct] = useState<Product | undefined>();

  const filtered = products.filter((p) =>
    p.name.toLowerCase().includes(search.toLowerCase()),
  );

  const handleDelete = () => {
    if (deleteProduct) {
      setProducts((prev) => prev.filter((p) => p.id !== deleteProduct.id));
      setDeleteOpen(false);
      setDeleteProduct(undefined);
    }
  };

  const columns: ColumnsType<Product> = [
    {
      title: "Product",
      key: "product",
      render: (_, product) => (
        <div className="flex items-center gap-3">
          <img
            src={baseUrl + product.thumbnail}
            alt={product.name}
            className="w-10 h-10 rounded-md object-cover"
          />
          <div>
            <div className="font-medium text-foreground">{product.name}</div>
            <div className="text-xs text-muted-foreground">
              {product.material}
            </div>
          </div>
        </div>
      ),
    },
    {
      title: "Category",
      dataIndex: ["category", "name"],
      key: "category",
      render: (text) => <span className="text-muted-foreground">{text}</span>,
    },
    {
      title: "Price",
      dataIndex: "price",
      key: "price",
      render: (price: number) => (
        <span className="font-medium">
          {CURRENCY}
          {price.toLocaleString()}
        </span>
      ),
    },
    {
      title: "Stock",
      dataIndex: "stock",
      key: "stock",
      render: (stock: number) => (
        <span className={`font-medium ${stock < 10 ? "text-red-500" : ""}`}>
          {stock}
        </span>
      ),
    },
    {
      title: "Status",
      dataIndex: "status",
      key: "status",
      render: (status: boolean) => (
        <Tag color={status ? "green" : "default"}>
          {status ? "Active" : "Inactive"}
        </Tag>
      ),
    },
    {
      title: "Actions",
      key: "actions",
      render: (_, product) => (
        <div className="flex items-center gap-2">
          <button
            onClick={() => {
              setEditData(product);
              setAddOpen(true);
            }}
            className="p-1.5 rounded-md hover:bg-muted"
          >
            <Edit size={15} />
          </button>

          <button
            onClick={() => handleToggleStatus(product.id)}
            className="p-1.5 rounded-md hover:bg-muted"
          >
            {product.status ? <EyeOff size={15} /> : <Eye size={15} />}
          </button>

          <button
            onClick={() => {
              setDeleteProduct(product);
              setDeleteOpen(true);
            }}
            className="p-1.5 rounded-md hover:bg-muted text-red-500"
          >
            <Trash2 size={15} />
          </button>
        </div>
      ),
    },
  ];

  const handleToggleStatus = (id: string) => {
    setProducts((prev) =>
      prev.map((p) => (p.id === id ? { ...p, status: !p.status } : p)),
    );
  };

  const fetchproduct = async () => {
    const response = await dispatch(fetchProducts()).unwrap();
    if (response?.success === true) {
      setProducts(response?.data);
    }
  };

  useEffect(() => {
    fetchproduct();
  }, []);

  return (
    <div className="min-h-screen bg-background p-4 md:p-8">
      <div className="max-w-7xl mx-auto space-y-6">
        {/* Header */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <h1 className="text-2xl font-bold text-foreground">Products</h1>
          <button
            onClick={() => {
              setEditData(undefined);
              setAddOpen(true);
            }}
            className="gold-gradient text-primary-foreground px-4 py-2 rounded-md font-semibold text-sm inline-flex items-center gap-2 shimmer hover:opacity-90 transition-opacity"
          >
            <Plus size={16} /> Add Product
          </button>
        </div>

        {/* Search */}
        <div className="relative max-w-sm">
          <Search
            className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground"
            size={16}
          />
          <input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-9 pr-4 py-2 border border-input rounded-md text-sm bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-ring/30"
            placeholder="Search products..."
          />
        </div>

        {/* Table */}
        <div className="bg-card rounded-lg border border-border overflow-hidden shadow-sm">
          <div className="overflow-x-auto">
            <Table
              columns={columns}
              dataSource={filtered}
              rowKey="id"
              pagination={{
                pageSize: 5,
                showSizeChanger: true,
              }}
              className="rounded-lg overflow-hidden"
            />
          </div>
        </div>

        <AdminAddProduct
          isOpen={addOpen}
          editData={editData}
          setOpen={setAddOpen}
        />
        <AdminViewProduct
          isOpen={viewOpen}
          product={viewProduct}
          setOpen={setViewOpen}
        />
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
    </div>
  );
};

export default AdminProducts;
