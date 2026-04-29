import type { DayEntry, MealSectionId } from "../types/nutrition";

type MealEntryGroups = Record<MealSectionId, DayEntry[]>;

export function createEmptyMealGroups(): MealEntryGroups {
  return {
    breakfast: [],
    snack: [],
    lunch: [],
    secondSnack: [],
    dinner: [],
    thirdSnack: [],
  };
}

export function getMealSectionId(date: Date): MealSectionId {
  const hour = date.getHours();

  if (hour < 5) return "thirdSnack";
  if (hour < 10) return "breakfast";
  if (hour < 12) return "snack";
  if (hour < 15) return "lunch";
  if (hour < 17) return "secondSnack";
  if (hour < 21) return "dinner";
  return "thirdSnack";
}

export function buildMealEntryGroups(entries: DayEntry[]): MealEntryGroups {
  const groups = createEmptyMealGroups();

  [...entries]
    .sort(
      (a, b) => new Date(a.eatenAt).getTime() - new Date(b.eatenAt).getTime(),
    )
    .forEach((entry) => {
      groups[getMealSectionId(new Date(entry.eatenAt))].push(entry);
    });

  return groups;
}
