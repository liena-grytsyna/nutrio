import { startOfDay } from '../date/calendar';
import type { DayCalorieIndicator, DayEntry } from '../../types/nutrition';

const IDEAL_MIN_PROGRESS = 0.95;
const IDEAL_MAX_PROGRESS = 1.05;

export function getDateKey(date: Date) {
  const normalized = startOfDay(date);
  const year = normalized.getFullYear();
  const month = String(normalized.getMonth() + 1).padStart(2, '0');
  const day = String(normalized.getDate()).padStart(2, '0');

  return `${year}-${month}-${day}`;
}

export function getDayCalorieIndicator(
  calories: number,
  targetCalories: number,
): DayCalorieIndicator {
  if (targetCalories <= 0) {
    return {
      calories,
      progress: 0,
      status: 'under',
    };
  }

  const rawProgress = calories / targetCalories;
  const clampedProgress = Math.min(Math.max(rawProgress, 0), 1);

  if (rawProgress > IDEAL_MAX_PROGRESS) {
    return {
      calories,
      progress: 1,
      status: 'over',
    };
  }

  if (rawProgress >= IDEAL_MIN_PROGRESS) {
    return {
      calories,
      progress: 1,
      status: 'ideal',
    };
  }

  return {
    calories,
    progress: clampedProgress,
    status: 'under',
  };
}

export function buildDailyCalorieIndicators(
  entries: DayEntry[],
  targetCalories: number,
) {
  const dailyCalories = new Map<string, number>();

  entries.forEach((entry) => {
    const key = getDateKey(new Date(entry.eatenAt));
    const currentCalories = dailyCalories.get(key) ?? 0;
    dailyCalories.set(key, currentCalories + entry.calories);
  });

  return Object.fromEntries(
    Array.from(dailyCalories.entries()).map(([key, calories]) => [
      key,
      getDayCalorieIndicator(calories, targetCalories),
    ]),
  );
}
