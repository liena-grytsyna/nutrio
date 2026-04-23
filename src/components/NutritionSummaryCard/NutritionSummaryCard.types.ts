import type { NutritionValues } from '../../types/nutrition';

export type NutritionSummaryCardProps = {
  totals: NutritionValues;
  targets: NutritionValues;
};

export type MacroNutrientKey = Exclude<keyof NutritionValues, 'calories'>;

type TrackedNutrientPanelItemConfig = {
  id: string;
  label: string;
  color: string;
  tracked: true;
  nutrientKey: MacroNutrientKey;
};

type UntrackedNutrientPanelItemConfig = {
  id: string;
  label: string;
  color: string;
  tracked: false;
  valueLabel: string;
  targetLabel: string;
};

export type NutrientPanelItemConfig =
  | TrackedNutrientPanelItemConfig
  | UntrackedNutrientPanelItemConfig;
