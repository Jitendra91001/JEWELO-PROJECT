import React from "react";
import { Button, Row, Col } from "antd";
import CustomDatePicker from "./CustomDatePicker";
import { LeftOutlined, RightOutlined } from "@ant-design/icons";
import CommonText from "../HeadingTitle/CommonText";
import dayjs from "dayjs";


const DayviewDatePicker = ({ variant, onChange  , selectedDate , setSelectedDate  }) => {
  
  const handleDateChange = (date) => {
    setSelectedDate(date);
    onChange(date);
  };

  const handlePrevDay = () => {
    const prevDay = selectedDate.clone().subtract(1, "days");
    setSelectedDate(prevDay);
    onChange(prevDay);
  };

  const handleNextDay = () => {
    const nextDay = selectedDate.clone().add(1, "days");
    setSelectedDate(nextDay);
    onChange(nextDay);
  };

  const disabledDate = (current) => {
    return current && current.isBefore(dayjs(), "day");
  };


  return (
    <Row align="middle" justify="center" gutter={4}>
     
      <Col>
        <Button size="small" variant="text" type="text" onClick={handlePrevDay} disabled={dayjs(selectedDate).format("YYYY-MM-DD") === dayjs().format("YYYY-MM-DD")}><LeftOutlined className="text-gray-500 font-bolder"/></Button>
        </Col>
        <Col>
          <div className="full-day-name w-[90px]" ><CommonText title={selectedDate.format("dddd")} type="font1" color="#a0a0a0" /></div>
      </Col>
      <Col>
        <Button size="small" variant="text" type="text" onClick={handleNextDay}><RightOutlined className="text-gray-500 font-bolder" /></Button>
      </Col>
      <Col>
        <div className="w-[130px]">
        <CustomDatePicker
          value={dayjs(selectedDate)}
          onChange={handleDateChange}
          picker ={"date"}
          variant={variant}
          allowClear={false}
          disabledDate={disabledDate} 
          format={(date) => dayjs(date).format("DD-MMM-YY").toUpperCase()}
        />
        </div>
      </Col>
    </Row>
  );
};

export default DayviewDatePicker;
