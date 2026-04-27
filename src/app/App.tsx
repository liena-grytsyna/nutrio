import { useCallback, useEffect, useState } from 'react';
import { TopCalendar } from '../components/TopCalendar';
import { BottomNavigation } from '../components/BottomNavigation';
import {
  AddProductScreen,
  createProduct,
  fetchProducts,
  mockEntries,
  ProductListScreen,
  type CreateProductInput,
  type Product,
} from '../features/products';
import {
  buildDailyCalorieIndicators,
  calculateDayTotals,
  dailyTargets,
} from '../features/nutrition';
import { TodayScreen } from '../features/today';
import { isSameDay, startOfDay } from '../shared/utils/date';
import type { AppScreen } from '../types/navigation';
import './App.scss';

const tabs: Array<{ id: AppScreen; label: string }> = [
  { id: 'today', label: 'Today' },
  { id: 'add', label: 'Add' },
  { id: 'products', label: 'Products' },
];

export default function App() {
  const [activeScreen, setActiveScreen] = useState<AppScreen>('today');
  const [selectedDate, setSelectedDate] = useState(() => startOfDay(new Date()));
  const [products, setProducts] = useState<Product[]>([]);
  const [productsLoading, setProductsLoading] = useState(true);
  const [productsError, setProductsError] = useState<string | null>(null);
  const dailyCalorieIndicators = buildDailyCalorieIndicators(
    mockEntries,
    dailyTargets.calories,
  );

  useEffect(() => {
    const controller = new AbortController();

    setProductsLoading(true);
    setProductsError(null);

    fetchProducts(controller.signal)
      .then(setProducts)
      .catch((error: unknown) => {
        if (error instanceof DOMException && error.name === 'AbortError') {
          return;
        }

        setProductsError('Products could not be loaded.');
      })
      .finally(() => {
        if (!controller.signal.aborted) {
          setProductsLoading(false);
        }
      });

    return () => controller.abort();
  }, []);

  const handleCreateProduct = useCallback(async (input: CreateProductInput) => {
    const product = await createProduct(input);
    setProducts((currentProducts) =>
      [...currentProducts, product].sort((firstProduct, secondProduct) =>
        firstProduct.name.localeCompare(secondProduct.name),
      ),
    );
    setProductsError(null);
    return product;
  }, []);

  const selectedEntries = mockEntries.filter((entry) =>
    isSameDay(new Date(entry.eatenAt), selectedDate),
  );
  const totals = calculateDayTotals(selectedEntries);

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
            <TodayScreen
              totals={totals}
              selectedDate={selectedDate}
              entries={selectedEntries}
            />
          )}
          {activeScreen === 'add' && (
            <AddProductScreen onCreateProduct={handleCreateProduct} />
          )}
          {activeScreen === 'products' && (
            <ProductListScreen
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
