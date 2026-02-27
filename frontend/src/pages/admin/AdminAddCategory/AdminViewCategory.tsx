import React from "react";
import { X } from "lucide-react";

interface Category {
  id: string;
  name: string;
  products: number;
  status: boolean;
}

interface AdminViewCategoryProps {
  isOpen: boolean;
  category?: Category;
  setOpen: (value: boolean) => void;
}

const AdminViewCategory: React.FC<AdminViewCategoryProps> = ({ isOpen, category, setOpen }) => {
  if (!isOpen || !category) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      <div className="absolute inset-0 bg-foreground/50 backdrop-blur-sm" onClick={() => setOpen(false)} />
      <div className="relative bg-card w-full max-w-sm mx-4 rounded-xl shadow-2xl animate-fadeIn">
        <div className="flex justify-between items-center px-6 py-4 border-b border-border">
          <h2 className="text-xl font-semibold text-primary">Category Details</h2>
          <button onClick={() => setOpen(false)} className="text-muted-foreground hover:text-destructive text-xl transition-colors">
            <X size={20} />
          </button>
        </div>

        <div className="p-6 space-y-5">
          <div className="text-center">
            <h3 className="text-lg font-semibold text-foreground">{category.name}</h3>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="text-center p-3 rounded-lg bg-muted/50">
              <div className="text-xs text-muted-foreground mb-1">Products</div>
              <div className="text-base font-semibold text-foreground">{category.products}</div>
            </div>
            <div className="text-center p-3 rounded-lg bg-muted/50">
              <div className="text-xs text-muted-foreground mb-1">Status</div>
              <span className={`inline-block px-2 py-0.5 rounded-full text-xs font-medium ${category.status ? "bg-accent text-accent-foreground" : "bg-muted text-muted-foreground"}`}>
                {category.status ? "Active" : "Inactive"}
              </span>
            </div>
          </div>

          <div className="flex justify-end pt-2 border-t border-border">
            <button onClick={() => setOpen(false)} className="px-5 py-2 rounded-md border border-input text-muted-foreground hover:bg-muted transition-colors">
              Close
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminViewCategory;
