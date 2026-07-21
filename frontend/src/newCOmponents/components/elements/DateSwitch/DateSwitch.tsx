import React from "react";
import { LeftOutlined, RightOutlined } from '@ant-design/icons'; 
import IconButton from "../Button/IconButton";
import { Col, Row } from "antd";
import CommonText from "../HeadingTitle/CommonText";

interface SwitchDateProps  {
  handlePrevMonth: () => void;
  handleNextMonth: () => void;
  monthName: string;
  year: number;
}

const DateSwitch: React.FC<SwitchDateProps> = ({ handlePrevMonth, handleNextMonth, monthName, year }) => {
  return (
    <Row align={'middle'} gutter={[5,5]}>
      <Col>
         <IconButton size={"small"} onClick={handlePrevMonth}  icon={<LeftOutlined />} />
      </Col>
      <Col>
      <div className="w-[9vh] text-center">
        <CommonText title={`${monthName} - ${year}`} type="font2" />
      </div>
      </Col>
      <Col>
        <IconButton size={"small"} onClick={handleNextMonth}   icon={<RightOutlined />} />
      </Col>
    </Row>
  );
}

export default DateSwitch;

