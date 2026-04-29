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

const macroFields = [
  {
    name: 'calories',
    label: 'Kcal',
    placeholder: '89',
    step: undefined,
  },
  {
    name: 'protein',
    label: 'Protein',
    placeholder: '1.1',
    step: '0.1',
  },
  {
    name: 'fat',
    label: 'Fat',
    placeholder: '0.3',
    step: '0.1',
  },
  {
    name: 'carbs',
    label: 'Carbs',
    placeholder: '22.8',
    step: '0.1',
  },
] as const satisfies ReadonlyArray<{
  name: keyof Pick<ProductFormValues, 'calories' | 'protein' | 'fat' | 'carbs'>;
  label: string;
  placeholder: string;
  step?: string;
}>;

function toNumber(value: string) {
  const number = Number(value);
  return Number.isFinite(number) && number >= 0 ? number : null;
}

export function AddProductPage({ onCreateProduct }: AddProductPageProps) {
  const [formValues, setFormValues] =
    useState<ProductFormValues>(initialFormValues);
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

    if (
      !name ||
      calories === null ||
      protein === null ||
      fat === null ||
      carbs === null
    ) {
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
      <h2 className={styles['add-product-screen__title']}>Add Product</h2>

      <form
        className={styles['add-product-screen__form']}
        onSubmit={handleSubmit}
      >
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
          {macroFields.map((field) => (
            <label
              key={field.name}
              className={styles['add-product-screen__field']}
            >
              <span>{field.label}</span>
              <input
                name={field.name}
                value={formValues[field.name]}
                onChange={handleFieldChange}
                inputMode="decimal"
                min="0"
                placeholder={field.placeholder}
                required
                step={field.step}
                type="number"
              />
            </label>
          ))}
        </div>

        <Button disabled={isSaving} type="submit">
          {isSaving ? 'Saving...' : 'Save Product'}
        </Button>

        {statusMessage && (
          <p className={styles['add-product-screen__status']}>
            {statusMessage}
          </p>
        )}
      </form>
    </section>
  );
}
