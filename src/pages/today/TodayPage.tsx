import { useEffect, useState } from 'react';
import type { Product } from '../../features/products';
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
import { TodayAddEntryDialog } from './parts/TodayAddEntryDialog';
import { TodayMealCard } from './parts/TodayMealCard';
import './TodayPage.scss';

type TodayPageProps = {
  isProductsLoading: boolean;
  products: Product[];
  totals: NutritionValues;
  entries: DayEntry[];
  onAddEntry: (
    sectionId: MealSectionId,
    productId: string,
    amount: number,
  ) => Promise<void> | void;
};

export function TodayPage({
  isProductsLoading,
  products,
  totals,
  entries,
  onAddEntry,
}: TodayPageProps) {
  const mealGroups = buildMealEntryGroups(entries);
  const entryCount = entries.length;
  const [activeSectionId, setActiveSectionId] = useState<MealSectionId | null>(null);
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

  const activeSection =
    MEAL_SECTIONS.find((section) => section.id === activeSectionId) ?? null;

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
              onAdd={setActiveSectionId}
              onToggle={toggleMealSection}
            />
          ))}
        </div>
      </div>

      <TodayAddEntryDialog
        isLoadingProducts={isProductsLoading}
        isOpen={activeSection !== null}
        products={products}
        section={activeSection}
        onClose={() => setActiveSectionId(null)}
        onSubmit={(productId, amount) => {
          if (!activeSectionId) {
            return;
          }

          return onAddEntry(activeSectionId, productId, amount);
        }}
      />
    </section>
  );
}
