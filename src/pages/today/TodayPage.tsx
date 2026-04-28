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
  productsError?: string | null;
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
  productsError = null,
  products,
  totals,
  entries,
  onAddEntry,
}: TodayPageProps) {
  const mealGroups = buildMealEntryGroups(entries);
  const hasEntries = entries.length > 0;
  const [activeSectionId, setActiveSectionId] = useState<MealSectionId | null>(null);
  const [collapsedSections, setCollapsedSections] =
    useState<CollapsedMealSections>(() =>
      createCollapsedMealSections(mealGroups),
    );

  useEffect(() => {
    setCollapsedSections(createCollapsedMealSections(mealGroups));
  }, [entries]);

  function toggleMealSection(sectionId: MealSectionId) {
    setCollapsedSections((previousState) => ({
      ...previousState,
      [sectionId]: !previousState[sectionId],
    }));
  }

  const activeSection = MEAL_SECTIONS.find(
    (section) => section.id === activeSectionId,
  );

  return (
    <section className="screen today-screen">
      <NutritionSummaryCard totals={totals} targets={dailyTargets} />

      <div className="today-screen__meals-section">
        <h2 className="today-screen__meals-title">Meals</h2>
        {!hasEntries && (
          <p className="today-screen__meals-empty">
            No meals for this day yet. Use + to add a saved product.
          </p>
        )}

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

      {activeSection && (
        <TodayAddEntryDialog
          isLoadingProducts={isProductsLoading}
          productsError={productsError}
          products={products}
          section={activeSection}
          onClose={() => setActiveSectionId(null)}
          onSubmit={(productId, amount) =>
            onAddEntry(activeSection.id, productId, amount)
          }
        />
      )}
    </section>
  );
}
