import { Card, Col, Row, Typography } from "antd";
import React, { ReactNode, CSSProperties } from "react";
import Skeleton from "react-loading-skeleton";
import "react-loading-skeleton/dist/skeleton.css";
import CommonText from "../HeadingTitle/CommonText";

const CardSkeleton = () => {
  return (
    <div className="w-full h-full -mt-1">
      <div className="flex">
        <Skeleton width="4rem" height="2.5rem" className="mt-5 ml-3" />
        <div className="ml-4">
          <Skeleton width="5rem" height="1rem" className="mt-4" />
          <Skeleton width="7rem" height="1rem" className="mt-3" />
        </div>
      </div>
    </div>
  );
};

interface CardBoxProps {
  type?: any;
  rest?: any;
  icon?: ReactNode;
  sx?: CSSProperties;
  onClick?: () => void;
  metaIconStyle?: CSSProperties;
  metaTitleStyle?: CSSProperties;
  metaDescriptionStyle?: CSSProperties;
  bottomText?: any;
  items?: any;
  isLoading?: boolean;
}

const CardBox: React.FC<CardBoxProps> = ({
  metaDescriptionStyle,
  metaTitleStyle,
  metaIconStyle,
  onClick,
  isLoading,
  bottomText,
  sx,
  items,
  ...rest
}) => {
  return (
    <Card
      {...rest}
      bodyStyle={{ padding: "0px" }}
      className={`w-[238px] rounded-[7px] pt-[2px] m-auto h-[80px] `}
      style={sx}
      onClick={onClick}
      hoverable
    >
      {isLoading ? (
        <CardSkeleton />
      ) : (
        <Row wrap={false} className="px-3 py-2 flex-col">
          <Col className="flex justify-between w-[100%]">
            <Col flex={"auto"}>
              <Row wrap={true}>
                <Col flex={"auto"}>
                  <Typography.Text
                    style={{ fontWeight: 700, lineHeight: 1 }}
                    className="text-[15px] block"
                  >
                    {(items && items?.description) ?? "Total Appoinment"}
                  </Typography.Text>
                </Col>
                {items && items.bottomText ? (
                  <Col className="text-left">
                    <CommonText
                      type="font1"
                      color="#696969"
                      title={(items && items?.bottomText) ?? ""}
                    />
                  </Col>
                ) : null}
              </Row>
              <Row wrap={true} className="absolute -bottom-2">
                <Col flex={"auto"}>
                  <Typography.Text className="text-[--primary] font-bold text-[20px]  lg:text-[18px] xl:text-[20px] xxl:text-[24px]">
                    {(items && items?.title) ?? "00"}
                  </Typography.Text>
                </Col>
              </Row>
            </Col>
            <Col flex={"none"} className="flex">
              <img
                src={(items && items?.avatar) ?? ""}
                className={`h-[60px] w-[60px]`}
              />
            </Col>
          </Col>
        </Row>
      )}
    </Card>
  );
};
export default CardBox;
