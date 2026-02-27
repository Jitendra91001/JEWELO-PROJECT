import React from "react";
import { AlertTriangle } from "lucide-react";

interface AdminDeleteConfirmProps {
  isOpen: boolean;
  productName: string;
  onConfirm: () => void;
  onCancel: () => void;
}

const AdminDeleteConfirm: React.FC<AdminDeleteConfirmProps> = ({ isOpen, productName, onConfirm, onCancel }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      <div className="absolute inset-0 bg-foreground/50 backdrop-blur-sm" onClick={onCancel} />
      <div className="relative bg-card w-full max-w-sm mx-4 rounded-xl shadow-2xl animate-fadeIn">
        <div className="p-6 text-center space-y-4">
          <div className="flex justify-center">
            <div className="w-12 h-12 rounded-full bg-destructive/10 flex items-center justify-center">
              <AlertTriangle className="text-destructive" size={24} />
            </div>
          </div>
          <div>
            <h3 className="text-lg font-semibold text-foreground">Delete Product</h3>
            <p className="text-sm text-muted-foreground mt-2">
              Are you sure you want to delete <span className="font-medium text-foreground">"{productName}"</span>? This action cannot be undone.
            </p>
          </div>
          <div className="flex justify-center gap-3 pt-2">
            <button onClick={onCancel} className="px-5 py-2 rounded-md border border-input text-muted-foreground hover:bg-muted transition-colors">
              Cancel
            </button>
            <button onClick={onConfirm} className="px-5 py-2 rounded-md bg-destructive text-destructive-foreground font-semibold hover:opacity-90 transition-opacity">
              Delete
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminDeleteConfirm;
