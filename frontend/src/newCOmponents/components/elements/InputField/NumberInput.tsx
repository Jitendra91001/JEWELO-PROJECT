import React from 'react';
import './numberInput.css';
import {InputDy} from '../../../../src/helpers/dimentions'


type NumberInputProps = {
    type?: string,
    style?: React.CSSProperties,
    name?: string,
    value: any,
    onChange?: any,
    postFixCom?: React.ReactNode,
    status?: "error" | "success" | "warning" | "none" | boolean,
    numberTwoDigit?:boolean,
    size?: "large" | "middle" | "small";
    onlyNumber?:boolean,
    className?:any,
    numberLength?:number,
}

export const NumberInput: React.FC<NumberInputProps> = ({ type="text",size, style,numberTwoDigit,onlyNumber=false,numberLength=2, name, className, value, onChange, postFixCom,status="none" }) => {
    const defaultStyle = {
        width: "100%",
        height: "32px",
        border: "none",
    }
    const InputSize: Record<"small" | "middle" | "large", React.CSSProperties> = {
    small: InputDy.smallInput,
    middle: InputDy.middleInput,
    large: InputDy.largeInput,
    };

    return (
        <div className='relative number-input-lbr'>
            <input 
            autoComplete="off"
            type={type}
            value={value} 
            name={name || "name"}
            onChange={(e)=>{
                const {value} = e.target;
                if(onlyNumber){
                    if (value.length <= numberLength && /^[1-9][0-9]*$/.test(value) || value === "") {
                        onChange(e)
                    }
                }else{
                    onChange(e)
                }
              }
            }

            style={{ ...InputSize[size ?? "middle"], ...style }}
            className={`${status} ${className}`}
            />
            {
                postFixCom ? 
                <div  style={{position:"absolute",right:"0px",top:"0px",padding:"0px"}}>
                    {postFixCom}
                </div> : 
                <></>
            }

        </div>
    )
}