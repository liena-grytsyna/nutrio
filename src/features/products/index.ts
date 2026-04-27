export { createProduct, fetchProducts } from './api/productsApi';
export { getStoredProducts, saveProducts } from './lib/productStorage';
export { ProductCard } from './ui/ProductCard';
export { ProductSearch } from './ui/ProductSearch';
export { extractNutritionFromText } from './ocr/extractNutrition';
export type { CreateProductInput, Product } from './model/types';
