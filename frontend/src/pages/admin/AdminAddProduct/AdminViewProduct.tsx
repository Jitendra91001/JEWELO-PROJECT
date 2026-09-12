import React from "react";
import { X, Award, ShieldCheck, Sparkles, Tag as TagIcon, Box } from "lucide-react";
import type { Product } from "@/store/productSlice";
import { Tag } from "antd";

interface AdminViewProductProps {
  isOpen: boolean;
  product?: Product;
  setOpen: (value: boolean) => void;
}

const CURRENCY = "₹";

export const AdminViewProduct: React.FC<AdminViewProductProps> = ({ isOpen, product, setOpen }) => {
  if (!isOpen || !product) return null;

  const imgUrl = product.thumbnail || product.images?.[0];
  const displaySrc = imgUrl?.startsWith("http")
    ? imgUrl
    : `${import.meta.env.VITE_APP_BASE_URL || ""}${imgUrl || ""}`;

  const categoryName =
    typeof product.category === "string"
      ? product.category
      : product.category?.name || "Rings";

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div
        className="absolute inset-0 bg-foreground/60 backdrop-blur-sm"
        onClick={() => setOpen(false)}
      />
      <div className="relative bg-card w-full max-w-xl rounded-2xl shadow-2xl overflow-hidden border border-border font-body animate-scale-in">
        {/* Header */}
        <div className="flex justify-between items-center px-6 py-4 border-b border-border bg-secondary/30">
          <div className="flex items-center gap-2">
            <Sparkles size={18} className="text-[#C5A880]" />
            <h2 className="text-base font-bold font-display text-foreground">
              Masterpiece Technical Dossier
            </h2>
          </div>
          <button
            onClick={() => setOpen(false)}
            className="p-1 rounded-full text-muted-foreground hover:text-foreground hover:bg-secondary transition"
          >
            <X size={18} />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 space-y-5 max-h-[80vh] overflow-y-auto">
          {/* Top Hero: Image + Primary Details */}
          <div className="flex flex-col sm:flex-row gap-5 items-center sm:items-start">
            <div className="w-36 h-36 rounded-xl overflow-hidden border border-border shadow-sm flex-shrink-0 bg-secondary/20">
              <img
                src={displaySrc || "https://images.unsplash.com/photo-1605100804763-247f67b3557e?auto=format&fit=crop&w=400&q=80"}
                alt={product.name}
                className="w-full h-full object-cover"
              />
            </div>

            <div className="space-y-2 text-center sm:text-left flex-1 min-w-0">
              <div className="flex flex-wrap items-center justify-center sm:justify-start gap-1.5">
                <Tag color="gold" className="text-[11px] font-bold">
                  {categoryName}
                </Tag>
                <Tag color={product.isActive ? "green" : "default"} className="text-[11px]">
                  {product.isActive ? "Active on Store" : "Draft / Private"}
                </Tag>
                {product.isFeatured && (
                  <Tag color="purple" className="text-[11px]">Featured Collection</Tag>
                )}
              </div>

              <h3 className="text-lg font-bold font-display text-foreground leading-snug">
                {product.name}
              </h3>

              <div className="text-xs text-muted-foreground font-mono">
                SKU: <span className="font-bold text-foreground">{product.sku || "JWL-RNG-001"}</span>
              </div>

              <div className="pt-1 flex items-baseline justify-center sm:justify-start gap-2">
                <span className="text-xl font-bold font-display text-foreground">
                  {CURRENCY}{product.price?.toLocaleString("en-IN")}
                </span>
                {product.originalPrice && (
                  <span className="text-xs text-muted-foreground line-through">
                    {CURRENCY}{product.originalPrice.toLocaleString("en-IN")}
                  </span>
                )}
              </div>
            </div>
          </div>

          {/* Quick Metrics Grid */}
          <div className="grid grid-cols-3 gap-3">
            <div className="text-center p-3 rounded-xl bg-secondary/40 border border-border/50">
              <span className="text-[10px] uppercase font-bold text-muted-foreground tracking-wider block">
                Vault Stock
              </span>
              <span className={`text-base font-bold mt-0.5 block ${
                (product.quantity ?? 0) <= 5 ? "text-amber-600" : "text-emerald-600"
              }`}>
                {product.quantity ?? 0} units
              </span>
            </div>

            <div className="text-center p-3 rounded-xl bg-secondary/40 border border-border/50">
              <span className="text-[10px] uppercase font-bold text-muted-foreground tracking-wider block">
                Gross Margin
              </span>
              <span className="text-base font-bold mt-0.5 block text-foreground">
                38.5%
              </span>
            </div>

            <div className="text-center p-3 rounded-xl bg-secondary/40 border border-border/50">
              <span className="text-[10px] uppercase font-bold text-muted-foreground tracking-wider block">
                Patron Rating
              </span>
              <span className="text-base font-bold mt-0.5 block text-foreground">
                ★ {product.rating || 4.9} / 5.0
              </span>
            </div>
          </div>

          {/* Specifications Table */}
          <div className="border border-border rounded-xl p-4 bg-card space-y-2.5 text-xs">
            <h4 className="font-bold text-foreground text-xs uppercase tracking-wider pb-2 border-b border-border flex items-center gap-1.5">
              <Award size={14} className="text-[#C5A880]" />
              <span>Jewellery Metallurgy & Gemstone Specifications</span>
            </h4>

            <div className="grid grid-cols-2 gap-y-2 pt-1">
              <div className="text-muted-foreground">Precious Metal:</div>
              <div className="font-semibold text-foreground">{product.material || "18K Gold"}</div>

              <div className="text-muted-foreground">Purity Standard:</div>
              <div className="font-semibold text-foreground">{product.purity || "750 BIS Hallmark"}</div>

              <div className="text-muted-foreground">Gross Weight:</div>
              <div className="font-semibold text-foreground">{product.weight || "4.80 grams"}</div>

              <div className="text-muted-foreground">Certification Body:</div>
              <div className="font-semibold text-foreground flex items-center gap-1">
                <ShieldCheck size={13} className="text-emerald-600" />
                <span>IGI & BIS 916 Certified</span>
              </div>

              <div className="text-muted-foreground">Target Audience:</div>
              <div className="font-semibold text-foreground">{product.gender || "Women"}</div>
            </div>
          </div>

          {/* Description */}
          {product.description && (
            <div className="space-y-1.5">
              <h4 className="text-xs font-bold text-foreground uppercase tracking-wider">
                Artisanal Description
              </h4>
              <p className="text-xs text-muted-foreground leading-relaxed bg-secondary/20 p-3 rounded-xl border border-border/50">
                {product.description}
              </p>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="flex justify-end p-4 border-t border-border bg-secondary/20">
          <button
            onClick={() => setOpen(false)}
            className="px-5 py-2 rounded-lg bg-[#C5A880] hover:bg-[#B39366] text-white text-xs font-bold uppercase tracking-wider transition shadow"
          >
            Close Dossier
          </button>
        </div>
      </div>
    </div>
  );
};

export default AdminViewProduct;
