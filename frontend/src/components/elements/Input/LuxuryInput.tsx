import React, { forwardRef } from "react";
import { cn } from "@/lib/utils";
import { X } from "lucide-react";

export interface LuxuryInputProps
  extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
  helperText?: string;
  prefixIcon?: React.ReactNode;
  suffixIcon?: React.ReactNode;
  onClear?: () => void;
  floatingLabel?: boolean;
}

export const LuxuryInput = forwardRef<HTMLInputElement, LuxuryInputProps>(
  (
    {
      label,
      error,
      helperText,
      prefixIcon,
      suffixIcon,
      onClear,
      value,
      className,
      disabled,
      ...props
    },
    ref
  ) => {
    return (
      <div className="w-full space-y-1.5 font-body">
        {label && (
          <label className="block text-xs font-semibold uppercase tracking-wider text-foreground/80">
            {label}
          </label>
        )}

        <div className="relative flex items-center">
          {prefixIcon && (
            <div className="absolute left-3.5 flex items-center pointer-events-none text-muted-foreground">
              {prefixIcon}
            </div>
          )}

          <input
            ref={ref}
            value={value}
            disabled={disabled}
            className={cn(
              "w-full rounded-lg bg-background text-foreground text-xs placeholder:text-muted-foreground/70",
              "border border-[#EAE4DC] dark:border-[#2B2B2B] transition-all duration-200",
              "focus:outline-none focus:border-[#C5A880] focus:ring-2 focus:ring-[#C5A880]/20",
              "hover:border-[#C5A880]/60",
              "disabled:opacity-50 disabled:bg-secondary/40 disabled:cursor-not-allowed",
              prefixIcon ? "pl-10" : "pl-3.5",
              suffixIcon || onClear ? "pr-10" : "pr-3.5",
              "py-2.5 min-h-[38px]",
              error && "border-red-500 focus:border-red-500 focus:ring-red-500/20",
              className
            )}
            {...props}
          />

          {onClear && value && (
            <button
              type="button"
              onClick={onClear}
              className="absolute right-3 p-1 rounded-full text-muted-foreground hover:text-foreground hover:bg-secondary transition"
            >
              <X size={13} />
            </button>
          )}

          {suffixIcon && !onClear && (
            <div className="absolute right-3.5 flex items-center pointer-events-none text-muted-foreground">
              {suffixIcon}
            </div>
          )}
        </div>

        {error ? (
          <p className="text-[11px] text-red-500 font-medium">{error}</p>
        ) : helperText ? (
          <p className="text-[11px] text-muted-foreground">{helperText}</p>
        ) : null}
      </div>
    );
  }
);

LuxuryInput.displayName = "LuxuryInput";

// Luxury Textarea
export interface LuxuryTextareaProps
  extends React.TextareaHTMLAttributes<HTMLTextAreaElement> {
  label?: string;
  error?: string;
  helperText?: string;
}

export const LuxuryTextarea = forwardRef<HTMLTextAreaElement, LuxuryTextareaProps>(
  ({ label, error, helperText, className, ...props }, ref) => {
    return (
      <div className="w-full space-y-1.5 font-body">
        {label && (
          <label className="block text-xs font-semibold uppercase tracking-wider text-foreground/80">
            {label}
          </label>
        )}
        <textarea
          ref={ref}
          className={cn(
            "w-full rounded-lg bg-background text-foreground text-xs placeholder:text-muted-foreground/70",
            "border border-[#EAE4DC] dark:border-[#2B2B2B] transition-all duration-200",
            "focus:outline-none focus:border-[#C5A880] focus:ring-2 focus:ring-[#C5A880]/20",
            "hover:border-[#C5A880]/60 p-3 min-h-[90px]",
            error && "border-red-500 focus:border-red-500 focus:ring-red-500/20",
            className
          )}
          {...props}
        />
        {error ? (
          <p className="text-[11px] text-red-500 font-medium">{error}</p>
        ) : helperText ? (
          <p className="text-[11px] text-muted-foreground">{helperText}</p>
        ) : null}
      </div>
    );
  }
);

LuxuryTextarea.displayName = "LuxuryTextarea";

// Luxury Select
export interface LuxurySelectOption {
  label: string;
  value: string | number;
}

export interface LuxurySelectProps
  extends React.SelectHTMLAttributes<HTMLSelectElement> {
  label?: string;
  options: LuxurySelectOption[];
  error?: string;
}

export const LuxurySelect = forwardRef<HTMLSelectElement, LuxurySelectProps>(
  ({ label, options, error, className, ...props }, ref) => {
    return (
      <div className="w-full space-y-1.5 font-body">
        {label && (
          <label className="block text-xs font-semibold uppercase tracking-wider text-foreground/80">
            {label}
          </label>
        )}
        <select
          ref={ref}
          className={cn(
            "w-full rounded-lg bg-background text-foreground text-xs",
            "border border-[#EAE4DC] dark:border-[#2B2B2B] transition-all duration-200",
            "focus:outline-none focus:border-[#C5A880] focus:ring-2 focus:ring-[#C5A880]/20",
            "hover:border-[#C5A880]/60 px-3 py-2.5 min-h-[38px] font-medium cursor-pointer",
            error && "border-red-500 focus:border-red-500",
            className
          )}
          {...props}
        >
          {options.map((opt) => (
            <option key={opt.value} value={opt.value}>
              {opt.label}
            </option>
          ))}
        </select>
        {error && <p className="text-[11px] text-red-500 font-medium">{error}</p>}
      </div>
    );
  }
);

LuxurySelect.displayName = "LuxurySelect";

export default LuxuryInput;
