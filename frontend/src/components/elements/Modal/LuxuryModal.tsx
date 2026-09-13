import React from "react";
import { Modal, type ModalProps } from "antd";
import { cn } from "@/lib/utils";
import { X } from "lucide-react";

export interface LuxuryModalProps extends ModalProps {
  kicker?: string;
  subtitle?: string;
  withGoldBorder?: boolean;
}

export const LuxuryModal: React.FC<LuxuryModalProps> = ({
  title,
  kicker,
  subtitle,
  children,
  withGoldBorder = true,
  className,
  closeIcon,
  ...props
}) => {
  const customHeader = (
    <div className="pb-3 mb-2 border-b border-border/60">
      {kicker && (
        <span className="text-[10px] font-bold uppercase tracking-[0.2em] text-[#C5A880] block mb-0.5">
          {kicker}
        </span>
      )}
      <div className="font-display font-medium text-lg sm:text-xl text-foreground">
        {title}
      </div>
      {subtitle && (
        <p className="text-xs text-muted-foreground font-body mt-1 font-light">
          {subtitle}
        </p>
      )}
    </div>
  );

  return (
    <Modal
      title={title ? customHeader : null}
      closeIcon={
        closeIcon || (
          <div className="p-1.5 rounded-full hover:bg-secondary text-muted-foreground hover:text-foreground transition">
            <X size={16} />
          </div>
        )
      }
      className={cn(
        "luxury-modal",
        withGoldBorder && "border-hairline rounded-2xl",
        className
      )}
      centered
      footer={props.footer}
      {...props}
    >
      <div className="font-body text-xs py-2">{children}</div>
    </Modal>
  );
};

export default LuxuryModal;
