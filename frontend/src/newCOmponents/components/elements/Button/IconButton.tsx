import { Button, Flex, Tooltip } from "antd"
import React from "react";
import { useTheme } from "../../../contexts/Theme/Theme.context"
import "./customButton.css"
interface IconButtonProps {
    type?: any;
    icon?: React.ReactNode;
    onClick?: (e:any) => void;
    name?: any;
    endIcon?: any
    loadings?:any;
    extraicon?:React.ReactNode;
    disabled? : boolean;
    tooltip?:string;
    size?:any;
    shape?: "default" | "circle" | "round"
    danger?:boolean;
    block?: boolean;
    variant?: "dashed" | "filled" | "link" | "outlined" | "solid" | "text";
}


const IconButton: React.FC<IconButtonProps> = ({variant, type, icon, onClick, name, endIcon, disabled ,loadings, extraicon , tooltip, size, shape, danger,block}) => {
    
    const { Color } = useTheme();

    const getFontClass = (size: string) => {
        switch (size) {
          case "middle":
            return "font-[500]";
          case "small":
            return "font-[500] text-[14px]";
          case "large":
            return "font-[600]";
          default:
            return "font-[500]";
        }
      };
      
      const computedClassName = `rounded-md btnFont ${getFontClass(size)} mx-1`;      

    return (
        <Tooltip color={'#000'} overlayInnerStyle={{ borderRadius: "7px" }} title={tooltip} placement="top">
            <Button
                className={computedClassName}
                type={type ?type:"primary"}
                icon={icon}
                onClick={onClick}
                loading={loadings ?? false}
                disabled={disabled}
                size={size}
                variant={variant}
                shape={shape ? shape : "default"}
                style={{ backgroundColor: disabled && type !=="link" ? "#c2c4c3" : '', boxShadow:"none", color: danger ? "" : disabled? "#b0abab" : !type || type == "primary" ? "white":"var(--primary)",
                display: 'flex', 
                alignItems: 'center', 
                justifyContent: 'center', 
                    }}
                // style={{ backgroundColor: disabled ? "#c2c4c3" : '', boxShadow:"none", color: danger ? "" : disabled? Color['--disabledColor'] : !type || type == "primary" ? "white":"var(--primary)" }}
                danger={danger}
                block={block?true:false}
            >
                {endIcon === true ? <>{name} &nbsp; {extraicon}</> : name}
            </Button>
        </Tooltip>
    )
}

export default IconButton
