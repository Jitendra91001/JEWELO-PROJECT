import React, { useState, useEffect } from "react";
import { useAppDispatch } from "@/store/hooks";
import { createCategory, updateCategory } from "@/store/admin/adminThunk";
import UploadInputField from "@/components/ui/upload";
import type { UploadFile } from "antd/es/upload/interface";

interface Category {
  id?: string;
  name?: string;
  isActive?: boolean;
  image?: string;
  description?: string;
  slug?: string;
}

interface AdminAddCategoryProps {
  isOpen: boolean;
  editData?: Category;
  setOpen: (value: boolean) => void;
}

const AdminAddCategory: React.FC<AdminAddCategoryProps> = ({ isOpen, editData, setOpen }) => {
  const dispatch = useAppDispatch();
  const [formData, setFormData] = useState({
    name: "",
    description: "",
    slug: "",
    isActive: true,
  });
  const [fileList, setFileList] = useState<UploadFile[]>([]);

  useEffect(() => {
    if (editData?.id) {
      setFormData({
        name: editData.name || "",
        description: editData.description || "",
        slug: editData.slug || "",
        isActive: editData.isActive ?? true,
      });
      // Set existing image if available
      if (editData.image) {
        const imageUrl = `${import.meta.env.VITE_API_URL || 'http://localhost:5000'}${editData.image}`;
        setFileList([
          {
            uid: '-1',
            name: 'existing-image',
            status: 'done',
            url: imageUrl,
            thumbUrl: imageUrl,
          },
        ]);
      }
    } else {
      setFormData({
        name: "",
        description: "",
        slug: "",
        isActive: true,
      });
      setFileList([]);
    }
  }, [editData, isOpen]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    const data = new FormData();
    data.append('name', formData.name);
    data.append('description', formData.description);
    data.append('slug', formData.slug || formData.name.toLowerCase().replace(/\s+/g, '-'));
    data.append('isActive', formData.isActive.toString());

    if (fileList[0]?.originFileObj) {
      data.append('image', fileList[0].originFileObj);
    }

    if (editData?.id) {
      dispatch(updateCategory({ id: editData.id, data }));
    } else {
      dispatch(createCategory(data));
    }

    setOpen(false);
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      <div className="absolute inset-0 bg-foreground/50 backdrop-blur-sm" onClick={() => setOpen(false)} />
      <div className="relative bg-card w-full max-w-4xl mx-4 rounded-xl shadow-2xl animate-fadeIn">
        <div className="flex justify-between items-center px-6 py-4 border-b border-border">
          <h2 className="text-xl font-semibold text-primary">
            {editData?.id ? "Edit Category" : "Add New Category"}
          </h2>
          <button onClick={() => setOpen(false)} className="text-muted-foreground hover:text-destructive text-xl transition-colors">
            ✕
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-foreground">Category Name</label>
              <input
                type="text"
                name="name"
                required
                value={formData.name}
                onChange={handleChange}
                className="mt-1 w-full border border-input rounded-md px-3 py-2 bg-background text-foreground outline-none focus:ring-2 focus:ring-ring/30"
                placeholder="Enter category name"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-foreground">Slug</label>
              <input
                type="text"
                name="slug"
                value={formData.slug}
                onChange={handleChange}
                className="mt-1 w-full border border-input rounded-md px-3 py-2 bg-background text-foreground outline-none focus:ring-2 focus:ring-ring/30"
                placeholder="category-slug"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-foreground">Status</label>
              <select
                name="isActive"
                value={formData.isActive.toString()}
                onChange={(e) => setFormData(prev => ({ ...prev, isActive: e.target.value === 'true' }))}
                className="mt-1 w-full border border-input rounded-md px-3 py-2 bg-background text-foreground outline-none focus:ring-2 focus:ring-ring/30"
              >
                <option value="true">Active</option>
                <option value="false">Inactive</option>
              </select>
            </div>

            <div className="lg:col-span-2">
              <label className="block text-sm font-medium text-foreground">Description</label>
              <textarea
                name="description"
                value={formData.description}
                onChange={handleChange}
                className="mt-1 w-full border border-input rounded-md px-3 py-2 bg-background text-foreground outline-none focus:ring-2 focus:ring-ring/30"
                placeholder="Category description"
                rows={4}
              />
            </div>

            <div className="lg:col-span-2">
              <label className="block text-sm font-medium text-foreground">Image</label>
              <div className="mt-1">
                <UploadInputField 
                  fileList={fileList} 
                  setFileList={setFileList} 
                  listType="picture-card"
                />
              </div>
              <p className="text-xs text-muted-foreground mt-1">
                {editData?.image ? "Upload a new image to replace the current one" : "Upload an image for the category"}
              </p>
            </div>
          </div>

          <div className="flex flex-col sm:flex-row justify-end gap-3 pt-6 border-t border-border">
            <button
              type="button"
              onClick={() => setOpen(false)}
              className="w-full sm:w-auto px-5 py-2 rounded-md border border-input text-muted-foreground hover:bg-muted transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="w-full sm:w-auto px-6 py-2 rounded-md gold-gradient text-primary-foreground font-semibold hover:opacity-90 transition-opacity shadow-md shimmer"
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
