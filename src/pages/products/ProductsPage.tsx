import { useMemo, useState } from 'react';
import {
  ProductCard,
  ProductSearch,
  type Product,
} from '../../features/products';
import './ProductsPage.scss';

type ProductsPageProps = {
  error?: string | null;
  isLoading?: boolean;
  products: Product[];
};

export function ProductsPage({
  error = null,
  isLoading = false,
  products,
}: ProductsPageProps) {
  const [query, setQuery] = useState('');
  const normalizedQuery = query.trim().toLowerCase();
  const visibleProducts = useMemo(() => {
    if (!normalizedQuery) {
      return products;
    }

    return products.filter((product) =>
      product.name.toLowerCase().includes(normalizedQuery),
    );
  }, [normalizedQuery, products]);

  return (
    <section className="screen product-list-screen">
      <div className="product-list-screen__intro">
        <h2 className="product-list-screen__title">Product List</h2>
        <p className="product-list-screen__hint">
          Products are loaded from PostgreSQL through the API.
        </p>
      </div>

      {error && <p className="product-list-screen__status">{error}</p>}

      <ProductSearch
        value={query}
        resultCount={visibleProducts.length}
        onChange={setQuery}
      />

      {isLoading ? (
        <p className="product-list-screen__status">Loading products...</p>
      ) : (
        <ul className="product-list-screen__list">
          {visibleProducts.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </ul>
      )}

      {!isLoading && visibleProducts.length === 0 && (
        <p className="product-list-screen__empty">No products found.</p>
      )}
    </section>
  );
}
