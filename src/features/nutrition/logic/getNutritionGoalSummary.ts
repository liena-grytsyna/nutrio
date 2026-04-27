import type { NutritionGoalSummary, NutritionValues } from '../types';
import {
  getCalorieBalanceStatus,
  getCalorieProgressRatio,
  getClampedProgress,
} from './calorieBalance';

function getProgress(value: number, target: number) {
  return getClampedProgress(getCalorieProgressRatio(value, target));
}

function getRemaining(value: number, target: number) {
  return Math.max(target - value, 0);
}

export function getNutritionGoalSummary(
  consumed: NutritionValues,
  target: NutritionValues,
): NutritionGoalSummary {
  const calorieProgressRatio = getCalorieProgressRatio(
    consumed.calories,
    target.calories,
  );

  return {
    consumed,
    target,
    remaining: {
      calories: getRemaining(consumed.calories, target.calories),
      protein: getRemaining(consumed.protein, target.protein),
      fat: getRemaining(consumed.fat, target.fat),
      carbs: getRemaining(consumed.carbs, target.carbs),
    },
    progress: {
      calories: getProgress(consumed.calories, target.calories),
      protein: getProgress(consumed.protein, target.protein),
      fat: getProgress(consumed.fat, target.fat),
      carbs: getProgress(consumed.carbs, target.carbs),
    },
    calorieStatus: getCalorieBalanceStatus(calorieProgressRatio),
    calorieProgressRatio,
  };
}
