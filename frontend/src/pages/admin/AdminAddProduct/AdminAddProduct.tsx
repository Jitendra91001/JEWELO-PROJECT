import React, { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchCategory, type Product } from "@/store/productSlice";
import { toast } from "sonner";
import { AppDispatch, RootState } from "@/store";
import { postProduct } from "@/store/admin/adminThunk";

interface AdminAddProductProps {
  isOpen: boolean;
  editData?: Product | null;
  setOpen: (value: boolean) => void;
}

const initialFormData = {
  name: "",
  category: null,
  price: "",
  stock: "",
  status: "active",
  material: "",
};

const AdminAddProduct: React.FC<AdminAddProductProps> = ({
  isOpen,
  editData,
  setOpen,
}) => {
  const dispatch = useDispatch<AppDispatch>();
  const [allCategory, setCategory] = useState([]);
  const { loading } = useSelector((state: RootState) => state.products);

  const fetchCategoryData = async () => {
    try {
      const response = await dispatch(fetchCategory()).unwrap();
      if (response?.success === true) {
        setCategory(response?.data);
      }
    } catch (error) {
      console.log(error, "error");
    }
  };
  useEffect(() => {
    fetchCategoryData();
  }, []);

  const [formData, setFormData] = useState(initialFormData);

  useEffect(() => {
    if (editData?.id) {
      setFormData({
        name: editData.name || "",
        category: editData.category || null,
        price: editData.price?.toString() || "",
        stock: editData.stock?.toString() || "",
        status: editData.status ? "active" : "inactive",
        material: editData.material || "",
      });
    } else {
      setFormData(initialFormData);
    }
  }, [editData, isOpen]);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>,
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!formData.name.trim()) {
      toast.error("Product name is required");
      return;
    }
    if (!formData.price || Number(formData.price) <= 0) {
      toast.error("Enter a valid price");
      return;
    }

    const payload = {
      name: formData.name.trim(),
      category: formData.category,
      price: Number(formData.price),
      stock: Number(formData.stock) || 0,
      status: formData.status === "active",
      material: formData.material.trim(),
    };

    try {
      if (editData?.id) {
        // await dispatch(updateProduct({ id: editData.id, ...payload })).unwrap();
        toast.success("Product updated successfully");
      } else {
        await dispatch(postProduct(payload)).unwrap();
        toast.success("Product added successfully");
      }
      setOpen(false);
    } catch (error: any) {
      toast.error(error || "Something went wrong");
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      {/* Overlay */}
      <div
        className="absolute inset-0 bg-black/60"
        onClick={() => setOpen(false)}
      />

      {/* Modal */}
      <div className="relative z-10 w-full max-w-lg rounded-xl border border-border bg-card p-6 shadow-xl mx-4">
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-xl font-semibold text-card-foreground">
            {editData?.id ? "Edit Product" : "Add New Product"}
          </h2>
          <button
            onClick={() => setOpen(false)}
            className="text-muted-foreground hover:text-destructive text-xl transition-colors"
          >
            ✕
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Product Name */}
          <div>
            <label className="text-sm font-medium text-card-foreground">
              Product Name
            </label>
            <input
              name="name"
              value={formData.name}
              onChange={handleChange}
              className="mt-1 w-full border border-input rounded-md px-3 py-2 bg-background text-foreground outline-none focus:ring-2 focus:ring-ring/30"
              placeholder="Enter product name"
              maxLength={100}
            />
          </div>

          {/* Category + Material */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="text-sm font-medium text-card-foreground">
                Category
              </label>
              <select
                name="category"
                value={formData.category}
                onChange={handleChange}
                className="mt-1 w-full border border-input rounded-md px-3 py-2 bg-background text-foreground outline-none focus:ring-2 focus:ring-ring/30"
              >
                {allCategory?.map((cat) => (
                  <option key={cat?.name} value={cat?.id}>
                    {cat}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="text-sm font-medium text-card-foreground">
                Material
              </label>
              <input
                name="material"
                value={formData.material}
                onChange={handleChange}
                className="mt-1 w-full border border-input rounded-md px-3 py-2 bg-background text-foreground outline-none focus:ring-2 focus:ring-ring/30"
                placeholder="18K Gold, Platinum..."
                maxLength={100}
              />
            </div>
          </div>

          {/* Price + Stock */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="text-sm font-medium text-card-foreground">
                Price (₹)
              </label>
              <input
                name="price"
                type="number"
                value={formData.price}
                onChange={handleChange}
                className="mt-1 w-full border border-input rounded-md px-3 py-2 bg-background text-foreground outline-none focus:ring-2 focus:ring-ring/30"
                placeholder="Enter price"
                min="0"
              />
            </div>

            <div>
              <label className="text-sm font-medium text-card-foreground">
                Stock
              </label>
              <input
                name="stock"
                type="number"
                value={formData.stock}
                onChange={handleChange}
                className="mt-1 w-full border border-input rounded-md px-3 py-2 bg-background text-foreground outline-none focus:ring-2 focus:ring-ring/30"
                placeholder="Enter stock quantity"
                min="0"
              />
            </div>
          </div>

          {/* Status */}
          <div>
            <label className="text-sm font-medium text-card-foreground">
              Status
            </label>
            <select
              name="status"
              value={formData.status}
              onChange={handleChange}
              className="mt-1 w-full border border-input rounded-md px-3 py-2 bg-background text-foreground outline-none focus:ring-2 focus:ring-ring/30"
            >
              <option value="active">Active</option>
              <option value="inactive">Inactive</option>
            </select>
          </div>

          {/* Buttons */}
          <div className="flex justify-end gap-3 pt-2">
            <button
              type="button"
              onClick={() => setOpen(false)}
              className="px-5 py-2 rounded-md border border-input text-muted-foreground hover:bg-muted transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={loading}
              className="px-5 py-2 rounded-md bg-primary text-primary-foreground hover:bg-primary/90 transition-colors disabled:opacity-50"
            >
              {loading
                ? "Saving..."
                : editData?.id
                  ? "Update Product"
                  : "Add Product"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AdminAddProduct;
