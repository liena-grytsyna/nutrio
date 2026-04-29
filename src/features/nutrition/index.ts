export { createDayEntry, fetchDayEntries } from './api/dayEntriesApi';
export { dailyTargets } from './model/dailyTargets';
export {
  getCalorieBalanceStatus,
  getCalorieProgressRatio,
  getClampedProgress,
} from './lib/calorieBalance';
export { calculateDayTotals } from './lib/calculateDayTotals';
export {
  buildDailyCalorieIndicators,
  getDateKey,
  getDayCalorieIndicator,
} from './lib/getDayCalorieIndicator';
export {
  buildMealEntryGroups,
  getMealSectionId,
  type MealSectionId,
} from './lib/getMealEntryGroups';
export { getNutritionGoalSummary } from './lib/getNutritionGoalSummary';
export type {
  CalorieBalanceStatus,
  CreateDayEntryInput,
  DayCalorieIndicator,
  DayEntry,
  NutritionGoalSummary,
  NutritionValues,
  ProductSource,
} from './model/types';
