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
  isLoading?: any;
  loading?: boolean
}

const ResetSubmitButton: React.FC<ButtonDatatype> = ({  value, sizeType, className, onClick, disabled, style , type , loading , isLoading ,...rest }) => {
  const {Color} = useTheme()
  
  return (
    <>
      <Button
        style={{ border:type=='reset'?`1px solid ${Color['--border-color']}`:'none', color:type=="submit"?"var(--white)":"var(--primary)", backgroundColor:type=="submit"?"var(--primary)":"var(--white)",boxShadow:"none"}}
        className={`rounded-md ${sizeType === "middle" ? "font-[500] text-[16px]" : sizeType==="small" ? "font-[500] text-[14px]" :sizeType==="large"? "font-[600] text-[16px]":"font-[500] text-[16px]"} mx-1 `}

        onClick={onClick}
        size={sizeType ? sizeType : "middle"}
        type={type ? type : 'reset'}
        loading={loading == true ? true : false}
        htmlType={type ?? "button"}

        {...rest}>{value ? value : "Save"}</Button>
    </>
  )
}

export default ResetSubmitButton;