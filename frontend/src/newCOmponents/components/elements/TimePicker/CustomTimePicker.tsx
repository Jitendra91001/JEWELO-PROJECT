import React from 'react';
import { TimePicker } from 'antd';
import "./customTimePicker.css"
import CommonHeading from '../HeadingTitle/CommonHeading';
import { useTheme } from '../../../contexts/Theme/Theme.context';
interface TimePickerProps {
     shadow?:boolean;
     size?:any;
     onChange?:any;
     rest?:any;
     value?:any;
     className?:string;
     use12Hours?:boolean;
     format?:string;
     disabled?:boolean;
     disabledTime?:any
     disabledHours?:any
     disabledMinutes?:any;
     placeholder? : any;
     disabledSeconds?:any
     label?:any
     name?:string;
     onOk?:any;
     onBlur?:any;
     required?:boolean ;
     status ?: string ;
     allowClear?:boolean
     minuteStep?:any;
     showNow?:boolean
}

const CustomTimePicker: React.FC <TimePickerProps>= ({label,required,shadow,placeholder ,name , className, onBlur, disabledTime,value,size,onChange,disabledSeconds, disabledMinutes, disabledHours,use12Hours, status ,format,disabled,allowClear,minuteStep,onOk,showNow,...rest}) =>{
const {Color} =useTheme()
return(
     <div>
     {label && <label>
                <div className={`text-start flex items-center gap-1`}>
                    <CommonHeading title={label} type="labelHeading" />
                  {required && <span style={{ color:Color['--asterik']}}>*</span>}
                </div>
            </label>}
     <TimePicker

     size={size ? size : "middle"} 
     onChange={onChange}
     className={className}
     disabledTime={disabledTime}
     disabledHours={disabledHours}
     disabledMinutes={disabledMinutes}
     disabledSeconds={disabledSeconds}
     value={value}
     format={format}
     onBlur={onBlur}
     required={required?true:false}
     use12Hours={use12Hours}
     disabled={disabled ?? false}
     allowClear={allowClear}
     name={name}
     placeholder={placeholder}
     status={status ? status : ""}
     onOk={onOk}
     showNow={showNow}
     style={{width:"100%", borderRadius: '5px', boxShadow: shadow ? 'rgba(187, 187, 187, 0.288) 0px 3px 6px, rgba(187, 187, 187, 0.288) 0px 3px 6px' : 'none' }}
     {...rest}
     minuteStep={minuteStep ? minuteStep : 1}
     />
    </div>
   )}
export default CustomTimePicker;