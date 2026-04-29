import { useEffect, useState } from "react";
import { createDayEntry, fetchNutritionOverview } from "../api/nutrition";
import { getDateKey } from "../lib/date";
import { EMPTY_NUTRITION_OVERVIEW } from "../lib/emptyNutrition";
import { getMealSectionId } from "../lib/mealEntries";
import { MEAL_SECTION_HOURS } from "../lib/mealSections";
import type { MealSectionId, NutritionOverview } from "../types/nutrition";
import type { Product } from "../types/product";

type UseNutritionOverviewOptions = {
  products: Product[];
  selectedDate: Date;
};

function getErrorMessage(error: unknown, fallbackMessage: string) {
  return error instanceof Error ? error.message : fallbackMessage;
}

export function useNutritionOverview({
  products,
  selectedDate,
}: UseNutritionOverviewOptions) {
  const [nutritionOverview, setNutritionOverview] = useState<NutritionOverview>(
    EMPTY_NUTRITION_OVERVIEW,
  );
  const [entriesLoading, setEntriesLoading] = useState(true);
  const [entriesError, setEntriesError] = useState<string | null>(null);
  const selectedDateKey = getDateKey(selectedDate);
  const timezoneOffsetMinutes = selectedDate.getTimezoneOffset();
  const selectedDayOverview =
    nutritionOverview.days[selectedDateKey] ?? nutritionOverview.defaultDay;

  useEffect(() => {
    const controller = new AbortController();

    async function loadNutritionOverview() {
      setEntriesLoading(true);
      setEntriesError(null);

      try {
        const overview = await fetchNutritionOverview(
          timezoneOffsetMinutes,
          controller.signal,
        );
        setNutritionOverview(overview);
      } catch (error) {
        if (!controller.signal.aborted) {
          setEntriesError(getErrorMessage(error, "Meals could not be loaded."));
          setNutritionOverview(EMPTY_NUTRITION_OVERVIEW);
        }
      } finally {
        if (!controller.signal.aborted) {
          setEntriesLoading(false);
        }
      }
    }

    loadNutritionOverview();

    return () => controller.abort();
  }, [timezoneOffsetMinutes]);

  async function refreshNutritionOverview() {
    setEntriesLoading(true);

    try {
      const overview = await fetchNutritionOverview(timezoneOffsetMinutes);
      setNutritionOverview(overview);
      setEntriesError(null);
      return overview;
    } catch (error) {
      setEntriesError(getErrorMessage(error, "Meals could not be refreshed."));
      throw error;
    } finally {
      setEntriesLoading(false);
    }
  }

  async function handleAddEntry(
    sectionId: MealSectionId,
    productId: string,
    amount: number,
  ) {
    const product = products.find((item) => item.id === productId);

    if (!product) {
      throw new Error("Selected product was not found.");
    }

    const sameSectionCount = selectedDayOverview.entries.filter((entry) => {
      const eatenAt = new Date(entry.eatenAt);

      return getMealSectionId(eatenAt) === sectionId;
    }).length;

    const eatenAt = new Date(selectedDate);
    eatenAt.setHours(
      MEAL_SECTION_HOURS[sectionId],
      Math.min(sameSectionCount * 5, 55),
      0,
      0,
    );

    await createDayEntry({
      productId,
      amount,
      eatenAt: eatenAt.toISOString(),
    });

    await refreshNutritionOverview();
  }

  return {
    nutritionOverview,
    entriesLoading,
    entriesError,
    selectedDayOverview,
    refreshNutritionOverview,
    handleAddEntry,
  };
}
