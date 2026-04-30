// React state
import { useState } from "react";

// UI components
import { BottomNavigation } from "./components/BottomNavigation";
import { TopCalendar } from "./components/TopCalendar";

// Custom hooks (data logic)
import { useNutritionOverview } from "./hooks/useNutritionOverview";
import { useProducts } from "./hooks/useProducts";

// Styles
import styles from "./App.module.scss";

// Date helper
import { startOfDay } from "./lib/date";

// Pages
import { AddProductPage } from "./pages/AddProductPage";
import { ProductsPage } from "./pages/ProductsPage";
import { TodayPage } from "./pages/TodayPage";

// Screen type
import type { AppScreen } from "./types/app";

// Navigation tabs
const tabs = [
  { id: "today", label: "Today" },
  { id: "add", label: "Add" },
  { id: "products", label: "Products" },
] satisfies ReadonlyArray<{ id: AppScreen; label: string }>;

export default function App() {
  // Active screen (tab)
  const [activeScreen, setActiveScreen] = useState<AppScreen>("today");

  // Selected date
  const [selectedDate, setSelectedDate] = useState(() =>
    startOfDay(new Date()),
  );

  // Products state
  const { products, productsLoading, productsError, handleCreateProduct } =
    useProducts();

  // Nutrition data
  const {
    nutritionOverview,
    entriesLoading,
    entriesError,
    selectedDayOverview,
    handleAddEntry,
    handleDeleteEntry,
  } = useNutritionOverview({
    products,
    selectedDate,
  });

  return (
    <div className={styles["app-shell"]}>
      <div className={styles["app-shell__phone"]}>
        {/* Calendar */}
        <TopCalendar
          dailyCalorieIndicators={nutritionOverview.dailyCalorieIndicators}
          defaultIndicator={nutritionOverview.defaultIndicator}
          selectedDate={selectedDate}
          onSelectDate={setSelectedDate}
        />

        <main className={styles["app-shell__content"]}>
          {/* Today screen */}
          {activeScreen === "today" && (
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
              onDeleteEntry={handleDeleteEntry}
            />
          )}

          {/* Add product */}
          {activeScreen === "add" && (
            <AddProductPage onCreateProduct={handleCreateProduct} />
          )}

          {/* Products list */}
          {activeScreen === "products" && (
            <ProductsPage
              error={productsError}
              isLoading={productsLoading}
              products={products}
            />
          )}
        </main>

        {/* Bottom navigation */}
        <BottomNavigation
          activeScreen={activeScreen}
          tabs={tabs}
          onSelectScreen={setActiveScreen}
        />
      </div>
    </div>
  );
}
