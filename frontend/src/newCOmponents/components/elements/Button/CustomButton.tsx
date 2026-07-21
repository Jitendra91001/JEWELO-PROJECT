import { Button } from 'antd'
import React from 'react'
import { ThemeType } from '../../../contexts/Theme/Theme.model'
import "./customButton.css"
import { useTheme } from '../../../contexts/Theme/Theme.context';

interface ButtonDatatype {
  value: string | React.ReactNode,
  rest?: any,
  sizeType?: any,
  className?: any,
  themeType?: ThemeType,
  onClick?: () => void,
  disabled?: boolean;
  style?: any,
  type?: any,
  width ? : any ;
  isLoading?: any;
  tabIndex?: any;
  loading?: boolean;
  danger?: boolean;
  block?: boolean;
  variant?: "dashed" | "filled" | "link" | "outlined" | "solid" | "text";
}

const ButtonFeild: React.FC<ButtonDatatype> = ({ variant, value, sizeType, className, onClick, disabled, style ,width, type , tabIndex, loading , isLoading, danger, block ,...rest }) => {
  const {Color} = useTheme();

  const getFontClass = () => {
    if (sizeType === 'middle') return 'font-[500]';
    if (sizeType === 'small') return 'font-[500] !text-[0.875rem]';
    if (sizeType === 'large') return 'font-[600] text-[1rem]';
    return 'font-[500]';
  };
  
  // const computedClassName = `rounded-md btnFont ${getFontClass()} mx-1 ${className || ''}`;  
  const computedClassName = `rounded-md btnFont ${getFontClass()} mx-1`;  

  return (
    <>
      <Button
        className={computedClassName}
        style={{ backgroundColor: danger ? "" : disabled ? "#c2c4c3" : type === 'default' ? "white" :  type === "abha" ? "rgb(214, 96, 37)" : Color["--primary"] , color: danger ? "" : disabled? Color['--disabledColor'] :type==="default"? Color["--primary"] : "white", minWidth:"6rem" , width : width, boxShadow:"none"}}
        disabled={disabled ? disabled : false}
        onClick={onClick}
        size={sizeType ? sizeType : "middle"}
        type={type ? type : 'primary'}
        loading={loading == true ? true : false}
        htmlType={type ?? "button"}
        tabIndex={tabIndex}
        variant={variant}
        danger={danger}
        block={block}
        {...rest}>{value ? value : "Save"}</Button>
    </>
  )
}

export default ButtonFeild;

