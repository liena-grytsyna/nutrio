import { useEffect, useState } from "react";
import { NutritionSummaryCard } from "../components/NutritionSummaryCard";
import { buildMealEntryGroups } from "../lib/mealEntries";
import {
  createCollapsedMealSections,
  MEAL_SECTIONS,
  type CollapsedMealSections,
} from "../lib/mealSections";
import type {
  DayEntry,
  MealSectionId,
  NutritionGoalSummary,
} from "../types/nutrition";
import type { Product } from "../types/product";
import { TodayAddEntryDialog } from "../components/TodayAddEntryDialog";
import { TodayMealCard } from "../components/TodayMealCard";
import { cn } from "../lib/cn";
import styles from "./TodayPage.module.scss";

// Props for the TodayPage component
type TodayPageProps = {
  entriesError?: string | null;
  isEntriesLoading?: boolean;
  isProductsLoading: boolean;
  productsError?: string | null;
  products: Product[];
  summary: NutritionGoalSummary;
  entries: DayEntry[];
  onAddEntry: (
    sectionId: MealSectionId,
    productId: string,
    amount: number,
  ) => Promise<void> | void;
  onDeleteEntry: (entryId: string) => Promise<void> | void;
};

// Main screen for today's meals and nutrition summary
export function TodayPage({
  entriesError = null,
  isEntriesLoading = false,
  isProductsLoading,
  productsError = null,
  products,
  summary,
  entries,
  onAddEntry,
  onDeleteEntry,
}: TodayPageProps) {
  const mealGroups = buildMealEntryGroups(entries);
  const hasEntries = entries.length > 0;
  const canAddEntries = !isEntriesLoading && !entriesError;
  const [activeSectionId, setActiveSectionId] = useState<MealSectionId | null>(
    null,
  );
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
    <section className={cn("screen", styles["today-screen"])}>
      <NutritionSummaryCard summary={summary} />

      <div className={styles["today-screen__meals-section"]}>
        <h2 className={styles["today-screen__meals-title"]}>Meals</h2>
        {isEntriesLoading ? (
          <p className={styles["today-screen__status"]}>Loading meals...</p>
        ) : entriesError ? (
          <p className={styles["today-screen__status"]}>{entriesError}</p>
        ) : (
          !hasEntries && (
            <p className={styles["today-screen__meals-empty"]}>
              No meals for this day yet. Use + to add a saved product.
            </p>
          )
        )}

        <div className={styles["today-screen__meals"]}>
          {MEAL_SECTIONS.map((section) => (
            <TodayMealCard
              key={section.id}
              canAdd={canAddEntries}
              section={section}
              entries={mealGroups[section.id]}
              isCollapsed={collapsedSections[section.id]}
              onAdd={setActiveSectionId}
              onToggle={toggleMealSection}
              onDeleteEntry={onDeleteEntry}
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
