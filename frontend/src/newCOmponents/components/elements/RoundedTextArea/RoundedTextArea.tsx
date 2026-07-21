import { Input } from "antd";
import React from "react";

interface TextAreaDatatype {
  placeholder?: string;
  rest?: any;
  className?: string;
  autoSize?: any;
  onChange?: (e: any) => void;
  onBlur?:(e:any)=>void;
  size?: "large" | "middle" | "small"; 
  name?: any;
  readOnly? : boolean;
  value?: any;
  row?: any;
  disabled ? :  boolean ;
  status?:any
}

const RoundedTextArea: React.FC<TextAreaDatatype> = ({ status,size, placeholder, value, name,onChange, row,readOnly,onBlur, disabled, ...rest    }) => {
  const { TextArea } = Input;
  return (
    <>
      <TextArea rows={row ?? 4} size={size?size:"middle"} status={status ?? ""} onChange={onChange} onBlur={onBlur} className="rounded-lg" placeholder={placeholder} name={name ?? ""} value={value} disabled={readOnly ? true : false}/>
    </>
  );
};

export default RoundedTextArea;
