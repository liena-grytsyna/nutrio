import type { NutritionGoalSummary } from '../../logic/nutrition/nutritionSummary.types';
import { NUTRIENT_PANEL_CONFIG } from './NutritionSummaryCard.constants';
import { MiniRing } from './NutritionSummaryCardRings';

type NutritionSummaryCardPanelProps = {
  summary: NutritionGoalSummary;
};

function formatGramValue(value: number) {
  return `${value.toFixed(0)} g`;
}

export function NutritionSummaryCardPanel({
  summary,
}: NutritionSummaryCardPanelProps) {
  return (
    <section className="nutrition-summary-card__panel" aria-label="Nutrients">
      <div className="nutrition-summary-card__panel-header">
        <h3 className="nutrition-summary-card__panel-title">Nutrients</h3>
      </div>

      <div className="nutrition-summary-card__panel-grid">
        {NUTRIENT_PANEL_CONFIG.map((item) => {
          if (item.tracked) {
            const consumedValue = summary.consumed[item.nutrientKey];
            const targetValue = summary.target[item.nutrientKey];
            const progressValue = summary.progress[item.nutrientKey];

            return (
              <article
                key={item.id}
                className="nutrition-summary-card__panel-item"
              >
                <p className="nutrition-summary-card__panel-item-label">
                  {item.label}
                </p>
                <p className="nutrition-summary-card__panel-item-value">
                  {formatGramValue(consumedValue)}
                </p>
                <MiniRing
                  color={item.color}
                  progress={progressValue}
                  tracked
                  label={`${Math.round(progressValue * 100)}%`}
                />
                <p className="nutrition-summary-card__panel-item-target">
                  {formatGramValue(targetValue)} goal
                </p>
              </article>
            );
          }

          return (
            <article key={item.id} className="nutrition-summary-card__panel-item">
              <p className="nutrition-summary-card__panel-item-label">
                {item.label}
              </p>
              <p className="nutrition-summary-card__panel-item-value">
                {item.valueLabel}
              </p>
              <MiniRing
                color={item.color}
                progress={0}
                tracked={false}
                label="Later"
              />
              <p className="nutrition-summary-card__panel-item-target">
                {item.targetLabel}
              </p>
            </article>
          );
        })}
      </div>
    </section>
  );
}
