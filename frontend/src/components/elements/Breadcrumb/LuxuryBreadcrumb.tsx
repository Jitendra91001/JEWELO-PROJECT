import React from "react";
import { Link } from "react-router-dom";
import { ChevronRight, Home } from "lucide-react";
import { cn } from "@/lib/utils";

export interface LuxuryBreadcrumbItem {
  label: string;
  href?: string;
  icon?: React.ReactNode;
}

export interface LuxuryBreadcrumbProps {
  items: LuxuryBreadcrumbItem[];
  showHome?: boolean;
  className?: string;
}

export const LuxuryBreadcrumb: React.FC<LuxuryBreadcrumbProps> = ({
  items,
  showHome = true,
  className,
}) => {
  return (
    <nav
      aria-label="Breadcrumb"
      className={cn("flex items-center space-x-2 text-xs font-body", className)}
    >
      {showHome && (
        <div className="flex items-center">
          <Link
            to="/"
            className="text-muted-foreground hover:text-[#C5A880] transition flex items-center gap-1"
          >
            <Home size={13} />
            <span className="sr-only">Home</span>
          </Link>
          <span className="mx-2 text-muted-foreground/50">
            <ChevronRight size={12} />
          </span>
        </div>
      )}

      {items.map((item, idx) => {
        const isLast = idx === items.length - 1;

        return (
          <div key={idx} className="flex items-center">
            {item.href && !isLast ? (
              <Link
                to={item.href}
                className="text-muted-foreground hover:text-[#C5A880] transition flex items-center gap-1.5 font-medium"
              >
                {item.icon && <span>{item.icon}</span>}
                <span>{item.label}</span>
              </Link>
            ) : (
              <span
                className={cn(
                  "flex items-center gap-1.5 font-semibold",
                  isLast ? "text-[#997D4D] dark:text-[#DFD0B8]" : "text-muted-foreground"
                )}
                aria-current={isLast ? "page" : undefined}
              >
                {item.icon && <span>{item.icon}</span>}
                <span>{item.label}</span>
              </span>
            )}

            {!isLast && (
              <span className="mx-2 text-muted-foreground/40">
                <ChevronRight size={12} />
              </span>
            )}
          </div>
        );
      })}
    </nav>
  );
};

export default LuxuryBreadcrumb;
