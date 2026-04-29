import type { Product } from "../types/product";

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

  return products.filter((product) =>
    product.name.toLowerCase().includes(normalizedQuery),
  );
}
