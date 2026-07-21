import { Col, Row } from 'antd';
import React from 'react'
import CommonHeading from '../HeadingTitle/CommonHeading';

const StrapCard = ({StarpCardData,StrapCardTitle}) => {
  return (
    <div className="pl-1">
    <Row
      align={"middle"}
      gutter={[15, 15]}
      className="bg-white rounded-md sx:rounded-b-md">
      <Col className="bg-[#d5d9dd] min-h-[60px] flex justify-center items-center rounded-l-md xs:text-center sm:text-center md:text-start">
        <CommonHeading title={StrapCardTitle} type="labelHeading" />
      </Col>
      <Col>
        <Row gutter={[10, 10]} align={"middle"} justify={StarpCardData.length > 0 ? "space-around" : "space-between"}>
          {StarpCardData.map((ele,index) => {
            return (
              <Col className={`text-center ${StarpCardData.length > 0 ? 'min-w-[140px]':'min-w-[130px]'}`}>
                <CommonHeading title={ele.lable} type="labelHeading" />
                <CommonHeading title={ele.value} type="Heading1" />
              </Col>
            );
          })}
        </Row>
      </Col>
    </Row>
  </div>
  )
}

export default StrapCard