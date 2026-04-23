import { useEffect, useState } from 'react';
import { NutritionSummaryCard } from '../../components/NutritionSummaryCard';
import { dailyTargets } from '../../data/dailyTargets';
import {
  buildMealEntryGroups,
  type MealSectionId,
} from '../../logic/nutrition/getMealEntryGroups';
import type { DayEntry, NutritionValues } from '../../types/nutrition';
import './TodayScreen.scss';

type TodayScreenProps = {
  totals: NutritionValues;
  selectedDate: Date;
  entries: DayEntry[];
};

type MealSectionConfig = {
  id: MealSectionId;
  title: string;
  emptyHint: string;
};

type CollapsedMealSections = Record<MealSectionId, boolean>;

const MEAL_SECTIONS: MealSectionConfig[] = [
  {
    id: 'breakfast',
    title: 'Breakfast',
    emptyHint: 'Add your first meal',
  },
  {
    id: 'snack',
    title: 'Snack',
    emptyHint: 'Add a snack',
  },
  {
    id: 'lunch',
    title: 'Lunch',
    emptyHint: 'Add your lunch',
  },
  {
    id: 'secondSnack',
    title: 'Second Snack',
    emptyHint: 'Add another snack',
  },
  {
    id: 'dinner',
    title: 'Dinner',
    emptyHint: 'Add your dinner',
  },
  {
    id: 'thirdSnack',
    title: 'Third Snack',
    emptyHint: 'Add a late snack',
  },
];

const TIME_FORMATTER = new Intl.DateTimeFormat('en-GB', {
  hour: '2-digit',
  minute: '2-digit',
});

function createCollapsedMealSections(
  mealGroups: ReturnType<typeof buildMealEntryGroups>,
): CollapsedMealSections {
  const collapsedSections = {} as CollapsedMealSections;

  MEAL_SECTIONS.forEach((section) => {
    collapsedSections[section.id] = mealGroups[section.id].length === 0;
  });

  return collapsedSections;
}

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

function MoreIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
      <circle cx="12" cy="5.5" r="1.8" />
      <circle cx="12" cy="12" r="1.8" />
      <circle cx="12" cy="18.5" r="1.8" />
    </svg>
  );
}

function InfoIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <circle
        cx="12"
        cy="12"
        r="9"
        stroke="currentColor"
        strokeWidth="1.8"
      />
      <path
        d="M12 10.5v5"
        stroke="currentColor"
        strokeWidth="1.8"
        strokeLinecap="round"
      />
      <circle cx="12" cy="7.5" r="1.1" fill="currentColor" />
    </svg>
  );
}

function MealSectionIcon({ sectionId }: { sectionId: MealSectionId }) {
  switch (sectionId) {
    case 'breakfast':
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
    case 'lunch':
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
    case 'dinner':
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
    case 'snack':
    case 'secondSnack':
    case 'thirdSnack':
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
}

export function TodayScreen({
  totals,
  selectedDate,
  entries,
}: TodayScreenProps) {
  const mealGroups = buildMealEntryGroups(entries);
  const entryCount = entries.length;
  const [collapsedSections, setCollapsedSections] =
    useState<CollapsedMealSections>(() =>
      createCollapsedMealSections(mealGroups),
    );

  useEffect(() => {
    setCollapsedSections(createCollapsedMealSections(mealGroups));
  }, [selectedDate, entryCount]);

  function toggleMealSection(sectionId: MealSectionId) {
    setCollapsedSections((previousState) => ({
      ...previousState,
      [sectionId]: !previousState[sectionId],
    }));
  }

  return (
    <section className="screen today-screen">
      <NutritionSummaryCard totals={totals} targets={dailyTargets} />

      <div className="today-screen__meals-section">
        <div className="today-screen__meals-header">
          <div className="today-screen__meals-heading">
            <h2 className="today-screen__meals-title">Meals</h2>
          </div>
        </div>

        <div className="today-screen__meals">
          {MEAL_SECTIONS.map((section) => {
            const sectionEntries = mealGroups[section.id];
            const isEmpty = sectionEntries.length === 0;
            const isCollapsed = collapsedSections[section.id];
            const totalCalories = sectionEntries.reduce(
              (sum, entry) => sum + entry.calories,
              0,
            );
            const mealCardClassName = [
              'today-screen__meal-card',
              !isEmpty && 'today-screen__meal-card--filled',
              !isEmpty && !isCollapsed && 'today-screen__meal-card--expanded',
              isEmpty && 'today-screen__meal-card--empty',
            ]
              .filter(Boolean)
              .join(' ');
            const contentId = `meal-section-${section.id}`;

            return (
              <article key={section.id} className={mealCardClassName}>
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
                      <p className="today-screen__meal-calories">
                        {isEmpty
                          ? section.emptyHint
                          : `${totalCalories.toFixed(0)} kcal`}
                      </p>
                    </div>
                  </div>

                  <div className="today-screen__meal-actions">
                    {!isEmpty && (
                      <button
                        type="button"
                        className={
                          isCollapsed
                            ? 'today-screen__meal-action today-screen__meal-action--toggle today-screen__meal-action--toggle-collapsed'
                            : 'today-screen__meal-action today-screen__meal-action--toggle'
                        }
                        aria-label={
                          isCollapsed
                            ? `Expand ${section.title}`
                            : `Collapse ${section.title}`
                        }
                        aria-expanded={!isCollapsed}
                        aria-controls={contentId}
                        onClick={() => toggleMealSection(section.id)}
                      >
                        <ChevronIcon />
                      </button>
                    )}

                    <button
                      type="button"
                      className="today-screen__meal-action today-screen__meal-action--more"
                      aria-label={`${section.title} options`}
                    >
                      <MoreIcon />
                    </button>

                    <button
                      type="button"
                      className="today-screen__meal-action today-screen__meal-action--add"
                      aria-label={`Add item to ${section.title}`}
                    >
                      <PlusIcon />
                    </button>
                  </div>
                </div>

                {!isEmpty && !isCollapsed && (
                  <div id={contentId} className="today-screen__meal-body">
                    {sectionEntries.map((entry) => (
                      <div key={entry.id} className="today-screen__meal-item">
                        <span
                          className="today-screen__meal-item-status"
                          aria-hidden="true"
                        />

                        <div className="today-screen__meal-item-content">
                          <p className="today-screen__meal-item-name">
                            {entry.name}
                          </p>
                          <p className="today-screen__meal-item-meta">
                            <span className="today-screen__meal-item-accent">
                              {entry.amount} g
                            </span>
                            <span className="today-screen__meal-item-dot">
                              •
                            </span>
                            <span>{entry.calories.toFixed(0)} kcal</span>
                            <span className="today-screen__meal-item-dot">
                              •
                            </span>
                            <span>
                              {TIME_FORMATTER.format(new Date(entry.eatenAt))}
                            </span>
                          </p>
                        </div>

                        <button
                          type="button"
                          className="today-screen__meal-item-action"
                          aria-label={`More details for ${entry.name}`}
                        >
                          <InfoIcon />
                        </button>
                      </div>
                    ))}
                  </div>
                )}
              </article>
            );
          })}
        </div>
      </div>
    </section>
  );
}
