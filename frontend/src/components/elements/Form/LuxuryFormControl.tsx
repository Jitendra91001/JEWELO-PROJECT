import React from "react";
import { cn } from "@/lib/utils";
import { Info } from "lucide-react";

export interface LuxuryFormControlProps {
  label?: string;
  required?: boolean;
  tooltip?: string;
  error?: string;
  helperText?: string;
  className?: string;
  children: React.ReactNode;
}

export const LuxuryFormControl: React.FC<LuxuryFormControlProps> = ({
  label,
  required = false,
  tooltip,
  error,
  helperText,
  className,
  children,
}) => {
  return (
    <div className={cn("w-full space-y-1.5 font-body", className)}>
      {label && (
        <div className="flex items-center justify-between">
          <label className="block text-xs font-semibold uppercase tracking-wider text-foreground/80">
            {label}
            {required && <span className="text-[#C5A880] ml-1 font-bold">*</span>}
          </label>
          {tooltip && (
            <span
              className="text-muted-foreground hover:text-foreground cursor-help transition"
              title={tooltip}
            >
              <Info size={12} />
            </span>
          )}
        </div>
      )}

      <div>{children}</div>

      {error ? (
        <p className="text-[11px] text-red-500 font-medium animate-in fade-in slide-in-from-top-1 duration-200">
          {error}
        </p>
      ) : helperText ? (
        <p className="text-[11px] text-muted-foreground font-light">
          {helperText}
        </p>
      ) : null}
    </div>
  );
};

export const LuxuryFormRow: React.FC<React.HTMLAttributes<HTMLDivElement>> = ({
  className,
  children,
  ...props
}) => (
  <div
    className={cn("grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4", className)}
    {...props}
  >
    {children}
  </div>
);

export default LuxuryFormControl;
