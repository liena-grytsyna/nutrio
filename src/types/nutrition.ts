// Basic nutrition values (per product or total)
export type NutritionValues = {
  calories: number;
  protein: number;
  fat: number;
  carbs: number;
};

// Status of calorie balance for the day
export type CalorieBalanceStatus = "under" | "ideal" | "over";

// Small indicator used in calendar (daily overview)
export type DayCalorieIndicator = {
  calories: number; // total calories for the day
  progress: number; // progress toward daily goal (0–1)
  status: CalorieBalanceStatus; // under / ideal / over
};

// Meal sections during the day
export type MealSectionId =
  | "breakfast"
  | "snack"
  | "lunch"
  | "secondSnack"
  | "dinner"
  | "thirdSnack";

// Single food entry (what user ate)
export type DayEntry = NutritionValues & {
  id: string;
  name: string;
  amount: number; // amount in grams
  eatenAt: string; // ISO date string
};

// Input for creating a new entry
export type CreateDayEntryInput = {
  productId: string;
  amount: number;
  eatenAt: string;
};

// Input for previewing nutrition before saving
export type PreviewDayEntryNutritionInput = {
  productId: string;
  amount: number;
};

// Summary for the whole day
export type NutritionGoalSummary = {
  consumed: NutritionValues; // what user already ate
  target: NutritionValues; // daily goal
  remaining: NutritionValues; // what is left
  progress: NutritionValues; // progress for each macro
  calorieStatus: CalorieBalanceStatus;
  calorieProgressRatio: number; // 0–1
};

// Full data for a single day
export type DayNutritionOverview = {
  entries: DayEntry[]; // all meals
  totals: NutritionValues; // total nutrition
  summary: NutritionGoalSummary;
};

// Data for multiple days (used in calendar)
export type NutritionOverview = {
  days: Record<string, DayNutritionOverview>; // key = date
  dailyCalorieIndicators: Record<string, DayCalorieIndicator>;
  defaultDay: DayNutritionOverview; // fallback if no data
  defaultIndicator: DayCalorieIndicator; // fallback indicator
};
