import {
  useEffect,
  useMemo,
  useRef,
  useState,
  type FormEvent,
} from 'react';
import { createPortal } from 'react-dom';
import {
  getProductNutritionForAmount,
  searchProducts,
  type Product,
} from '../../../features/products';
import { formatNumber } from '../../../shared/lib/formatNumber';
import { Button } from '../../../shared/ui/Button';
import type { MealSectionConfig } from '../constants';

type TodayAddEntryDialogProps = {
  isLoadingProducts: boolean;
  isOpen: boolean;
  productsError?: string | null;
  products: Product[];
  section: MealSectionConfig | null;
  onClose: () => void;
  onSubmit: (productId: string, amount: number) => Promise<void> | void;
};

export function TodayAddEntryDialog({
  isLoadingProducts,
  isOpen,
  productsError = null,
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
  const dialogRef = useRef<HTMLFormElement>(null);

  const visibleProducts = useMemo(
    () => searchProducts(products, query),
    [products, query],
  );
  const selectedProduct = useMemo(
    () => visibleProducts.find((product) => product.id === selectedProductId) ?? null,
    [selectedProductId, visibleProducts],
  );
  const parsedAmount = Number(amount);
  const previewNutrition =
    selectedProduct && Number.isFinite(parsedAmount) && parsedAmount > 0
      ? getProductNutritionForAmount(selectedProduct, parsedAmount)
      : null;
  const canSubmit = Boolean(selectedProduct) && Number.isFinite(parsedAmount) && parsedAmount > 0;

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

  useEffect(() => {
    if (!isOpen) {
      return;
    }

    const activeElement = document.activeElement;

    if (activeElement instanceof HTMLElement) {
      activeElement.blur();
    }

    const focusDialog = window.setTimeout(() => {
      dialogRef.current?.focus({ preventScroll: true });
    }, 0);

    const previousOverflow = document.body.style.overflow;

    document.body.style.overflow = 'hidden';

    function handleKeyDown(event: KeyboardEvent) {
      if (event.key === 'Escape') {
        onClose();
      }
    }

    document.addEventListener('keydown', handleKeyDown);

    return () => {
      window.clearTimeout(focusDialog);
      document.body.style.overflow = previousOverflow;
      document.removeEventListener('keydown', handleKeyDown);
    };
  }, [isOpen, onClose]);

  if (!isOpen || !section) {
    return null;
  }

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    const parsedAmount = Number(amount);

    if (!selectedProduct) {
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
      await onSubmit(selectedProduct.id, parsedAmount);
      onClose();
    } catch (error) {
      setStatusMessage(
        error instanceof Error ? error.message : 'Product could not be added.',
      );
    } finally {
      setIsSaving(false);
    }
  }

  const dialog = (
    <div className="today-screen__dialog-backdrop" onClick={onClose}>
      <form
        ref={dialogRef}
        className="today-screen__dialog"
        role="dialog"
        aria-modal="true"
        aria-labelledby="today-add-entry-title"
        aria-describedby="today-add-entry-hint"
        tabIndex={-1}
        onClick={(event) => event.stopPropagation()}
        onSubmit={handleSubmit}
      >
        <div className="today-screen__dialog-header">
          <div>
            <h3 id="today-add-entry-title" className="today-screen__dialog-title">
              Add to {section.title}
            </h3>
            <p id="today-add-entry-hint" className="today-screen__dialog-hint">
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
        ) : productsError ? (
          <p className="today-screen__dialog-status">{productsError}</p>
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
                placeholder="Name, brand or barcode..."
                onChange={(event) => {
                  setStatusMessage(null);
                  setQuery(event.target.value);
                }}
              />
            </label>

            <div className="today-screen__dialog-products" role="listbox">
              {visibleProducts.map((product) => (
                <button
                  key={product.id}
                  type="button"
                  role="option"
                  aria-selected={product.id === selectedProductId}
                  className={
                    product.id === selectedProductId
                      ? 'today-screen__dialog-product today-screen__dialog-product--active'
                      : 'today-screen__dialog-product'
                  }
                  onClick={() => {
                    setStatusMessage(null);
                    setSelectedProductId(product.id);
                  }}
                >
                  <strong>{product.name}</strong>
                  <span>{product.servingSize}</span>
                  <span>
                    {formatNumber(product.calories, 1)} kcal • P{' '}
                    {formatNumber(product.protein, 1)} • F{' '}
                    {formatNumber(product.fat, 1)} • C{' '}
                    {formatNumber(product.carbs, 1)}
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
                disabled={!selectedProductId}
                onChange={(event) => {
                  setStatusMessage(null);
                  setAmount(event.target.value);
                }}
              />
            </label>

            {previewNutrition && selectedProduct && (
              <div className="today-screen__dialog-preview">
                <strong className="today-screen__dialog-preview-title">
                  {selectedProduct.name} • {formatNumber(parsedAmount, 1)} g
                </strong>
                <p className="today-screen__dialog-preview-meta">
                  {formatNumber(previewNutrition.calories, 1)} kcal • P{' '}
                  {formatNumber(previewNutrition.protein, 1)} • F{' '}
                  {formatNumber(previewNutrition.fat, 1)} • C{' '}
                  {formatNumber(previewNutrition.carbs, 1)}
                </p>
              </div>
            )}

            <div className="today-screen__dialog-actions">
              <Button type="button" variant="ghost" onClick={onClose}>
                Cancel
              </Button>
              <Button disabled={isSaving || !canSubmit} type="submit">
                {isSaving ? 'Adding...' : 'Add to Meal'}
              </Button>
            </div>
          </>
        )}

        {statusMessage && (
          <p className="today-screen__dialog-status" role="status">
            {statusMessage}
          </p>
        )}
      </form>
    </div>
  );

  return createPortal(dialog, document.body);
}
