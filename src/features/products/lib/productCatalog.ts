import type { Product } from '../model/types';

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
