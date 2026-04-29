export type NutritionValues = {
  calories: number;
  protein: number;
  fat: number;
  carbs: number;
};

export type CalorieBalanceStatus = "under" | "ideal" | "over";

export type DayCalorieIndicator = {
  calories: number;
  progress: number;
  status: CalorieBalanceStatus;
};

export type MealSectionId =
  | "breakfast"
  | "snack"
  | "lunch"
  | "secondSnack"
  | "dinner"
  | "thirdSnack";

export type DayEntry = NutritionValues & {
  id: string;
  name: string;
  amount: number;
  eatenAt: string;
};

export type CreateDayEntryInput = {
  productId: string;
  amount: number;
  eatenAt: string;
};

export type PreviewDayEntryNutritionInput = {
  productId: string;
  amount: number;
};

export type NutritionGoalSummary = {
  consumed: NutritionValues;
  target: NutritionValues;
  remaining: NutritionValues;
  progress: NutritionValues;
  calorieStatus: CalorieBalanceStatus;
  calorieProgressRatio: number;
};

export type DayNutritionOverview = {
  entries: DayEntry[];
  totals: NutritionValues;
  summary: NutritionGoalSummary;
};

export type NutritionOverview = {
  days: Record<string, DayNutritionOverview>;
  dailyCalorieIndicators: Record<string, DayCalorieIndicator>;
  defaultDay: DayNutritionOverview;
  defaultIndicator: DayCalorieIndicator;
};
