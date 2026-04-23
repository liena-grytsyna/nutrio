import { useState } from 'react';
import { mockEntries, mockProducts } from './data/mockProducts';
import { calculateDayTotals } from './logic/nutrition/calculateDayTotals';
import type { AppScreen } from './types/navigation';
import { TopCalendar } from './ui/components/TopCalendar';
import { AddProductScreen } from './ui/screens/AddProductScreen';
import { ProductListScreen } from './ui/screens/ProductListScreen';
import { TodayScreen } from './ui/screens/TodayScreen';

const tabs: Array<{ id: AppScreen; label: string }> = [
  { id: 'today', label: 'Сегодня' },
  { id: 'add', label: 'Добавить' },
  { id: 'products', label: 'Продукты' },
];

export default function App() {
  const [activeScreen, setActiveScreen] = useState<AppScreen>('today');
  const totals = calculateDayTotals(mockEntries);

  return (
    <div className="app-shell">
      <div className="phone-frame">
        <TopCalendar />

        <main className="screen-area">
          {activeScreen === 'today' && <TodayScreen totals={totals} />}
          {activeScreen === 'add' && <AddProductScreen />}
          {activeScreen === 'products' && (
            <ProductListScreen products={mockProducts} />
          )}
        </main>

        <nav className="tabbar" aria-label="Навигация">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              type="button"
              className={tab.id === activeScreen ? 'tab active' : 'tab'}
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
