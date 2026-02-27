import React, { useState, useEffect } from "react";

interface Category {
  id?: string;
  name?: string;
  status?: boolean;
}

interface AdminAddCategoryProps {
  isOpen: boolean;
  editData?: Category;
  setOpen: (value: boolean) => void;
}

const AdminAddCategory: React.FC<AdminAddCategoryProps> = ({ isOpen, editData, setOpen }) => {
  const [name, setName] = useState("");
  const [status, setStatus] = useState("active");

  useEffect(() => {
    if (editData?.id) {
      setName(editData.name || "");
      setStatus(editData.status ? "active" : "inactive");
    } else {
      setName("");
      setStatus("active");
    }
  }, [editData, isOpen]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setOpen(false);
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      <div className="absolute inset-0 bg-foreground/50 backdrop-blur-sm" onClick={() => setOpen(false)} />
      <div className="relative bg-card w-full max-w-md mx-4 rounded-xl shadow-2xl animate-fadeIn">
        <div className="flex justify-between items-center px-6 py-4 border-b border-border">
          <h2 className="text-xl font-semibold text-primary">
            {editData?.id ? "Edit Category" : "Add New Category"}
          </h2>
          <button onClick={() => setOpen(false)} className="text-muted-foreground hover:text-destructive text-xl transition-colors">
            ✕
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          <div>
            <label className="block text-sm font-medium text-foreground">Category Name</label>
            <input
              type="text"
              required
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="mt-1 w-full border border-input rounded-md px-3 py-2 bg-background text-foreground outline-none focus:ring-2 focus:ring-ring/30"
              placeholder="Enter category name"
            />
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
              {editData?.id ? "Edit Category" : "Add Category"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AdminAddCategory;
