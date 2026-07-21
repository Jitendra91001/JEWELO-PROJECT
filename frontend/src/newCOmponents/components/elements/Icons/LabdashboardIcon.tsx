import React from 'react';
import { svgProps } from './iconsInterface';
export const LabashboardIcon=({fill , height , width , style}:svgProps)=>{
    return(
        <>
<svg width={width??"16"} height={height??"16"} viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
<path d="M14.2222 0H1.77778C0.8 0 0 0.8 0 1.77778V14.2222C0 15.2 0.8 16 1.77778 16H14.2222C15.2 16 16 15.2 16 14.2222V1.77778C16 0.8 15.2 0 14.2222 0ZM1.77778 14.2222V1.77778H7.11111V14.2222H1.77778ZM14.2222 14.2222H8.88889V8H14.2222V14.2222ZM14.2222 6.22222H8.88889V1.77778H14.2222V6.22222Z" fill={fill??"white"}/>
</svg>


        </>
    )
}