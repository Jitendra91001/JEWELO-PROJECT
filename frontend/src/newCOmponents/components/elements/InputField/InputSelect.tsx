import { Form, Input, Typography } from "antd";
import React, { CSSProperties, useState } from "react";
import SearchOption from "../Search/SearchOption";
import { InputDy } from '../../../../src/helpers/dimentions'
import CommonHeading from "../HeadingTitle/CommonHeading";
import { useTheme } from "../../../contexts/Theme/Theme.context";
interface InputFieldProps {
    type: string;
    placeholder?: string;
    prefix?: React.ReactNode;
    suffix?: React.ReactNode;
    size?: "large" | "middle" | "small";
    name?: any;
    label?: string;
    value?: any;
    regx?: any;
    onChange?: React.ChangeEventHandler<HTMLInputElement> | any;
    onBlur?: (event: React.FocusEventHandler<HTMLInputElement>) => void;
    className?: string;
    rest?: any;
    shadow?: boolean;
    required?: boolean;
    sx?: CSSProperties;
    addonBefore?: any;
    min: any;
    addonBeforeStyle?: CSSProperties;
    addonAfter?: any;
    showSelectLabel?: boolean;
    labelClass?: any;
    status?: any;
    disabled?: boolean;
}

const ChargesField = ({
    type,
    placeholder,
    name,
    label,
    onChange,
    regx,
    value,
    required,
    suffix,
    prefix,
    className,
    size,
    rest, status,
    shadow,
    min,
    sx,
    addonBefore,
    addonBeforeStyle,
    addonAfter,
    showSelectLabel,
    labelClass,
    disabled
}: InputFieldProps) => {
    const {Color}=useTheme();
    const [errors, setErrors] = useState<any>({});
    const inputValidation = () => {
        const regex = regx?.pattern;
        if (!regex?.test(value?.[name])) {
            setErrors({ [name]: regx?.msg });
        } else {
            setErrors({});
        }
    };
    // const InputSize = {
    //     large: InputDy?.largeInput,
    //     middle: InputDy?.middleInput,
    //     small: InputDy?.smallInput,
    // }
   
    return (
        <div>
            <label>
                <div className={`text-start flex items-center`}>
                    <CommonHeading title={label} type="labelHeading" />
                    <span style={{ color:Color['--asterik'], display: required ? "contents" : "none" }}>*</span>
                </div>
            </label>
            <Input
                addonBefore={addonBefore ? <Form.Item name="prefix" noStyle><SearchOption showSelectLabel={showSelectLabel} options={addonBefore} style={addonBeforeStyle} shadow={true} /> </Form.Item> : ""}
                type={type}
                status={status}
                placeholder={placeholder}
                value={value?.[name]}
                name={name}
                onChange={(e) => {
                    inputValidation();
                    onChange(e);
                }}
                onBlur={() => {
                    inputValidation();
                }}
                // style={InputSize[size]
                size={size?size:"middle"}
                addonAfter={addonAfter ?? ""}
                required={required}
                prefix={prefix}
                suffix={suffix}
                min={min}
                disabled={disabled ?? false}
            />
            {errors?.[name] && (
                <Typography.Text className="block text-start font-[400]" style={{ margin: "0px 0px 0px 3px", color: "red" }}>
                {errors?.[name]}
                </Typography.Text>
            )}
        </div>
    )
}

export default ChargesField