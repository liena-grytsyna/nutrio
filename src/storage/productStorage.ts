import type { Product } from '../features/products';

const PRODUCTS_STORAGE_KEY = 'nutrio-products';

export function getStoredProducts(): Product[] {
  const rawValue = localStorage.getItem(PRODUCTS_STORAGE_KEY);

  if (!rawValue) {
    return [];
  }

  try {
    return JSON.parse(rawValue) as Product[];
  } catch {
    return [];
  }
}

export function saveProducts(products: Product[]) {
  localStorage.setItem(PRODUCTS_STORAGE_KEY, JSON.stringify(products));
}
