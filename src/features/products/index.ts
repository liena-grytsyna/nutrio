export { AddProductScreen } from './screens/AddProductScreen';
export { ProductListScreen } from './screens/ProductListScreen';
export { ProductCard } from './components/ProductCard';
export { ProductSearch } from './components/ProductSearch';
export { createProduct, fetchProducts } from './api/productsApi';
export { mockEntries, mockProducts } from './data/mockProducts';
export { extractNutritionFromText } from './ocr/extractNutrition';
export type { CreateProductInput, Product } from './types';
