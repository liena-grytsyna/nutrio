import type { NutritionValues } from '../../types/nutrition';

type NutritionGoalSummary = {
  consumed: NutritionValues;
  target: NutritionValues;
  remaining: NutritionValues;
  progress: NutritionValues;
};

function getProgress(value: number, target: number) {
  if (target <= 0) {
    return 0;
  }

  return Math.min(value / target, 1);
}

function getRemaining(value: number, target: number) {
  return Math.max(target - value, 0);
}

export function getNutritionGoalSummary(
  consumed: NutritionValues,
  target: NutritionValues,
): NutritionGoalSummary {
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
  };
}
