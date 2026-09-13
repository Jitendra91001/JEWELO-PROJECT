import React from "react";
import { Drawer, type DrawerProps } from "antd";
import { cn } from "@/lib/utils";
import { X } from "lucide-react";

export interface LuxuryDrawerProps extends DrawerProps {
  kicker?: string;
  subtitle?: string;
  footerActions?: React.ReactNode;
}

export const LuxuryDrawer: React.FC<LuxuryDrawerProps> = ({
  title,
  kicker,
  subtitle,
  children,
  footerActions,
  className,
  closeIcon,
  ...props
}) => {
  const customHeader = (
    <div className="py-1">
      {kicker && (
        <span className="text-[10px] font-bold uppercase tracking-[0.2em] text-[#C5A880] block mb-0.5 font-body">
          {kicker}
        </span>
      )}
      <div className="font-display font-medium text-lg sm:text-xl text-foreground">
        {title}
      </div>
      {subtitle && (
        <p className="text-xs text-muted-foreground font-body mt-0.5 font-light">
          {subtitle}
        </p>
      )}
    </div>
  );

  return (
    <Drawer
      title={title ? customHeader : null}
      closeIcon={
        closeIcon || (
          <div className="p-1.5 rounded-full hover:bg-secondary text-muted-foreground hover:text-foreground transition">
            <X size={16} />
          </div>
        )
      }
      footer={
        footerActions ? (
          <div className="p-4 bg-background border-t border-border flex items-center justify-end gap-2">
            {footerActions}
          </div>
        ) : (
          props.footer
        )
      }
      className={cn("luxury-drawer font-body", className)}
      {...props}
    >
      <div className="text-xs text-foreground py-2 font-body">{children}</div>
    </Drawer>
  );
};

export default LuxuryDrawer;
