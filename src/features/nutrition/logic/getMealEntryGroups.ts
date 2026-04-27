import type { DayEntry } from '../types';

export type MealSectionId =
  | 'breakfast'
  | 'snack'
  | 'lunch'
  | 'secondSnack'
  | 'dinner'
  | 'thirdSnack';

type MealEntryGroups = Record<MealSectionId, DayEntry[]>;

export function getMealSectionId(date: Date): MealSectionId {
  const hour = date.getHours();

  if (hour >= 5 && hour < 10) {
    return 'breakfast';
  }

  if (hour < 12) {
    return 'snack';
  }

  if (hour < 15) {
    return 'lunch';
  }

  if (hour < 17) {
    return 'secondSnack';
  }

  if (hour < 21) {
    return 'dinner';
  }

  return 'thirdSnack';
}

export function buildMealEntryGroups(entries: DayEntry[]): MealEntryGroups {
  const groups: MealEntryGroups = {
    breakfast: [],
    snack: [],
    lunch: [],
    secondSnack: [],
    dinner: [],
    thirdSnack: [],
  };

  entries
    .slice()
    .sort(
      (left, right) =>
        new Date(left.eatenAt).getTime() - new Date(right.eatenAt).getTime(),
    )
    .forEach((entry) => {
      groups[getMealSectionId(new Date(entry.eatenAt))].push(entry);
    });

  return groups;
}
