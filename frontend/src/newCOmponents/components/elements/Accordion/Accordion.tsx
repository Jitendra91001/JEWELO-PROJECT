import { Collapse, CollapseProps } from "antd";
import React from "react";

type AccordionProps = {
  item: CollapseProps["items"];
  size?: any;
  rest?: any;
  handleAccordianChange?: (value: any) => void;
  defaultActiveKey?: any;
  bordered?: any;
  ghost?: boolean;
  destroyInactivePanel?: any;
  activeKey ? : any ;
  style?: any;
  expandIconPosition?: any;
  className?: any;
  accordion?: boolean;
  expandIcon?: any;
  collapsible?: CollapseProps["collapsible"];
};

export default function AccordionItem(props: AccordionProps) {
  return (
    <Collapse
      accordion={props?.accordion}
      items={props?.item}
      onChange={props?.handleAccordianChange}
      activeKey={props?.activeKey ? props?.activeKey : props?.defaultActiveKey}
      defaultActiveKey={props?.defaultActiveKey}
      size={props.size ? props.size : "small"}
      bordered={props?.bordered}
      destroyInactivePanel={props?.destroyInactivePanel}
      ghost={props?.ghost}
      style={props?.style}
      collapsible={props?.collapsible}
      expandIconPosition={props?.expandIconPosition}
      className={props?.className}
      expandIcon={props?.expandIcon}
    />
  );
}
