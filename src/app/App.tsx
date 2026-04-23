import { useState } from 'react';
import { TopCalendar } from '../components';
import { dailyTargets } from '../data/dailyTargets';
import { mockEntries, mockProducts } from '../data/mockProducts';
import { isSameDay, startOfDay } from '../logic/date/calendar';
import { calculateDayTotals } from '../logic/nutrition/calculateDayTotals';
import { buildDailyCalorieIndicators } from '../logic/nutrition/getDayCalorieIndicator';
import { AddProductScreen, ProductListScreen, TodayScreen } from '../screens';
import type { AppScreen } from '../types/navigation';
import './App.scss';

const tabs: Array<{ id: AppScreen; label: string }> = [
  { id: 'today', label: 'Сегодня' },
  { id: 'add', label: 'Добавить' },
  { id: 'products', label: 'Продукты' },
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
              entryCount={selectedEntries.length}
            />
          )}
          {activeScreen === 'add' && <AddProductScreen />}
          {activeScreen === 'products' && (
            <ProductListScreen products={mockProducts} />
          )}
        </main>

        <nav className="app-shell__tabbar" aria-label="Навигация">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              type="button"
              className={
                tab.id === activeScreen
                  ? 'app-shell__tab app-shell__tab--active'
                  : 'app-shell__tab'
              }
              onClick={() => setActiveScreen(tab.id)}
            >
              {tab.label}
            </button>
          ))}
        </nav>
      </div>
    </div>
  );
}
