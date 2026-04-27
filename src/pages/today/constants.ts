import {
  buildMealEntryGroups,
  type MealSectionId,
} from '../../features/nutrition';

export type MealSectionConfig = {
  id: MealSectionId;
  title: string;
  emptyHint: string;
};

export type CollapsedMealSections = Record<MealSectionId, boolean>;

type MealGroups = ReturnType<typeof buildMealEntryGroups>;

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
  mealGroups: MealGroups,
): CollapsedMealSections {
  return Object.fromEntries(
    MEAL_SECTIONS.map(({ id }) => [id, mealGroups[id].length === 0]),
  ) as CollapsedMealSections;
}
