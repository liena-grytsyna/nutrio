import './AddProductScreen.scss';

export function AddProductScreen() {
  return (
    <section className="screen add-product-screen">
      <div className="add-product-screen__card">
        <h2 className="add-product-screen__title">Add Product</h2>
        <p className="add-product-screen__hint">
          The next step will add a form for manual product entry, database
          search, and adding items from a package photo.
        </p>
      </div>

      <div className="add-product-screen__card">
        <h3 className="add-product-screen__subtitle">What&apos;s Included in the MVP</h3>
        <ol className="add-product-screen__list">
          <li>Product name</li>
          <li>Calories per 100 g</li>
          <li>Protein, fat, and carbs</li>
          <li>Save button</li>
          <li>OCR photo import groundwork</li>
        </ol>
      </div>
    </section>
  );
}
