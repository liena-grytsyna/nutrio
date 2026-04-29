import {
  useEffect,
  useState,
  type FormEvent,
} from 'react';
import { createPortal } from 'react-dom';
import {
  searchProducts,
  type Product,
} from '../../../features/products';
import {
  previewDayEntryNutrition,
  type NutritionValues,
} from '../../../features/nutrition';
import { formatNumber } from '../../../shared/lib/formatNumber';
import { Button } from '../../../shared/ui/Button';
import type { MealSectionConfig } from '../constants';

type TodayAddEntryDialogProps = {
  isLoadingProducts: boolean;
  productsError?: string | null;
  products: Product[];
  section: MealSectionConfig;
  onClose: () => void;
  onSubmit: (productId: string, amount: number) => Promise<void> | void;
};

export function TodayAddEntryDialog({
  isLoadingProducts,
  productsError = null,
  products,
  section,
  onClose,
  onSubmit,
}: TodayAddEntryDialogProps) {
  const [amount, setAmount] = useState('100');
  const [query, setQuery] = useState('');
  const [selectedProductId, setSelectedProductId] = useState<string | null>(
    products[0]?.id ?? null,
  );
  const [statusMessage, setStatusMessage] = useState<string | null>(null);
  const [isSaving, setIsSaving] = useState(false);
  const [previewNutrition, setPreviewNutrition] = useState<NutritionValues | null>(
    null,
  );

  const visibleProducts = searchProducts(products, query);
  const selectedProduct =
    visibleProducts.find((product) => product.id === selectedProductId) ??
    visibleProducts[0] ??
    null;
  const parsedAmount = Number(amount);
  const isAmountValid = Number.isFinite(parsedAmount) && parsedAmount > 0;

  useEffect(() => {
    const previousOverflow = document.body.style.overflow;

    document.body.style.overflow = 'hidden';

    function handleKeyDown(event: KeyboardEvent) {
      if (event.key === 'Escape') {
        onClose();
      }
    }

    document.addEventListener('keydown', handleKeyDown);

    return () => {
      document.body.style.overflow = previousOverflow;
      document.removeEventListener('keydown', handleKeyDown);
    };
  }, [onClose]);

  useEffect(() => {
    if (!selectedProduct || !isAmountValid) {
      setPreviewNutrition(null);
      return;
    }

    const controller = new AbortController();

    async function loadPreview() {
      try {
        setStatusMessage(null);
        const nutrition = await previewDayEntryNutrition(
          {
            productId: selectedProduct.id,
            amount: parsedAmount,
          },
          controller.signal,
        );
        setPreviewNutrition(nutrition);
      } catch (error) {
        if (!controller.signal.aborted) {
          setPreviewNutrition(null);
          setStatusMessage(
            error instanceof Error
              ? error.message
              : 'Preview could not be calculated.',
          );
        }
      }
    }

    loadPreview();

    return () => controller.abort();
  }, [isAmountValid, parsedAmount, selectedProduct]);

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    if (!selectedProduct) {
      setStatusMessage('Choose a product first.');
      return;
    }

    if (!isAmountValid) {
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
        className="today-screen__dialog"
        role="dialog"
        aria-modal="true"
        aria-labelledby="today-add-entry-title"
        aria-describedby="today-add-entry-hint"
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
              {visibleProducts.map((product) => {
                const isSelected = product.id === selectedProduct?.id;
                const productClassName = isSelected
                  ? 'today-screen__dialog-product today-screen__dialog-product--active'
                  : 'today-screen__dialog-product';

                return (
                  <button
                    key={product.id}
                    type="button"
                    role="option"
                    aria-selected={isSelected}
                    className={productClassName}
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
                );
              })}
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
                disabled={!selectedProduct}
                onChange={(event) => {
                  setStatusMessage(null);
                  setAmount(event.target.value);
                }}
              />
            </label>

            {previewNutrition && (
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
              <Button
                disabled={isSaving || !selectedProduct || !isAmountValid}
                type="submit"
              >
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
