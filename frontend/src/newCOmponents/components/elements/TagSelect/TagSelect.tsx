import React from 'react';
import { Select } from 'antd';

interface SelectPropsCustom {
  options?: any[];
  className?: string;
  placeholder?: string;
  style?: any;
  mode?:"tags" | "multiple" | undefined;
  onChange?: (e: any, name: any) => void;
  size?: "large" | "middle" | "small";
  onSearch?: (e: any) => void;
  selectedValue?: any[];
  readOnly?: boolean;
  status?: any;
  onBlur?: (e: any) => void;
  tagRender? : any;
  maxCount?:number;
  filterOption ? : any ;
  inputRef?:null;
  notFoundContent?:any;
  showSearch?:boolean;
  allowclear?:any;
}

const TagSelect: React.FC<SelectPropsCustom> = ({ inputRef,options,style, selectedValue, maxCount, placeholder, onChange, tagRender , onSearch, onBlur,readOnly,allowclear, status,size,mode,notFoundContent,showSearch=true }) => {

  const filterOption = (
    input: string,
    option?: { label: string; value: string }
  ) => (option?.label ?? "").toLowerCase().includes(input.toLowerCase());

  return (
    <>
      <Select
        mode={mode?mode:"tags"}
        className={'block text-start font-[400]'}
        style={style ? style : undefined}
        placeholder={placeholder ?? "Select"}
        onChange={onChange}
        options={options ?? []}
        size={size?size:"middle"}
        showSearch={showSearch}
        value={selectedValue}
        onSearch={onSearch}
        filterOption={filterOption}
        status={status}
        disabled={readOnly ? true : false}
        onBlur={onBlur}
        tagRender={tagRender}
        maxCount={maxCount}
        ref={inputRef}
        notFoundContent={notFoundContent}
        allowClear={allowclear}
      />
    </>
  )
};

export default TagSelect;