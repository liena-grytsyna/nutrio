import type { AppScreen } from '../../features/navigation/types';
import './BottomNavigation.scss';

type BottomNavigationTab = {
  id: AppScreen;
  label: string;
};

type BottomNavigationProps = {
  activeScreen: AppScreen;
  tabs: BottomNavigationTab[];
  onSelectScreen: (screen: AppScreen) => void;
};

export function BottomNavigation({
  activeScreen,
  tabs,
  onSelectScreen,
}: BottomNavigationProps) {
  return (
    <nav className="bottom-navigation" aria-label="Navigation">
      {tabs.map((tab) => {
        const isActive = tab.id === activeScreen;

        return (
          <button
            key={tab.id}
            type="button"
            className={
              isActive
                ? 'bottom-navigation__tab bottom-navigation__tab--active'
                : 'bottom-navigation__tab'
            }
            onClick={() => onSelectScreen(tab.id)}
          >
            {tab.label}
          </button>
        );
      })}
    </nav>
  );
}
