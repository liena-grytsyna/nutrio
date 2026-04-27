import type { CreateProductInput, Product } from '../types';

type ProductsResponse = {
  products: Product[];
};

type ProductResponse = {
  product: Product;
};

async function readJsonResponse<T>(response: Response): Promise<T> {
  if (!response.ok) {
    const message = await response.text();
    throw new Error(message || `Request failed with status ${response.status}`);
  }

  return response.json() as Promise<T>;
}

export async function fetchProducts(signal?: AbortSignal): Promise<Product[]> {
  const response = await fetch('/api/products', { signal });
  const data = await readJsonResponse<ProductsResponse>(response);
  return data.products;
}

export async function createProduct(input: CreateProductInput): Promise<Product> {
  const response = await fetch('/api/products', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(input),
  });
  const data = await readJsonResponse<ProductResponse>(response);
  return data.product;
}
