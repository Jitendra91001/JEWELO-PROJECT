export interface DateTimeValue {
  day: string;
  month: string;
  year: string;
  hours: string;
  minutes: string;
  period: 'AM' | 'PM';
}

export const isLeapYear = (year: number): boolean => {
  return (year % 4 === 0 && year % 100 !== 0) || year % 400 === 0;
};

export const getDaysInMonth = (month: number, year: number): number => {
  const daysInMonth = [31, 28, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31];
  if (month === 2 && isLeapYear(year)) {
    return 29;
  }
  return daysInMonth[month - 1] || 31;
};

export const isValidDate = (day: number, month: number, year: number): boolean => {
  if (month < 1 || month > 12) return false;
  if (year < 1900 || year > 2100) return false;
  if (day < 1) return false;

  const maxDays = getDaysInMonth(month, year);
  return day <= maxDays;
};

export const isValidTime = (hours: number, minutes: number): boolean => {
  return hours >= 1 && hours <= 12 && minutes >= 0 && minutes <= 59;
};

export const dateTimeToString = (value: DateTimeValue): string => {
  const { day, month, year, hours, minutes, period } = value;
  if (!day || !month || !year || !hours || !minutes) return '';

  return `${day.padStart(2, '0')}/${month.padStart(2, '0')}/${year} ${hours.padStart(2, '0')}:${minutes.padStart(2, '0')} ${period}`;
};

export const parseDateTime = (dateStr: string): Date | null => {
  const parts = dateStr.match(/(\d{2})\/(\d{2})\/(\d{4})\s+(\d{2}):(\d{2})\s+(AM|PM)/);
  if (!parts) return null;

  const day = parseInt(parts[1]);
  const month = parseInt(parts[2]);
  const year = parseInt(parts[3]);
  let hours = parseInt(parts[4]);
  const minutes = parseInt(parts[5]);
  const period = parts[6];

  if (period === 'PM' && hours !== 12) {
    hours += 12;
  } else if (period === 'AM' && hours === 12) {
    hours = 0;
  }

  return new Date(year, month - 1, day, hours, minutes);
};

export const isFutureDate = (day: number, month: number, year: number, hours: number, minutes: number, period: 'AM' | 'PM'): boolean => {
  let hour24 = hours;
  if (period === 'PM' && hours !== 12) {
    hour24 = hours + 12;
  } else if (period === 'AM' && hours === 12) {
    hour24 = 0;
  }

  const date = new Date(year, month - 1, day, hour24, minutes);
  return date > new Date();
};

export const isPastDate = (day: number, month: number, year: number, hours: number, minutes: number, period: 'AM' | 'PM'): boolean => {
  let hour24 = hours;
  if (period === 'PM' && hours !== 12) {
    hour24 = hours + 12;
  } else if (period === 'AM' && hours === 12) {
    hour24 = 0;
  }

  const date = new Date(year, month - 1, day, hour24, minutes);
  return date < new Date();
};

export const getCalendarDays = (month: number, year: number): (number | null)[] => {
  const firstDay = new Date(year, month - 1, 1).getDay();
  const daysInMonth = getDaysInMonth(month, year);

  const days: (number | null)[] = [];

  for (let i = 0; i < firstDay; i++) {
    days.push(null);
  }

  for (let day = 1; day <= daysInMonth; day++) {
    days.push(day);
  }

  return days;
};
