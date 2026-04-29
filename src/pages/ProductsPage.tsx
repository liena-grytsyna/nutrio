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

type ProductSearchProps = {
  value: string;
  resultCount: number;
  onChange: (value: string) => void;
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

function ProductSearch({ value, resultCount, onChange }: ProductSearchProps) {
  const resultLabel =
    resultCount === 1 ? "1 product" : `${resultCount} products`;

  return (
    <label className={styles["product-list-screen__search"]}>
      <span className={styles["product-list-screen__search-label"]}>
        Search products
      </span>
      <input
        className={styles["product-list-screen__search-input"]}
        type="search"
        value={value}
        placeholder="Name..."
        onChange={(event) => onChange(event.target.value)}
      />
      <span className={styles["product-list-screen__search-count"]}>
        {resultLabel}
      </span>
    </label>
  );
}

export function ProductsPage({
  error = null,
  isLoading = false,
  products,
}: ProductsPageProps) {
  const [query, setQuery] = useState("");
  const visibleProducts = searchProducts(products, query);
  const showSearch = products.length > 0;
  const showEmptyState = !isLoading && visibleProducts.length === 0;

  return (
    <section className={cn("screen", styles["product-list-screen"])}>
      <div className={styles["product-list-screen__intro"]}>
        <h2 className={styles["product-list-screen__title"]}>Products</h2>
        <p className={styles["product-list-screen__hint"]}>
          Your saved product catalog from the API.
        </p>
      </div>

      {error && (
        <p className={styles["product-list-screen__status"]}>{error}</p>
      )}

      {showSearch && (
        <ProductSearch
          value={query}
          resultCount={visibleProducts.length}
          onChange={setQuery}
        />
      )}

      {isLoading ? (
        <p className={styles["product-list-screen__status"]}>
          Loading products...
        </p>
      ) : visibleProducts.length > 0 ? (
        <ul className={styles["product-list-screen__list"]}>
          {visibleProducts.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </ul>
      ) : null}

      {showEmptyState && (
        <p className={styles["product-list-screen__empty"]}>
          {query ? "No products match this search." : "No saved products yet."}
        </p>
      )}
    </section>
  );
}
