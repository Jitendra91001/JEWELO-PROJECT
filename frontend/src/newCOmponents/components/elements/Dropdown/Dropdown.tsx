import { Button, Dropdown } from "antd";
import type { MenuProps } from "antd";
import React from "react";
import { ReactNode } from "react";

export type DynamicDropdownType = {
  title: string | React.ReactNode;
  items: MenuProps["items"] | [];
  arrow?: boolean;
  type?: "primary" | "default" | "plane";
  trigger?: "hover" | "click";
  sizeType?: "middle" | "large" | "small";
  showArrow?: boolean;
  placement?: "topLeft" | "topCenter" | "topRight" | "bottomLeft" | "bottomCenter" | "bottomRight" | "top" | "bottom";
  iconPosition?: "start" | "end";
  dropDownIcon?: ReactNode;
  onClick? : any;
  block?: boolean;
};

const DynamicDropdown = ({
  title,
  items,
  placement,
  type,
  trigger,
  sizeType,
  showArrow,
  onClick ,
  iconPosition,
  dropDownIcon,
  block
}: DynamicDropdownType) => (
  <Dropdown
    menu={{ items , onClick}}
    placement={placement ? placement : ""}
    trigger={trigger ? trigger : "hover"}
    arrow={showArrow ? showArrow : false}
    
  >
    <Button block={block} icon={dropDownIcon ? dropDownIcon : <></>} iconPosition={iconPosition ? iconPosition : 'end'} size={sizeType ? sizeType : "middle"} className="rounded-md" type={type}>{title}</Button>
  </Dropdown>
);

export default DynamicDropdown;
