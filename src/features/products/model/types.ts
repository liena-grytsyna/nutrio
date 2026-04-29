import type { NutritionValues } from '../../nutrition';

export type Product = NutritionValues & {
  id: string;
  name: string;
  servingSize: string;
  createdAt?: string;
  updatedAt?: string;
};

export type CreateProductInput = NutritionValues & {
  name: string;
  servingSize: string;
};
