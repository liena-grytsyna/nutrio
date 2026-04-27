import { useEffect, useState } from 'react';
import { NutritionSummaryCard } from '../../widgets/NutritionSummaryCard';
import {
  buildMealEntryGroups,
  dailyTargets,
  type DayEntry,
  type MealSectionId,
  type NutritionValues,
} from '../../features/nutrition';
import {
  createCollapsedMealSections,
  MEAL_SECTIONS,
  type CollapsedMealSections,
} from './constants';
import { TodayMealCard } from './parts/TodayMealCard';
import './TodayPage.scss';

type TodayPageProps = {
  totals: NutritionValues;
  entries: DayEntry[];
};

export function TodayPage({
  totals,
  entries,
}: TodayPageProps) {
  const mealGroups = buildMealEntryGroups(entries);
  const entryCount = entries.length;
  const [collapsedSections, setCollapsedSections] =
    useState<CollapsedMealSections>(() =>
      createCollapsedMealSections(mealGroups),
    );

  useEffect(() => {
    setCollapsedSections(createCollapsedMealSections(mealGroups));
  }, [entryCount]);

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
        <h2 className="today-screen__meals-title">Meals</h2>

        <div className="today-screen__meals">
          {MEAL_SECTIONS.map((section) => (
            <TodayMealCard
              key={section.id}
              section={section}
              entries={mealGroups[section.id]}
              isCollapsed={collapsedSections[section.id]}
              onToggle={toggleMealSection}
            />
          ))}
        </div>
      </div>
    </section>
  );
}
