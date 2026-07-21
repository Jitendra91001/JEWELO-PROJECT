import { Space } from 'antd'
import React, { CSSProperties, useRef } from 'react'
import NormalInputField from './NormalInput'
import ButtonFeild from '../Button/CustomButton'
import { InputDy } from '../../../helpers/dimentions';

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
  addonBeforeStyle?: CSSProperties;
  showSelectLabel?: boolean;
  labelClass?: any;
  disabled?: boolean;
  validation?: boolean;
  regexErrors?: string;
  errors?: any;
  setErrors?: any;
  addonBeforeHandleChange?: (e: any) => void;
  onClick?: (e: any) => void;
  onFocus? : () => void;
  onBlur?:any;
  outerDivStyle?:any;
  maxLength ? : number ;
  addonBeforeDefaultValue?:any;
    customAddonBefore?:boolean;
  inputRef?:any;
  api?:any;
  status?:any;
  inputMode ?: any;
  onInput ? : any;
  tabIndex?:any;
  showIconMark?: boolean;
  icon?: string; 
  disabledBtn?:boolean
}

const InputGeneratePassword = ({
  type,
  placeholder,
  name,
  label,
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
  onClick,
  sx,
  addonBefore,
  addonBeforeStyle,
  showSelectLabel,
  labelClass,
  onBlur,
  onInput,
  setErrors,
  maxLength,
  api,
  regexErrors,
  onFocus,
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
  disabledBtn=false
}: InputFieldProps) => {

  const inputValidation = (evt: any) => {
    const regxs = new RegExp(regx)
    const { value } = evt.target || evt;
    if (!regxs.test(value)) {
      setErrors({...errors, [name]: regexErrors });
    } else {
      setErrors({...errors,[name]: ""});
    }
  };

const handleWheel = (event) =>{
  event.preventDefault()
}

//   const InputSize ={
//     large:InputDy?.largeInput,
//     middle:InputDy?.middleInput,
//     small: InputDy?.smallInput,
// }

const inputRef = useRef(null)

  return (
    <Space.Compact style={{display: "flex", alignItems: "center" }}>
      <NormalInputField 
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

      className={'rounded-md'}
      // style={InputSize[size]}
      size={size? size:"middle"}
      prefix={prefix}
      suffix={suffix}
      maxLength={maxLength}
      disabled={disabled ?? false}
      onWheel={handleWheel}
      inputMode={inputMode}
      onInput={onInput}
       />
      <div className="-mt-[3px] -ml-[5px]">
        <ButtonFeild value={"Generate"} className="rounded-md" type="primary" disabled={disabledBtn} onClick={onClick} />
      </div>
    </Space.Compact>
  )
}

export default InputGeneratePassword
