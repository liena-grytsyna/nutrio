import type { NutritionValues } from '../../nutrition/types';

function extractNumber(pattern: RegExp, text: string) {
  const match = text.match(pattern);
  if (!match) {
    return null;
  }

  return Number(match[1].replace(',', '.'));
}

export function extractNutritionFromText(text: string): NutritionValues {
  return {
    calories: extractNumber(/(?:ккал|kcal)[^\d]{0,8}(\d+[.,]?\d*)/i, text) ?? 0,
    protein: extractNumber(/(?:белки|protein)[^\d]{0,8}(\d+[.,]?\d*)/i, text) ?? 0,
    fat: extractNumber(/(?:жиры|fat)[^\d]{0,8}(\d+[.,]?\d*)/i, text) ?? 0,
    carbs:
      extractNumber(
        /(?:углеводы|carbohydrates|carbs)[^\d]{0,8}(\d+[.,]?\d*)/i,
        text,
      ) ?? 0,
  };
}
