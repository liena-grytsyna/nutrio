import { useEffect, useState, type FormEvent } from "react";
import { createPortal } from "react-dom";
import { formatNumber } from "../lib/formatNumber";
import type { MealSectionConfig } from "../lib/mealSections";
import type { Product } from "../types/product";
import { Button } from "./Button";
import { cn } from "../lib/cn";
import styles from "./TodayAddEntryDialog.module.scss";

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
  const [amount, setAmount] = useState("100");
  const [selectedProductId, setSelectedProductId] = useState<string | null>(
    products[0]?.id ?? null,
  );
  const [statusMessage, setStatusMessage] = useState<string | null>(null);
  const [isSaving, setIsSaving] = useState(false);
  const selectedProduct =
    products.find((product) => product.id === selectedProductId) ??
    products[0] ??
    null;
  const parsedAmount = Number(amount);
  const isAmountValid = Number.isFinite(parsedAmount) && parsedAmount > 0;

  useEffect(() => {
    const previousOverflow = document.body.style.overflow;

    document.body.style.overflow = "hidden";

    function handleKeyDown(event: KeyboardEvent) {
      if (event.key === "Escape") {
        onClose();
      }
    }

    document.addEventListener("keydown", handleKeyDown);

    return () => {
      document.body.style.overflow = previousOverflow;
      document.removeEventListener("keydown", handleKeyDown);
    };
  }, [onClose]);

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    if (!selectedProduct) {
      setStatusMessage("Choose a product first.");
      return;
    }

    if (!isAmountValid) {
      setStatusMessage("Enter a valid amount in grams.");
      return;
    }

    setIsSaving(true);
    setStatusMessage(null);

    try {
      await onSubmit(selectedProduct.id, parsedAmount);
      onClose();
    } catch (error) {
      setStatusMessage(
        error instanceof Error ? error.message : "Product could not be added.",
      );
    } finally {
      setIsSaving(false);
    }
  }

  const dialog = (
    <div className={styles.backdrop} onClick={onClose}>
      <form
        className={styles.dialog}
        role="dialog"
        aria-modal="true"
        aria-labelledby="today-add-entry-title"
        onClick={(event) => event.stopPropagation()}
        onSubmit={handleSubmit}
      >
        <div className={styles.header}>
          <h3 id="today-add-entry-title" className={styles.title}>
            Add to {section.title}
          </h3>
        </div>

        {isLoadingProducts ? (
          <p className={styles.status}>Loading products...</p>
        ) : productsError ? (
          <p className={styles.status}>{productsError}</p>
        ) : products.length === 0 ? (
          <p className={styles.status}>
            No products yet. Create one on the Add screen first.
          </p>
        ) : (
          <>
            <div className={styles.products} role="listbox">
              {products.map((product) => {
                const isSelected = product.id === selectedProduct?.id;
                const productClassName = cn(
                  styles.product,
                  isSelected && styles["product--active"],
                );

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
                      {formatNumber(product.calories, 1)} kcal • P{" "}
                      {formatNumber(product.protein, 1)} • F{" "}
                      {formatNumber(product.fat, 1)} • C{" "}
                      {formatNumber(product.carbs, 1)}
                    </span>
                  </button>
                );
              })}
            </div>

            <label className={styles.field}>
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
<p className={styles.privacy}>
  Food entries are stored in the database and linked to this browser.
</p>
            <div className={styles.actions}>
              <Button type="button" variant="ghost" onClick={onClose}>
                Cancel
              </Button>
              <Button
                disabled={isSaving || !selectedProduct || !isAmountValid}
                type="submit"
              >
                {isSaving ? "Adding..." : "Add to Meal"}
              </Button>
            </div>
          </>
        )}

        {statusMessage && (
          <p className={styles.status} role="status">
            {statusMessage}
          </p>
        )}
      </form>
    </div>
  );

  return createPortal(dialog, document.body);
}
