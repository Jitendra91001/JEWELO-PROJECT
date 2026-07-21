import React from "react";
import { Tabs } from 'antd';
import type { TabsProps } from 'antd';


interface DynamicTabsProps {
    items: TabsProps['items'] | any;
    children?: React.ReactNode,
    onChange: any,
    className?: string,
    activeKey?: string,
    tabPosition?: "top" | "bottom" | "left" | "right",
    type?: "line" | "card" | "editable-card",
    tabBarExtraContent?: any,
    icon?: any,
    size?: "large" | "middle" | "small",
    disabled?: boolean
}

export const DynamicTabs: React.FC<DynamicTabsProps> = ({ items, size, tabPosition, type, onChange, className, activeKey, tabBarExtraContent, icon, ...rest }) => {
    return (
        <>
            {items?.length > 0 &&
                <Tabs size={size} tabBarExtraContent={tabBarExtraContent} defaultActiveKey="1" activeKey={activeKey} type={type} tabPosition={tabPosition} items={
                    items.length > 0 && items?.map((item: any) => {
                        return {
                            key: item.key,
                            label: item.label,
                            children: item.children,
                            icon: item.icon,
                            disabled: item.disabled
                        }

                    })
                } onChange={onChange}
                    className={className}
                    {...rest}
                />}
        </>
    )
}
