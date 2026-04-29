import type { DayEntry, MealSectionId } from '../types/nutrition';

export type MealSectionConfig = {
  id: MealSectionId;
  title: string;
  emptyHint: string;
};

export type CollapsedMealSections = Record<MealSectionId, boolean>;

type MealEntryGroups = Record<MealSectionId, DayEntry[]>;

export const MEAL_SECTION_HOURS: Record<MealSectionId, number> = {
  breakfast: 8,
  snack: 10,
  lunch: 13,
  secondSnack: 16,
  dinner: 19,
  thirdSnack: 22,
};

export const MEAL_SECTIONS = [
  { id: 'breakfast', title: 'Breakfast', emptyHint: 'Add your first meal' },
  { id: 'snack', title: 'Snack', emptyHint: 'Add a snack' },
  { id: 'lunch', title: 'Lunch', emptyHint: 'Add your lunch' },
  { id: 'secondSnack', title: 'Second Snack', emptyHint: 'Add another snack' },
  { id: 'dinner', title: 'Dinner', emptyHint: 'Add your dinner' },
  { id: 'thirdSnack', title: 'Third Snack', emptyHint: 'Add a late snack' },
] as const satisfies ReadonlyArray<MealSectionConfig>;

export const TIME_FORMATTER = new Intl.DateTimeFormat('en-GB', {
  hour: '2-digit',
  minute: '2-digit',
});

export function createCollapsedMealSections(
  groups: MealEntryGroups,
): CollapsedMealSections {
  const result = {} as CollapsedMealSections;

  for (const { id } of MEAL_SECTIONS) {
    result[id] = groups[id].length === 0;
  }

  return result;
}
