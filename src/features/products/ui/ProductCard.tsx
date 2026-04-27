import type { Product } from '../model/types';

type ProductCardProps = {
  product: Product;
};

export function ProductCard({ product }: ProductCardProps) {
  return (
    <li className="product-list-screen__item">
      <strong className="product-list-screen__item-name">{product.name}</strong>
      <p className="product-list-screen__item-meta">
        {product.calories} kcal | P {product.protein} | F {product.fat} | C{' '}
        {product.carbs}
      </p>
      <p className="product-list-screen__item-serving">{product.servingSize}</p>
    </li>
  );
}
