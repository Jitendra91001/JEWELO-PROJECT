import { useEffect, useRef, useState } from "react";
import { ClockCircleOutlined, CheckOutlined } from "@ant-design/icons";

interface TimePickerProps {
  selectedHours?: number;
  selectedMinutes?: number;
  selectedPeriod?: 'AM' | 'PM';
  onTimeSelect: (hours: number, minutes: number, period: 'AM' | 'PM') => void;
  variant?: 'default' | 'compact' | 'extended';
  minuteInterval?: 1 | 5 | 10 | 15 | 30;
  className?: string;
}

export const TimePicker: React.FC<TimePickerProps> = ({
  selectedHours = 12,
  selectedMinutes = 0,
  selectedPeriod = 'AM',
  onTimeSelect,
  variant = 'compact',
  minuteInterval = 1,
  className = '',
}) => {
  const hoursRef = useRef<HTMLDivElement>(null);
  const minutesRef = useRef<HTMLDivElement>(null);
  const [hoveredHour, setHoveredHour] = useState<number | null>(null);
  const [hoveredMinute, setHoveredMinute] = useState<number | null>(null);

  const hours = Array.from({ length: 12 }, (_, i) => i + 1);
  
  // Filter minutes based on interval
  const minutes = Array.from({ length: 60 }, (_, i) => i).filter(
    minute => minute % minuteInterval === 0
  );

  // Format time for display
  const getFormattedTime = (): string => {
    if (selectedHours && selectedMinutes !== undefined && selectedPeriod) {
      const hoursStr = selectedHours.toString().padStart(2, '0');
      const minutesStr = selectedMinutes.toString().padStart(2, '0');
      return `${hoursStr}:${minutesStr} ${selectedPeriod}`;
    }
    return 'No time selected';
  };

  // Scroll to selected values on mount and when they change
  useEffect(() => {
    if (hoursRef.current) {
      const selectedElement = hoursRef.current.querySelector('[data-selected="true"]');
      if (selectedElement) {
        selectedElement.scrollIntoView({ block: 'center', behavior: 'smooth' });
      }
    }
  }, [selectedHours]);

  useEffect(() => {
    if (minutesRef.current) {
      const selectedElement = minutesRef.current.querySelector('[data-selected="true"]');
      if (selectedElement) {
        selectedElement.scrollIntoView({ block: 'center', behavior: 'smooth' });
      }
    }
  }, [selectedMinutes]);

  const getSizeClasses = () => {
    switch(variant) {
      case 'compact':
        return 'w-64 p-4';
      case 'extended':
        return 'w-72 p-5';
      default:
        return 'w-68 p-4';
    }
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
      {/* Header with gradient - matching Calendar style */}
      <div className="bg-gradient-to-r from-blue-50 to-indigo-50 -mt-2 -mx-2 p-3 rounded-t-2xl mb-3">
        <div className="flex items-center space-x-3">
          <div className="bg-white p-1.5 rounded-lg shadow-sm">
            <ClockCircleOutlined className="text-[--primary] text-base" />
          </div>
          <div>
            <p className="text-xs font-medium text-gray-500 uppercase tracking-wider">
              Selected Time
            </p>
            <p className="text-base font-bold text-gray-800">
              {getFormattedTime()}
            </p>
          </div>
        </div>
      </div>

      {/* Time Columns */}
      <div className="flex gap-2 mb-3">
        {/* Hours Column */}
        <div className="flex-1">
          <div className="text-xs font-semibold text-gray-500 mb-2 text-center uppercase tracking-wider">
            Hour
          </div>
          <div
            ref={hoursRef}
            className="
              h-44 
              overflow-y-auto 
              border border-gray-100 
              scrollbar-thin scrollbar-thumb-gray-300 scrollbar-track-gray-50
              bg-gray-50
            "
          >
            {hours.map((hour) => {
              const isSelected = hour === selectedHours;
              const isHovered = hoveredHour === hour;
              
              return (
                <button
                  key={hour}
                  onClick={() => onTimeSelect(hour, selectedMinutes, selectedPeriod)}
                  onMouseEnter={() => setHoveredHour(hour)}
                  onMouseLeave={() => setHoveredHour(null)}
                  data-selected={isSelected}
                  className={`
                    w-full py-1.5 px-2 
                    text-sm text-center transition-all duration-200
                    relative border border-gray-200
                    transform active:scale-95
                    ${isSelected
                      ? 'bg-[--primary] text-white font-semibold shadow-sm'
                      : 'text-gray-700'
                    }
                    ${!isSelected && !isHovered && 'hover:bg-gray-200'}
                    ${isHovered && !isSelected && 'bg-gray-200'}
                  `}
                  type="button"
                >
                  <span className="relative z-10">
                    {hour.toString().padStart(2, '0')}
                  </span>
                  {isSelected && (
                    <CheckOutlined className="absolute right-2 top-1/2 transform -translate-y-1/2 text-white text-xs" />
                  )}
                </button>
              );
            })}
          </div>
        </div>

        {/* Minutes Column */}
        <div className="flex-1">
          <div className="text-xs font-semibold text-gray-500 mb-2 text-center uppercase tracking-wider">
            Minute
          </div>
          <div
            ref={minutesRef}
            className="
              h-44 
              overflow-y-auto 
              border border-gray-100 
              scrollbar-thin scrollbar-thumb-gray-300 scrollbar-track-gray-50
              bg-gray-50
            "
          >
            {minutes.map((minute) => {
              const isSelected = minute === selectedMinutes;
              const isHovered = hoveredMinute === minute;
              
              return (
                <button
                  key={minute}
                  onClick={() => onTimeSelect(selectedHours, minute, selectedPeriod)}
                  onMouseEnter={() => setHoveredMinute(minute)}
                  onMouseLeave={() => setHoveredMinute(null)}
                  data-selected={isSelected}
                  className={`
                    w-full py-1.5 px-2 
                    text-sm text-center transition-all duration-200
                    relative border border-gray-200
                    transform active:scale-95
                    ${isSelected
                      ? 'bg-[--primary] text-white font-semibold shadow-sm'
                      : 'text-gray-700'
                    }
                    ${!isSelected && !isHovered && 'hover:bg-gray-200'}
                    ${isHovered && !isSelected && 'bg-gray-200'}
                  `}
                  type="button"
                >
                  <span className="relative z-10">
                    {minute.toString().padStart(2, '0')}
                  </span>
                  {isSelected && (
                    <CheckOutlined className="absolute right-2 top-1/2 transform -translate-y-1/2 text-white text-xs" />
                  )}
                </button>
              );
            })}
          </div>
        </div>
      </div>

      {/* Period Selection - matching Calendar button style */}
      <div className="flex gap-2">
        <button
          onClick={() => onTimeSelect(selectedHours, selectedMinutes, 'AM')}
          className={`
            flex-1 py-1.5 
            rounded-md text-sm font-semibold 
            transition-all duration-200
            transform active:scale-95
            border-none shadow-md
            ${selectedPeriod === 'AM'
              ? 'bg-[--primary] text-white border-[--primary] shadow-sm'
              : 'bg-gray-50 text-gray-600 border-gray-200 hover:bg-gray-100'
            }
          `}
          type="button"
        >
          AM
        </button>
        <button
          onClick={() => onTimeSelect(selectedHours, selectedMinutes, 'PM')}
          className={`
            flex-1 py-1.5 
            rounded-md text-sm font-semibold 
            transition-all duration-200
            transform active:scale-95
            border-none shadow-md
            ${selectedPeriod === 'PM'
              ? 'bg-[--primary] text-white border-[--primary] shadow-sm'
              : 'bg-gray-50 text-gray-600 border-gray-200 hover:bg-gray-100'
            }
          `}
          type="button"
        >
          PM
        </button>
      </div>

      {/* Minute Interval Indicator - matching Calendar footer style */}
      {minuteInterval > 1 && variant === 'extended' && (
        <div className="mt-3 pt-2 border-t border-gray-100">
          <div className="text-center">
            <span className="text-[10px] text-gray-400 bg-gray-50 px-2 py-1 rounded-full">
              {minuteInterval}-minute intervals
            </span>
          </div>
        </div>
      )}
    </div>
  );
};