import businessReport  from  "../../../assets/businessReport.png"


import React from "react";

interface Props {
  fill? : string ;
  height? : string ;
  width? : string ;
  style?:any;
}

const BusinessReport = ({fill , height , width,style} : Props) => {
  return (
    <img src={businessReport} style={{filter: 'brightness(100%)',...style}} />
  );
};

export default BusinessReport;
