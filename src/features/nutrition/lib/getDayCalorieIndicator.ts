import { startOfDay } from '../../../shared/lib/date';
import type { DayCalorieIndicator, DayEntry } from '../model/types';
import {
  getCalorieBalanceStatus,
  getCalorieProgressRatio,
  getClampedProgress,
} from './calorieBalance';

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
  const rawProgress = getCalorieProgressRatio(calories, targetCalories);
  const status = getCalorieBalanceStatus(rawProgress);
  const progress = status === 'under' ? getClampedProgress(rawProgress) : 1;

  return {
    calories,
    progress,
    status,
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
