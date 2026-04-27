import { useMemo, useState } from 'react';
import { ProductCard } from '../components/ProductCard';
import { ProductSearch } from '../components/ProductSearch';
import type { Product } from '../types';
import './ProductListScreen.scss';

type ProductListScreenProps = {
  products: Product[];
};

export function ProductListScreen({ products }: ProductListScreenProps) {
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
          This screen uses mock data for now. LocalStorage persistence comes
          next.
        </p>
      </div>

      <ProductSearch
        value={query}
        resultCount={visibleProducts.length}
        onChange={setQuery}
      />

      <ul className="product-list-screen__list">
        {visibleProducts.map((product) => (
          <ProductCard key={product.id} product={product} />
        ))}
      </ul>

      {visibleProducts.length === 0 && (
        <p className="product-list-screen__empty">No products found.</p>
      )}
    </section>
  );
}
