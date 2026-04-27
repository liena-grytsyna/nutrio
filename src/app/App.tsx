import { useEffect, useState } from 'react';
import { TopCalendar } from '../widgets/TopCalendar';
import { BottomNavigation } from '../widgets/BottomNavigation';
import {
  createProduct,
  fetchProducts,
  type CreateProductInput,
  type Product,
} from '../features/products';
import {
  buildDailyCalorieIndicators,
  calculateDayTotals,
  dailyTargets,
  getMealSectionId,
  getStoredDayEntries,
  saveDayEntries,
  type DayCalorieIndicator,
  type DayEntry,
  type MealSectionId,
} from '../features/nutrition';
import { AddProductPage } from '../pages/add-product/AddProductPage';
import { ProductsPage } from '../pages/products/ProductsPage';
import { TodayPage } from '../pages/today/TodayPage';
import { startOfDay } from '../shared/lib/date';
import type { AppScreen } from '../features/navigation/types';
import './App.scss';

const tabs = [
  { id: 'today', label: 'Today' },
  { id: 'add', label: 'Add' },
  { id: 'products', label: 'Products' },
] satisfies ReadonlyArray<{ id: AppScreen; label: string }>;

const MEAL_SECTION_HOURS: Record<MealSectionId, number> = {
  breakfast: 8,
  snack: 10,
  lunch: 13,
  secondSnack: 16,
  dinner: 19,
  thirdSnack: 22,
};

function roundNutritionValue(value: number) {
  return Math.round(value * 10) / 10;
}

function createEntryId() {
  if (typeof crypto !== 'undefined' && 'randomUUID' in crypto) {
    return crypto.randomUUID();
  }

  return `${Date.now()}-${Math.random().toString(16).slice(2)}`;
}

export default function App() {
  const [activeScreen, setActiveScreen] = useState<AppScreen>('today');
  const [selectedDate, setSelectedDate] = useState(() => startOfDay(new Date()));
  const [entries, setEntries] = useState<DayEntry[]>(() => getStoredDayEntries());
  const [products, setProducts] = useState<Product[]>([]);
  const [productsLoading, setProductsLoading] = useState(true);
  const [productsError, setProductsError] = useState<string | null>(null);

  useEffect(() => {
    const controller = new AbortController();

    setProductsError(null);

    fetchProducts(controller.signal)
      .then(setProducts)
      .catch(() => {
        if (!controller.signal.aborted) {
          setProductsError('Products could not be loaded.');
        }
      })
      .finally(() => {
        if (!controller.signal.aborted) {
          setProductsLoading(false);
        }
      });

    return () => controller.abort();
  }, []);

  async function handleCreateProduct(input: CreateProductInput) {
    const product = await createProduct(input);

    setProducts((currentProducts) =>
      [...currentProducts, product].sort((first, second) =>
        first.name.localeCompare(second.name),
      ),
    );
    setProductsError(null);

    return product;
  }

  useEffect(() => {
    saveDayEntries(entries);
  }, [entries]);

  function handleAddEntry(
    sectionId: MealSectionId,
    productId: string,
    amount: number,
  ) {
    const product = products.find((item) => item.id === productId);

    if (!product) {
      throw new Error('Selected product was not found.');
    }

    const sameSectionCount = entries.filter((entry) => {
      const eatenAt = new Date(entry.eatenAt);

      return (
        startOfDay(eatenAt).getTime() === selectedDate.getTime() &&
        getMealSectionId(eatenAt) === sectionId
      );
    }).length;

    const eatenAt = new Date(selectedDate);
    eatenAt.setHours(
      MEAL_SECTION_HOURS[sectionId],
      Math.min(sameSectionCount * 5, 55),
      0,
      0,
    );

    const amountRatio = amount / 100;

    setEntries((currentEntries) => [
      ...currentEntries,
      {
        id: createEntryId(),
        name: product.name,
        amount,
        calories: roundNutritionValue(product.calories * amountRatio),
        protein: roundNutritionValue(product.protein * amountRatio),
        fat: roundNutritionValue(product.fat * amountRatio),
        carbs: roundNutritionValue(product.carbs * amountRatio),
        source: 'search',
        eatenAt: eatenAt.toISOString(),
      },
    ]);
  }

  const dailyCalorieIndicators: Record<string, DayCalorieIndicator> =
    buildDailyCalorieIndicators(entries, dailyTargets.calories);
  const entriesForSelectedDate = entries.filter(
    (entry) => startOfDay(new Date(entry.eatenAt)).getTime() === selectedDate.getTime(),
  );
  const totals = calculateDayTotals(entriesForSelectedDate);

  return (
    <div className="app-shell">
      <div className="app-shell__phone">
        <TopCalendar
          calorieTarget={dailyTargets.calories}
          dailyCalorieIndicators={dailyCalorieIndicators}
          selectedDate={selectedDate}
          onSelectDate={setSelectedDate}
        />

        <main className="app-shell__content">
          {activeScreen === 'today' && (
            <TodayPage
              key={selectedDate.getTime()}
              isProductsLoading={productsLoading}
              products={products}
              totals={totals}
              entries={entriesForSelectedDate}
              onAddEntry={handleAddEntry}
            />
          )}
          {activeScreen === 'add' && (
            <AddProductPage onCreateProduct={handleCreateProduct} />
          )}
          {activeScreen === 'products' && (
            <ProductsPage
              error={productsError}
              isLoading={productsLoading}
              products={products}
            />
          )}
        </main>

        <BottomNavigation
          activeScreen={activeScreen}
          tabs={tabs}
          onSelectScreen={setActiveScreen}
        />
      </div>
    </div>
  );
}
