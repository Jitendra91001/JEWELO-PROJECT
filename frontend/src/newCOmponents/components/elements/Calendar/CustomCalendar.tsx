import React, { useEffect, useState } from "react";
import "dayjs/locale/zh-cn";
import dayjs, { Dayjs } from "dayjs";
import dayLocaleData from "dayjs/plugin/localeData";
import { Calendar, Col, Row, Select, theme } from "antd";
import type { CalendarProps } from "antd";
import ButtonFeild from "../Button/CustomButton";
import { t } from "i18next";
import CommonText from "../HeadingTitle/CommonText";
import { CalendarMode } from "antd/es/calendar/generateCalendar";
import "./calendar.css";

dayjs.extend(dayLocaleData);

interface PropsCustom {
  setNextVisitDate?: (date: string | null) => void;
  disableDate?: (date: Dayjs) => boolean;
  nextVisitDate?: string;
  headerRender?: (object: {
    value: dayjs.Dayjs;
    type: CalendarMode;
    onChange: (date: dayjs.Dayjs) => void;
    onTypeChange: (type: CalendarMode) => void;
  }) => JSX.Element;
  fullscreen?: boolean;
  disableDropDown?: boolean;
  isResetEnable?: boolean;
  defaultValue?: Dayjs;
  isToday?: boolean;
  updated?: boolean;
  showScheduleTask?: boolean;
  shouldResetTaskData?: boolean;
  setShouldResetTaskData?: (type: boolean) => void;
}

const CustomCalender: React.FC<PropsCustom> = ({
  setNextVisitDate,
  disableDate,
  headerRender,
  fullscreen = false,
  disableDropDown,
  isResetEnable = false,
  defaultValue,
  nextVisitDate,
  showScheduleTask,
  isToday = false,
  shouldResetTaskData = false,
  setShouldResetTaskData,
  updated,
}) => {
  const { token } = theme.useToken();

  const [currentValue, setCurrentValue] = useState<Dayjs | undefined>(
    defaultValue
  );
  const [currentMonth, setCurrentMonth] = useState(dayjs().month());
  const [currentYear, setCurrentYear] = useState(dayjs().year());

  const wrapperStyle: React.CSSProperties = {
    border: `1px solid ${token.colorBorderSecondary}`,
    borderRadius: token.borderRadiusLG,
  };

  // ==============================
  // Handle Date Select
  // ==============================
  const handleDateChange = (date: Dayjs) => {
    setCurrentValue(date);
    setNextVisitDate?.(date.format("YYYY-MM-DD"));
  };

  const handlePanelChange = (date: Dayjs) => {
    setCurrentMonth(date.month());
    setCurrentYear(date.year());
  };

  // ==============================
  // Sync from nextVisitDate (string → Dayjs)
  // ==============================
  useEffect(() => {
    if (nextVisitDate) {
      const parsed = dayjs(nextVisitDate);
      if (parsed.isValid()) {
        setCurrentValue(parsed);
        setCurrentMonth(parsed.month());
        setCurrentYear(parsed.year());
      }
    }
  }, [nextVisitDate]);

  // ==============================
  // Reset Task Data
  // ==============================
  
useEffect(() => {
  if (shouldResetTaskData) {
    const today = dayjs();

    setCurrentValue(today);
    setCurrentMonth(today.month());
    setCurrentYear(today.year());

    setNextVisitDate?.(null);
    setShouldResetTaskData?.(false);
  }
}, [shouldResetTaskData]);

  // ==============================
  // Schedule Task Mode
  // ==============================
  useEffect(() => {
    if (showScheduleTask && updated && nextVisitDate) {
      const parsed = dayjs(nextVisitDate);
      if (parsed.isValid()) {
        setCurrentValue(parsed);
      }
    }
  }, [showScheduleTask, updated, nextVisitDate]);

  // ==============================
  // Custom Header
  // ==============================
  const renderHeader = () => {
    if (headerRender) return headerRender;

    const years = Array.from({ length: 10 }, (_, i) => dayjs().year() + i);
    const months = Array.from({ length: 12 }, (_, i) => i);

    return ({ value }: { value: Dayjs }) => {
      const currentY = value?.year();
      const currentM = value?.month();

      return (
        <div style={{ padding: 8 }}>
          <Row gutter={8}>
            <Col>
              <Select
                size="small"
                value={currentY}
                disabled={disableDropDown}
                onChange={(newYear) => {
                  const newDate = (currentValue || dayjs())
                    .year(newYear)
                    .month(currentMonth);
                  setCurrentYear(newYear);
                  setCurrentValue(newDate);
                  if (disableDate?.(newDate)) {
                    setNextVisitDate?.(null);
                  } else {
                    setNextVisitDate?.(newDate.format("YYYY-MM-DD"));
                  }
                }}
              >
                {years.map((year) => (
                  <Select.Option key={year} value={year}>
                    {year}
                  </Select.Option>
                ))}
              </Select>
            </Col>

            <Col>
              <Select
                size="small"
                value={currentM}
                disabled={disableDropDown}
                onChange={(newMonth) => {
                  const newDate = (currentValue || dayjs())
                    .month(newMonth)
                    .year(currentYear);
                  setCurrentMonth(newMonth);
                  setCurrentValue(newDate);
                  if (disableDate?.(newDate)) {
                    setNextVisitDate?.(null);
                  } else {
                    setNextVisitDate?.(newDate.format("YYYY-MM-DD"));
                  }
                }}
              >
                {months.map((month) => (
                  <Select.Option key={month} value={month}>
                    {dayjs().month(month).format("MMM")}
                  </Select.Option>
                ))}
              </Select>
            </Col>
          </Row>
        </div>
      );
    };
  };

  // ==============================
  // Date Cell Render
  // ==============================
  const dateFullCellRender = (date: Dayjs) => (
    <div
      title={date.format("DD-MMM-YY").toUpperCase()}
      className="ant-picker-cell-inner"
    >
      <span>{date.date()}</span>
    </div>
  );

  return (
    <>
      <div style={wrapperStyle} className="calendar-container">
        <Calendar
          fullscreen={fullscreen}
          value={currentValue}
          defaultValue={defaultValue}
          disabledDate={disableDate}
          headerRender={renderHeader()}
          onPanelChange={handlePanelChange}
          onChange={handleDateChange}
          dateFullCellRender={dateFullCellRender}
        />
      </div>

      {/* Reset Button */}
      {isResetEnable && (
        <div className="flex justify-end mt-4 rounded-md">
          <ButtonFeild
            value={t("reset")}
            onClick={() => {
              const today = dayjs();

              setCurrentValue(today); // keep controlled
              setCurrentMonth(today.month());
              setCurrentYear(today.year());

              setNextVisitDate?.(null); // clear external form value
            }}
          />
        </div>
      )}

      {/* Today Button */}
      {isToday && !isResetEnable && (
        <div
          className="py-2 cursor-pointer border-solid border-[1px] border-[#ddd] border-t-none rounded-b-md"
          onClick={() => {
            const today = dayjs();
            setCurrentValue(today);
            setCurrentMonth(today.month());
            setCurrentYear(today.year());
            setNextVisitDate?.(today.format("YYYY-MM-DD"));
          }}
        >
          <CommonText title="Today" type="clickFont2" color="#2f3cf5" />
        </div>
      )}
    </>
  );
};

export default CustomCalender;