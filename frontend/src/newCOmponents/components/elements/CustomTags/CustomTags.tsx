import React from "react";
import { Tag } from 'antd';

interface CustomTagsDatatype {
    color?: string,
    onChange?: React.ChangeEventHandler<HTMLInputElement>,
    value?: string,
    rest?: any,
    icon?: React.ReactNode,
    className?: string,
    sx?: any

}

const CustomTags: React.FC<CustomTagsDatatype> = ({ color, value, icon, onChange,sx, className, ...rest }) => {
    return (
        <>
            <Tag
                style={sx ?? {}}
                color={color ?? "#108ee9"}
                className={` rounded ${className}`}
                onChange={onChange}
                icon={icon}
                {...rest} >
                {value ?? "Save"}
            </Tag>
        </>
    );
}
export default CustomTags;