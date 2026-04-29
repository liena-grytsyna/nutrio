import { useState, type ChangeEvent, type FormEvent } from 'react';
import { Button } from '../components/Button';
import { cn } from '../lib/cn';
import type { CreateProductInput, Product } from '../types/product';
import styles from './AddProductPage.module.scss';

type AddProductPageProps = {
  onCreateProduct: (input: CreateProductInput) => Promise<Product>;
};

type ProductFormValues = {
  name: string;
  servingSize: string;
  calories: string;
  protein: string;
  fat: string;
  carbs: string;
};

const initialFormValues: ProductFormValues = {
  name: '',
  servingSize: '100 g',
  calories: '',
  protein: '',
  fat: '',
  carbs: '',
};

function toNumber(value: string) {
  const number = Number(value);
  return Number.isFinite(number) && number >= 0 ? number : null;
}

export function AddProductPage({ onCreateProduct }: AddProductPageProps) {
  const [formValues, setFormValues] = useState<ProductFormValues>(initialFormValues);
  const [statusMessage, setStatusMessage] = useState<string | null>(null);
  const [isSaving, setIsSaving] = useState(false);

  function handleFieldChange(event: ChangeEvent<HTMLInputElement>) {
    const { name, value } = event.target;

    setStatusMessage(null);
    setFormValues((currentValues) => ({
      ...currentValues,
      [name]: value,
    }));
  }

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    const calories = toNumber(formValues.calories);
    const protein = toNumber(formValues.protein);
    const fat = toNumber(formValues.fat);
    const carbs = toNumber(formValues.carbs);
    const name = formValues.name.trim();
    const servingSize = formValues.servingSize.trim() || '100 g';

    if (!name || calories === null || protein === null || fat === null || carbs === null) {
      setStatusMessage('Fill in product name and nutrition values.');
      return;
    }

    setIsSaving(true);
    setStatusMessage(null);

    try {
      await onCreateProduct({
        name,
        servingSize,
        calories,
        protein,
        fat,
        carbs,
      });

      setFormValues(initialFormValues);
      setStatusMessage('Product saved.');
    } catch (error) {
      setStatusMessage(
        error instanceof Error ? error.message : 'Product could not be saved.',
      );
    } finally {
      setIsSaving(false);
    }
  }

  return (
    <section className={cn('screen', styles['add-product-screen'])}>
      <div className={styles['add-product-screen__card']}>
        <h2 className={styles['add-product-screen__title']}>Add Product</h2>
        <p className={styles['add-product-screen__hint']}>
          Save product nutrition values to the PostgreSQL database.
        </p>
      </div>

      <form className={styles['add-product-screen__form']} onSubmit={handleSubmit}>
        <label className={styles['add-product-screen__field']}>
          <span>Name</span>
          <input
            name="name"
            value={formValues.name}
            onChange={handleFieldChange}
            placeholder="Banana"
            required
          />
        </label>

        <label className={styles['add-product-screen__field']}>
          <span>Serving</span>
          <input
            name="servingSize"
            value={formValues.servingSize}
            onChange={handleFieldChange}
            placeholder="100 g"
          />
        </label>

        <div className={styles['add-product-screen__macro-grid']}>
          <label className={styles['add-product-screen__field']}>
            <span>Kcal</span>
            <input
              name="calories"
              value={formValues.calories}
              onChange={handleFieldChange}
              inputMode="decimal"
              min="0"
              placeholder="89"
              required
              type="number"
            />
          </label>

          <label className={styles['add-product-screen__field']}>
            <span>Protein</span>
            <input
              name="protein"
              value={formValues.protein}
              onChange={handleFieldChange}
              inputMode="decimal"
              min="0"
              placeholder="1.1"
              required
              step="0.1"
              type="number"
            />
          </label>

          <label className={styles['add-product-screen__field']}>
            <span>Fat</span>
            <input
              name="fat"
              value={formValues.fat}
              onChange={handleFieldChange}
              inputMode="decimal"
              min="0"
              placeholder="0.3"
              required
              step="0.1"
              type="number"
            />
          </label>

          <label className={styles['add-product-screen__field']}>
            <span>Carbs</span>
            <input
              name="carbs"
              value={formValues.carbs}
              onChange={handleFieldChange}
              inputMode="decimal"
              min="0"
              placeholder="22.8"
              required
              step="0.1"
              type="number"
            />
          </label>
        </div>

        <Button disabled={isSaving} type="submit">
          {isSaving ? 'Saving...' : 'Save Product'}
        </Button>

        {statusMessage && (
          <p className={styles['add-product-screen__status']}>{statusMessage}</p>
        )}
      </form>
    </section>
  );
}
