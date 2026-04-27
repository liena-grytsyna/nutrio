import {
  getNutritionGoalSummary,
  type NutritionValues,
} from '../../features/nutrition';
import { NutritionSummaryCardChart } from './parts/NutritionSummaryCardChart';
import { NutritionSummaryCardPanel } from './parts/NutritionSummaryCardPanel';
import './NutritionSummaryCard.scss';

type NutritionSummaryCardProps = {
  totals: NutritionValues;
  targets: NutritionValues;
};

export function NutritionSummaryCard({
  totals,
  targets,
}: NutritionSummaryCardProps) {
  const summary = getNutritionGoalSummary(totals, targets);
  const className = `nutrition-summary-card nutrition-summary-card--${summary.calorieStatus}`;

  return (
    <section className={className}>
      <div className="nutrition-summary-card__header">
        <NutritionSummaryCardChart summary={summary} />
        <p className="nutrition-summary-card__left">
          {summary.remaining.calories.toFixed(0)} kcal left
        </p>
      </div>

      <NutritionSummaryCardPanel summary={summary} />
    </section>
  );
}
