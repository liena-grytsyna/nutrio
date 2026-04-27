import type { CreateProductInput, Product } from '../types';

type ProductsResponse = {
  products: Product[];
};

type ProductResponse = {
  product: Product;
};

type ErrorResponse = {
  error?: string;
};

async function readJsonResponse<T>(response: Response): Promise<T> {
  if (!response.ok) {
    const contentType = response.headers.get('content-type') ?? '';
    const message = contentType.includes('application/json')
      ? ((await response.json()) as ErrorResponse).error
      : await response.text();

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
