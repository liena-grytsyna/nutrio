import { useState } from 'react';
import { TopCalendar } from '../components/TopCalendar';
import { BottomNavigation } from '../components/BottomNavigation';
import { mockEntries, mockProducts } from '../features/products';
import { AddProductScreen, ProductListScreen } from '../features/products';
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
  const dailyCalorieIndicators = buildDailyCalorieIndicators(
    mockEntries,
    dailyTargets.calories,
  );

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
          {activeScreen === 'add' && <AddProductScreen />}
          {activeScreen === 'products' && (
            <ProductListScreen products={mockProducts} />
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
