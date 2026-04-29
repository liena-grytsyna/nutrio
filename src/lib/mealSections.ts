import type { DayEntry, MealSectionId } from '../types/nutrition';

export type MealSectionConfig = {
  id: MealSectionId;
  title: string;
  emptyHint: string;
};

export type CollapsedMealSections = Record<MealSectionId, boolean>;

type MealEntryGroups = Record<MealSectionId, DayEntry[]>;

export const MEAL_SECTIONS = [
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
] as const satisfies ReadonlyArray<MealSectionConfig>;

export const TIME_FORMATTER = new Intl.DateTimeFormat('en-GB', {
  hour: '2-digit',
  minute: '2-digit',
});

export function createCollapsedMealSections(
  mealGroups: MealEntryGroups,
): CollapsedMealSections {
  const collapsedSections = {} as CollapsedMealSections;

  for (const { id } of MEAL_SECTIONS) {
    collapsedSections[id] = mealGroups[id].length === 0;
  }

  return collapsedSections;
}
