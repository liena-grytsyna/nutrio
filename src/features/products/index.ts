export { createProduct, fetchProducts } from './api/productsApi';
export {
  getProductNutritionForAmount,
  searchProducts,
  sortProductsByName,
} from './lib/productCatalog';
export { ProductCard } from './ui/ProductCard';
export { ProductSearch } from './ui/ProductSearch';
export type { CreateProductInput, Product } from './model/types';
