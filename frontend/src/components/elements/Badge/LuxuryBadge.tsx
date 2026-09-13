import React from "react";
import { cn } from "@/lib/utils";
import { Sparkles, ShieldCheck, Check, AlertCircle } from "lucide-react";

export type LuxuryBadgeVariant =
  | "gold"
  | "karat"
  | "certified"
  | "inStock"
  | "lowStock"
  | "outOfStock"
  | "obsidian"
  | "platinum"
  | "outline";

export interface LuxuryBadgeProps extends React.HTMLAttributes<HTMLSpanElement> {
  variant?: LuxuryBadgeVariant;
  icon?: React.ReactNode;
  dot?: boolean;
  size?: "sm" | "md";
  children: React.ReactNode;
}

export const LuxuryBadge: React.FC<LuxuryBadgeProps> = ({
  variant = "gold",
  icon,
  dot = false,
  size = "md",
  children,
  className,
  ...props
}) => {
  const variantMap: Record<LuxuryBadgeVariant, string> = {
    gold: "bg-[#FAF5ED] dark:bg-[#252018] text-[#997D4D] dark:text-[#EFE6D5] border border-[#C5A880]/40",
    karat:
      "bg-gradient-to-r from-[#FAF5ED] to-[#F5EEDD] text-[#705A34] dark:bg-none dark:bg-[#1E1A14] dark:text-[#EFE6D5] border border-[#C5A880]/50 font-bold",
    certified:
      "bg-emerald-50 dark:bg-emerald-950/40 text-[#2D5A43] dark:text-emerald-300 border border-emerald-500/30",
    inStock:
      "bg-emerald-50 dark:bg-emerald-950/30 text-emerald-700 dark:text-emerald-400 border border-emerald-500/20",
    lowStock:
      "bg-amber-50 dark:bg-amber-950/30 text-amber-700 dark:text-amber-400 border border-amber-500/20",
    outOfStock:
      "bg-red-50 dark:bg-red-950/30 text-red-700 dark:text-red-400 border border-red-500/20",
    obsidian:
      "bg-[#121212] text-white border border-[#333333] shadow-xs",
    platinum:
      "bg-slate-100 dark:bg-slate-800/60 text-slate-700 dark:text-slate-200 border border-slate-300 dark:border-slate-700",
    outline:
      "bg-transparent text-foreground border border-border",
  };

  const defaultIconMap: Partial<Record<LuxuryBadgeVariant, React.ReactNode>> = {
    karat: <Sparkles size={11} className="text-[#C5A880]" />,
    certified: <ShieldCheck size={11} className="text-[#2D5A43]" />,
    inStock: <Check size={11} className="text-emerald-600" />,
    lowStock: <AlertCircle size={11} className="text-amber-600" />,
  };

  const activeIcon = icon !== undefined ? icon : defaultIconMap[variant];

  const sizeClasses = {
    sm: "text-[9px] px-2 py-0.5 gap-1",
    md: "text-[10px] sm:text-[11px] px-2.5 py-0.5 gap-1.5",
  };

  return (
    <span
      className={cn(
        "inline-flex items-center rounded-full font-semibold uppercase tracking-wider font-body whitespace-nowrap transition-colors",
        variantMap[variant],
        sizeClasses[size],
        className
      )}
      {...props}
    >
      {dot && (
        <span
          className={cn(
            "w-1.5 h-1.5 rounded-full",
            variant === "inStock"
              ? "bg-emerald-500"
              : variant === "lowStock"
              ? "bg-amber-500"
              : variant === "outOfStock"
              ? "bg-red-500"
              : "bg-[#C5A880]"
          )}
        />
      )}
      {activeIcon && <span className="flex-shrink-0">{activeIcon}</span>}
      <span>{children}</span>
    </span>
  );
};

export default LuxuryBadge;
