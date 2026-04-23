import type { Product } from '../../types/nutrition';

type ProductListScreenProps = {
  products: Product[];
};

export function ProductListScreen({ products }: ProductListScreenProps) {
  return (
    <section className="screen">
      <div className="card">
        <h2>Список продуктов</h2>
        <p className="hint">
          Пока тут мок-данные. Дальше подключим сохранение в `localStorage`.
        </p>
      </div>

      <ul className="product-list">
        {products.map((product) => (
          <li key={product.id} className="product-item">
            <strong>{product.name}</strong>
            <p>
              {product.calories} ккал • Б {product.protein} • Ж {product.fat} •
              У {product.carbs}
            </p>
            <p>{product.servingSize}</p>
          </li>
        ))}
      </ul>
    </section>
  );
}
