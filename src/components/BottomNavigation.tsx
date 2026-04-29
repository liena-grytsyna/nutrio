import { cn } from "../lib/cn";
import type { AppScreen } from "../types/app";
import styles from "./BottomNavigation.module.scss";

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
    <nav className={styles["bottom-navigation"]} aria-label="Navigation">
      {tabs.map((tab) => {
        const isActive = tab.id === activeScreen;

        return (
          <button
            key={tab.id}
            type="button"
            className={cn(
              styles["bottom-navigation__tab"],
              isActive && styles["bottom-navigation__tab--active"],
            )}
            onClick={() => onSelectScreen(tab.id)}
          >
            {tab.label}
          </button>
        );
      })}
    </nav>
  );
}
