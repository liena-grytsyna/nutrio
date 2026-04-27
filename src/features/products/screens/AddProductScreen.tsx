import { useState, type ChangeEvent, type FormEvent } from 'react';
import { Button } from '../../../shared/ui/Button';
import type { CreateProductInput, Product } from '../types';
import './AddProductScreen.scss';

type AddProductScreenProps = {
  onCreateProduct: (input: CreateProductInput) => Promise<Product>;
};

type ProductFormValues = {
  name: string;
  brand: string;
  barcode: string;
  servingSize: string;
  calories: string;
  protein: string;
  fat: string;
  carbs: string;
};

const initialFormValues: ProductFormValues = {
  name: '',
  brand: '',
  barcode: '',
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

export function AddProductScreen({ onCreateProduct }: AddProductScreenProps) {
  const [formValues, setFormValues] = useState<ProductFormValues>(initialFormValues);
  const [statusMessage, setStatusMessage] = useState<string | null>(null);
  const [isSaving, setIsSaving] = useState(false);

  const updateField =
    (field: keyof ProductFormValues) =>
    (event: ChangeEvent<HTMLInputElement>) => {
      setFormValues((currentValues) => ({
        ...currentValues,
        [field]: event.target.value,
      }));
    };

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
        brand: formValues.brand.trim() || null,
        barcode: formValues.barcode.trim() || null,
        servingSize,
        calories,
        protein,
        fat,
        carbs,
      });

      setFormValues(initialFormValues);
      setStatusMessage('Product saved.');
    } catch {
      setStatusMessage('Product could not be saved.');
    } finally {
      setIsSaving(false);
    }
  }

  return (
    <section className="screen add-product-screen">
      <div className="add-product-screen__card">
        <h2 className="add-product-screen__title">Add Product</h2>
        <p className="add-product-screen__hint">
          Save product nutrition values to the PostgreSQL database.
        </p>
      </div>

      <form className="add-product-screen__form" onSubmit={handleSubmit}>
        <label className="add-product-screen__field">
          <span>Name</span>
          <input
            value={formValues.name}
            onChange={updateField('name')}
            placeholder="Banana"
            required
          />
        </label>

        <div className="add-product-screen__row">
          <label className="add-product-screen__field">
            <span>Brand</span>
            <input
              value={formValues.brand}
              onChange={updateField('brand')}
              placeholder="Optional"
            />
          </label>

          <label className="add-product-screen__field">
            <span>Barcode</span>
            <input
              value={formValues.barcode}
              onChange={updateField('barcode')}
              placeholder="Optional"
              inputMode="numeric"
            />
          </label>
        </div>

        <label className="add-product-screen__field">
          <span>Serving</span>
          <input
            value={formValues.servingSize}
            onChange={updateField('servingSize')}
            placeholder="100 g"
          />
        </label>

        <div className="add-product-screen__macro-grid">
          <label className="add-product-screen__field">
            <span>Kcal</span>
            <input
              value={formValues.calories}
              onChange={updateField('calories')}
              inputMode="decimal"
              min="0"
              placeholder="89"
              required
              type="number"
            />
          </label>

          <label className="add-product-screen__field">
            <span>Protein</span>
            <input
              value={formValues.protein}
              onChange={updateField('protein')}
              inputMode="decimal"
              min="0"
              placeholder="1.1"
              required
              step="0.1"
              type="number"
            />
          </label>

          <label className="add-product-screen__field">
            <span>Fat</span>
            <input
              value={formValues.fat}
              onChange={updateField('fat')}
              inputMode="decimal"
              min="0"
              placeholder="0.3"
              required
              step="0.1"
              type="number"
            />
          </label>

          <label className="add-product-screen__field">
            <span>Carbs</span>
            <input
              value={formValues.carbs}
              onChange={updateField('carbs')}
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
          <p className="add-product-screen__status">{statusMessage}</p>
        )}
      </form>
    </section>
  );
}
