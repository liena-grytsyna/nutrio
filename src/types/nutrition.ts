// nutrition types 
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

// product and day entry types
export type Product = NutritionValues & {
  id: string;
  name: string;
  servingSize: string;
};

// source of the product entry
export type ProductSource = 'manual' | 'search' | 'ocr';

// day entry type
export type DayEntry = NutritionValues & {
  id: string;
  name: string;
  amount: number;
  source: ProductSource;
  eatenAt: string;
};
