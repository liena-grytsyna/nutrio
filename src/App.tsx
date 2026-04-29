import { useState } from 'react';
import { BottomNavigation } from './components/BottomNavigation';
import { TopCalendar } from './components/TopCalendar';
import { useNutritionOverview } from './hooks/useNutritionOverview';
import { useProducts } from './hooks/useProducts';
import styles from './App.module.scss';
import { startOfDay } from './lib/date';
import { AddProductPage } from './pages/AddProductPage';
import { ProductsPage } from './pages/ProductsPage';
import { TodayPage } from './pages/TodayPage';
import type { AppScreen } from './types/app';

const tabs = [
  { id: 'today', label: 'Today' },
  { id: 'add', label: 'Add' },
  { id: 'products', label: 'Products' },
] satisfies ReadonlyArray<{ id: AppScreen; label: string }>;

export default function App() {
  const [activeScreen, setActiveScreen] = useState<AppScreen>('today');
  const [selectedDate, setSelectedDate] = useState(() => startOfDay(new Date()));
  const {
    products,
    productsLoading,
    productsError,
    handleCreateProduct,
  } = useProducts();
  const {
    nutritionOverview,
    entriesLoading,
    entriesError,
    selectedDayOverview,
    handleAddEntry,
  } = useNutritionOverview({
    products,
    selectedDate,
  });

  return (
    <div className={styles['app-shell']}>
      <div className={styles['app-shell__phone']}>
        <TopCalendar
          dailyCalorieIndicators={nutritionOverview.dailyCalorieIndicators}
          defaultIndicator={nutritionOverview.defaultIndicator}
          selectedDate={selectedDate}
          onSelectDate={setSelectedDate}
        />

        <main className={styles['app-shell__content']}>
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
