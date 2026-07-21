import React from 'react';
import { svgProps } from './iconsInterface';
export const ProtectIcon=({fill , height , width , style}:svgProps)=>{
    return(
        <svg width={width || "18"} height={height || "18"} fill={fill || "none"} style={style} viewBox="0 0 39 37" xmlns="http://www.w3.org/2000/svg">
<g clipPath="url(#clip0_240_15914)">
<path d="M17.4619 20.0418H13.5094V15.4168H17.4619V11.5627H22.2048V15.4168H26.1573V20.0418H22.2048V23.896H17.4619V20.0418ZM19.8333 3.0835L7.18542 7.7085V17.0972C7.18542 24.8827 12.5766 32.1439 19.8333 33.9168C27.0901 32.1439 32.4813 24.8827 32.4813 17.0972V7.7085L19.8333 3.0835ZM29.3193 17.0972C29.3193 23.2639 25.2878 28.9681 19.8333 30.7102C14.3789 28.9681 10.3474 23.2793 10.3474 17.0972V9.85141L19.8333 6.38266L29.3193 9.85141V17.0972Z" fill="#01A768"/>
</g>
<defs>
<clipPath id="clip0_240_15914">
<rect width="37.9438" height="37" fill="white" transform="translate(0.86145)"/>
</clipPath>
</defs>
</svg>
    )
}
