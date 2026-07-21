import { InfoCircleFilled } from "@ant-design/icons";
import { Tag, Tooltip } from "antd";
import React from "react";

interface StatusTagProps {
  color?: any;
  bordered?: boolean;
  closeIcon?: any;
  children?: any;
  onClose?: any;
  tooltip?: any;
  style?:any;
  tooltipPlacement?: any
}
const StatusTag = ({
  color,
  bordered,
  closeIcon,
  children,
  onClose,
  tooltip,
  tooltipPlacement,
  style,
}: StatusTagProps) => {
  return tooltip ? (
    <Tooltip color="#000000" styles={{body : { borderRadius:"5px"}}} placement={tooltipPlacement?tooltipPlacement:"left"} title={tooltip}>
        <Tag
          style={style}
          className="rounded-xl font-[500] text-[14px] min-w-[90px] max-w-[155px] shadow flex items-center justify-center px-2 status-tag"
          color={color ? color : "var(--white)"}
          bordered={bordered ? true : false}
          closeIcon={
            closeIcon ?? <InfoCircleFilled className="absolute right-2" style={{ fontSize:"13px" }} />
          }
          onClose={onClose ? onClose : (e) => e.preventDefault()}
          children={children ?? <>&nbsp;</>}
        />
    </Tooltip>
  ) : (
    <>
     <Tag
       style={style}
          className="rounded-xl font-[500] text-[14px] min-w-[90px] max-w-[155px] shadow flex items-center justify-center status-tag"
          color={color ? color : "var(--white)"}
          bordered={bordered ? true : false}
          closeIcon={
            closeIcon ?? <InfoCircleFilled className="absolute right-2"style={{ fontSize:"13px"}} />
          }
          onClose={onClose ? onClose : (e) => e.preventDefault()}
          children={children ?? <>&nbsp;</>}
        />
    </>
  );
};

export default StatusTag;
