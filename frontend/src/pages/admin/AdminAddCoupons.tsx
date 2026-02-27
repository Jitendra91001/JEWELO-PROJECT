import React, { useState } from "react";

interface Product {
  id?: string;
  name?: string;
  price?: number;
  stock?: number;
  category?: string;
}

interface AdminAddCouponsProps {
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

const AdminAddCoupons: React.FC<AdminAddCouponsProps> = ({
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

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setOpen(false);
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      <div
        className="absolute inset-0 bg-black/50 backdrop-blur-sm"
        onClick={() => setOpen(false)}
      ></div>

      <div className="relative bg-white w-full max-w-2xl mx-4 rounded-xl shadow-2xl animate-fadeIn">
        <div className="flex justify-between items-center px-6 py-4 border-b">
          <h2 className="text-xl font-semibold text-[#96794B]">
            {editData?.id ? "Edit New Product" : "Add New Product"}
          </h2>
          <button
            onClick={() => setOpen(false)}
            className="text-gray-500 hover:text-red-500 text-xl"
          >
            ✕
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          <div>
            <label className="block text-sm font-medium ">Product Name</label>
            <input
              type="text"
              required
              value={productName}
              onChange={(e) => setProductName(e.target.value)}
              className="mt-1 w-full border border-gray-300 rounded-md px-3 py-2  outline-none"
              placeholder="Enter product name"
            />
          </div>

          {/* Category + Material Row */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium ">Category</label>
              <select
                value={category}
                onChange={(e) => setCategory(e.target.value)}
                className="mt-1 w-full border border-gray-300 rounded-md px-3 py-2 outline-none"
              >
                {categories.map((cat) => (
                  <option key={cat}>{cat}</option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium ">Material</label>
              <input
                type="text"
                value={material}
                onChange={(e) => setMaterial(e.target.value)}
                className="mt-1 w-full border border-gray-300 rounded-md px-3 py-2 outline-none"
                placeholder="18K Gold, Platinum..."
              />
            </div>
          </div>

          {/* Price + Stock Row */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium ">Price (₹)</label>
              <input
                type="number"
                required
                value={price}
                onChange={(e) => setPrice(e.target.value)}
                className="mt-1 w-full border border-gray-300 rounded-md px-3 py-2 outline-none"
                placeholder="Enter price"
              />
            </div>

            <div>
              <label className="block text-sm font-medium ">Stock</label>
              <input
                type="number"
                required
                value={stock}
                onChange={(e) => setStock(e.target.value)}
                className="mt-1 w-full border border-gray-300 rounded-md px-3 py-2 outline-none"
                placeholder="Enter stock quantity"
              />
            </div>
          </div>

          {/* Status */}
          <div>
            <label className="block text-sm font-medium ">Status</label>
            <select
              value={status}
              onChange={(e) => setStatus(e.target.value)}
              className="mt-1 w-full border border-gray-300 rounded-md px-3 py-2 outline-none"
            >
              <option value="active">Active</option>
              <option value="inactive">Inactive</option>
            </select>
          </div>

          {/* Footer Buttons */}
          <div className="flex justify-end gap-3 pt-4 border-t">
            <button
              type="button"
              onClick={() => setOpen(false)}
              className="px-5 py-2 rounded-md border border-gray-300 text-gray-600 hover:bg-gray-100"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-6 py-2 rounded-md bg-[#96794B] text-white font-semibold
              hover:bg-[#7d6531] transition duration-200 shadow-md"
            >
              {editData?.id ? "Edit Product" : "Add Product"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AdminAddCoupons;
