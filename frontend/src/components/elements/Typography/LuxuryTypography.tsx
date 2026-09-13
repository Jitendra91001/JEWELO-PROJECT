import React from "react";
import { cn } from "@/lib/utils";

// 1. Kicker / Overline
export interface LuxuryKickerProps extends React.HTMLAttributes<HTMLParagraphElement> {
  children: React.ReactNode;
  className?: string;
  withLines?: boolean;
}

export const LuxuryKicker: React.FC<LuxuryKickerProps> = ({
  children,
  className,
  withLines = false,
  ...props
}) => {
  if (withLines) {
    return (
      <div className="flex items-center gap-3 justify-center mb-1.5">
        <span className="h-[1px] w-6 bg-[#C5A880]/60" />
        <p
          className={cn(
            "text-[10px] sm:text-[11px] font-bold uppercase tracking-[0.22em] text-[#C5A880] font-body",
            className
          )}
          {...props}
        >
          {children}
        </p>
        <span className="h-[1px] w-6 bg-[#C5A880]/60" />
      </div>
    );
  }

  return (
    <p
      className={cn(
        "text-[10px] sm:text-[11px] font-bold uppercase tracking-[0.22em] text-[#C5A880] font-body mb-1",
        className
      )}
      {...props}
    >
      {children}
    </p>
  );
};

// 2. Heading Styles (H1 - H6)
export interface LuxuryHeadingProps extends React.HTMLAttributes<HTMLHeadingElement> {
  as?: "h1" | "h2" | "h3" | "h4" | "h5" | "h6";
  children: React.ReactNode;
  subtitle?: React.ReactNode;
  kicker?: string;
  withDivider?: boolean;
  align?: "left" | "center" | "right";
  className?: string;
  goldGradient?: boolean;
}

export const LuxuryHeading: React.FC<LuxuryHeadingProps> = ({
  as: Component = "h2",
  children,
  subtitle,
  kicker,
  withDivider = false,
  align = "left",
  className,
  goldGradient = false,
  ...props
}) => {
  const sizeMap = {
    h1: "text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-normal tracking-tight leading-[1.15]",
    h2: "text-2xl sm:text-3xl md:text-4xl font-normal tracking-tight leading-[1.2]",
    h3: "text-xl sm:text-2xl md:text-3xl font-medium tracking-tight leading-[1.25]",
    h4: "text-lg sm:text-xl font-medium tracking-normal leading-[1.3]",
    h5: "text-base sm:text-lg font-semibold tracking-normal leading-[1.35]",
    h6: "text-sm sm:text-base font-semibold uppercase tracking-wider leading-[1.4]",
  };

  const alignMap = {
    left: "text-left items-start",
    center: "text-center items-center",
    right: "text-right items-end",
  };

  return (
    <div className={cn("flex flex-col", alignMap[align])}>
      {kicker && <LuxuryKicker withLines={align === "center"}>{kicker}</LuxuryKicker>}
      <Component
        className={cn(
          "font-display text-foreground font-serif",
          sizeMap[Component],
          goldGradient && "gold-text",
          className
        )}
        {...props}
      >
        {children}
      </Component>
      {withDivider && (
        <div
          className={cn(
            "h-[1px] bg-gradient-to-r from-transparent via-[#C5A880]/70 to-transparent my-3",
            align === "center" ? "w-24 mx-auto" : "w-16"
          )}
        />
      )}
      {subtitle && (
        <p className="text-xs sm:text-sm text-muted-foreground font-body max-w-2xl font-light mt-1.5 leading-relaxed">
          {subtitle}
        </p>
      )}
    </div>
  );
};

// 3. Body Text Styles
export interface LuxuryTextProps extends React.HTMLAttributes<HTMLParagraphElement> {
  variant?: "lead" | "body" | "caption" | "meta" | "quote";
  children: React.ReactNode;
  className?: string;
  muted?: boolean;
}

export const LuxuryText: React.FC<LuxuryTextProps> = ({
  variant = "body",
  children,
  className,
  muted = false,
  ...props
}) => {
  const variantClasses = {
    lead: "text-base sm:text-lg text-foreground font-light leading-relaxed font-body",
    body: "text-xs sm:text-sm leading-relaxed font-body",
    caption: "text-[11px] sm:text-xs text-muted-foreground font-body leading-normal",
    meta: "text-[10px] font-mono uppercase tracking-wider text-muted-foreground",
    quote: "text-sm sm:text-base italic font-serif text-foreground/90 border-l-2 border-[#C5A880] pl-4 py-1",
  };

  return (
    <p
      className={cn(
        variantClasses[variant],
        muted && "text-muted-foreground",
        className
      )}
      {...props}
    >
      {children}
    </p>
  );
};
