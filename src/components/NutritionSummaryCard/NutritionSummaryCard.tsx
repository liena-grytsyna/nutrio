import { getNutritionGoalSummary } from '../../logic/nutrition/getNutritionGoalSummary';
import { NutritionSummaryCardChart } from './NutritionSummaryCardChart';
import { NutritionSummaryCardPanel } from './NutritionSummaryCardPanel';
import type { NutritionSummaryCardProps } from './NutritionSummaryCard.types';
import './NutritionSummaryCard.scss';

export function NutritionSummaryCard({
  totals,
  targets,
}: NutritionSummaryCardProps) {
  const summary = getNutritionGoalSummary(totals, targets);

  return (
    <section
      className={`nutrition-summary-card nutrition-summary-card--${summary.calorieStatus}`}
    >
      <div className="nutrition-summary-card__header">

        <NutritionSummaryCardChart summary={summary} />

        <div className="nutrition-summary-card__main">
          <p className="nutrition-summary-card__left">
            {summary.remaining.calories.toFixed(0)} kcal left
          </p>
        </div>
      </div>

      <NutritionSummaryCardPanel summary={summary} />
    </section>
  );
}
