import { Form, Typography,InputNumber } from "antd";
import React,{ CSSProperties, useState } from "react";
import SearchOption from "../Search/SearchOption";
import {InputDy} from '../../../../src/helpers/dimentions'
import CommonHeading from "../HeadingTitle/CommonHeading";


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
  addonBeforeStyle?: CSSProperties;
  addonAfter?: any;
  showSelectLabel?: boolean;
  labelClass?: any;
  status?:any;
  disabled?: boolean;
  min?:any;
  max?:any;
}

const InputNumberField = ({
  type,
  placeholder,
  name,
  label,
  onChange,
  regx,
  value,
  required,
  suffix,
  min,
  max,
  prefix,
  className,
  size,
  rest,status,
  shadow,

  sx,
  addonBefore,
  addonBeforeStyle,
  addonAfter,
  showSelectLabel,
  labelClass,
  disabled
}: InputFieldProps) => {
  const [errors, setErrors] = useState<any>({});

  const inputValidation = () => {
    const regex = regx?.pattern;
    if (!regex?.test(value?.[name])) {
      setErrors({ [name]: regx?.msg });
    } else {
      setErrors({});
    }
  };

//   const InputSize ={
//     small: InputDy?.smallInput,
//     middle:InputDy?.middleInput,
//     large:InputDy?.largeInput
// }

  return (
    <>
      {label && <label>
        <Typography.Text className={`labelName flex gap-1`} >
          <CommonHeading title={label} type="labelHeading" />
          <span
            style={{ color: "red", display: required ? "contents" : "none" }}
          >
            *
          </span>
        </Typography.Text>
      </label>}
      <InputNumber
        className={className? className :"w-[100%]"}
        addonBefore={addonBefore ? <Form.Item name="prefix" noStyle><SearchOption showSelectLabel={showSelectLabel} options={addonBefore}  style={addonBeforeStyle} shadow={true} /> </Form.Item> : ""}
        type={type}
        status={status}
        placeholder={placeholder} 
        value={value?.[name]}
        name={name}
        min={min}
        max={max}
        onChange={(e) => {
           inputValidation();
          onChange(e);
        }}
        onBlur={() => {
          inputValidation();
        }}
        // style={InputSize[size]}
        size={size?size:"middle"}
        addonAfter={addonAfter ?? ""}
        required={required}
        prefix={prefix}
        suffix={suffix}
        disabled={disabled ?? false}
      />
      {errors?.[name] && (
        <span style={{ margin: "4px 2px", color: "red" }}>
          {errors?.[name]}
        </span>
      )}
    </>
  );
};

export default InputNumberField;
