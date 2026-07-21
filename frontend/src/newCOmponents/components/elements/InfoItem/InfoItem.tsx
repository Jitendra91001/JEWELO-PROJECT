import { Typography } from "antd";
import React from "react";

interface InfoItemProps {
  label: React.ReactNode;
  value: React.ReactNode;
  size?: "sm" | "md" | "lg" | "xl";
  className?: string;
  align?: "center" | "start";
}

const sizeClasses = {
  default: {
    label: "text-[14px]",
    value: "text-[14px]",
    colon: "text-[14px]",
  },
  sm: {
    label: "text-[12px]",
    value: "text-[12px]",
    colon: "text-[12px]",
  },
  md: {
    label: "text-[16px]",
    value: "text-[16px]",
    colon: "text-[16px]",
  },
  lg: {
    label: "text-[18px]",
    value: "text-[18px]",
    colon: "text-[18px]",
  },
  xl: {
    label: "text-[20px]",
    value: "text-[20px]",
    colon: "text-[20px]",
  },
};

const InfoItem: React.FC<InfoItemProps> = ({
  label,
  value,
  size,
  className = "",
  align = "center",
}) => {
  const selectedSize = size ? sizeClasses[size] : sizeClasses.default;

  return (
    <div
      className={`
        flex flex-wrap sm:flex-nowrap
        ${align === "center" ? "items-start" : "items-center"}
        ${className}
      `}
    >
      {/* Label */}
      <Typography.Text
        strong
        className={`
          ${
            align === "center"
              ? "w-full sm:w-[180px] text-left sm:text-end"
              : "w-auto text-left"
          }
          ${selectedSize.label}
        `}
      >
        {label}
      </Typography.Text>

      {/* Colon */}
      <Typography.Text
        className={`
          px-2
          ${
            align === "center"
              ? "hidden sm:block"
              : "block flex-shrink-0"
          }
          ${selectedSize.colon}
        `}
      >
        :
      </Typography.Text>

      {/* Value */}
      <Typography.Text
        className={`
          text-[#555]
          break-words
          ${align === "center" ? "flex-1" : ""}
          ${selectedSize.value}
        `}
      >
        {value ?? "---"}
      </Typography.Text>
    </div>
  );
};

export default InfoItem;