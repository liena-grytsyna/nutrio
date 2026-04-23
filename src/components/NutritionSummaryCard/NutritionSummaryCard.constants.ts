import type { CalorieBalanceStatus } from '../../types/nutrition';
import type {
  MacroNutrientKey,
  NutrientPanelItemConfig,
} from './NutritionSummaryCard.types';

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

export const MACRO_RING_CONFIG: Array<{
  nutrientKey: MacroNutrientKey;
  color: string;
  rotation: number;
}> = [
  {
    nutrientKey: 'protein',
    color: NUTRITION_SUMMARY_COLORS.protein,
    rotation: -142,
  },
  {
    nutrientKey: 'fat',
    color: NUTRITION_SUMMARY_COLORS.fat,
    rotation: 126,
  },
  {
    nutrientKey: 'carbs',
    color: NUTRITION_SUMMARY_COLORS.carbs,
    rotation: 16,
  },
];

export const NUTRIENT_PANEL_CONFIG: NutrientPanelItemConfig[] = [
  {
    id: 'protein',
    label: 'Protein',
    color: NUTRITION_SUMMARY_COLORS.protein,
    tracked: true,
    nutrientKey: 'protein',
  },
  {
    id: 'carbs',
    label: 'Carbs',
    color: NUTRITION_SUMMARY_COLORS.carbs,
    tracked: true,
    nutrientKey: 'carbs',
  },
  {
    id: 'fat',
    label: 'Fat',
    color: NUTRITION_SUMMARY_COLORS.fat,
    tracked: true,
    nutrientKey: 'fat',
  },
  {
    id: 'fiber',
    label: 'Fiber',
    color: NUTRITION_SUMMARY_COLORS.fiber,
    tracked: false,
    valueLabel: '0 g',
    targetLabel: 'Tracking later',
  },
  {
    id: 'salt',
    label: 'Salt',
    color: NUTRITION_SUMMARY_COLORS.salt,
    tracked: false,
    valueLabel: '--',
    targetLabel: 'Tracking later',
  },
  {
    id: 'sugar',
    label: 'Sugar',
    color: NUTRITION_SUMMARY_COLORS.sugar,
    tracked: false,
    valueLabel: '--',
    targetLabel: 'Tracking later',
  },
];
