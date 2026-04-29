import { readJsonResponse } from "./http";
import type { CreateProductInput, Product } from "../types/product";

type ProductsResponse = {
  products: Product[];
};

type ProductResponse = {
  product: Product;
};

export async function fetchProducts(signal?: AbortSignal): Promise<Product[]> {
  const response = await fetch("/api/products", { signal });
  return (await readJsonResponse<ProductsResponse>(response)).products;
}

export async function createProduct(
  input: CreateProductInput,
): Promise<Product> {
  const response = await fetch("/api/products", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(input),
  });
  return (await readJsonResponse<ProductResponse>(response)).product;
}
