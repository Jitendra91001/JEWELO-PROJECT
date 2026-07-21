import React from "react";
import { Input } from "antd";
import './customTextarea.css'
import { CSSProperties } from "styled-components";
import CommonHeading from "../HeadingTitle/CommonHeading";
import { useTheme } from "../../../contexts/Theme/Theme.context";

const { TextArea } = Input;
interface CustomTextAreaProps {
    rows?: number;
    cols?: number;
    placeholder?: string;
    styles?: React.CSSProperties;
    className?: string;
    showCount?: boolean;
    maxLength?: number;
    minLength?: number;
    label?: string;
    mandatory?: boolean;
    titleClass?: string;
    regex?: string;
    setValue?: any;
    status?:any;
    shadow?:boolean;
    setName?:string;
    isDisabled?:boolean;
    handleChange?:any;
    sx?:CSSProperties;
    size?: "large" | "middle" | "small";
    tabIndex?:any;
    required?: boolean;
    handleBlur?:any;
    name?:any;
    autoSize?:any;
}

export const CustomTextArea: React.FC<CustomTextAreaProps> = ({size, rows, cols, placeholder, className, styles, label, mandatory, titleClass, regex, setValue, setName , handleChange , required,  isDisabled, tabIndex ,shadow,sx,handleBlur,autoSize, ...rest }) => {
    const { Color } = useTheme();
    
    return (
        <>
        <label>
        <div  className={`font-[500] text-start flex items-center mb-1`}>
          <CommonHeading title={label} type="labelHeading" />
          <span style={{ color: Color["--asterik"], display: required ? "contents" : "none" }}> * </span>
        </div>
        </label>
            <TextArea
                rows={rows || 4}
                placeholder={placeholder || "Enter value"}
                onChange={handleChange}
                className="rounded-md"
                size={size ? size: "middle"}
                name={setName}
                value={setValue}
                tabIndex={tabIndex}
                disabled={isDisabled}
                onBlur={handleBlur}
                autoSize={autoSize}
                {...rest}
            />
        </>
    )
}