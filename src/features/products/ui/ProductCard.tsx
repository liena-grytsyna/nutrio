import type { Product } from '../model/types';
import { formatNumber } from '../../../shared/lib/formatNumber';

type ProductCardProps = {
  product: Product;
};

export function ProductCard({ product }: ProductCardProps) {
  const servingLabel = product.brand
    ? `${product.brand} • ${product.servingSize}`
    : product.servingSize;

  return (
    <li className="product-list-screen__item">
      <strong className="product-list-screen__item-name">{product.name}</strong>
      <p className="product-list-screen__item-meta">
        {formatNumber(product.calories, 1)} kcal | P{' '}
        {formatNumber(product.protein, 1)} | F {formatNumber(product.fat, 1)} | C{' '}
        {formatNumber(product.carbs, 1)}
      </p>
      <p className="product-list-screen__item-serving">{servingLabel}</p>
    </li>
  );
}
