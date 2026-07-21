import React from "react";
import { Tooltip, Tag } from "antd";

interface CustomTagProps {
  label: React.ReactNode;
  title?: React.ReactNode;
  closable?: boolean;
  onClose?: (e: React.MouseEvent<HTMLElement>) => void;
}

const TagRender = ({
  label,
  title,
  closable = false,
  onClose,
}: CustomTagProps) => {
  return (
    <Tooltip title={title}>
      <span>
        <Tag
          closable={closable}
          onClose={onClose}
          style={{margin:"2px 2px" }}
          bordered={false}
          className={`py-[3px] text-[13px] rounded-md`}
        >
          {label}
        </Tag>
      </span>
    </Tooltip>
  );
};

export default TagRender;