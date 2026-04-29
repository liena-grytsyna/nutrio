const locale = "en-US";

function copyDate(date: Date) {
  return new Date(date);
}

export function startOfDay(date: Date) {
  const copy = copyDate(date);
  copy.setHours(0, 0, 0, 0);
  return copy;
}

export function addDays(date: Date, amount: number) {
  const copy = copyDate(date);
  copy.setDate(copy.getDate() + amount);
  return copy;
}

export function addMonths(date: Date, amount: number) {
  const copy = copyDate(date);
  copy.setMonth(copy.getMonth() + amount);
  return copy;
}

export function isSameDay(a: Date, b: Date) {
  return startOfDay(a).getTime() === startOfDay(b).getTime();
}

export function isSameMonth(a: Date, b: Date) {
  return a.getFullYear() === b.getFullYear() && a.getMonth() === b.getMonth();
}

export function getStartOfWeek(date: Date) {
  const d = startOfDay(date);
  const day = d.getDay() || 7;
  return addDays(d, 1 - day);
}

export function startOfMonth(date: Date) {
  const copy = copyDate(date);
  copy.setHours(0, 0, 0, 0);
  copy.setDate(1);
  return copy;
}

export function getDateKey(date: Date) {
  const normalized = startOfDay(date);
  const month = String(normalized.getMonth() + 1).padStart(2, "0");
  const day = String(normalized.getDate()).padStart(2, "0");

  return `${normalized.getFullYear()}-${month}-${day}`;
}

export function getWeekDays(date: Date) {
  const start = getStartOfWeek(date);
  return Array.from({ length: 7 }, (_, i) => addDays(start, i));
}

export function getMonthDays(date: Date) {
  const start = getStartOfWeek(startOfMonth(date));
  return Array.from({ length: 42 }, (_, i) => addDays(start, i));
}

export const formatCalendarMonth = (date: Date) =>
  date.toLocaleDateString(locale, { month: "long" });

export const formatCalendarMonthYear = (date: Date) =>
  date.toLocaleDateString(locale, { month: "long", year: "numeric" });

export const formatWeekdayLabel = (date: Date) =>
  date.toLocaleDateString(locale, { weekday: "short" });

export const formatLongDate = (date: Date) =>
  date.toLocaleDateString(locale, {
    weekday: "long",
    day: "numeric",
    month: "long",
  });
