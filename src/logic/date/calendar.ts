const WEEKDAY_FORMATTER = new Intl.DateTimeFormat('en-US', {
  weekday: 'short',
});

const MONTH_FORMATTER = new Intl.DateTimeFormat('en-US', {
  month: 'long',
});

const MONTH_YEAR_FORMATTER = new Intl.DateTimeFormat('en-US', {
  month: 'long',
  year: 'numeric',
});

const LONG_DATE_FORMATTER = new Intl.DateTimeFormat('ru-RU', {
  weekday: 'long',
  day: 'numeric',
  month: 'long',
});

function capitalizeFirstLetter(value: string) {
  if (!value) {
    return value;
  }

  return value[0].toUpperCase() + value.slice(1);
}

export function startOfDay(date: Date) {
  const normalized = new Date(date);
  normalized.setHours(0, 0, 0, 0);
  return normalized;
}

export function addDays(date: Date, amount: number) {
  const shifted = new Date(date);
  shifted.setDate(shifted.getDate() + amount);
  return shifted;
}

export function addMonths(date: Date, amount: number) {
  const shifted = new Date(date);
  shifted.setMonth(shifted.getMonth() + amount);
  return shifted;
}

export function isSameDay(left: Date, right: Date) {
  return startOfDay(left).getTime() === startOfDay(right).getTime();
}

export function isSameMonth(left: Date, right: Date) {
  return (
    left.getFullYear() === right.getFullYear() &&
    left.getMonth() === right.getMonth()
  );
}

export function getStartOfWeek(date: Date) {
  const normalized = startOfDay(date);
  const dayOfWeek = normalized.getDay();
  const mondayBasedOffset = dayOfWeek === 0 ? 6 : dayOfWeek - 1;
  return addDays(normalized, -mondayBasedOffset);
}

export function startOfMonth(date: Date) {
  const normalized = startOfDay(date);
  normalized.setDate(1);
  return normalized;
}

export function getWeekDays(date: Date) {
  const weekStart = getStartOfWeek(date);

  return Array.from({ length: 7 }, (_, index) => addDays(weekStart, index));
}

export function getMonthDays(date: Date) {
  const monthStart = startOfMonth(date);
  const gridStart = getStartOfWeek(monthStart);

  return Array.from({ length: 42 }, (_, index) => addDays(gridStart, index));
}

export function formatCalendarMonth(date: Date) {
  return MONTH_FORMATTER.format(date);
}

export function formatCalendarMonthYear(date: Date) {
  return MONTH_YEAR_FORMATTER.format(date);
}

export function formatWeekdayLabel(date: Date) {
  return WEEKDAY_FORMATTER.format(date);
}

export function formatLongDate(date: Date) {
  return capitalizeFirstLetter(LONG_DATE_FORMATTER.format(date));
}
