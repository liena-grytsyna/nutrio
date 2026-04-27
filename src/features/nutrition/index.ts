export { dailyTargets } from './data/dailyTargets';
export {
  getCalorieBalanceStatus,
  getCalorieProgressRatio,
  getClampedProgress,
} from './logic/calorieBalance';
export { calculateDayTotals } from './logic/calculateDayTotals';
export {
  buildDailyCalorieIndicators,
  getDateKey,
  getDayCalorieIndicator,
} from './logic/getDayCalorieIndicator';
export {
  buildMealEntryGroups,
  getMealSectionId,
  type MealSectionId,
} from './logic/getMealEntryGroups';
export { getNutritionGoalSummary } from './logic/getNutritionGoalSummary';
export type {
  CalorieBalanceStatus,
  DayCalorieIndicator,
  DayEntry,
  NutritionGoalSummary,
  NutritionValues,
  ProductSource,
} from './types';
