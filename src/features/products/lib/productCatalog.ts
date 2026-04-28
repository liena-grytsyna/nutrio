import type { NutritionValues } from '../../nutrition';
import type { Product } from '../model/types';

function roundNutritionValue(value: number) {
  return Math.round(value * 10) / 10;
}

export function sortProductsByName(products: Product[]) {
  return [...products].sort((first, second) =>
    first.name.localeCompare(second.name),
  );
}

export function searchProducts(products: Product[], query: string) {
  const normalizedQuery = query.trim().toLowerCase();

  if (!normalizedQuery) {
    return products;
  }

  return products.filter((product) => {
    const name = product.name.toLowerCase();
    const brand = (product.brand ?? '').toLowerCase();
    const barcode = (product.barcode ?? '').toLowerCase();

    return (
      name.includes(normalizedQuery) ||
      brand.includes(normalizedQuery) ||
      barcode.includes(normalizedQuery)
    );
  });
}

export function getProductNutritionForAmount(
  product: Pick<Product, keyof NutritionValues>,
  amount: number,
): NutritionValues {
  const amountRatio = amount / 100;

  return {
    calories: roundNutritionValue(product.calories * amountRatio),
    protein: roundNutritionValue(product.protein * amountRatio),
    fat: roundNutritionValue(product.fat * amountRatio),
    carbs: roundNutritionValue(product.carbs * amountRatio),
  };
}
