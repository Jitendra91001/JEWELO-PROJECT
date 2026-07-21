import { DatePicker } from "antd";
import React, { useState } from "react";
import { DatePickerDy } from "../../../helpers/dimentions";
import CommonHeading from "../HeadingTitle/CommonHeading";
import { useTheme } from "../../../contexts/Theme/Theme.context";
import { CalendarOutlined } from "@ant-design/icons";
import { t } from 'i18next'
import './customDatePicker.css';

interface CustomDatePickerDatatype {
  onOk?: (value: any) => void;
  showTime?: any;
  className?: string;
  rest?: any;
  disabled?: boolean;
  format?: any;
  disabledDate?: any;
  onChange?: (event: any) => void;
  DatePickerType?: string;
  name?: string;
  shadow?: boolean;
  sx?: any;
  defaultValue?: any;
  required?: boolean;
  value ? : any;
  size? : any;
  placeholder? : string;
  disabledDateStatus?: boolean;
  picker?: 'date' | 'week' | 'month' | 'quarter' | 'year';
  disabledDateType?: any;
  status ?: string | any;
  tabIndex?: any;
  label?: string;
  onOpenChange ? : any ;
  showSelectLabel?: boolean;
  use12Hours?:any
  variant?: "borderless"|"filled"|"outlined";
  suffixIcon?: any ;
  allowClear?:boolean;
  popupStyle?:any;
  showNow?:boolean;
  handleBlur?:any;
  getPopupContainer?:any;
  open?:boolean;
  defaultOpen?:boolean;
  defaultPickerValue?:any;
}


const { RangePicker } = DatePicker;

const CustomDatePicker: React.FC<CustomDatePickerDatatype> = ({
  onOk,
  showTime,
  onChange,
  className,
  DatePickerType,
  shadow,
  sx,
  placeholder,
  size,
  value,
  defaultValue,
  disabledDateStatus,
  picker="date",
  disabled=false,
  disabledDateType,
  status ,
  getPopupContainer,
  tabIndex,
  label,
  format,
  name,
  onOpenChange ,
  use12Hours,
  required,
  variant,
  suffixIcon=<CalendarOutlined/>,
  allowClear,
  popupStyle,
  handleBlur,
  showNow,
  open,
  defaultOpen,
  defaultPickerValue,
  ...rest
}) => {
  
  const [type] = useState(DatePickerType);
  const {Color} = useTheme();

  const SearchSize ={
    large: DatePickerDy?.largeDatePicker,
    middle:DatePickerDy?.middleDatePicker,
    small: DatePickerDy?.smallDatePicker,
}
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


  return (
    <>
        {
        label && (<label>
          <div 
          className={`flex items-center text-start`}
          >
            <CommonHeading title={label} type="labelHeading" />
            <span
              style={{ color: "red", paddingLeft: "2px", display: required ? "block" : "none" }}>
              *
            </span>
          </div>
        </label>)
      }
      <div className="custom-datepicker-wrapper w-full">
      {type && type === "RangePicker" ? (
        <RangePicker tabIndex={tabIndex}         
        defaultOpen={defaultOpen}
        onChange={onChange}   
        value={value}         
        className={className}
        format={format ?? "YYYY-MM-DD"}  
        size={size ? size : "middle"}
        disabled={disabled}
        disabledDate={disabledDateType}
        {...rest}
        allowClear={allowClear}
        open={open}
        onOpenChange={onOpenChange} 
        cellRender={customCellRender}
        
        />
      ) : (
        <DatePicker
          onChange={onChange}
          className={'block'}
          name={name}
          picker={picker ?? "date"}
          format={format ?? "DD-MMM-YY"}  
          size={size?size:"middle"}
          value={value}
          placeholder={placeholder ?? t("selectDate")}
          disabledDate={disabledDateType}
          tabIndex={tabIndex}
          {...rest}
          status={status}
          placement="bottomRight"
          showTime={showTime}
          variant={variant}
          required={required}
          use12Hours={use12Hours}
          suffixIcon={suffixIcon} 
          onOpenChange={onOpenChange}
          allowClear={allowClear}
          getPopupContainer={getPopupContainer}
          popupStyle={popupStyle}
          onBlur={handleBlur}
          onOk={onOk}
          disabled={disabled}
          showNow={showNow}
          defaultPickerValue={defaultPickerValue}
          cellRender={customCellRender}           
          
        />
      )}
      </div>
    </>
  );
};

export default CustomDatePicker;

