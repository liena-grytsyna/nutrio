import {
  useEffect,
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

  const visibleProducts = searchProducts(products, query);
  const selectedProduct =
    visibleProducts.find((product) => product.id === selectedProductId) ??
    visibleProducts[0] ??
    null;
  const parsedAmount = Number(amount);
  const isAmountValid = Number.isFinite(parsedAmount) && parsedAmount > 0;
  const previewNutrition =
    selectedProduct && isAmountValid
      ? getProductNutritionForAmount(selectedProduct, parsedAmount)
      : null;
  const dialogStatusMessage = isLoadingProducts
    ? 'Loading products...'
    : productsError ||
      (products.length === 0
        ? 'No products yet. Create one on the Add screen first.'
        : null);

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

  function getNutritionLabel(
    nutrition: Pick<Product, 'calories' | 'protein' | 'fat' | 'carbs'>,
  ) {
    return `${formatNumber(nutrition.calories, 1)} kcal • P ${formatNumber(nutrition.protein, 1)} • F ${formatNumber(nutrition.fat, 1)} • C ${formatNumber(nutrition.carbs, 1)}`;
  }

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

        {dialogStatusMessage ? (
          <p className="today-screen__dialog-status">{dialogStatusMessage}</p>
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

                return (
                  <button
                    key={product.id}
                    type="button"
                    role="option"
                    aria-selected={isSelected}
                    className={
                      isSelected
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
                    <span>{getNutritionLabel(product)}</span>
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
                  {getNutritionLabel(previewNutrition)}
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
