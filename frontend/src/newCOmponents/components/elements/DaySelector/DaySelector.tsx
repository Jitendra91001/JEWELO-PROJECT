import React from "react";
import "./DaySelector.css";

interface Day {
  label: string;
  value: string;
}
interface DaySelectorProps {
  Days?: string[]; 
  onlyShow?: boolean; 
  setSelectedDays:any;
  selectedDays:any;
  activeDays?:boolean;
}

const days: Day[] = [
  { label: "Su", value: "Sunday" },
  { label: "Mo", value: "Monday" },
  { label: "Tu", value: "Tuesday" },
  { label: "We", value: "Wednesday" },
  { label: "Th", value: "Thursday" },
  { label: "Fr", value: "Friday" },
  { label: "Sa", value: "Saturday" },
];

const DaySelector: React.FC<DaySelectorProps> = ({ Days = [], onlyShow,setSelectedDays, selectedDays,activeDays}) => {

  const toggleDay = (dayValue: string) => {
    setSelectedDays((prevSelected: string[]) =>
      prevSelected?.includes(dayValue)
        ? prevSelected.filter((day) => day !== dayValue)
        : [...prevSelected, dayValue]
    );
  };
  const displayedDays = activeDays ? days?.filter(day => Days?.includes(day?.value)) : days  
  return (
    <div className="days-selector">
      {displayedDays?.map((day) => (
        <div
          key={day.value}
          className={`day ${Days?.includes(day.value) ? "active" : ""} ${selectedDays?.includes(day.value) ? "active" : ""} 
          ${!onlyShow ? "cursor-pointer" : ""}`}
          onClick={onlyShow ? () => {} : () => toggleDay(day.value)}
        >
          {day.label}
        </div>
      ))}
    </div>
  );
};

export default DaySelector;
