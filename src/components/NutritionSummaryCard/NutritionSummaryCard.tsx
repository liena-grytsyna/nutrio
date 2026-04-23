import { getNutritionGoalSummary } from '../../logic/nutrition/getNutritionGoalSummary';
import type { NutritionValues } from '../../types/nutrition';
import './NutritionSummaryCard.scss';

type NutritionSummaryCardProps = {
  totals: NutritionValues;
  targets: NutritionValues;
};

type MacroRingProps = {
  color: string;
  progress: number;
  rotation: number;
};

const OUTER_RADIUS = 39;
const OUTER_CIRCUMFERENCE = 2 * Math.PI * OUTER_RADIUS;
const ARC_WINDOW = OUTER_CIRCUMFERENCE * 0.18;
const CALORIE_RADIUS = 26;
const CALORIE_CIRCUMFERENCE = 2 * Math.PI * CALORIE_RADIUS;

function MacroRing({ color, progress, rotation }: MacroRingProps) {
  return (
    <circle
      cx="48"
      cy="48"
      r={OUTER_RADIUS}
      fill="none"
      stroke={color}
      strokeWidth="5"
      strokeLinecap="round"
      strokeDasharray={`${ARC_WINDOW * progress} ${OUTER_CIRCUMFERENCE}`}
      transform={`rotate(${rotation} 48 48)`}
    />
  );
}

export function NutritionSummaryCard({
  totals,
  targets,
}: NutritionSummaryCardProps) {
  const summary = getNutritionGoalSummary(totals, targets);

  return (
    <section className="nutrition-summary-card">
      <div className="nutrition-summary-card__header">
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
              r={OUTER_RADIUS}
              fill="none"
              stroke="rgba(132, 141, 170, 0.12)"
              strokeWidth="5"
            />
            <MacroRing
              color="#f4b248"
              progress={summary.progress.protein}
              rotation={-142}
            />
            <MacroRing
              color="#bf6be5"
              progress={summary.progress.fat}
              rotation={126}
            />
            <MacroRing
              color="#4dc4ee"
              progress={summary.progress.carbs}
              rotation={16}
            />

            <circle
              cx="48"
              cy="48"
              r={CALORIE_RADIUS}
              fill="none"
              stroke="rgba(93, 203, 129, 0.14)"
              strokeWidth="10"
            />
            <circle
              cx="48"
              cy="48"
              r={CALORIE_RADIUS}
              fill="none"
              stroke="#52d082"
              strokeWidth="10"
              strokeLinecap="round"
              strokeDasharray={`${CALORIE_CIRCUMFERENCE * summary.progress.calories} ${CALORIE_CIRCUMFERENCE}`}
              transform="rotate(-90 48 48)"
            />
          </svg>
        </div>

        <div className="nutrition-summary-card__main">
          <p className="nutrition-summary-card__title">Calories</p>
          <p className="nutrition-summary-card__value">
            {summary.consumed.calories.toFixed(0)} kcal
          </p>
          <p className="nutrition-summary-card__left">
            {summary.remaining.calories.toFixed(0)} kcal left
          </p>
        </div>

        <button
          type="button"
          className="nutrition-summary-card__info"
          aria-label="Nutrition details"
        >
          i
        </button>
      </div>

      <div className="nutrition-summary-card__macros">
        <article className="nutrition-summary-card__macro">
          <p className="nutrition-summary-card__macro-label nutrition-summary-card__macro-label--protein">
            Protein
          </p>
          <p className="nutrition-summary-card__macro-value">
            {summary.consumed.protein.toFixed(0)} g
          </p>
          <p className="nutrition-summary-card__macro-left">
            {summary.remaining.protein.toFixed(0)} g left
          </p>
        </article>

        <article className="nutrition-summary-card__macro">
          <p className="nutrition-summary-card__macro-label nutrition-summary-card__macro-label--fat">
            Fat
          </p>
          <p className="nutrition-summary-card__macro-value">
            {summary.consumed.fat.toFixed(0)} g
          </p>
          <p className="nutrition-summary-card__macro-left">
            {summary.remaining.fat.toFixed(0)} g left
          </p>
        </article>

        <article className="nutrition-summary-card__macro">
          <p className="nutrition-summary-card__macro-label nutrition-summary-card__macro-label--carbs">
            Carbs
          </p>
          <p className="nutrition-summary-card__macro-value">
            {summary.consumed.carbs.toFixed(0)} g
          </p>
          <p className="nutrition-summary-card__macro-left">
            {summary.remaining.carbs.toFixed(0)} g left
          </p>
        </article>
      </div>
    </section>
  );
}
