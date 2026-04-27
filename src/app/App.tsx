import { useEffect, useState } from 'react';
import { TopCalendar } from '../widgets/TopCalendar';
import { BottomNavigation } from '../widgets/BottomNavigation';
import {
  createProduct,
  fetchProducts,
  mockEntries,
  type CreateProductInput,
  type Product,
} from '../features/products';
import {
  buildDailyCalorieIndicators,
  calculateDayTotals,
  dailyTargets,
} from '../features/nutrition';
import { AddProductPage } from '../pages/add-product/AddProductPage';
import { ProductsPage } from '../pages/products/ProductsPage';
import { TodayPage } from '../pages/today/TodayPage';
import { isSameDay, startOfDay } from '../shared/lib/date';
import type { AppScreen } from '../features/navigation/types';
import './App.scss';

const tabs = [
  { id: 'today', label: 'Today' },
  { id: 'add', label: 'Add' },
  { id: 'products', label: 'Products' },
] satisfies ReadonlyArray<{ id: AppScreen; label: string }>;

const dailyCalorieIndicators = buildDailyCalorieIndicators(
  mockEntries,
  dailyTargets.calories,
);

export default function App() {
  const [activeScreen, setActiveScreen] = useState<AppScreen>('today');
  const [selectedDate, setSelectedDate] = useState(() => startOfDay(new Date()));
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

  const entriesForSelectedDate = mockEntries.filter((entry) =>
    isSameDay(new Date(entry.eatenAt), selectedDate),
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
              totals={totals}
              entries={entriesForSelectedDate}
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
