import type { CreateProductInput, Product } from '../model/types';

type ProductsResponse = {
  products: Product[];
};

type ProductResponse = {
  product: Product;
};

type ErrorResponse = {
  error?: string;
};

function getDefaultErrorMessage(status: number) {
  if (status >= 500) {
    return 'Server is temporarily unavailable. Please try again later.';
  }

  if (status === 404) {
    return 'Requested resource was not found.';
  }

  return `Request failed with status ${status}.`;
}

async function readJsonResponse<T>(response: Response): Promise<T> {
  if (!response.ok) {
    const message = (response.headers.get('content-type') ?? '').includes(
      'application/json',
    )
      ? ((await response.json()) as ErrorResponse).error
      : null;

    throw new Error(message || getDefaultErrorMessage(response.status));
  }

  return response.json() as Promise<T>;
}

export async function fetchProducts(signal?: AbortSignal): Promise<Product[]> {
  const response = await fetch('/api/products', { signal });
  return (await readJsonResponse<ProductsResponse>(response)).products;
}

export async function createProduct(input: CreateProductInput): Promise<Product> {
  const response = await fetch('/api/products', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(input),
  });
  return (await readJsonResponse<ProductResponse>(response)).product;
}
