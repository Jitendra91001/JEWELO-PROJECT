import React from "react";
import { Sparkles, Gem, PackageOpen, Plus } from "lucide-react";
import { cn } from "@/lib/utils";
import LuxuryButton from "../Button/LuxuryButton";

export interface LuxuryEmptyStateProps {
  icon?: React.ReactNode;
  title?: string;
  description?: string;
  kicker?: string;
  actionLabel?: string;
  onAction?: () => void;
  className?: string;
}

export const LuxuryEmptyState: React.FC<LuxuryEmptyStateProps> = ({
  icon,
  title = "No Masterpieces Discovered",
  description = "The boutique vault currently holds no pieces matching your exact refinement.",
  kicker = "BOUTIQUE VAULT",
  actionLabel,
  onAction,
  className,
}) => {
  return (
    <div
      className={cn(
        "py-16 px-6 rounded-2xl border border-dashed border-[#C5A880]/30 bg-[#FAF7F2]/40 dark:bg-[#161616]/40 text-center flex flex-col items-center justify-center font-body",
        className
      )}
    >
      <div className="w-16 h-16 rounded-full bg-[#FAF5ED] dark:bg-[#201C16] border border-[#C5A880]/40 flex items-center justify-center text-[#C5A880] mb-4 shadow-sm">
        {icon || <Gem size={28} className="stroke-[1.5]" />}
      </div>

      {kicker && (
        <span className="text-[10px] font-bold uppercase tracking-[0.22em] text-[#C5A880] block mb-1">
          {kicker}
        </span>
      )}

      <h3 className="font-display font-medium text-lg sm:text-xl text-foreground mb-2">
        {title}
      </h3>

      <p className="text-xs sm:text-sm text-muted-foreground font-light max-w-md mb-6 leading-relaxed">
        {description}
      </p>

      {actionLabel && onAction && (
        <LuxuryButton
          variant="primary-gold"
          size="sm"
          onClick={onAction}
          leftIcon={<Plus size={14} />}
        >
          {actionLabel}
        </LuxuryButton>
      )}
    </div>
  );
};

export default LuxuryEmptyState;
