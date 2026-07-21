import { useState, useEffect } from "react";
import { getCalendarDays } from "./dateTimeUtils";
import { 
  LeftOutlined, 
  RightOutlined,
  CalendarOutlined,
  ClockCircleOutlined,
  CheckCircleFilled
} from "@ant-design/icons";

interface CalendarProps {
  selectedDay?: number;
  selectedMonth?: number;
  selectedYear?: number;
  onDateSelect: (day: number, month: number, year: number) => void;
  disableFuture?: boolean;
  disablePast?: boolean;
  minDate?: Date;
  maxDate?: Date;
  highlightedDates?: Date[];
  showWeekNumbers?: boolean;
  variant?: 'default' | 'compact' | 'extended';
  className?: string;
}

export const Calendar: React.FC<CalendarProps> = ({
  selectedDay,
  selectedMonth,
  selectedYear,
  onDateSelect,
  disableFuture = false,
  disablePast = false,
  minDate,
  maxDate,
  highlightedDates = [],
  showWeekNumbers = false,
  variant = 'default',
  className = '',
}) => {
  const today = new Date();
  const [viewMonth, setViewMonth] = useState(selectedMonth || today.getMonth() + 1);
  const [viewYear, setViewYear] = useState(selectedYear || today.getFullYear());
  const [hoveredDay, setHoveredDay] = useState<number | null>(null);

  useEffect(() => {
    if (selectedMonth && selectedYear) {
      setViewMonth(selectedMonth);
      setViewYear(selectedYear);
    }
  }, [selectedMonth, selectedYear]);

  const calendarDays = getCalendarDays(viewMonth, viewYear);
  const weekDays = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
  
  const monthNames = [
    'January', 'February', 'March', 'April', 'May', 'June',
    'July', 'August', 'September', 'October', 'November', 'December'
  ];

  const handlePrevMonth = () => {
    if (viewMonth === 1) {
      setViewMonth(12);
      setViewYear(viewYear - 1);
    } else {
      setViewMonth(viewMonth - 1);
    }
  };

  const handleNextMonth = () => {
    if (viewMonth === 12) {
      setViewMonth(1);
      setViewYear(viewYear + 1);
    } else {
      setViewMonth(viewMonth + 1);
    }
  };

  const handleToday = () => {
    setViewMonth(today.getMonth() + 1);
    setViewYear(today.getFullYear());
  };

  const isDateDisabled = (day: number): boolean => {
    const date = new Date(viewYear, viewMonth - 1, day);
    const now = new Date();
    now.setHours(0, 0, 0, 0);
    date.setHours(0, 0, 0, 0);

    if (disableFuture && date > now) return true;
    if (disablePast && date < now) return true;
    if (minDate && date < minDate) return true;
    if (maxDate && date > maxDate) return true;
    
    return false;
  };

  const isHighlighted = (day: number): boolean => {
    const date = new Date(viewYear, viewMonth - 1, day);
    return highlightedDates.some(
      (highlightedDate) => 
        highlightedDate.toDateString() === date.toDateString()
    );
  };

  const isSelected = (day: number): boolean => {
    return (
      day === selectedDay &&
      viewMonth === selectedMonth &&
      viewYear === selectedYear
    );
  };

  const isToday = (day: number): boolean => {
    return (
      day === today.getDate() &&
      viewMonth === today.getMonth() + 1 &&
      viewYear === today.getFullYear()
    );
  };

  const getWeekNumber = (day: number): number => {
    const date = new Date(viewYear, viewMonth - 1, day);
    const firstJan = new Date(date.getFullYear(), 0, 1);
    const days = Math.floor((date.getTime() - firstJan.getTime()) / (24 * 60 * 60 * 1000));
    return Math.ceil((days + firstJan.getDay() + 1) / 7);
  };

  const getSizeClasses = () => {
    switch(variant) {
      case 'compact':
        return 'w-72 p-4';
      case 'extended':
        return 'w-96 p-6';
      default:
        return 'w-80 p-5';
    }
  };

  const getFormattedSelectedDate = (): string => {
    if (selectedDay && selectedMonth && selectedYear) {
      return `${monthNames[selectedMonth - 1].substring(0, 3)} ${selectedDay}, ${selectedYear}`;
    }
    return 'No date selected';
  };

  return (
    <div 
      className={`
        bg-white
        border border-gray-100 
        rounded-2xl shadow-lg 
        transition-all duration-200
        hover:shadow-xl
        ${getSizeClasses()}
        ${className}
      `}
    >
      {/* Header with gradient */}
      <div className="bg-gradient-to-r from-blue-50 to-indigo-50 -mt-2 -mx-2 p-4 rounded-t-2xl mb-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="bg-white p-2 rounded-lg shadow-sm">
              <CalendarOutlined className="text-[--primary] text-lg" />
            </div>
            <div>
              <p className="text-xs font-medium text-gray-500 uppercase tracking-wider">
                Selected Date
              </p>
              <p className="text-lg font-bold text-gray-800">
                {getFormattedSelectedDate()}
              </p>
            </div>
          </div>
          
          {(selectedDay || selectedMonth || selectedYear) && (
            <div className="bg-green-500 p-1.5 rounded-full shadow-lg">
              <CheckCircleFilled className="text-white text-sm" />
            </div>
          )}
        </div>
      </div>

      {/* Month Navigation - Modern Design */}
      <div className="flex items-center justify-between mb-6 px-1">
        <button
          onClick={handlePrevMonth}
          className="
            w-8 h-8
            flex items-center justify-center
            bg-gray-50
            hover:bg-gray-100
            active:bg-gray-200
            rounded-[6px]
            border border-gray-200
            transition-all duration-200
            group
            focus:outline-none focus:ring-2 focus:ring-[--primary] focus:ring-offset-2
          "
          type="button"
        >
          <LeftOutlined className="text-gray-600 text-sm group-hover:text-[--primary] transition-colors" />
        </button>

        <div className="flex items-center space-x-3">
          <button
            onClick={handleToday}
            className="
              px-3 py-1.5 
              text-xs font-semibold 
              text-[--primary]
              bg-blue-50
              rounded-lg 
              hover:bg-blue-100
              transition-all duration-200
              focus:outline-none focus:ring-2 focus:ring-[--primary]
              border border-[--primary]
            "
          >
            Today
          </button>
          <div className="text-base font-bold text-gray-800">
            {monthNames[viewMonth - 1]} {viewYear}
          </div>
        </div>

        <button
          onClick={handleNextMonth}
          className="
            w-8 h-8
            flex items-center justify-center
            bg-gray-50
            hover:bg-gray-100
            active:bg-gray-200
            rounded-[6px]
            border border-gray-200
            transition-all duration-200
            group
            focus:outline-none focus:ring-2 focus:ring-[--primary] focus:ring-offset-2
          "
          type="button"
        >
          <RightOutlined className="text-gray-600 text-sm group-hover:text-[--primary] transition-colors" />
        </button>
      </div>

      {/* Week Days - Better styling */}
      <div className={`
        grid ${showWeekNumbers ? 'grid-cols-8' : 'grid-cols-7'} gap-1 mb-3
      `}>
        {showWeekNumbers && (
          <div className="text-center text-xs font-semibold text-gray-400 py-2">
            Wk
          </div>
        )}
        {weekDays.map((day, index) => (
          <div
            key={day}
            className={`
              text-center text-xs font-semibold py-2
              ${index === 0 ? 'text-red-400' : 'text-gray-500'}
              uppercase tracking-wider
            `}
          >
            {day}
          </div>
        ))}
      </div>

      {/* Calendar Days - Modern grid with better spacing */}
      <div className={`
        grid ${showWeekNumbers ? 'grid-cols-8' : 'grid-cols-7'} gap-1.5
      `}>
        {calendarDays.map((day, index) => {
          if (day === null) {
            return (
              <div 
                key={`empty-${index}`} 
                className="aspect-square"
              />
            );
          }

          const disabled = isDateDisabled(day);
          const selected = isSelected(day);
          const todayDate = isToday(day);
          const highlighted = isHighlighted(day);
          const weekNumber = getWeekNumber(day);
          const isHovered = hoveredDay === day;

          return (
            <>
              {showWeekNumbers && index % 7 === 0 && (
                <div 
                  key={`week-${weekNumber}`}
                  className="
                    aspect-square 
                    flex items-center justify-center 
                    text-xs font-medium 
                    text-gray-400
                    bg-gray-50
                    rounded-lg
                  "
                >
                  {weekNumber}
                </div>
              )}
              
              <button
                key={day}
                onClick={() => !disabled && onDateSelect(day, viewMonth, viewYear)}
                onMouseEnter={() => !disabled && setHoveredDay(day)}
                onMouseLeave={() => setHoveredDay(null)}
                disabled={disabled}
                className={`
                  aspect-square 
                  flex items-center justify-center 
                  rounded-md border-1 border-gray-100 text-sm font-medium
                  transition-all duration-200
                  relative
                  transform active:scale-95
                  focus:outline-none focus:ring-2 focus:ring-[--primary] focus:ring-offset-2
                  ${disabled 
                    ? 'text-gray-300 cursor-not-allowed bg-gray-50' 
                    : 'hover:shadow-md hover:-translate-y-0.5 cursor-pointer'
                  }
                  ${selected 
                    ? 'bg-[--primary] text-white shadow-lg shadow-[#3c9a9f50]' 
                    : 'text-gray-700'
                  }
                  ${todayDate && !selected 
                    ? 'border-2 border-[--primary] font-bold' 
                    : ''
                  }
                  ${highlighted && !selected
                    ? 'bg-yellow-50 text-yellow-700 border border-yellow-200'
                    : ''
                  }
                  ${!disabled && !selected && !highlighted && !todayDate
                    ? 'hover:bg-gray-100 bg-gray-50'
                    : ''
                  }
                  ${isHovered && !disabled && !selected && !highlighted
                    ? 'bg-gray-200'
                    : ''
                  }
                `}
                type="button"
              >
                {day}
                
                {/* Dot indicator for highlighted dates */}
                {highlighted && !selected && (
                  <span className="absolute bottom-1.5 w-1 h-1 bg-yellow-500 rounded-full" />
                )}
              </button>
            </>
          );
        })}
      </div>

      {/* Footer with modern design */}
      {variant === 'extended' && (
        <div className="mt-5 pt-4 border-t border-gray-100">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <div className="flex items-center space-x-2">
                <div className="w-3 h-3 bg-gradient-to-br bg-[--primary] rounded-full shadow-sm" />
                <span className="text-xs text-gray-600 font-medium">Selected</span>
              </div>
              <div className="flex items-center space-x-2">
                <div className="w-3 h-3 bg-yellow-400 rounded-full shadow-sm animate-pulse" />
                <span className="text-xs text-gray-600 font-medium">Event</span>
              </div>
              <div className="flex items-center space-x-2">
                <div className="w-3 h-3 border-2 border-[--primary] rounded-full" />
                <span className="text-xs text-gray-600 font-medium">Today</span>
              </div>
            </div>
            
            <div className="text-xs text-gray-400 font-medium bg-gray-50 px-3 py-1.5 rounded-full">
              Click to select
            </div>
          </div>
        </div>
      )}
    </div>
  );
};