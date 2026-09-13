import React from "react";
import { cn } from "@/lib/utils";

export interface LuxurySkeletonProps extends React.HTMLAttributes<HTMLDivElement> {
  className?: string;
  variant?: "rectangular" | "circular" | "text";
}

export const LuxurySkeleton: React.FC<LuxurySkeletonProps> = ({
  className,
  variant = "rectangular",
  ...props
}) => {
  const variantClasses = {
    rectangular: "rounded-lg",
    circular: "rounded-full",
    text: "rounded h-4 w-full",
  };

  return (
    <div
      className={cn(
        "bg-[#FAF5ED] dark:bg-[#1C1C1C] shimmer animate-pulse",
        variantClasses[variant],
        className
      )}
      {...props}
    />
  );
};

export const LuxuryProductCardSkeleton: React.FC = () => {
  return (
    <div className="bg-card rounded-2xl p-4 border border-[#EAE4DC] dark:border-[#2B2B2B] space-y-3">
      <LuxurySkeleton className="aspect-square w-full rounded-xl" />
      <div className="space-y-2 pt-2">
        <LuxurySkeleton className="h-3 w-1/3" />
        <LuxurySkeleton className="h-4 w-4/5" />
        <div className="flex justify-between items-center pt-2">
          <LuxurySkeleton className="h-5 w-1/4" />
          <LuxurySkeleton className="h-4 w-1/4" />
        </div>
      </div>
    </div>
  );
};

export const LuxuryTableRowSkeleton: React.FC<{ columnsCount?: number }> = ({
  columnsCount = 5,
}) => {
  return (
    <div className="flex items-center gap-4 py-3 border-b border-border/60">
      {Array.from({ length: columnsCount }).map((_, idx) => (
        <LuxurySkeleton key={idx} className="h-4 flex-1" />
      ))}
    </div>
  );
};

export default LuxurySkeleton;
