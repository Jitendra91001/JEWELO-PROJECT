import React, { useState, useEffect } from "react";

interface Product {
  id?: string;
  name?: string;
  price?: number;
  stock?: number;
  category?: string;
  material?: string;
  status?: boolean;
}

interface AdminAddProductProps {
  isOpen: boolean;
  editData?: Product;
  setOpen: (value: boolean) => void;
}

const categories = [
  "Rings",
  "Necklaces",
  "Earrings",
  "Bangles",
  "Bracelets",
  "Others",
];

const AdminAddProduct: React.FC<AdminAddProductProps> = ({
  isOpen,
  editData,
  setOpen,
}) => {
  const [productName, setProductName] = useState("");
  const [category, setCategory] = useState(categories[0]);
  const [price, setPrice] = useState("");
  const [stock, setStock] = useState("");
  const [status, setStatus] = useState("active");
  const [material, setMaterial] = useState("");

  useEffect(() => {
    if (editData?.id) {
      setProductName(editData.name || "");
      setCategory(editData.category || categories[0]);
      setPrice(editData.price?.toString() || "");
      setStock(editData.stock?.toString() || "");
      setStatus(editData.status ? "active" : "inactive");
      setMaterial(editData.material || "");
    } else {
      setProductName("");
      setCategory(categories[0]);
      setPrice("");
      setStock("");
      setStatus("active");
      setMaterial("");
    }
  }, [editData, isOpen]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setOpen(false);
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      <div
        className="absolute inset-0 bg-foreground/50 backdrop-blur-sm"
        onClick={() => setOpen(false)}
      />

      <div className="relative bg-card w-full max-w-2xl mx-4 rounded-xl shadow-2xl animate-fadeIn">
        <div className="flex justify-between items-center px-6 py-4 border-b border-border">
          <h2 className="text-xl font-semibold text-primary">
            {editData?.id ? "Edit Product" : "Add New Product"}
          </h2>
          <button
            onClick={() => setOpen(false)}
            className="text-muted-foreground hover:text-destructive text-xl transition-colors"
          >
            ✕
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          <div>
            <label className="block text-sm font-medium text-foreground">Product Name</label>
            <input
              type="text"
              required
              value={productName}
              onChange={(e) => setProductName(e.target.value)}
              className="mt-1 w-full border border-input rounded-md px-3 py-2 bg-background text-foreground outline-none focus:ring-2 focus:ring-ring/30"
              placeholder="Enter product name"
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-foreground">Category</label>
              <select
                value={category}
                onChange={(e) => setCategory(e.target.value)}
                className="mt-1 w-full border border-input rounded-md px-3 py-2 bg-background text-foreground outline-none focus:ring-2 focus:ring-ring/30"
              >
                {categories.map((cat) => (
                  <option key={cat}>{cat}</option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-foreground">Material</label>
              <input
                type="text"
                value={material}
                onChange={(e) => setMaterial(e.target.value)}
                className="mt-1 w-full border border-input rounded-md px-3 py-2 bg-background text-foreground outline-none focus:ring-2 focus:ring-ring/30"
                placeholder="18K Gold, Platinum..."
              />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-foreground">Price (₹)</label>
              <input
                type="number"
                required
                value={price}
                onChange={(e) => setPrice(e.target.value)}
                className="mt-1 w-full border border-input rounded-md px-3 py-2 bg-background text-foreground outline-none focus:ring-2 focus:ring-ring/30"
                placeholder="Enter price"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-foreground">Stock</label>
              <input
                type="number"
                required
                value={stock}
                onChange={(e) => setStock(e.target.value)}
                className="mt-1 w-full border border-input rounded-md px-3 py-2 bg-background text-foreground outline-none focus:ring-2 focus:ring-ring/30"
                placeholder="Enter stock quantity"
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-foreground">Status</label>
            <select
              value={status}
              onChange={(e) => setStatus(e.target.value)}
              className="mt-1 w-full border border-input rounded-md px-3 py-2 bg-background text-foreground outline-none focus:ring-2 focus:ring-ring/30"
            >
              <option value="active">Active</option>
              <option value="inactive">Inactive</option>
            </select>
          </div>

          <div className="flex justify-end gap-3 pt-4 border-t border-border">
            <button
              type="button"
              onClick={() => setOpen(false)}
              className="px-5 py-2 rounded-md border border-input text-muted-foreground hover:bg-muted transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-6 py-2 rounded-md gold-gradient text-primary-foreground font-semibold hover:opacity-90 transition-opacity shadow-md shimmer"
            >
              {editData?.id ? "Edit Product" : "Add Product"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AdminAddProduct;
