import { Form, Input, Typography } from "antd";
import React,{ CSSProperties, useEffect, useRef  } from "react";
import SearchOption from "../Search/SearchOption";
import FlagSelect from "../../ui/FlagSelect";
import {InputDy} from '../../../../src/helpers/dimentions'
import CommonHeading from "../HeadingTitle/CommonHeading";
import { useTheme } from "../../../contexts/Theme/Theme.context";

interface InputFieldProps {
  type: string;
  placeholder?: string;
  prefix?: React.ReactNode;
  suffix?: React.ReactNode;
  size?: "large" | "middle" | "small";
  name?: any;
  label?: string;
  readOnly?: boolean;
  value?: any;
  regx?: any;
  onKeyup?: (event: any) => void;
  onChange?: (event: any) => void;
  className?: string;
  rest?: any;
  shadow?: boolean;
  required?: boolean;
  sx?: CSSProperties;
  addonBefore?: any;
  addonAfter?: any;
  addonBeforeStyle?: CSSProperties;
  showSelectLabel?: boolean;
  labelClass?: any;
  disabled?: boolean;
  validation?: boolean;
  regexErrors?: string;
  errors?: any;
  setErrors?: any;
  addonBeforeHandleChange?: (e: any) => void;
  onFocus? : () => void;
  onBlur?:any;
  outerDivStyle?:any;
  maxLength ? : number ;
  addonBeforeDefaultValue?:any;
  customAddonBefore?:boolean;
  inputRef?:any;
  api?:any;
  capitalize ? : boolean ;
  status?:any;
  addonBeforePlaceHolder?:any;
  inputMode ?: any;
  CustomLabel ? : any;
  autoFilled?:boolean;
  onInput ? : any;
  tabIndex?:any;
  showIconMark?: boolean;
  icon?: string; 
  addonBeforText?: string;
  onKeyDown?: (event: React.KeyboardEvent<HTMLInputElement>) => void;
  onPaste?: (event: React.KeyboardEvent<HTMLInputElement>) => void;
  inputDisabled?: boolean;
  onPressEnter?: any;
  iconRender?: any;
  allowClr ? : boolean ;
  my?: string;
}

const NormalInputField = ({
  type,
  placeholder,
  name,
  label,
  CustomLabel,
  onKeyup,
  onChange,
  regx,
  value,
  required,
  suffix,
  prefix,
  className,

  size,
  rest,
  shadow,
  validation,
  sx,
  addonBefore,
  addonBeforText,
  addonAfter,
  iconRender,
  addonBeforeStyle,
  addonBeforePlaceHolder,
  showSelectLabel,
  labelClass,
  onBlur,
  onInput,
  setErrors,
  maxLength,
  api,
  regexErrors,
  onFocus,
  autoFilled=true,
  capitalize , 
  disabled,
  status,
  readOnly,
  addonBeforeHandleChange, 
  inputMode,
  outerDivStyle,
  addonBeforeDefaultValue,
  errors,
  tabIndex,
  customAddonBefore = true,
  showIconMark = false,
  icon,
  onKeyDown,
  inputDisabled,
  onPressEnter,
  allowClr = true,
  my
}: InputFieldProps) => {
  const inputValidation = (evt: any) => {
    const regxs = new RegExp(regx)
    const { value } = evt.target || evt;
    if (!regxs.test(value)) {
      setErrors?.({...errors, [name]: regexErrors });
    } else {
      setErrors?.({...errors,[name]: ""});
    }
  };

//   const InputSize ={
//     large:InputDy?.largeInput,
//     middle:InputDy?.middleInput,
//     small: InputDy?.smallInput,
// }
const {Color}=useTheme()
const handleWheel = (event) =>{
  event.preventDefault()
}

const inputRef = useRef(null)

useEffect(() => {
  const inputEl = inputRef?.current;
  if (inputEl && inputEl?.input) { // Ensure inputEl is valid and has the `input` property
      inputEl?.input?.addEventListener('wheel', handleWheel, { passive: false });
  }

  return () => {
      if (inputEl && inputEl?.input) {
          inputEl?.input?.removeEventListener('wheel', handleWheel, { passive: false });
      }
  };
}, []);


  return (
    <div className={my ? my : "my-6"} style={outerDivStyle}>
    {
      CustomLabel?CustomLabel:
        label && (<label>
          <div 
          className={`text-start flex items-center`}
          >
            <CommonHeading title={`${label}${showIconMark ? ` ${icon}` : ''}`} type="labelHeading" />
            <span
              style={{color:Color['--asterik'], paddingLeft: "2px", display: required ? "block" : "none" }}
            >
              * 
            </span>
          </div>
        </label>)
      }
 
      <Input
       onPressEnter={onPressEnter}
       autoComplete={autoFilled?"on":"new-password"}
       className={`${capitalize ? "capitalize" : ""}`}
        addonBefore={
          addonBeforText ? addonBeforText : addonBefore ? 
          customAddonBefore?
          (
            <Form.Item name="prefix" noStyle>
              <SearchOption
                onChangeOption={addonBeforeHandleChange}
                showSelectLabel={showSelectLabel}
                options={addonBefore}
                style={addonBeforeStyle ?? {minWidth:"100px"}}
                tabIndex={tabIndex}
                className={"block "}
                shadow={true}
                disabled={disabled}
                value={addonBeforeDefaultValue}
                placeholderTxt={addonBeforePlaceHolder}
                allowClr={allowClr}
              />{" "}
            </Form.Item>
            
          ) 
          : (
            <FlagSelect options={addonBefore} handleChange={addonBeforeHandleChange} value={addonBeforeDefaultValue} disabled={disabled}/>
          )
          :("")
        }
        type={type}
        placeholder={placeholder}
        value={value}
        status={status}
        onFocus={onFocus}
        name={name}
        onChange={onChange}
        tabIndex={tabIndex}
        onKeyUp={onKeyup}
        ref={inputRef}
        readOnly={readOnly}
        onBlur={(e) => validation ? inputValidation(e) : api === true ? onBlur(e) :"" }
        // style={InputSize[size] }
        size={size?size:"middle"}
        prefix={prefix}
        suffix={suffix}
        maxLength={maxLength}
        disabled={disabled ?? inputDisabled ?? false}
        onWheel={handleWheel}
        inputMode={inputMode}
        onInput={onInput}
        addonAfter={addonAfter}
        iconRender={iconRender}
        onKeyDown={onKeyDown}
      />
      {errors?.[name] && (
        <Typography.Text className="block text-start font-[400]" style={{ margin: "0px 0px 0px 3px", color: "red" }}>
          {errors?.[name]}
        </Typography.Text>
      )}
    </div>
  );
};

export default NormalInputField;
