import type {
  DayNutritionOverview,
  NutritionValues,
  NutritionGoalSummary,
  NutritionOverview,
} from "../types/nutrition";

const ZERO_NUTRITION: NutritionValues = {
  calories: 0,
  protein: 0,
  fat: 0,
  carbs: 0,
};

export const EMPTY_SUMMARY: NutritionGoalSummary = {
  consumed: ZERO_NUTRITION,
  target: ZERO_NUTRITION,
  remaining: ZERO_NUTRITION,
  progress: ZERO_NUTRITION,
  calorieStatus: "under",
  calorieProgressRatio: 0,
};

export const EMPTY_DAY_OVERVIEW: DayNutritionOverview = {
  entries: [],
  totals: ZERO_NUTRITION,
  summary: EMPTY_SUMMARY,
};

export const EMPTY_NUTRITION_OVERVIEW: NutritionOverview = {
  days: {},
  dailyCalorieIndicators: {},
  defaultDay: EMPTY_DAY_OVERVIEW,
  defaultIndicator: {
    calories: 0,
    progress: 0,
    status: "under",
  },
};
