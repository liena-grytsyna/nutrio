export function AddProductScreen() {
  return (
    <section className="screen">
      <div className="card">
        <h2>Добавить продукт</h2>
        <p className="hint">
          На следующем шаге здесь появится форма для ручного ввода продукта,
          поиск по базе и добавление через фото упаковки.
        </p>
      </div>

      <div className="card">
        <h3>Что будет в MVP</h3>
        <ol className="step-list">
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
