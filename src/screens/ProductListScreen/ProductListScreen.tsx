import type { Product } from '../../types/nutrition';
import './ProductListScreen.scss';

type ProductListScreenProps = {
  products: Product[];
};

export function ProductListScreen({ products }: ProductListScreenProps) {
  return (
    <section className="screen product-list-screen">
      <div className="product-list-screen__intro">
        <h2 className="product-list-screen__title">Список продуктов</h2>
        <p className="product-list-screen__hint">
          Пока тут мок-данные. Дальше подключим сохранение в `localStorage`.
        </p>
      </div>

      <ul className="product-list-screen__list">
        {products.map((product) => (
          <li key={product.id} className="product-list-screen__item">
            <strong className="product-list-screen__item-name">
              {product.name}
            </strong>
            <p className="product-list-screen__item-meta">
              {product.calories} ккал • Б {product.protein} • Ж {product.fat} • У{' '}
              {product.carbs}
            </p>
            <p className="product-list-screen__item-serving">
              {product.servingSize}
            </p>
          </li>
        ))}
      </ul>
    </section>
  );
}
