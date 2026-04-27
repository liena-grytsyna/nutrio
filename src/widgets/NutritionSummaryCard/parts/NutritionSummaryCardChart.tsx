import type { NutritionGoalSummary } from '../../../features/nutrition';
import {
  CALORIE_RING_STYLES,
  NUTRITION_SUMMARY_COLORS,
  NUTRITION_SUMMARY_RING,
  TRACKED_NUTRIENTS,
} from '../NutritionSummaryCard.constants';
import { MacroRing } from './NutritionSummaryCardRings';

type NutritionSummaryCardChartProps = {
  summary: NutritionGoalSummary;
};

export function NutritionSummaryCardChart({
  summary,
}: NutritionSummaryCardChartProps) {
  const calorieProgressPercent = Math.round(summary.calorieProgressRatio * 100);
  const calorieRingStyle = CALORIE_RING_STYLES[summary.calorieStatus];

  return (
    <div className="nutrition-summary-card__chart">
      <svg
        viewBox="0 0 96 96"
        className="nutrition-summary-card__ring"
        role="img"
        aria-label="Nutrition progress"
      >
        <circle
          cx="48"
          cy="48"
          r={NUTRITION_SUMMARY_RING.outerRadius}
          fill="none"
          stroke={NUTRITION_SUMMARY_COLORS.outerTrack}
          strokeWidth="5"
        />

        {TRACKED_NUTRIENTS.map((nutrient) => (
          <MacroRing
            key={nutrient.key}
            color={nutrient.color}
            progress={summary.progress[nutrient.key]}
            rotation={nutrient.ringRotation}
          />
        ))}

        <circle
          cx="48"
          cy="48"
          r={NUTRITION_SUMMARY_RING.calorieRadius}
          fill="none"
          stroke={calorieRingStyle.track}
          strokeWidth="10"
        />
        <circle
          cx="48"
          cy="48"
          r={NUTRITION_SUMMARY_RING.calorieRadius}
          fill="none"
          stroke={calorieRingStyle.fill}
          strokeWidth="10"
          strokeLinecap="round"
          strokeDasharray={`${NUTRITION_SUMMARY_RING.calorieCircumference * summary.progress.calories} ${NUTRITION_SUMMARY_RING.calorieCircumference}`}
          transform="rotate(-90 48 48)"
        />
      </svg>

      <div className="nutrition-summary-card__center">
        <p className="nutrition-summary-card__title">Calories</p>
        <p className="nutrition-summary-card__value">
          {summary.consumed.calories.toFixed(0)}
        </p>
        <p className="nutrition-summary-card__unit">kcal</p>
        <p className="nutrition-summary-card__percent">
          {calorieProgressPercent}%
        </p>
      </div>
    </div>
  );
}
