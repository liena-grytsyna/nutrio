import type { ComponentType } from "react";
import { cn } from "../lib/cn";
import { TIME_FORMATTER, type MealSectionConfig } from "../lib/mealSections";
import type { DayEntry, MealSectionId } from "../types/nutrition";
import styles from "./TodayMealCard.module.scss";

function ChevronIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <path
        d="m7 10 5 5 5-5"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

function PlusIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <path
        d="M12 5v14M5 12h14"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
      />
    </svg>
  );
}

function BreakfastIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <path
        d="M6 10h7.5a3.5 3.5 0 0 1 0 7H10a4 4 0 0 1-4-4Z"
        stroke="currentColor"
        strokeWidth="1.8"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M13.5 11H15a2.5 2.5 0 0 1 0 5h-1.5"
        stroke="currentColor"
        strokeWidth="1.8"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M9 6.2c0 .9-.5 1.3-.9 1.8-.5.5-.9 1-.9 1.8"
        stroke="currentColor"
        strokeWidth="1.8"
        strokeLinecap="round"
      />
      <path
        d="M12 6.2c0 .9-.5 1.3-.9 1.8-.5.5-.9 1-.9 1.8"
        stroke="currentColor"
        strokeWidth="1.8"
        strokeLinecap="round"
      />
    </svg>
  );
}

function LunchIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <path
        d="M5 13.2c0 3.2 3.1 5.8 7 5.8s7-2.6 7-5.8H5Z"
        stroke="currentColor"
        strokeWidth="1.8"
        strokeLinejoin="round"
      />
      <path
        d="M7 13.2a5 5 0 0 1 10 0"
        stroke="currentColor"
        strokeWidth="1.8"
        strokeLinecap="round"
      />
      <path
        d="M10 8.3c.8-.4 1.2-1 1.6-1.9"
        stroke="currentColor"
        strokeWidth="1.8"
        strokeLinecap="round"
      />
      <path
        d="M13.7 8c.8-.2 1.5-.7 2.1-1.6"
        stroke="currentColor"
        strokeWidth="1.8"
        strokeLinecap="round"
      />
    </svg>
  );
}

function DinnerIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <path
        d="M4.5 14h15"
        stroke="currentColor"
        strokeWidth="1.8"
        strokeLinecap="round"
      />
      <path
        d="M7.5 14a4.5 4.5 0 0 1 9 0"
        stroke="currentColor"
        strokeWidth="1.8"
        strokeLinecap="round"
      />
      <path
        d="M12 8V5.5"
        stroke="currentColor"
        strokeWidth="1.8"
        strokeLinecap="round"
      />
      <path
        d="M6.5 18.5h11"
        stroke="currentColor"
        strokeWidth="1.8"
        strokeLinecap="round"
      />
    </svg>
  );
}

function SnackIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <path
        d="M12.2 8.2c3 0 5.5 2.4 5.5 5.4 0 3-2.5 5.4-5.5 5.4s-5.4-2.4-5.4-5.4c0-3 2.4-5.4 5.4-5.4Z"
        stroke="currentColor"
        strokeWidth="1.8"
        strokeLinejoin="round"
      />
      <path
        d="M12.1 8.1c.3-1.1 1-2 2.1-2.8"
        stroke="currentColor"
        strokeWidth="1.8"
        strokeLinecap="round"
      />
      <path
        d="M11.8 8.2c-1.1-1.2-2.3-1.8-3.8-2"
        stroke="currentColor"
        strokeWidth="1.8"
        strokeLinecap="round"
      />
      <path
        d="M9.3 12.2c1-.2 1.7-.8 2.2-1.8"
        stroke="currentColor"
        strokeWidth="1.6"
        strokeLinecap="round"
      />
    </svg>
  );
}

const MEAL_SECTION_ICONS: Record<MealSectionId, ComponentType> = {
  breakfast: BreakfastIcon,
  snack: SnackIcon,
  lunch: LunchIcon,
  secondSnack: SnackIcon,
  dinner: DinnerIcon,
  thirdSnack: SnackIcon,
};

function MealSectionIcon({ sectionId }: { sectionId: MealSectionId }) {
  const Icon = MEAL_SECTION_ICONS[sectionId];

  return <Icon />;
}

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
    hasEntries && styles["card--filled"],
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
            <MealEntryRow key={entry.id} entry={entry} />
          ))}
        </div>
      )}
    </article>
  );
}
