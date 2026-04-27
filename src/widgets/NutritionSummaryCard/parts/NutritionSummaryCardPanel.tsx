import type { NutritionGoalSummary } from '../../../features/nutrition';
import {
  PENDING_NUTRIENTS,
  TRACKED_NUTRIENTS,
} from '../NutritionSummaryCard.constants';
import { MiniRing } from './NutritionSummaryCardRings';

type NutritionSummaryCardPanelProps = {
  summary: NutritionGoalSummary;
};

type NutritionPanelItemProps = {
  color: string;
  label: string;
  progress: number;
  ringLabel: string;
  target: string;
  tracked?: boolean;
  value: string;
};

function formatGramValue(value: number) {
  return `${value.toFixed(0)} g`;
}

function NutritionPanelItem({
  color,
  label,
  progress,
  ringLabel,
  target,
  tracked = true,
  value,
}: NutritionPanelItemProps) {
  return (
    <article className="nutrition-summary-card__panel-item">
      <p className="nutrition-summary-card__panel-item-label">{label}</p>
      <p className="nutrition-summary-card__panel-item-value">{value}</p>
      <MiniRing
        color={color}
        progress={progress}
        tracked={tracked}
        label={ringLabel}
      />
      <p className="nutrition-summary-card__panel-item-target">{target}</p>
    </article>
  );
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
        {TRACKED_NUTRIENTS.map((nutrient) => {
          const progress = summary.progress[nutrient.key];

          return (
            <NutritionPanelItem
              key={nutrient.key}
              color={nutrient.color}
              label={nutrient.label}
              progress={progress}
              ringLabel={`${Math.round(progress * 100)}%`}
              target={`${formatGramValue(summary.target[nutrient.key])} goal`}
              value={formatGramValue(summary.consumed[nutrient.key])}
            />
          );
        })}

        {PENDING_NUTRIENTS.map((nutrient) => (
          <NutritionPanelItem
            key={nutrient.id}
            color={nutrient.color}
            label={nutrient.label}
            progress={0}
            ringLabel="Later"
            target={nutrient.targetLabel}
            tracked={false}
            value={nutrient.valueLabel}
          />
        ))}
      </div>
    </section>
  );
}
