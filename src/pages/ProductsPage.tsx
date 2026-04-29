import { useState } from "react";
import { cn } from "../lib/cn";
import { formatNumber } from "../lib/formatNumber";
import { searchProducts } from "../lib/products";
import type { Product } from "../types/product";
import styles from "./ProductsPage.module.scss";

type ProductsPageProps = {
  error?: string | null;
  isLoading?: boolean;
  products: Product[];
};

function ProductCard({ product }: { product: Product }) {
  return (
    <li className={styles["product-list-screen__item"]}>
      <strong className={styles["product-list-screen__item-name"]}>
        {product.name}
      </strong>

      <p className={styles["product-list-screen__item-meta"]}>
        {formatNumber(product.calories, 1)} kcal | P{" "}
        {formatNumber(product.protein, 1)} | F {formatNumber(product.fat, 1)} |
        C {formatNumber(product.carbs, 1)}
      </p>

      <p className={styles["product-list-screen__item-serving"]}>
        {product.servingSize}
      </p>
    </li>
  );
}

export function ProductsPage({
  error = null,
  isLoading = false,
  products,
}: ProductsPageProps) {
  const [query, setQuery] = useState("");
  const visibleProducts = searchProducts(products, query);

  return (
    <section className={cn("screen", styles["product-list-screen"])}>
      <h2 className={styles["product-list-screen__title"]}>Products</h2>

      {error && (
        <p className={styles["product-list-screen__status"]}>{error}</p>
      )}

      {products.length > 0 && (
        <label className={styles["product-list-screen__search"]}>
          <span className={styles["product-list-screen__search-label"]}>
            Search products
          </span>

          <input
            className={styles["product-list-screen__search-input"]}
            type="search"
            value={query}
            placeholder="Name..."
            onChange={(event) => setQuery(event.target.value)}
          />

          <span className={styles["product-list-screen__search-count"]}>
            {visibleProducts.length === 1
              ? "1 product"
              : `${visibleProducts.length} products`}
          </span>
        </label>
      )}

      {isLoading && (
        <p className={styles["product-list-screen__status"]}>
          Loading products...
        </p>
      )}

      {!isLoading && visibleProducts.length > 0 && (
        <ul className={styles["product-list-screen__list"]}>
          {visibleProducts.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </ul>
      )}

      {!isLoading && visibleProducts.length === 0 && (
        <p className={styles["product-list-screen__empty"]}>
          {query ? "No products match this search." : "No saved products yet."}
        </p>
      )}
    </section>
  );
}