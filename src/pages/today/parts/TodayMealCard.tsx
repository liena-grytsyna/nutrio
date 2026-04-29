import type { DayEntry, MealSectionId } from '../../../features/nutrition';
import {
  TIME_FORMATTER,
  type MealSectionConfig,
} from '../constants';
import {
  ChevronIcon,
  MealSectionIcon,
  PlusIcon,
} from './TodayIcons';

type TodayMealCardProps = {
  canAdd: boolean;
  section: MealSectionConfig;
  entries: DayEntry[];
  isCollapsed: boolean;
  onAdd: (sectionId: MealSectionId) => void;
  onToggle: (sectionId: MealSectionId) => void;
};

function MealEntryRow({ entry }: { entry: DayEntry }) {
  return (
    <div className="today-screen__meal-item">
      <span className="today-screen__meal-item-status" aria-hidden="true" />

      <div className="today-screen__meal-item-content">
        <p className="today-screen__meal-item-name">{entry.name}</p>
        <p className="today-screen__meal-item-meta">
          <span className="today-screen__meal-item-accent">{entry.amount} g</span>
          <span className="today-screen__meal-item-dot">•</span>
          <span>{entry.calories.toFixed(0)} kcal</span>
          <span className="today-screen__meal-item-dot">•</span>
          <span>{TIME_FORMATTER.format(new Date(entry.eatenAt))}</span>
        </p>
      </div>
    </div>
  );
}

export function TodayMealCard({
  canAdd,
  section,
  entries,
  isCollapsed,
  onAdd,
  onToggle,
}: TodayMealCardProps) {
  const hasEntries = entries.length > 0;
  const totalCalories = entries.reduce((sum, entry) => sum + entry.calories, 0);
  const contentId = `meal-section-${section.id}`;
  const summaryText = hasEntries
    ? `${totalCalories.toFixed(0)} kcal`
    : section.emptyHint;
  let mealCardClassName = 'today-screen__meal-card';

  if (hasEntries) {
    mealCardClassName += ' today-screen__meal-card--filled';
  }

  if (hasEntries && !isCollapsed) {
    mealCardClassName += ' today-screen__meal-card--expanded';
  }

  const toggleButtonClassName = isCollapsed
    ? 'today-screen__meal-action today-screen__meal-action--toggle today-screen__meal-action--toggle-collapsed'
    : 'today-screen__meal-action today-screen__meal-action--toggle';

  return (
    <article className={mealCardClassName}>
      <div className="today-screen__meal-header">
        <span className="today-screen__meal-status" aria-hidden="true" />

        <div className="today-screen__meal-main">
          <span
            className={`today-screen__meal-icon today-screen__meal-icon--${section.id}`}
            aria-hidden="true"
          >
            <MealSectionIcon sectionId={section.id} />
          </span>

          <div className="today-screen__meal-summary">
            <h3 className="today-screen__meal-title">{section.title}</h3>
            <p className="today-screen__meal-calories">{summaryText}</p>
          </div>
        </div>

        <div className="today-screen__meal-actions">
          {hasEntries && (
            <button
              type="button"
              className={toggleButtonClassName}
              aria-label={isCollapsed ? `Expand ${section.title}` : `Collapse ${section.title}`}
              aria-expanded={!isCollapsed}
              aria-controls={contentId}
              onClick={() => onToggle(section.id)}
            >
              <ChevronIcon />
            </button>
          )}

          <button
            type="button"
            className="today-screen__meal-action today-screen__meal-action--add"
            aria-label={
              canAdd
                ? `Add item to ${section.title}`
                : `${section.title} is unavailable while meals are loading`
            }
            disabled={!canAdd}
            onClick={() => onAdd(section.id)}
          >
            <PlusIcon />
          </button>
        </div>
      </div>

      {hasEntries && !isCollapsed && (
        <div id={contentId} className="today-screen__meal-body">
          {entries.map((entry) => (
            <MealEntryRow key={entry.id} entry={entry} />
          ))}
        </div>
      )}
    </article>
  );
}
