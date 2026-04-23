import type { CalorieBalanceStatus, NutritionValues } from '../../types/nutrition';

export type NutritionGoalSummary = {
  consumed: NutritionValues;
  target: NutritionValues;
  remaining: NutritionValues;
  progress: NutritionValues;
  calorieStatus: CalorieBalanceStatus;
  calorieProgressRatio: number;
};
