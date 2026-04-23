import './AddProductScreen.scss';

export function AddProductScreen() {
  return (
    <section className="screen add-product-screen">
      <div className="add-product-screen__card">
        <h2 className="add-product-screen__title">Добавить продукт</h2>
        <p className="add-product-screen__hint">
          На следующем шаге здесь появится форма для ручного ввода продукта,
          поиск по базе и добавление через фото упаковки.
        </p>
      </div>

      <div className="add-product-screen__card">
        <h3 className="add-product-screen__subtitle">Что будет в MVP</h3>
        <ol className="add-product-screen__list">
          <li>Название продукта</li>
          <li>Калории на 100 г</li>
          <li>Белки, жиры, углеводы</li>
          <li>Кнопка сохранения</li>
          <li>Подготовка к OCR из фото</li>
        </ol>
      </div>
    </section>
  );
}
