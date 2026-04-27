import type { DayEntry, NutritionValues } from '../model/types';

const emptyNutrition: NutritionValues = {
  calories: 0,
  protein: 0,
  fat: 0,
  carbs: 0,
};

export function calculateDayTotals(entries: DayEntry[]): NutritionValues {
  return entries.reduce((totals, entry) => {
    totals.calories += entry.calories;
    totals.protein += entry.protein;
    totals.fat += entry.fat;
    totals.carbs += entry.carbs;
    return totals;
  }, { ...emptyNutrition });
}
