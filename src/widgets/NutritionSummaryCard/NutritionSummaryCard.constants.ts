import type { CalorieBalanceStatus, NutritionValues } from '../../features/nutrition';

type MacroNutrientKey = keyof Omit<NutritionValues, 'calories'>;

type TrackedNutrientConfig = {
  key: MacroNutrientKey;
  label: string;
  color: string;
  ringRotation: number;
};

type PendingNutrientConfig = {
  id: string;
  label: string;
  color: string;
  valueLabel: string;
  targetLabel: string;
};

const OUTER_RADIUS = 46;
const OUTER_CIRCUMFERENCE = 2 * Math.PI * OUTER_RADIUS;
const CALORIE_RADIUS = 36;
const MINI_RING_RADIUS = 18;

export const NUTRITION_SUMMARY_RING = {
  outerRadius: OUTER_RADIUS,
  outerCircumference: OUTER_CIRCUMFERENCE,
  outerArcWindow: OUTER_CIRCUMFERENCE * 0.18,
  calorieRadius: CALORIE_RADIUS,
  calorieCircumference: 2 * Math.PI * CALORIE_RADIUS,
  miniRingRadius: MINI_RING_RADIUS,
  miniRingCircumference: 2 * Math.PI * MINI_RING_RADIUS,
} as const;

export const NUTRITION_SUMMARY_COLORS = {
  outerTrack: 'rgba(132, 141, 170, 0.12)',
  miniTrack: 'rgba(132, 141, 170, 0.14)',
  protein: '#bf6be5',
  fat: '#f4b248',
  carbs: '#4dc4ee',
  fiber: '#7cc58f',
  salt: '#96a0b4',
  sugar: '#f2a5c3',
} as const;

export const CALORIE_RING_STYLES: Record<
  CalorieBalanceStatus,
  { fill: string; track: string }
> = {
  under: {
    fill: '#f3b649',
    track: 'rgba(243, 182, 73, 0.14)',
  },
  ideal: {
    fill: '#53c57a',
    track: 'rgba(83, 197, 122, 0.14)',
  },
  over: {
    fill: '#e8695f',
    track: 'rgba(232, 105, 95, 0.14)',
  },
};

export const TRACKED_NUTRIENTS = [
  {
    key: 'protein',
    label: 'Protein',
    color: NUTRITION_SUMMARY_COLORS.protein,
    ringRotation: -142,
  },
  {
    key: 'carbs',
    label: 'Carbs',
    color: NUTRITION_SUMMARY_COLORS.carbs,
    ringRotation: 16,
  },
  {
    key: 'fat',
    label: 'Fat',
    color: NUTRITION_SUMMARY_COLORS.fat,
    ringRotation: 126,
  },
] as const satisfies ReadonlyArray<TrackedNutrientConfig>;

export const PENDING_NUTRIENTS = [
  {
    id: 'fiber',
    label: 'Fiber',
    color: NUTRITION_SUMMARY_COLORS.fiber,
    valueLabel: '0 g',
    targetLabel: 'Tracking later',
  },
  {
    id: 'salt',
    label: 'Salt',
    color: NUTRITION_SUMMARY_COLORS.salt,
    valueLabel: '--',
    targetLabel: 'Tracking later',
  },
  {
    id: 'sugar',
    label: 'Sugar',
    color: NUTRITION_SUMMARY_COLORS.sugar,
    valueLabel: '--',
    targetLabel: 'Tracking later',
  },
] as const satisfies ReadonlyArray<PendingNutrientConfig>;
