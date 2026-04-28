import type { DayEntry } from '../model/types';

const DAY_ENTRIES_STORAGE_KEY = 'nutrio-day-entries';

export function getStoredDayEntries(): DayEntry[] {
  const rawValue = localStorage.getItem(DAY_ENTRIES_STORAGE_KEY);

  if (!rawValue) {
    return [];
  }

  try {
    return JSON.parse(rawValue) as DayEntry[];
  } catch {
    return [];
  }
}

export function saveDayEntries(entries: DayEntry[]) {
  localStorage.setItem(DAY_ENTRIES_STORAGE_KEY, JSON.stringify(entries));
}
