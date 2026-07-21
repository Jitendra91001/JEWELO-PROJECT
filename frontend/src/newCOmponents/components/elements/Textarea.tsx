import { Input } from "antd";
import React from "react";

interface TextAreaDatatype {
  placeholder?: string;
  rest?: any;
  className?: string;
  autoSize?: any;
  onChange?: (e: any) => void;
  size?: any;
  name?: any;
  readOnly? : boolean;
  value?: any;
  row?: any;
  status?:any
}

const Textarea: React.FC<TextAreaDatatype> = ({ status,placeholder, value, name, row,readOnly,onChange , ...rest}) => {
  const { TextArea } = Input;
  return (
    <>
      <TextArea rows={row ?? 4} status={status ?? ""} placeholder={placeholder} name={name ?? ""} value={value} onChange={onChange} disabled={readOnly ? true : false}/>
    </>
  );
};

export default Textarea;


