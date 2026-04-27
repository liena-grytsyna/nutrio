import type { DayEntry } from '../model/types';

const DAY_ENTRIES_STORAGE_KEY = 'nutrio-day-entries';

export function getStoredDayEntries(): DayEntry[] {
  if (typeof localStorage === 'undefined') {
    return [];
  }

  const rawValue = localStorage.getItem(DAY_ENTRIES_STORAGE_KEY);

  if (!rawValue) {
    return [];
  }

  try {
    const parsedValue = JSON.parse(rawValue);
    return Array.isArray(parsedValue) ? (parsedValue as DayEntry[]) : [];
  } catch {
    return [];
  }
}

export function saveDayEntries(entries: DayEntry[]) {
  if (typeof localStorage === 'undefined') {
    return;
  }

  localStorage.setItem(DAY_ENTRIES_STORAGE_KEY, JSON.stringify(entries));
}
