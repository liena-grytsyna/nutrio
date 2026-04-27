import type { NutritionValues } from '../nutrition';

export type Product = NutritionValues & {
  id: string;
  name: string;
  servingSize: string;
};
