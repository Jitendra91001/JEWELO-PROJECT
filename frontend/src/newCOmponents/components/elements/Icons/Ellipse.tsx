import React from 'react';
import { svgProps } from './iconsInterface';
export const Ellipse = ({ fill, height, width, style }: svgProps) => {
    return (
        <svg width={width || "6"} height={height || "18"}  style={style}  viewBox="0 0 10 10" fill={fill} xmlns="http://www.w3.org/2000/svg">
            <circle cx="5" cy="5" r="4.5" stroke="white" />
        </svg>
    )
}