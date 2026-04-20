import React from "react";
import { X } from "lucide-react";
import type { Product } from "@/store/productSlice";

interface AdminViewProductProps {
  isOpen: boolean;
  product?: Product;
  setOpen: (value: boolean) => void;
}

const CURRENCY = "₹";

const AdminViewProduct: React.FC<AdminViewProductProps> = ({ isOpen, product, setOpen }) => {
  if (!isOpen || !product) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      <div className="absolute inset-0 bg-foreground/50 backdrop-blur-sm" onClick={() => setOpen(false)} />
      <div className="relative bg-card w-full max-w-lg mx-4 rounded-xl shadow-2xl animate-fadeIn">
        <div className="flex justify-between items-center px-6 py-4 border-b border-border">
          <h2 className="text-xl font-semibold text-primary">Product Details</h2>
          <button onClick={() => setOpen(false)} className="text-muted-foreground hover:text-destructive text-xl transition-colors">
            <X size={20} />
          </button>
        </div>

        <div className="p-6 space-y-5">
          <div className="flex justify-center">
            <img
              src={product.thumbnail ? `${import.meta.env.VITE_APP_BASE_URL}${product.thumbnail}` : ""}
              alt={product.name}
              className="w-40 h-40 rounded-lg object-cover border border-border shadow-sm"
            />
          </div>

          <div className="text-center">
            <h3 className="text-lg font-semibold text-foreground">{product.name}</h3>
            <p className="text-sm text-muted-foreground mt-1">
              {typeof product.category === "string"
                ? product.category
                : product.category?.name}{" "}
              • {product.material}
            </p>
          </div>

          <div className="grid grid-cols-3 gap-4">
            <div className="text-center p-3 rounded-lg bg-muted/50">
              <div className="text-xs text-muted-foreground mb-1">Price</div>
              <div className="text-base font-semibold text-foreground">
                {CURRENCY}{product.price.toLocaleString()}
              </div>
            </div>
            <div className="text-center p-3 rounded-lg bg-muted/50">
              <div className="text-xs text-muted-foreground mb-1">Stock</div>
              <div className={`text-base font-semibold ${
                (product.quantity ?? 0) < 10 ? "text-destructive" : "text-foreground"
              }`}>{product.quantity ?? 0}</div>
            </div>
            <div className="text-center p-3 rounded-lg bg-muted/50">
              <div className="text-xs text-muted-foreground mb-1">Status</div>
              <span
                className={`inline-block px-2 py-0.5 rounded-full text-xs font-medium ${
                  product.isActive ? "bg-accent text-accent-foreground" : "bg-muted text-muted-foreground"
                }`}
              >
                {product.isActive ? "Active" : "Inactive"}
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

export default AdminViewProduct;
