import { cn } from "../lib/cn";
import { TIME_FORMATTER, type MealSectionConfig } from "../lib/mealSections";
import type { DayEntry, MealSectionId } from "../types/nutrition";
import { ChevronIcon, MealSectionIcon, PlusIcon } from "./icons";
import styles from "./TodayMealCard.module.scss";

type TodayMealCardProps = {
  canAdd: boolean;
  section: MealSectionConfig;
  entries: DayEntry[];
  isCollapsed: boolean;
  onAdd: (sectionId: MealSectionId) => void;
  onToggle: (sectionId: MealSectionId) => void;
};

function MealEntryRow({ entry, onDeleteEntry }: { entry: DayEntry; onDeleteEntry?: (entryId: string) => void }) {
  return (
    <div className={styles.item}>
      <span className={styles["item-status"]} aria-hidden="true" />

      <div className={styles["item-content"]}>
        <p className={styles["item-name"]}>{entry.name}</p>
        <p className={styles["item-meta"]}>
          <span className={styles["item-accent"]}>{entry.amount} g</span>
          <span className={styles["item-dot"]}>•</span>
          <span>{entry.calories.toFixed(0)} kcal</span>
          <span className={styles["item-dot"]}>•</span>
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
  const mealCardClassName = cn(
    styles.card,
    hasEntries && !isCollapsed && styles["card--expanded"],
  );
  const toggleButtonClassName = cn(
    styles.action,
    styles["action--toggle"],
    isCollapsed && styles["action--toggle-collapsed"],
  );

  return (
    <article className={mealCardClassName}>
      <div className={styles.header}>
        <span className={styles.status} aria-hidden="true" />

        <div className={styles.main}>
          <span
            className={cn(styles.icon, styles[`icon--${section.id}`])}
            aria-hidden="true"
          >
            <MealSectionIcon sectionId={section.id} />
          </span>

          <div className={styles.summary}>
            <h3 className={styles.title}>{section.title}</h3>
            <p className={styles.calories}>{summaryText}</p>
          </div>
        </div>

        <div className={styles.actions}>
          {hasEntries && (
            <button
              type="button"
              className={toggleButtonClassName}
              aria-label={
                isCollapsed
                  ? `Expand ${section.title}`
                  : `Collapse ${section.title}`
              }
              aria-expanded={!isCollapsed}
              aria-controls={contentId}
              onClick={() => onToggle(section.id)}
            >
              <ChevronIcon />
            </button>
          )}
          <button
            type="button"
            className={cn(styles.action, styles["action--add"])}
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
        <div id={contentId} className={styles.body}>
          {entries.map((entry) => (
            <MealEntryRow
              key={entry.id}
              entry={entry}
            />
          ))}
        </div>
      )}
    </article>
  );
}
