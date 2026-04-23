export type NutritionValues = {
  calories: number;
  protein: number;
  fat: number;
  carbs: number;
};

export type CalorieBalanceStatus = 'under' | 'ideal' | 'over';

export type DayCalorieIndicator = {
  calories: number;
  progress: number;
  status: CalorieBalanceStatus;
};

export type Product = NutritionValues & {
  id: string;
  name: string;
  servingSize: string;
};

export type ProductSource = 'manual' | 'search' | 'ocr';

export type DayEntry = NutritionValues & {
  id: string;
  name: string;
  amount: number;
  source: ProductSource;
  eatenAt: string;
};
