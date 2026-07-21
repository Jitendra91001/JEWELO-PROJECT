import React from "react";
import { Select, Space } from "antd";
import { useTranslation } from "react-i18next";
// import {SearchDy} from '../../../../src/helpers/dimentions'
import CommonHeading from "../HeadingTitle/CommonHeading";
import { useTheme } from "../../../contexts/Theme/Theme.context";

interface SearchOptionProps {
  options?: any;
  style?: React.CSSProperties;
  placeholderTxt?: string;
  onChangeOption?:(e:any, _)=>void;
  onKeyPressOption?:(e:any)=>void;
  status?: any;
  allowClr?: boolean;
  label?: any;
  required?: boolean;
  disabled?: boolean;
  size?: "large" | "middle" | "small";
  value?: any;
  shadow?: boolean;
  showSelectLabel?: boolean;
  labelClass?: any;
  rest?: any;
  labelStyle?: any;
  mode?: any;
  suffixIcon?: any;
  onSearch?: any;
  readOnly? : boolean;
  className? : any;
  name? : any;
  selectedValue?:any;
  notFoundContent?:any;
  onfocus?:any;
  tabIndex?:any;
  ref? : string ;
  filter? :boolean;
  onBlur?:any;
  showSearch?: boolean;
  maxCount?:number;
  optionRender?: (option: any) => React.ReactNode;
  onClear?: any;
}

const filterOption = (
  input: string,
  option?: { label: string; value: string }
) => (option?.label ?? "").toLowerCase().includes(input.toLowerCase());

const SearchOption: React.FC<SearchOptionProps> = ({
  options,
  onSearch,
  style,
  placeholderTxt,
  onChangeOption,
  onKeyPressOption,
  status,
  suffixIcon,
  allowClr,
  label,
  required,
  disabled,
  ref,
  size,
  value,
  shadow,
  name ,
  onfocus,
  showSelectLabel,
  readOnly,
  labelClass,
  labelStyle,
  mode,
  className,
  tabIndex,
  notFoundContent,
  filter=true,
  onBlur,
  showSearch,
  maxCount,
  optionRender,
  onClear,
  ...rest
}) => {

 const { t } = useTranslation();
 const {Color}=useTheme()
//   const SearchSize ={
//     large:SearchDy?.largeSearch,
//     middle:SearchDy?.middleSearch,
//     small: SearchDy?.smallSearch,
// }

const defaultOptionRender = (option: any) => (
  <Space>
    <span role="img" aria-label={option.data.label}>
      {option.data.image ?? ""}
    </span>
    {option.data.label}
  </Space>
);

  return showSelectLabel !== true ? (
    <>
      <label>
      <div 
          className={`flex items-center text-start`}>
          <CommonHeading title={t(label)} type="labelHeading" />
          <span
           style={{ color:Color['--asterik'], paddingLeft: "2px", display: required ? "block" : "none" }}
          >
            *
          </span>
        </div>
      </label>
      <Select
        className={'block font-[400] rounded-md text-start'}
        showSearch = {showSearch ?? true }
        ref={ref}
        mode={mode}
        style={style ? style : undefined}
        size={size?size:"middle"}
        placeholder={placeholderTxt ?? t("SearchToSelectPlaceholder")}
        optionFilterProp="children"
        filterOption={filterOption}
        onChange={onChangeOption}
        onKeyUp={onKeyPressOption}
        onSearch={onSearch}
        value={value}
        onFocus={onfocus}
        disabled={disabled}
        suffixIcon={suffixIcon}
        defaultValue={value}
        status={status}
        tabIndex={tabIndex}
        maxCount={maxCount}
        allowClear={allowClr ?? true}
        onBlur={onBlur}
        filterSort={filter 
          ? (optionA, optionB) => (optionA?.label ?? "").toLowerCase().localeCompare((optionB?.label ?? "").toLowerCase()) 
          : undefined}
        options={options ?? []}
        optionRender={optionRender || defaultOptionRender} 
        onClear={onClear}
        notFoundContent={notFoundContent}
      />
    </>
  ) : (
      <Select
        showSearch
        mode={mode}
        className={'block font-[400] rounded-md text-start'}
        style={style ? style : undefined}
        size={size?size:"middle"}
        placeholder={placeholderTxt ?? t("SearchToSelectPlaceholder")}
        optionFilterProp="children"
        filterOption={filterOption}
        onChange={onChangeOption}
        onKeyUp={onKeyPressOption}
        onSearch={onSearch}
        value={value}
        status={status}
        tabIndex={tabIndex}
        allowClear={allowClr ?? true}
        filterSort={filter 
          ? (optionA, optionB) => (optionA?.label ?? "").toLowerCase().localeCompare((optionB?.label ?? "").toLowerCase()) 
          : undefined}
        options={options ?? []}
        disabled={disabled}
        optionRender={optionRender || defaultOptionRender} 
        onClear={onClear}
        notFoundContent={notFoundContent}
      />
  );
};

export default SearchOption;
