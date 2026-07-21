import React from 'react';
import { TimePicker } from 'antd';
import "./customTimePicker.css"
interface TimePickerProps {
     shadow?:boolean;
     size?:any;
     onChange?:any;
     rest?:any;
     value?:any;
     className?:string;
     use12Hours?:boolean;
     format?:string;
     placeholder?:any;
     status?:any;
     disabled?:boolean;
}
const { RangePicker } = TimePicker;
const CustomTimeRangePicker: React.FC <TimePickerProps>= ({shadow,className,value,size,onChange,use12Hours,format,placeholder,status,disabled,...rest}) =>{
  const customCellRender = (currentDate: any, info: any) => {
    if (info.type === "date") {
      return (
        <div
          className="ant-picker-cell-inner"
          title={currentDate.format("DD-MMM-YY").toUpperCase()}
          style={{
            width: '100%',
            height: '100%',
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
          }}
        >
          {currentDate.date()}
        </div>
      );
    }
    return info.originNode; 
  };
  return(
     <>   
   <RangePicker
    size={size ? size : "middle"} 
    onChange={onChange}
    className={className}
    value={value}
    format={format}
    use12Hours={use12Hours}
    placeholder={placeholder}
    style={{ borderRadius: '5px', boxShadow: shadow ? 'rgba(187, 187, 187, 0.288) 0px 3px 6px, rgba(187, 187, 187, 0.288) 0px 3px 6px' : 'none' }}
    {...rest}
    status={status}
    disabled={disabled}
    cellRender={customCellRender}
    />
    </>
   )}
export default CustomTimeRangePicker;