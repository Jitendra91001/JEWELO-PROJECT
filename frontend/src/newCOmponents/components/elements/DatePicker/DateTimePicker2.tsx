import DateTimePicker from 'react-datetime-picker';
import 'react-datetime-picker/dist/DateTimePicker.css';
import 'react-calendar/dist/Calendar.css';
import 'react-clock/dist/Clock.css';
import "./customDatePicker.css"
import {  CalendarOutlined, ClockCircleFilled, CloseCircleFilled } from '@ant-design/icons';
import CommonHeading from '../HeadingTitle/CommonHeading';

interface Props {
  format ? : string ;
  value ? : any ;
  onChange ? : any ;
  label ? : any ;
  required ? : boolean ;
}

const DateTimePicker2 = ({format , value , onChange , label , required} : Props) => {
  const minDate = new Date();
  const maxDate = new Date('2100-12-31');

  const handleChange = (date: Date | null) => {
    if (date && !isNaN(date.getTime())) {
      onChange(date);
    } else if (date === null) {
      onChange(null);
    }
  };

  return (
    <>
      {label && (
        <label>
          <div className="flex items-center text-start">
            <CommonHeading title={label} type="labelHeading" />
            <span
              style={{ color: "red", paddingLeft: "2px", display: required ? "block" : "none" }}
            >
              *
            </span>
          </div>
        </label>
      )}
   
      <div className="custom-datepicker-wrapper">
        <DateTimePicker
          onChange={handleChange} // Use the validated handler
          value={value}
          format={format ?? 'dd-MM-yyyy'}
          clearIcon={<CloseCircleFilled />}
          calendarIcon={<CalendarOutlined />}
          disableClock={false}
          yearPlaceholder='YYYY'
          monthPlaceholder='MM'
          dayPlaceholder='DD'
          hourPlaceholder='HH'
           maxDetail="minute"
          minutePlaceholder='MM'
          minDate={minDate}
          maxDate={maxDate}
        />
      </div>
    </>
  );
};

export default DateTimePicker2;