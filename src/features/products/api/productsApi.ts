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
    const contentType = response.headers.get('content-type') ?? '';
    const message = contentType.includes('application/json')
      ? ((await response.json()) as ErrorResponse).error
      : null;

    throw new Error(message || getDefaultErrorMessage(response.status));
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
