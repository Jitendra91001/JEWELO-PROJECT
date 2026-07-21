import { Button } from 'antd'
import React from 'react'
import { ThemeType } from '../../../contexts/Theme/Theme.model'
import { VarientBtnDy } from '../../../helpers/dimentions'

interface ButtonDatatype {
  value: string | React.ReactNode,
  rest?: any,
  sizeType?: any,
  className?: any,
  themeType?: ThemeType,
  onClick?: () => void,
  disabled?: boolean;
  style?: any,
  isLoading?: any;
  tabIndex?: any;
  loading?: boolean;
  varientType?: "lightBtn" | "darkBtn" | "dangerBtn" | "disable" ;
}

const VarientBtnType ={
    lightBtn:VarientBtnDy?.lightBtn,
    dangerBtn:VarientBtnDy?.dangerBtn,
    disableBtn:VarientBtnDy?.disableBtn
}

const VarientButton: React.FC<ButtonDatatype> = ({  value, sizeType, className, onClick, disabled, style , tabIndex, loading , isLoading, varientType }) => {
  return (
    <>
      <Button
        className={`rounded-md ${sizeType === "middle" ? "font-[500] text-[16px]" : sizeType==="small" ? "font-[500] text-[14px]" : "font-[600] text-[16px]"} mx-1 `}
        disabled={disabled ? disabled : false}
        onClick={onClick}
        size={sizeType ? sizeType : "middle"}
        loading={loading == true ? true : false}
        tabIndex={tabIndex}
        danger={varientType==="dangerBtn"?true:false}
        style={VarientBtnType[varientType]}
        >{value ? value : "Save"}</Button>
    </>
  )
}

export default VarientButton;

