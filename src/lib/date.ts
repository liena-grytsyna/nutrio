const locale = "en-US";

export function startOfDay(date: Date) {
  const d = new Date(date);
  d.setHours(0, 0, 0, 0);
  return d;
}

export function addDays(date: Date, amount: number) {
  const d = new Date(date);
  d.setDate(d.getDate() + amount);
  return d;
}

export function addMonths(date: Date, amount: number) {
  const d = new Date(date);
  d.setMonth(d.getMonth() + amount);
  return d;
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
  const d = startOfDay(date);
  d.setDate(1);
  return d;
}

export function getDateKey(date: Date) {
  const normalized = startOfDay(date);
  const year = normalized.getFullYear();
  const month = String(normalized.getMonth() + 1).padStart(2, "0");
  const day = String(normalized.getDate()).padStart(2, "0");

  return `${year}-${month}-${day}`;
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
