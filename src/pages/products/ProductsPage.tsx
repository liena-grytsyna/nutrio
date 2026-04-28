import { useState } from 'react';
import {
  ProductCard,
  ProductSearch,
  searchProducts,
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
  const visibleProducts = searchProducts(products, query);
  const showSearch = products.length > 0;
  const showEmptyState = !isLoading && visibleProducts.length === 0;

  return (
    <section className="screen product-list-screen">
      <div className="product-list-screen__intro">
        <h2 className="product-list-screen__title">Products</h2>
        <p className="product-list-screen__hint">
          Your saved product catalog from the API.
        </p>
      </div>

      {error && <p className="product-list-screen__status">{error}</p>}

      {showSearch && (
        <ProductSearch
          value={query}
          resultCount={visibleProducts.length}
          onChange={setQuery}
        />
      )}

      {isLoading ? (
        <p className="product-list-screen__status">Loading products...</p>
      ) : visibleProducts.length > 0 ? (
        <ul className="product-list-screen__list">
          {visibleProducts.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </ul>
      ) : null}

      {showEmptyState && (
        <p className="product-list-screen__empty">
          {query ? 'No products match this search.' : 'No saved products yet.'}
        </p>
      )}
    </section>
  );
}
