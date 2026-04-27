import type { NutritionValues } from '../../nutrition';

export type Product = NutritionValues & {
  id: string;
  name: string;
  brand?: string | null;
  barcode?: string | null;
  servingSize: string;
  createdAt?: string;
  updatedAt?: string;
};

export type CreateProductInput = NutritionValues & {
  name: string;
  brand?: string | null;
  barcode?: string | null;
  servingSize: string;
};
