import React from "react";
import CommonHeading from "../../elements/HeadingTitle/CommonHeading";
import { Space, Select } from 'antd';

interface OptionProps {
    label: string;
    value: string | number;

}

interface SelectProps {
    options?: OptionProps[];
    size?: 'small' | 'middle' | 'large'; 
    title?: string;
    placeholder?: string;
    style?: React.CSSProperties;
    required?: boolean;
    onChange?: any;
    value?: any;
    status?: any;
    defaultValue?: number | string;
    allowClear?: boolean;
    onFocus?: any;
    disabled?: boolean;
    styles ? : any;
    onBlur ? : any;
    variant?: "outlined" | "borderless" | "filled";
    optionRender?: (option: any) => React.ReactNode;
    showSearch?:boolean;

}
const NormalSelect: React.FC<SelectProps> = ({
    options,
    required = false,
    title,
    placeholder = "Select",
    onChange, value,
    onFocus,
    status,
    defaultValue,
    allowClear = true,
    disabled,
    onBlur ,
    size,
    variant,
    styles ,
    optionRender,
    showSearch=false
}) => {

    const defaultOptionRender = (option: any) => (
        <Space>
            <span role="img" aria-label={option.data.label}>
                {option.data.image ?? ""}
            </span>
            {option.data.label}
        </Space>
    );
    return (
        <div>
            {
                title && (<label>
                    <div className={`flex items-center text-start`}>
                        <CommonHeading title={title} type={"labelHeading"} />
                        <div
                            style={{ color: "red", paddingLeft: "2px", display: required ? "block" : "none" }}
                        >
                            <span
                                style={{ color: "red", paddingLeft: "2px", display: required ? "block" : "none" }}
                            >
                                *
                            </span>
                        </div>
                    </div>
                </label>)
            }
            <Select
                size={size? size: 'middle'}
                placeholder={placeholder}
                style={{ width: "100%" }}
                status={status}
                options={options ?? []}
                className='rounded-md'
                onBlur={onBlur}
                allowClear={allowClear}
                onFocus={onFocus}
                onChange={onChange}
                value={value}
                styles={styles}
                defaultValue={defaultValue}
                disabled={disabled}
                showSearch={showSearch}
                variant={variant? variant :"outlined"}
                optionRender={optionRender || defaultOptionRender}
            />
        </div>
    )
}

export default NormalSelect;