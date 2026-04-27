type ProductSearchProps = {
  value: string;
  resultCount: number;
  onChange: (value: string) => void;
};

export function ProductSearch({
  value,
  resultCount,
  onChange,
}: ProductSearchProps) {
  const resultLabel = resultCount === 1 ? '1 product' : `${resultCount} products`;

  return (
    <label className="product-list-screen__search">
      <span className="product-list-screen__search-label">Search products</span>
      <input
        className="product-list-screen__search-input"
        type="search"
        value={value}
        placeholder="Name, brand or barcode..."
        onChange={(event) => onChange(event.target.value)}
      />
      <span className="product-list-screen__search-count">
        {resultLabel}
      </span>
    </label>
  );
}
