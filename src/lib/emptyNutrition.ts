import type {
  DayNutritionOverview,
  NutritionGoalSummary,
  NutritionOverview,
} from "../types/nutrition";

export const EMPTY_SUMMARY: NutritionGoalSummary = {
  consumed: {
    calories: 0,
    protein: 0,
    fat: 0,
    carbs: 0,
  },
  target: {
    calories: 0,
    protein: 0,
    fat: 0,
    carbs: 0,
  },
  remaining: {
    calories: 0,
    protein: 0,
    fat: 0,
    carbs: 0,
  },
  progress: {
    calories: 0,
    protein: 0,
    fat: 0,
    carbs: 0,
  },
  calorieStatus: "under",
  calorieProgressRatio: 0,
};

export const EMPTY_DAY_OVERVIEW: DayNutritionOverview = {
  entries: [],
  totals: {
    calories: 0,
    protein: 0,
    fat: 0,
    carbs: 0,
  },
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
