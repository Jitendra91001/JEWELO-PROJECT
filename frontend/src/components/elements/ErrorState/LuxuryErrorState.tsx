import React from "react";
import { AlertTriangle, RefreshCcw, ShieldAlert, XCircle } from "lucide-react";
import { cn } from "@/lib/utils";
import LuxuryButton from "../Button/LuxuryButton";

export interface LuxuryErrorStateProps {
  title?: string;
  message?: string;
  kicker?: string;
  onRetry?: () => void;
  variant?: "banner" | "card" | "full-page";
  className?: string;
}

export const LuxuryErrorState: React.FC<LuxuryErrorStateProps> = ({
  title = "Authentication or Vault Synchronisation Error",
  message = "An error interrupted the communication with the jewellery catalog services. Please try again.",
  kicker = "VAULT NOTICE",
  onRetry,
  variant = "card",
  className,
}) => {
  if (variant === "banner") {
    return (
      <div
        className={cn(
          "p-3.5 rounded-xl bg-red-50/80 dark:bg-red-950/20 border border-red-500/30 text-red-800 dark:text-red-300 flex items-center justify-between gap-3 text-xs font-body",
          className
        )}
      >
        <div className="flex items-center gap-2.5">
          <AlertTriangle size={16} className="text-red-600 flex-shrink-0" />
          <div>
            <span className="font-semibold">{title}: </span>
            <span className="font-light opacity-90">{message}</span>
          </div>
        </div>

        {onRetry && (
          <button
            type="button"
            onClick={onRetry}
            className="text-[11px] font-bold uppercase tracking-wider text-red-700 hover:text-red-900 underline flex-shrink-0"
          >
            Retry
          </button>
        )}
      </div>
    );
  }

  return (
    <div
      className={cn(
        "p-8 sm:p-12 rounded-2xl border border-red-500/20 bg-red-50/20 dark:bg-red-950/10 text-center flex flex-col items-center justify-center font-body",
        variant === "full-page" && "min-h-[400px]",
        className
      )}
    >
      <div className="w-14 h-14 rounded-full bg-red-50 dark:bg-red-950/40 border border-red-500/30 flex items-center justify-center text-red-600 mb-4 shadow-xs">
        <ShieldAlert size={26} />
      </div>

      {kicker && (
        <span className="text-[10px] font-bold uppercase tracking-[0.22em] text-red-600 block mb-1">
          {kicker}
        </span>
      )}

      <h3 className="font-display font-medium text-lg sm:text-xl text-foreground mb-2">
        {title}
      </h3>

      <p className="text-xs sm:text-sm text-muted-foreground font-light max-w-md mb-6 leading-relaxed">
        {message}
      </p>

      {onRetry && (
        <LuxuryButton
          variant="outline-gold"
          size="sm"
          onClick={onRetry}
          leftIcon={<RefreshCcw size={13} />}
        >
          Retry Connection
        </LuxuryButton>
      )}
    </div>
  );
};

export default LuxuryErrorState;
