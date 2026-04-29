import { useEffect, useState } from 'react';
import { TopCalendar } from '../widgets/TopCalendar';
import { BottomNavigation } from '../widgets/BottomNavigation';
import {
  createProduct,
  fetchProducts,
  sortProductsByName,
  type CreateProductInput,
  type Product,
} from '../features/products';
import {
  createDayEntry,
  fetchNutritionOverview,
  getMealSectionId,
  type DayNutritionOverview,
  type NutritionOverview,
  type MealSectionId,
  type NutritionGoalSummary,
} from '../features/nutrition';
import { AddProductPage } from '../pages/add-product/AddProductPage';
import { ProductsPage } from '../pages/products/ProductsPage';
import { TodayPage } from '../pages/today/TodayPage';
import { getDateKey, startOfDay } from '../shared/lib/date';
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

const EMPTY_SUMMARY: NutritionGoalSummary = {
  consumed: {
    calories: 0,
    protein: 0,
    fat: 0,
    carbs: 0,
  },
  target: {
    calories: 0,
    protein: 0,
    fat: 0,
    carbs: 0,
  },
  remaining: {
    calories: 0,
    protein: 0,
    fat: 0,
    carbs: 0,
  },
  progress: {
    calories: 0,
    protein: 0,
    fat: 0,
    carbs: 0,
  },
  calorieStatus: 'under',
  calorieProgressRatio: 0,
};

const EMPTY_DAY_OVERVIEW: DayNutritionOverview = {
  entries: [],
  totals: {
    calories: 0,
    protein: 0,
    fat: 0,
    carbs: 0,
  },
  summary: EMPTY_SUMMARY,
};

const EMPTY_NUTRITION_OVERVIEW: NutritionOverview = {
  days: {},
  dailyCalorieIndicators: {},
  defaultDay: EMPTY_DAY_OVERVIEW,
  defaultIndicator: {
    calories: 0,
    progress: 0,
    status: 'under',
  },
};

function getErrorMessage(error: unknown, fallbackMessage: string) {
  return error instanceof Error ? error.message : fallbackMessage;
}

export default function App() {
  const [activeScreen, setActiveScreen] = useState<AppScreen>('today');
  const [selectedDate, setSelectedDate] = useState(() => startOfDay(new Date()));
  const [nutritionOverview, setNutritionOverview] =
    useState<NutritionOverview>(EMPTY_NUTRITION_OVERVIEW);
  const [entriesLoading, setEntriesLoading] = useState(true);
  const [entriesError, setEntriesError] = useState<string | null>(null);
  const [products, setProducts] = useState<Product[]>([]);
  const [productsLoading, setProductsLoading] = useState(true);
  const [productsError, setProductsError] = useState<string | null>(null);
  const selectedDateKey = getDateKey(selectedDate);
  const timezoneOffsetMinutes = selectedDate.getTimezoneOffset();
  const selectedDayOverview =
    nutritionOverview.days[selectedDateKey] ?? nutritionOverview.defaultDay;

  useEffect(() => {
    const controller = new AbortController();

    async function loadProducts() {
      setProductsError(null);

      try {
        const nextProducts = await fetchProducts(controller.signal);
        setProducts(sortProductsByName(nextProducts));
      } catch (error) {
        if (!controller.signal.aborted) {
          setProductsError(
            getErrorMessage(error, 'Products could not be loaded.'),
          );
        }
      } finally {
        if (!controller.signal.aborted) {
          setProductsLoading(false);
        }
      }
    }

    loadProducts();

    return () => controller.abort();
  }, []);

  useEffect(() => {
    const controller = new AbortController();

    async function loadNutritionOverview() {
      setEntriesLoading(true);
      setEntriesError(null);

      try {
        const overview = await fetchNutritionOverview(
          timezoneOffsetMinutes,
          controller.signal,
        );
        setNutritionOverview(overview);
      } catch (error) {
        if (!controller.signal.aborted) {
          setEntriesError(getErrorMessage(error, 'Meals could not be loaded.'));
          setNutritionOverview(EMPTY_NUTRITION_OVERVIEW);
        }
      } finally {
        if (!controller.signal.aborted) {
          setEntriesLoading(false);
        }
      }
    }

    loadNutritionOverview();

    return () => controller.abort();
  }, [timezoneOffsetMinutes]);

  async function handleCreateProduct(input: CreateProductInput) {
    const product = await createProduct(input);

    setProducts((currentProducts) =>
      sortProductsByName([...currentProducts, product]),
    );
    setProductsError(null);

    return product;
  }

  async function handleAddEntry(
    sectionId: MealSectionId,
    productId: string,
    amount: number,
  ) {
    const product = products.find((item) => item.id === productId);

    if (!product) {
      throw new Error('Selected product was not found.');
    }

    const sameSectionCount = selectedDayOverview.entries.filter((entry) => {
      const eatenAt = new Date(entry.eatenAt);

      return getMealSectionId(eatenAt) === sectionId;
    }).length;

    const eatenAt = new Date(selectedDate);
    eatenAt.setHours(
      MEAL_SECTION_HOURS[sectionId],
      Math.min(sameSectionCount * 5, 55),
      0,
      0,
    );

    await createDayEntry({
      productId,
      amount,
      eatenAt: eatenAt.toISOString(),
    });

    setEntriesLoading(true);

    try {
      const overview = await fetchNutritionOverview(timezoneOffsetMinutes);
      setNutritionOverview(overview);
      setEntriesError(null);
    } catch (error) {
      setEntriesError(getErrorMessage(error, 'Meals could not be refreshed.'));
    } finally {
      setEntriesLoading(false);
    }
  }

  return (
    <div className="app-shell">
      <div className="app-shell__phone">
        <TopCalendar
          dailyCalorieIndicators={nutritionOverview.dailyCalorieIndicators}
          defaultIndicator={nutritionOverview.defaultIndicator}
          selectedDate={selectedDate}
          onSelectDate={setSelectedDate}
        />

        <main className="app-shell__content">
          {activeScreen === 'today' && (
            <TodayPage
              key={selectedDate.getTime()}
              entriesError={entriesError}
              isEntriesLoading={entriesLoading}
              isProductsLoading={productsLoading}
              productsError={productsError}
              products={products}
              summary={selectedDayOverview.summary}
              entries={selectedDayOverview.entries}
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
