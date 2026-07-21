import React from 'react';
import { Select, SelectProps } from 'antd';
import CommonHeading from '../HeadingTitle/CommonHeading';
import { useTheme } from "../../../contexts/Theme/Theme.context";
interface SelectPropsCustom {
  options?: SelectProps['options'];
  className?: string;
  placeholder?: string;
  style?: any;
  mode?: "multiple" | "tags";
  onChange?: (e: any, name: any) => void;
  size?:any;
  onSearch?: (e: any) => void;
  selectedValue?: any[];
  readOnly?: boolean;
  status?: any;
  onBlur?: (e: any) => void;
  maxcount?:number;
  required:boolean;
  label:string;
  showIconMark?: boolean;
  icon?: string;
}

const TableSelect: React.FC<SelectPropsCustom> = ({ options,style, selectedValue, placeholder, onChange, onSearch, onBlur,readOnly, status,size,mode,maxcount,label,showIconMark,icon, required }) => {

  const filterOption = (
    input: string,
    option?: { label: string; value: string }
  ) => (option?.label ?? "").toLowerCase().includes(input.toLowerCase());
  const {Color}=useTheme()
  return (
    <div className="my-6 tagSelect">
    {
        label && (<label>
          <div className={`text-start flex items-center`}>
            <CommonHeading title={`${label}${showIconMark ? ` ${icon}` : ''}`} type="labelHeading" />
            <span
              style={{color:Color['--asterik'], paddingLeft: "2px", display: required ? "block" : "none" }}> *  </span>
          </div>
        </label>)
      }
    <Select
      mode={mode}
      style={style ?? { width: '100%' }}
      placeholder={placeholder ?? "Select"}
      onChange={onChange}
      options={options ?? []}
      size={ size ?? "large"}
      showSearch
      value={selectedValue}
      onSearch={onSearch}
      filterOption={filterOption}
      status={status}
      disabled={readOnly ? true : false}
      maxCount={maxcount}
      onBlur={onBlur}
      className='rounded-md'
    />
    </div>
  )
};

export default TableSelect;