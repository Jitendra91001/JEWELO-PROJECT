import React from 'react';
import { svgProps } from './iconsInterface';
export const WarningIcon=({fill , height , width , style}:svgProps)=>{
    return(
        <svg width={width || "18"} height={height || "18"}  style={style} viewBox="0 0 39 37" fill="none" xmlns="http://www.w3.org/2000/svg">
<path d="M19.4999 9.23475L31.4048 29.2918H7.59504L19.4999 9.23475ZM19.4999 3.0835L2.10901 32.3752H36.8908L19.4999 3.0835ZM21.0809 24.6668H17.9189V27.7502H21.0809V24.6668ZM21.0809 15.4168H17.9189V21.5835H21.0809V15.4168Z" fill={fill || "#F0483E"}/>
</svg>
    )
}
