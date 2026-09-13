import React from "react";
import { cn } from "@/lib/utils";

export interface LuxuryCardProps extends React.HTMLAttributes<HTMLDivElement> {
  variant?: "masterpiece" | "minimal" | "spec" | "interactive";
  bordered?: boolean;
  withGlow?: boolean;
  className?: string;
  children: React.ReactNode;
}

export const LuxuryCard: React.FC<LuxuryCardProps> = ({
  variant = "masterpiece",
  bordered = true,
  withGlow = false,
  className,
  children,
  ...props
}) => {
  const variantClasses = {
    masterpiece:
      "bg-card text-card-foreground rounded-2xl p-6 transition-all duration-300 shadow-sm",
    minimal:
      "bg-background text-foreground rounded-xl p-5 border border-[#EAE4DC] dark:border-[#2B2B2B]",
    spec:
      "bg-[#FAF7F2] dark:bg-[#1A1A1A] text-foreground rounded-xl p-4 border border-[#C5A880]/30",
    interactive:
      "bg-card text-card-foreground rounded-2xl p-6 transition-all duration-300 hover:-translate-y-1 hover:shadow-md cursor-pointer",
  };

  return (
    <div
      className={cn(
        variantClasses[variant],
        bordered && "border border-[#EAE4DC] dark:border-[#2B2B2B]",
        withGlow && "hover:shadow-[0_0_24px_rgba(197,168,128,0.18)] hover:border-[#C5A880]/50",
        className
      )}
      {...props}
    >
      {children}
    </div>
  );
};

export const LuxuryCardHeader: React.FC<React.HTMLAttributes<HTMLDivElement>> = ({
  className,
  children,
  ...props
}) => (
  <div className={cn("flex items-center justify-between pb-4 mb-4 border-b border-border/60", className)} {...props}>
    {children}
  </div>
);

export const LuxuryCardTitle: React.FC<React.HTMLAttributes<HTMLHeadingElement>> = ({
  className,
  children,
  ...props
}) => (
  <h3 className={cn("font-display font-semibold text-lg text-foreground tracking-tight", className)} {...props}>
    {children}
  </h3>
);

export const LuxuryCardDescription: React.FC<React.HTMLAttributes<HTMLParagraphElement>> = ({
  className,
  children,
  ...props
}) => (
  <p className={cn("text-xs text-muted-foreground font-body mt-0.5", className)} {...props}>
    {children}
  </p>
);

export const LuxuryCardContent: React.FC<React.HTMLAttributes<HTMLDivElement>> = ({
  className,
  children,
  ...props
}) => <div className={cn("space-y-4", className)} {...props}>{children}</div>;

export const LuxuryCardFooter: React.FC<React.HTMLAttributes<HTMLDivElement>> = ({
  className,
  children,
  ...props
}) => (
  <div className={cn("pt-4 mt-4 border-t border-border/60 flex items-center justify-between", className)} {...props}>
    {children}
  </div>
);

export default LuxuryCard;
