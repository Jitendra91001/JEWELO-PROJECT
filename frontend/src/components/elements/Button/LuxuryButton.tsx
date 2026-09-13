import React from "react";
import { cn } from "@/lib/utils";
import { Loader2 } from "lucide-react";

export type LuxuryButtonVariant =
  | "primary-gold"
  | "obsidian"
  | "outline-gold"
  | "ghost"
  | "link"
  | "destructive";

export type LuxuryButtonSize = "xs" | "sm" | "md" | "lg";

export interface LuxuryButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: LuxuryButtonVariant;
  size?: LuxuryButtonSize;
  loading?: boolean;
  leftIcon?: React.ReactNode;
  rightIcon?: React.ReactNode;
  fullWidth?: boolean;
}

export const LuxuryButton: React.FC<LuxuryButtonProps> = ({
  variant = "primary-gold",
  size = "md",
  loading = false,
  leftIcon,
  rightIcon,
  fullWidth = false,
  children,
  className,
  disabled,
  ...props
}) => {
  const baseClasses =
    "inline-flex items-center justify-center font-body font-semibold tracking-wider uppercase transition-all duration-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#C5A880]/30 disabled:opacity-50 disabled:pointer-events-none active:scale-[0.98]";

  const variantMap: Record<LuxuryButtonVariant, string> = {
    "primary-gold":
      "bg-[#C5A880] hover:bg-[#B39366] text-white shadow-sm hover:shadow-[0_4px_16px_rgba(197,168,128,0.35)] border border-[#C5A880]/40",
    obsidian:
      "bg-[#121212] hover:bg-[#1f1f1f] text-white border border-[#2B2B2B] hover:border-[#C5A880]/40 shadow-sm",
    "outline-gold":
      "bg-transparent border border-[#C5A880] text-[#997D4D] dark:text-[#DFD0B8] hover:bg-[#FAF5ED] dark:hover:bg-[#1A1A1A] hover:border-[#997D4D]",
    ghost:
      "bg-transparent text-foreground hover:bg-[#FAF7F2] dark:hover:bg-[#1E1E1E] border border-transparent",
    link:
      "bg-transparent text-[#997D4D] hover:text-[#705A34] p-0 h-auto underline-offset-4 hover:underline border-0 shadow-none font-medium normal-case tracking-normal",
    destructive:
      "bg-red-600 hover:bg-red-700 text-white shadow-sm border border-red-500/20",
  };

  const sizeMap: Record<LuxuryButtonSize, string> = {
    xs: "text-[10px] px-2.5 py-1.5 gap-1.5",
    sm: "text-xs px-3.5 py-2 gap-2",
    md: "text-xs px-4 py-2.5 gap-2.5 min-h-[38px]",
    lg: "text-sm px-6 py-3.5 gap-3 min-h-[46px]",
  };

  return (
    <button
      className={cn(
        baseClasses,
        variantMap[variant],
        sizeMap[size],
        fullWidth && "w-full",
        className
      )}
      disabled={disabled || loading}
      {...props}
    >
      {loading ? (
        <>
          <Loader2 size={size === "xs" ? 12 : 14} className="animate-spin" />
          <span>Processing...</span>
        </>
      ) : (
        <>
          {leftIcon && <span className="flex-shrink-0">{leftIcon}</span>}
          <span>{children}</span>
          {rightIcon && <span className="flex-shrink-0">{rightIcon}</span>}
        </>
      )}
    </button>
  );
};

export default LuxuryButton;
