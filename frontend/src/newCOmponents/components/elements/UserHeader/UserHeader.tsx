import { Col, Row, Skeleton } from "antd";
import React from "react";
import CommonHeading from "../HeadingTitle/CommonHeading";
import CommonText from "../HeadingTitle/CommonText";
import { t } from "../../../i18n/i18n";

interface UserHeaderType {
  title?: string;
  subtitle?: string;
  uhid?: string;
  isLoading?:boolean;
  extraData? :any;
  status? :any;
}

const UserHeader: React.FC<UserHeaderType> = ({ title, subtitle, uhid , status,isLoading,extraData}) => {
  return (title || subtitle || uhid) ? (
    <Row
      justify={"space-between"}
      align={"middle"}
      className="bg-[--white] p-2 rounded-md mb-3"
    >
      <Col className="flex items-baseline">
        {!isLoading?<CommonHeading
          type="MainHeadingDark"
          title={title ? title : ""}
        />:<Skeleton.Input size="small" className="pt-3 pl-1" active={isLoading} style={{ width: '50%' }} />}

        <Col className="pl-1">
          {!isLoading?<CommonText
            title={subtitle ? subtitle : ""}
            type="font1"
            color="var(--fontColor)"
          />:<Skeleton.Input size="small" active={isLoading} style={{ width: '40%' }} />}
        </Col>
      </Col>
      {!extraData &&
      <Col>
        {!isLoading?<CommonText 
          title= {status=== 'emergency'  ? (uhid ? `${t("erNo")} : ${uhid}` : "" )  : status==='ipd' ? (uhid ? `${t("admNumber")} : ${uhid}` : "" ) : uhid ? `${t("uhid")} : ${uhid}` : ""}
          type="font1"
          color="var(--fontColor)"
        />:<Skeleton.Input size="small" className="pt-3 pl-1" active={isLoading} style={{ width: '40%' }} />}
      </Col>
      }
      {extraData?
      <Col>
        {!isLoading?<CommonText
          title={extraData}
          type="font1"
          color="var(--fontColor)"
        />:<Skeleton.Input size="small" className="pt-3 pl-1" active={isLoading} style={{ width: '40%' }} />}
       </Col>
      :
      <></>
      }
      
    </Row>
  ) : (
    <Row
    justify={"space-between"}
    align={"middle"}
    className="bg-[--white] p-2 rounded-md mb-3"
  >
      <Col> <Skeleton.Input size="small" active={isLoading} className="pt-3 pl-1" style={{ width: '50%' }} /> <Skeleton.Input size="small" active={isLoading} style={{ width: '30%' }} /> </Col>
    </Row>
    )
  
};

export default UserHeader;
