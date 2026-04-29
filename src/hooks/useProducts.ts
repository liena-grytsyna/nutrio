import { useEffect, useState } from "react";
import { createProduct, fetchProducts } from "../api/products";
import { getErrorMessage } from "../lib/errors";
import { sortProductsByName } from "../lib/products";
import type { CreateProductInput, Product } from "../types/product";

export function useProducts() {
  const [products, setProducts] = useState<Product[]>([]);
  const [productsLoading, setProductsLoading] = useState(true);
  const [productsError, setProductsError] = useState<string | null>(null);

  useEffect(() => {
    const controller = new AbortController();

    async function loadProducts() {
      setProductsError(null);

      try {
        const nextProducts = await fetchProducts(controller.signal);
        setProducts(sortProductsByName(nextProducts));
      } catch (error) {
        if (!controller.signal.aborted) {
          setProductsError(
            getErrorMessage(error, "Products could not be loaded."),
          );
        }
      } finally {
        if (!controller.signal.aborted) {
          setProductsLoading(false);
        }
      }
    }

    loadProducts();

    return () => controller.abort();
  }, []);

  async function handleCreateProduct(input: CreateProductInput) {
    const product = await createProduct(input);

    setProducts((currentProducts) =>
      sortProductsByName([...currentProducts, product]),
    );
    setProductsError(null);

    return product;
  }

  return {
    products,
    productsLoading,
    productsError,
    handleCreateProduct,
  };
}
