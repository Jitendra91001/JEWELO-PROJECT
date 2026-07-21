import React from "react";
import {Radio } from "antd";
import CommonHeading from "../HeadingTitle/CommonHeading";
import { useTheme } from "../../../contexts/Theme/Theme.context";
interface RadioButtonProps {
  options: string[];
  onChange: (e : any) => void;
  
  checkedValue?: any;
  rest?: string[];
  required?:boolean;
  label?:any;
  labelClass?:any;
  name?:string;
  disabled?:boolean;
  disabledValues?:any[];
  tabIndex?:any;
  value?:any
}

const RadioButton: React.FC<RadioButtonProps> = ({
  options,
  onChange,
  checkedValue,
  required,
  label,
  labelClass,
  name,
  disabledValues=[],
  value,
  tabIndex,
  ...rest
 
}) => {
    const { Color } = useTheme();
  
  return (
    <div className="my-6">
      <label>
      <div 
          className={`font-[500] text-start flex items-center`}>
          <CommonHeading title={label} type="labelHeading"/>
          <span
           style={{ color: "var(--asterik)", paddingLeft: "2px", display: required ? "block" : "none" }}
          >
            *
          </span>
        </div>
      </label>
      <Radio.Group className="flex" onChange={onChange} name={name}  defaultValue={checkedValue} {...rest} value={value} >
        {options.map((option, index) => (
          <Radio key={index} value={option} tabIndex={tabIndex+index} disabled={disabledValues.includes(option)}>
           <span style={{color : Color['--blackWhite']}}> {option} </span>
          </Radio>
        ))}
      </Radio.Group>
    </div>
  );
};

export default RadioButton;
