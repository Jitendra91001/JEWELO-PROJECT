import React, { useEffect, useState } from 'react';
import { Row, Col } from 'antd';
import { useTranslation } from "react-i18next";
import { InvoiceDimension } from "../../../helpers/dimentions";
// import EcareLogo from "../../../assets/eCareLogoV2.svg";
import nabh from "../../../assets/nabh.png";
import indianHealth from "../../../assets/indianHealth.png";
import locationIcon from "../../../assets/location.png";
import phoneIcon from "../../../assets/phone.png";
import emailIcon from "../../../assets/email.png";

interface InvoiceHeaderProps {
   gstinNo?: string,
   heading: string,
   phoneNo?: number,
   email?: string,
   address?: string,
   pin?: string,
   date?: string,
   time?: string,
   logoLarge ?: string,
   logoSmall ?:string,
   invoiceNo?:string,
}

const InvoiceHeader: React.FC<InvoiceHeaderProps> = ({ logoLarge,logoSmall,gstinNo, heading, phoneNo, email, address, pin, date, time }) => {
   const { t } = useTranslation(); 

   const [logo, setLogo] = useState("")
   
   useEffect(() => {
      if(logoSmall && logoSmall!==""){
         setLogo(logoSmall)
      }
      else if(logoLarge && logoLarge!==""){
         setLogo(logoLarge)
      }
   }, [logoLarge,logoSmall])
   

   return (
      <>
         <Row wrap={false} className="w-full justify-between">
               <Col className="w-[28%] text-left px-3">
                  <img height={"63px"} width={"62px"} src={logo} />
                  {gstinNo && <Col className="flex items-center mt-2"> <span style={InvoiceDimension.Heading} className="min-w-[45px]">{t("gstin")}</span><span className="pl-[10px]" style={InvoiceDimension.Heading}>:</span> <span style={InvoiceDimension.Text} className="ml-[10px]">{gstinNo}</span></Col>}
               </Col>
               <Col className="w-[45%] text-center mx-2">
                  <h2 className='text-[1.5rem] font-semibold !mb-[8px] leading-[1rem]'>{heading ? heading : t("eCare")}</h2>
                  <Row align={"middle"} className="flex-nowrap" justify={"center"}>
                     {phoneNo &&
                        <Col>
                           <p style={InvoiceDimension.Text} className='flex items-center !mb-[5px] sm:text-[11px] xl:text-[14px]'><img className="max-w-[120px] mr-2 text-center whitespace-nowrap" src={phoneIcon} />{phoneNo}</p>
                        </Col>
                     }
                     {email &&
                        <Col className='ml-2'>
                           <p style={InvoiceDimension.Text} className='flex items-center !mb-[5px] sm:text-[11px] xl:text-[14px]'> <img className="max-w-[120px] mr-2 text-center whitespace-nowrap" src={emailIcon} />{email}</p>
                        </Col>
                     }
                  </Row>
                  <Col className="flex item-start justify-center text-wrap ">
                     <p style={InvoiceDimension.Text} className='!mb-[5px] sm:text-[11px] xl:text-[14px]'>{address && <img className="max-w-[120px] mr-2" src={locationIcon} />} {address} , <span className='whitespace-nowrap'> PIN - {pin}</span></p>
                  </Col>
               </Col>
               <Col className="w-[32%] text-right px-3">
                  <img className="max-w-[62px] h-[63px]" src={indianHealth} />
                  <img className="max-w-[62px] h-[63px] ml-3" src={nabh} />
                  {date &&
                     <Col className="mt-1">
                        <div className='flex items-center text-nowrap justify-end'>
                         <span style={InvoiceDimension.Heading} className="sm:text-[11px] xl:text-[14px]">{t("date")}</span><span className="pl-[10px] sm:text-[11px] xl:text-[14px]" style={InvoiceDimension.Heading}>:</span><span style={InvoiceDimension.Text} className="ml-[10px] sm:text-[11px] xl:text-[14px]">{date}<span className='pl-1 inline-block'>{time}</span></span>
                        </div>
                     </Col>
                  }
               </Col>
         </Row>
      </>
   )
}
export default InvoiceHeader;