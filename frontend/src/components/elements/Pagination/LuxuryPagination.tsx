import React from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { cn } from "@/lib/utils";

export interface LuxuryPaginationProps {
  current: number;
  pageSize: number;
  total: number;
  onChange: (page: number, pageSize: number) => void;
  showSizeChanger?: boolean;
  pageSizeOptions?: number[];
  className?: string;
}

export const LuxuryPagination: React.FC<LuxuryPaginationProps> = ({
  current,
  pageSize,
  total,
  onChange,
  showSizeChanger = true,
  pageSizeOptions = [10, 20, 50],
  className,
}) => {
  const totalPages = Math.max(1, Math.ceil(total / pageSize));

  // Compute page numbers to display
  const getPages = () => {
    const pages: (number | string)[] = [];
    if (totalPages <= 5) {
      for (let i = 1; i <= totalPages; i++) pages.push(i);
    } else {
      pages.push(1);
      if (current > 3) pages.push("...");

      const start = Math.max(2, current - 1);
      const end = Math.min(totalPages - 1, current + 1);

      for (let i = start; i <= end; i++) {
        if (!pages.includes(i)) pages.push(i);
      }

      if (current < totalPages - 2) pages.push("...");
      if (!pages.includes(totalPages)) pages.push(totalPages);
    }
    return pages;
  };

  const pages = getPages();

  return (
    <div
      className={cn(
        "flex flex-col sm:flex-row items-center justify-between gap-4 text-xs font-body py-3",
        className
      )}
    >
      <div className="text-muted-foreground font-light">
        Showing <span className="font-semibold text-foreground">{Math.min((current - 1) * pageSize + 1, total)}</span>–
        <span className="font-semibold text-foreground">{Math.min(current * pageSize, total)}</span> of{" "}
        <span className="font-semibold text-[#997D4D]">{total}</span> records
      </div>

      <div className="flex items-center gap-2">
        {showSizeChanger && (
          <div className="flex items-center gap-1.5 mr-2">
            <span className="text-muted-foreground text-[11px]">Rows:</span>
            <select
              value={pageSize}
              onChange={(e) => onChange(1, Number(e.target.value))}
              className="px-2 py-1 border border-border rounded-md bg-background text-foreground text-xs focus:outline-none focus:border-[#C5A880]"
            >
              {pageSizeOptions.map((opt) => (
                <option key={opt} value={opt}>
                  {opt}
                </option>
              ))}
            </select>
          </div>
        )}

        <button
          type="button"
          disabled={current <= 1}
          onClick={() => onChange(current - 1, pageSize)}
          className="p-1.5 rounded-md border border-border hover:border-[#C5A880] text-muted-foreground hover:text-foreground disabled:opacity-40 disabled:pointer-events-none transition"
          aria-label="Previous page"
        >
          <ChevronLeft size={14} />
        </button>

        <div className="flex items-center gap-1">
          {pages.map((p, idx) => {
            if (p === "...") {
              return (
                <span key={idx} className="px-1 text-muted-foreground">
                  ...
                </span>
              );
            }

            const pageNum = p as number;
            const isActive = pageNum === current;

            return (
              <button
                key={idx}
                type="button"
                onClick={() => onChange(pageNum, pageSize)}
                className={cn(
                  "min-w-[30px] h-[30px] px-2 rounded-md font-semibold text-xs transition-all",
                  isActive
                    ? "bg-[#C5A880] text-white shadow-xs"
                    : "border border-border text-foreground hover:border-[#C5A880] hover:text-[#997D4D]"
                )}
              >
                {pageNum}
              </button>
            );
          })}
        </div>

        <button
          type="button"
          disabled={current >= totalPages}
          onClick={() => onChange(current + 1, pageSize)}
          className="p-1.5 rounded-md border border-border hover:border-[#C5A880] text-muted-foreground hover:text-foreground disabled:opacity-40 disabled:pointer-events-none transition"
          aria-label="Next page"
        >
          <ChevronRight size={14} />
        </button>
      </div>
    </div>
  );
};

export default LuxuryPagination;
