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
  return (
    <label className="product-list-screen__search">
      <span className="product-list-screen__search-label">Search products</span>
      <input
        className="product-list-screen__search-input"
        type="search"
        value={value}
        placeholder="Greek yogurt, banana..."
        onChange={(event) => onChange(event.target.value)}
      />
      <span className="product-list-screen__search-count">
        {resultCount} found
      </span>
    </label>
  );
}
