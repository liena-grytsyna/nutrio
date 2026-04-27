import { useEffect, useMemo, useState, type FormEvent } from 'react';
import type { Product } from '../../../features/products';
import { Button } from '../../../shared/ui/Button';
import type { MealSectionConfig } from '../constants';

type TodayAddEntryDialogProps = {
  isLoadingProducts: boolean;
  isOpen: boolean;
  products: Product[];
  section: MealSectionConfig | null;
  onClose: () => void;
  onSubmit: (productId: string, amount: number) => Promise<void> | void;
};

export function TodayAddEntryDialog({
  isLoadingProducts,
  isOpen,
  products,
  section,
  onClose,
  onSubmit,
}: TodayAddEntryDialogProps) {
  const [amount, setAmount] = useState('100');
  const [query, setQuery] = useState('');
  const [selectedProductId, setSelectedProductId] = useState<string | null>(null);
  const [statusMessage, setStatusMessage] = useState<string | null>(null);
  const [isSaving, setIsSaving] = useState(false);

  const visibleProducts = useMemo(() => {
    const normalizedQuery = query.trim().toLowerCase();

    if (!normalizedQuery) {
      return products;
    }

    return products.filter((product) =>
      product.name.toLowerCase().includes(normalizedQuery),
    );
  }, [products, query]);

  useEffect(() => {
    if (!isOpen) {
      return;
    }

    setAmount('100');
    setQuery('');
    setStatusMessage(null);
    setSelectedProductId(products[0]?.id ?? null);
  }, [isOpen, products]);

  useEffect(() => {
    if (!visibleProducts.some((product) => product.id === selectedProductId)) {
      setSelectedProductId(visibleProducts[0]?.id ?? null);
    }
  }, [selectedProductId, visibleProducts]);

  if (!isOpen || !section) {
    return null;
  }

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    const parsedAmount = Number(amount);

    if (!selectedProductId) {
      setStatusMessage('Choose a product first.');
      return;
    }

    if (!Number.isFinite(parsedAmount) || parsedAmount <= 0) {
      setStatusMessage('Enter a valid amount in grams.');
      return;
    }

    setIsSaving(true);
    setStatusMessage(null);

    try {
      await onSubmit(selectedProductId, parsedAmount);
      onClose();
    } catch (error) {
      setStatusMessage(
        error instanceof Error ? error.message : 'Product could not be added.',
      );
    } finally {
      setIsSaving(false);
    }
  }

  return (
    <div className="today-screen__dialog-backdrop" onClick={onClose}>
      <form
        className="today-screen__dialog"
        role="dialog"
        aria-modal="true"
        aria-labelledby="today-add-entry-title"
        onClick={(event) => event.stopPropagation()}
        onSubmit={handleSubmit}
      >
        <div className="today-screen__dialog-header">
          <div>
            <h3 id="today-add-entry-title" className="today-screen__dialog-title">
              Add to {section.title}
            </h3>
            <p className="today-screen__dialog-hint">
              Choose a saved product and set the amount in grams.
            </p>
          </div>

          <Button
            className="today-screen__dialog-close"
            type="button"
            variant="ghost"
            onClick={onClose}
          >
            Close
          </Button>
        </div>

        {isLoadingProducts ? (
          <p className="today-screen__dialog-status">Loading products...</p>
        ) : products.length === 0 ? (
          <p className="today-screen__dialog-status">
            No products yet. Create one on the Add screen first.
          </p>
        ) : (
          <>
            <label className="today-screen__dialog-field">
              <span>Search product</span>
              <input
                type="search"
                value={query}
                placeholder="Banana, yogurt..."
                onChange={(event) => setQuery(event.target.value)}
              />
            </label>

            <div className="today-screen__dialog-products" role="list">
              {visibleProducts.map((product) => (
                <button
                  key={product.id}
                  type="button"
                  className={
                    product.id === selectedProductId
                      ? 'today-screen__dialog-product today-screen__dialog-product--active'
                      : 'today-screen__dialog-product'
                  }
                  onClick={() => setSelectedProductId(product.id)}
                >
                  <strong>{product.name}</strong>
                  <span>{product.servingSize}</span>
                  <span>
                    {product.calories} kcal • P {product.protein} • F {product.fat}{' '}
                    • C {product.carbs}
                  </span>
                </button>
              ))}
            </div>

            {visibleProducts.length === 0 && (
              <p className="today-screen__dialog-status">No products found.</p>
            )}

            <label className="today-screen__dialog-field">
              <span>Amount</span>
              <input
                type="number"
                min="1"
                inputMode="decimal"
                value={amount}
                onChange={(event) => setAmount(event.target.value)}
              />
            </label>

            <div className="today-screen__dialog-actions">
              <Button type="button" variant="ghost" onClick={onClose}>
                Cancel
              </Button>
              <Button disabled={isSaving || !selectedProductId} type="submit">
                {isSaving ? 'Adding...' : 'Add Product'}
              </Button>
            </div>
          </>
        )}

        {statusMessage && (
          <p className="today-screen__dialog-status">{statusMessage}</p>
        )}
      </form>
    </div>
  );
}
