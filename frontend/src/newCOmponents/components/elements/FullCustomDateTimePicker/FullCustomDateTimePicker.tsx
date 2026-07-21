import { useState, useRef, useEffect } from 'react';
import ReactDOM from 'react-dom';
import dayjs from 'dayjs';
import customParseFormat from 'dayjs/plugin/customParseFormat';
import {
  DateTimeValue,
  isValidDate,
  isValidTime,
  isFutureDate,
  isPastDate,
} from './dateTimeUtils';
import { TimePicker } from './TimePicker';
import { Calendar } from './Calendar';
import "./picker.css"
import { CloseCircleFilled } from '@ant-design/icons';
import CommonHeading from '../HeadingTitle/CommonHeading';

// Extend dayjs with custom parse format
dayjs.extend(customParseFormat);

interface DateTimePickerProps {
  value?: string;
  onChange?: (value: string) => void;
  disableFuture?: boolean;
  label?: string;
  format?: string;
  required?: boolean;
  disablePast?: boolean;
  status?: string;
  placeholder?: string;
  getPopupContainer?: (triggerNode: HTMLElement) => HTMLElement;
}

// Default format
const DEFAULT_FORMAT = 'DD/MM/YYYY HH:mm A';

export const FullCustomDateTimePicker: React.FC<DateTimePickerProps> = ({
  value = '',
  onChange,
  label,
  required,
  disableFuture = false,
  status,
  format = DEFAULT_FORMAT,
  disablePast = false,
  placeholder,
  getPopupContainer,
}) => {
  const [dateTime, setDateTime] = useState<DateTimeValue>({
    day: '',
    month: '',
    year: '',
    hours: '',
    minutes: '',
    period: 'AM',
  });

  const [showCalendar, setShowCalendar] = useState(false);
  const [showTimePicker, setShowTimePicker] = useState(false);
  const [error, setError] = useState('');
  const [cursorPosition, setCursorPosition] = useState(0);
  
  const [calendarPosition, setCalendarPosition] = useState({ top: 0, left: 0 });
  const [timePickerPosition, setTimePickerPosition] = useState({ top: 0, left: 0 });

  const inputRef = useRef<HTMLInputElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const calendarRef = useRef<HTMLDivElement>(null);
  const timePickerRef = useRef<HTMLDivElement>(null);

  // Parse format to understand structure
  const getFormatParts = () => {
    const parts = {
      hasDate: format.includes('DD') && (format.includes('MM') || format.includes('MMM')) && (format.includes('YYYY') || format.includes('YY')),
      hasTime: format.includes('HH') || format.includes('hh') || format.includes('mm'),
      hasDay: format.includes('DD'),
      hasMonth: format.includes('MM') || format.includes('MMM') || format.includes('MMMM'),
      hasYear: format.includes('YYYY') || format.includes('YY'),
      hasHours: format.includes('HH') || format.includes('hh') || format.includes('H') || format.includes('h'),
      hasMinutes: format.includes('mm'),
      hasSeconds: format.includes('ss'),
      hasPeriod: format.includes('A') || format.includes('a'),
      separator: '',
    };

    // Detect separator (/, -, space, etc.)
    const match = format.match(/[\/\-\s:]/);
    if (match) {
      parts.separator = match[0];
    }

    return parts;
  };

  const formatParts = getFormatParts();

  // Generate placeholder based on format
  const getPlaceholder = (): string => {
    if (placeholder) return placeholder;
    return format;
  };

  // Parse value from props using dayjs
  useEffect(() => {
    if (value) {
      const parsed = dayjs(value, format);
      if (parsed.isValid()) {
        const newDateTime: DateTimeValue = {
          day: formatParts.hasDay ? parsed.format('DD') : '',
          month: formatParts.hasMonth ? parsed.format('MM') : '',
          year: formatParts.hasYear ? parsed.format('YYYY') : '',
          hours: formatParts.hasHours ? parsed.format('hh') : '',
          minutes: formatParts.hasMinutes ? parsed.format('mm') : '',
          period: formatParts.hasPeriod ? parsed.format('A') as 'AM' | 'PM' : 'AM',
        };
        setDateTime(newDateTime);
      }
    }
  }, [value, format]);

  const getDisplayValue = (): string => {
    const { day, month, year, hours, minutes, period } = dateTime;
    
    const hasValue = day || month || year || hours || minutes;
    
    if (!hasValue) {
      return format;
    }
    
    let display = format;

    if (formatParts.hasDay) {
      display = display.replace(/DD/g, day ? day.padEnd(2, '_') : '__');
    }
    if (formatParts.hasMonth) {
      display = display.replace(/MM/g, month ? month.padEnd(2, '_') : '__');
    }
    if (formatParts.hasYear) {
      display = display.replace(/YYYY/g, year ? year.padEnd(4, '_') : '____');
    }
    if (formatParts.hasHours) {
      display = display.replace(/hh/g, hours ? hours.padEnd(2, '_') : '__')
                      .replace(/HH/g, hours ? hours.padEnd(2, '_') : '__');
    }
    if (formatParts.hasMinutes) {
      display = display.replace(/mm/g, minutes ? minutes.padEnd(2, '_') : '__');
    }
    if (formatParts.hasPeriod) {
      display = display.replace(/A/g, period);
    }

    return display;
  };

  const updatePopupPositions = () => {
    if (inputRef.current) {
      const rect = inputRef.current.getBoundingClientRect();
      const scrollY = window.scrollY;
      const scrollX = window.scrollX;
      
      setCalendarPosition({
        top: rect.bottom + scrollY,
        left: rect.left + scrollX
      });
      
      setTimePickerPosition({
        top: rect.bottom + scrollY,
        left: rect.left + scrollX
      });
    }
  };

  // Close all popups
  const closeAllPopups = () => {
    setShowCalendar(false);
    setShowTimePicker(false);
  };

  // 👇 FORMAT KE HISAB SE POPUP SHOW KARNE KA LOGIC
  const showAppropriatePopup = () => {
    updatePopupPositions();
    
    const { day, month, year, hours, minutes } = dateTime;
    
    // Case 1: Sirf Time format hai (no date parts)
    if (!formatParts.hasDate && formatParts.hasTime) {
      setShowTimePicker(true);
      setShowCalendar(false);
    }
    // Case 2: Sirf Date format hai (no time parts)
    else if (formatParts.hasDate && !formatParts.hasTime) {
      setShowCalendar(true);
      setShowTimePicker(false);
    }
    // Case 3: Dono hain (Date + Time)
    else if (formatParts.hasDate && formatParts.hasTime) {
      // Agar date complete nahi hai to calendar dikhao
      if (!day || !month || !year) {
        setShowCalendar(true);
        setShowTimePicker(false);
      } 
      // Agar date complete hai but time incomplete hai to time picker dikhao
      else if (day && month && year && (!hours || !minutes)) {
        setShowTimePicker(true);
        setShowCalendar(false);
      }
      // Agar sab kuch complete hai to kuch mat dikhao
      else {
        closeAllPopups();
      }
    }
    // Case 4: Kuch nahi hai format mein (should not happen)
    else {
      closeAllPopups();
    }
  };

  const handleTimeSelectString = (
    hours: string,
    minutes: string,
    period: 'AM' | 'PM'
  ) => {
    const updated = {
      ...dateTime,
      hours,
      minutes,
      period,
    };
    setDateTime(updated);
    validateDateTime(updated);
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    // Handle Escape key
    if (e.key === 'Escape') {
      e.preventDefault();
      closeAllPopups();
      return;
    }

    // Handle Tab key - allow natural tab navigation
    if (e.key === 'Tab') {
      closeAllPopups();
      // Let the natural tab behavior happen
      return;
    }

    if (e.key === 'Backspace') {
      e.preventDefault();
      handleBackspace();
      return;
    }

    if (e.key === 'ArrowLeft' || e.key === 'ArrowRight') {
      return;
    }

    const { hours, minutes } = dateTime;

    if (hours.length === 2 && minutes.length === 2) {
      if (e.key.toLowerCase() === 'a') {
        e.preventDefault();
        handleTimeSelectString(hours, minutes, 'AM');
        return;
      }
      if (e.key.toLowerCase() === 'p') {
        e.preventDefault();
        handleTimeSelectString(hours, minutes, 'PM');
        return;
      }
    }

    if (!/^\d$/.test(e.key)) {
      e.preventDefault();
      return;
    }

    e.preventDefault();
    handleNumberInput(e.key);
  };

  const handleNumberInput = (digit: string) => {
    const { day, month, year, hours, minutes } = dateTime;

    if (formatParts.hasDay && day.length < 2) {
      const newDay = day + digit;
      if (parseInt(newDay) <= 31) {
        const updated = { ...dateTime, day: newDay };
        setDateTime(updated);
        setCursorPosition(getCursorPosition('day', newDay.length));

        if (newDay.length === 2) {
          // Day complete hone par appropriate popup dikhao
          if (formatParts.hasDate && !formatParts.hasTime) {
            // Sirf date format hai to calendar band karo
            setShowCalendar(false);
          } else {
            // Date+Time format hai to calendar dikhao
            updatePopupPositions();
            setShowCalendar(true);
          }
        }
      }
    } else if (formatParts.hasMonth && month.length < 2) {
      const newMonth = month + digit;
      const monthValue = parseInt(newMonth);
      if (monthValue <= 12 && monthValue >= 1) {
        const updated = { ...dateTime, month: newMonth };
        setDateTime(updated);
        setCursorPosition(getCursorPosition('month', newMonth.length));

        if (newMonth.length === 2) {
          // Month complete hone par appropriate popup dikhao
          if (formatParts.hasDate && !formatParts.hasTime) {
            setShowCalendar(false);
          } else {
            updatePopupPositions();
            setShowCalendar(true);
          }
        }
      } else if (newMonth.length === 1) {
        const firstDigit = parseInt(newMonth);
        if (firstDigit === 0 || firstDigit === 1) {
          const updated = { ...dateTime, month: newMonth };
          setDateTime(updated);
          setCursorPosition(getCursorPosition('month', newMonth.length));
        }
      }
    } else if (formatParts.hasYear && year.length < 4) {
      const newYear = year + digit;
      const updated = { ...dateTime, year: newYear };
      setDateTime(updated);
      setCursorPosition(getCursorPosition('year', newYear.length));

      if (newYear.length === 4) {
        validateDate(parseInt(day), parseInt(month), parseInt(newYear));
        
        // Year complete hone par:
        // Agar time bhi hai to time picker dikhao, otherwise calendar band karo
        if (formatParts.hasTime) {
          updatePopupPositions();
          setShowTimePicker(true);
          setShowCalendar(false);
        } else {
          setShowCalendar(false);
        }
      }
    } else if (formatParts.hasHours && hours.length < 2) {
      const newHours = hours + digit;

      if (newHours.length === 1) {
        if (digit === '0' || digit === '1') {
          const updated = { ...dateTime, hours: newHours };
          setDateTime(updated);
          setCursorPosition(getCursorPosition('hours', newHours.length));
        }
      } else {
        const value = parseInt(newHours);
        if (value >= 1 && value <= 12) {
          const updated = { ...dateTime, hours: newHours };
          setDateTime(updated);
          setCursorPosition(getCursorPosition('hours', newHours.length));

          // Hours complete hone par time picker dikhao (agar minutes baki hain)
          if (formatParts.hasMinutes) {
            updatePopupPositions();
            setShowTimePicker(true);
          }
        }
      }
    } else if (formatParts.hasMinutes && minutes.length < 2) {
      const newMinutes = minutes + digit;
      if (parseInt(newMinutes) <= 59) {
        const updated = { ...dateTime, minutes: newMinutes };
        setDateTime(updated);
        setCursorPosition(getCursorPosition('minutes', newMinutes.length));

        if (newMinutes.length === 2) {
          // Minutes complete - time bhi complete
          setShowTimePicker(false);
          validateDateTime(updated);
        }
      }
    }
  };

  const getCursorPosition = (field: string, length: number): number => {
    let position = 0;
    
    if (formatParts.hasDay) {
      position += 2;
      if (field === 'day') return position - (2 - length);
    }
    if (formatParts.hasMonth) {
      position += 2 + (formatParts.separator ? 1 : 0);
      if (field === 'month') return position - (2 - length);
    }
    if (formatParts.hasYear) {
      position += 4 + (formatParts.separator ? 1 : 0);
      if (field === 'year') return position - (4 - length);
    }
    if (formatParts.hasHours) {
      position += 2 + (formatParts.hasMinutes ? 1 : 0);
      if (field === 'hours') return position - (2 - length);
    }
    if (formatParts.hasMinutes) {
      position += 2;
      if (field === 'minutes') return position - (2 - length);
    }

    return position;
  };

  const handleBackspace = () => {
    const { day, month, year, hours, minutes } = dateTime;

    if (formatParts.hasMinutes && minutes.length > 0) {
      const updated = { ...dateTime, minutes: minutes.slice(0, -1) };
      setDateTime(updated);
      setCursorPosition(getCursorPosition('minutes', updated.minutes.length));
      
      if (formatParts.hasTime) {
        updatePopupPositions();
        setShowTimePicker(true);
      }
    } else if (formatParts.hasHours && hours.length > 0) {
      const updated = { ...dateTime, hours: hours.slice(0, -1) };
      setDateTime(updated);
      setCursorPosition(getCursorPosition('hours', updated.hours.length));
      
      if (formatParts.hasTime) {
        updatePopupPositions();
        setShowTimePicker(true);
      }
    } else if (formatParts.hasYear && year.length > 0) {
      const updated = { ...dateTime, year: year.slice(0, -1) };
      setDateTime(updated);
      setCursorPosition(getCursorPosition('year', updated.year.length));
      
      if (formatParts.hasDate) {
        updatePopupPositions();
        setShowCalendar(true);
      }
    } else if (formatParts.hasMonth && month.length > 0) {
      const updated = { ...dateTime, month: month.slice(0, -1) };
      setDateTime(updated);
      setCursorPosition(getCursorPosition('month', updated.month.length));
      
      if (formatParts.hasDate) {
        updatePopupPositions();
        setShowCalendar(true);
      }
    } else if (formatParts.hasDay && day.length > 0) {
      const updated = { ...dateTime, day: day.slice(0, -1) };
      setDateTime(updated);
      setCursorPosition(getCursorPosition('day', updated.day.length));
      
      if (formatParts.hasDate) {
        updatePopupPositions();
        setShowCalendar(true);
      }
    }
    setError('');
  };

  const validateDate = (day: number, month: number, year: number): boolean => {
    if (!isValidDate(day, month, year)) {
      setError('Invalid date');
      return false;
    }
    setError('');
    return true;
  };

  const validateDateTime = (value: DateTimeValue) => {
    const { day, month, year, hours, minutes, period } = value;

    // Agar date format hai to date validate karo
    if (formatParts.hasDate && (!day || !month || !year)) {
      return;
    }

    // Agar time format hai to time validate karo
    if (formatParts.hasTime && (!hours || !minutes)) {
      return;
    }

    const d = day ? parseInt(day) : 1;
    const m = month ? parseInt(month) : 1;
    const y = year ? parseInt(year) : 2000;
    const h = hours ? parseInt(hours) : 12;
    const min = minutes ? parseInt(minutes) : 0;

    if (formatParts.hasDate && !isValidDate(d, m, y)) {
      setError('Invalid date');
      return;
    }

    if (formatParts.hasTime && !isValidTime(h, min)) {
      setError('Invalid time');
      return;
    }

    if (disableFuture && formatParts.hasDate && formatParts.hasTime && 
        isFutureDate(d, m, y, h, min, period)) {
      setError('Future dates are not allowed');
      return;
    }

    if (disablePast && formatParts.hasDate && formatParts.hasTime && 
        isPastDate(d, m, y, h, min, period)) {
      setError('Past dates are not allowed');
      return;
    }

    setError('');
    
    // Date object banao (default values for missing parts)
    const dateObj = new Date(
      y, 
      m - 1, 
      d, 
      formatParts.hasTime ? (period === 'PM' && h !== 12 ? h + 12 : period === 'AM' && h === 12 ? 0 : h) : 0,
      formatParts.hasTime ? min : 0
    );
    
    const formattedDate = dayjs(dateObj).format(format);
    onChange?.(formattedDate);
  };

  const handleCalendarSelect = (day: number, month: number, year: number) => {
    const updated = {
      ...dateTime,
      day: day.toString().padStart(2, '0'),
      month: month.toString().padStart(2, '0'),
      year: year.toString(),
    };
    setDateTime(updated);
    validateDate(day, month, year);
    setShowCalendar(false);
    
    // Agar time bhi format mein hai to time picker dikhao
    if (formatParts.hasTime) {
      updatePopupPositions();
      setShowTimePicker(true);
      setCursorPosition(format.indexOf('hh') !== -1 ? format.indexOf('hh') : format.length);
    }
    
    if (inputRef.current) {
      inputRef.current.focus();
    }
  };

  const handleTimeSelect = (hours: number, minutes: number, period: 'AM' | 'PM') => {
    const updated = {
      ...dateTime,
      hours: hours.toString().padStart(2, '0'),
      minutes: minutes.toString().padStart(2, '0'),
      period,
    };

    setDateTime(updated);
    validateDateTime(updated);
    setShowTimePicker(false);
    
    // Keep focus on input after time selection
    if (inputRef.current) {
      inputRef.current.focus();
    }
  };

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      const isOutsideInput = inputRef.current && !inputRef.current.contains(event.target as Node);
      const isOutsideCalendar = calendarRef.current && !calendarRef.current.contains(event.target as Node);
      const isOutsideTimePicker = timePickerRef.current && !timePickerRef.current.contains(event.target as Node);
      
      if (isOutsideInput) {
        if (showCalendar && isOutsideCalendar) {
          setShowCalendar(false);
        }
        if (showTimePicker && isOutsideTimePicker) {
          setShowTimePicker(false);
        }
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [showCalendar, showTimePicker]);

  useEffect(() => {
    const handleScroll = () => {
      if (showCalendar || showTimePicker) {
        updatePopupPositions();
      }
    };

    window.addEventListener('scroll', handleScroll, true);
    return () => window.removeEventListener('scroll', handleScroll, true);
  }, [showCalendar, showTimePicker]);

  useEffect(() => {
    if (inputRef.current) {
      inputRef.current.setSelectionRange(cursorPosition, cursorPosition);
    }
  }, [cursorPosition, dateTime]);

  const handleClear = () => {
    const emptyState = {
      day: '',
      month: '',
      year: '',
      hours: '',
      minutes: '',
      period: 'AM',
    };

    setDateTime(emptyState);
    setError('');
    setShowCalendar(false);
    setShowTimePicker(false);
    setCursorPosition(0);

    onChange?.('');
    
    if (inputRef.current) {
      inputRef.current.focus();
    }
  };

  const getContainer = () => {
    if (getPopupContainer && inputRef.current) {
      return getPopupContainer(inputRef.current);
    }
    return document.body;
  };

  const handleFocus = () => {
    showAppropriatePopup();
  };

  // Handle global escape key when popup is open
  useEffect(() => {
    const handleGlobalKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && (showCalendar || showTimePicker)) {
        closeAllPopups();
        if (inputRef.current) {
          inputRef.current.focus();
        }
      }
    };

    document.addEventListener('keydown', handleGlobalKeyDown);
    return () => document.removeEventListener('keydown', handleGlobalKeyDown);
  }, [showCalendar, showTimePicker]);

  return (
    <div ref={containerRef} className="relative w-full">
      <div className="relative">
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
        <div className='relative group'>
          <input
            ref={inputRef}
            type="text"
            value={getDisplayValue()}
            onKeyDown={handleKeyDown}
            onClick={showAppropriatePopup}
            onFocus={handleFocus}
            placeholder={getPlaceholder()}
            className={`
              w-full px-2 py-[5px] border-solid border-[1px] text-sm rounded-[6px] 
              focus:outline-none focus:ring-[0.2px] focus:ring-opacity-20 focus:border-[--primary]
              ${error || status === "error" 
                ? 'border-red-500 focus:ring-red-500 focus:border-red-500 hover:border-red-600' 
                : 'border-gray-300 focus:ring-[--primary] hover:border-[--primary]'
              }
              transition-all duration-300
              ${!dateTime.day && !dateTime.month && !dateTime.year && !dateTime.hours && !dateTime.minutes
                ? 'text-gray-400'
                : 'text-gray-900'
              }
              pr-8 cursor-pointer
            `}
            readOnly
          />
          {(dateTime.day || dateTime.month || dateTime.year || dateTime.hours || dateTime.minutes) && (
            <div
              onClick={handleClear}
              className="absolute right-2 top-1/2 transform -translate-y-[52%] cursor-pointer z-2 opacity-0 group-hover:opacity-100 transition-all"
            >
              <CloseCircleFilled className='text-gray-300 !text-xs hover:text-gray-400' />
            </div>
          )}
        </div>
        {error && (
          <p className="text-red-500 text-xs mt-1">{error}</p>
        )}
      </div>

      {/* Calendar Popup - Only show if format has date */}
      {showCalendar && formatParts.hasDate && ReactDOM.createPortal(
        <div
          ref={calendarRef}
          className="fixed z-[9999]"
          style={{
            top: calendarPosition.top,
            left: calendarPosition.left,
          }}
        >
          <Calendar
            selectedDay={dateTime.day ? parseInt(dateTime.day) : undefined}
            selectedMonth={dateTime.month ? parseInt(dateTime.month) : undefined}
            selectedYear={dateTime.year ? parseInt(dateTime.year) : undefined}
            onDateSelect={handleCalendarSelect}
            disableFuture={disableFuture}
            disablePast={disablePast}
          />
        </div>,
        getContainer()
      )}

      {/* Time Picker Popup - Only show if format has time */}
      {showTimePicker && formatParts.hasTime && ReactDOM.createPortal(
        <div
          ref={timePickerRef}
          className="fixed z-[9999]"
          style={{
            top: timePickerPosition.top,
            left: timePickerPosition.left,
          }}
        >
          <TimePicker
            selectedHours={dateTime.hours ? parseInt(dateTime.hours) : 12}
            selectedMinutes={dateTime.minutes ? parseInt(dateTime.minutes) : 0}
            selectedPeriod={dateTime.period}
            onTimeSelect={handleTimeSelect}
          />
        </div>,
        getContainer()
      )}
    </div>
  );
};