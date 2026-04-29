import { cn } from '../lib/cn';
import type {
  CalorieBalanceStatus,
  NutritionGoalSummary,
  NutritionValues,
} from '../types/nutrition';
import styles from './NutritionSummaryCard.module.scss';

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

type NutritionSummaryCardChartProps = {
  summary: NutritionGoalSummary;
};

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

type MacroRingProps = {
  color: string;
  progress: number;
  rotation: number;
};

type MiniRingProps = {
  color: string;
  progress: number;
  label: string;
  tracked?: boolean;
};

const OUTER_RADIUS = 46;
const OUTER_CIRCUMFERENCE = 2 * Math.PI * OUTER_RADIUS;
const CALORIE_RADIUS = 36;
const MINI_RING_RADIUS = 18;

const NUTRITION_SUMMARY_RING = {
  outerRadius: OUTER_RADIUS,
  outerCircumference: OUTER_CIRCUMFERENCE,
  outerArcWindow: OUTER_CIRCUMFERENCE * 0.18,
  calorieRadius: CALORIE_RADIUS,
  calorieCircumference: 2 * Math.PI * CALORIE_RADIUS,
  miniRingRadius: MINI_RING_RADIUS,
  miniRingCircumference: 2 * Math.PI * MINI_RING_RADIUS,
} as const;

const NUTRITION_SUMMARY_COLORS = {
  outerTrack: 'rgba(132, 141, 170, 0.12)',
  miniTrack: 'rgba(132, 141, 170, 0.14)',
  protein: '#bf6be5',
  fat: '#f4b248',
  carbs: '#4dc4ee',
  fiber: '#7cc58f',
  salt: '#96a0b4',
  sugar: '#f2a5c3',
} as const;

const CALORIE_RING_STYLES: Record<
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

const TRACKED_NUTRIENTS = [
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

const PENDING_NUTRIENTS = [
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

function getStrokeDasharray(filledLength: number, totalLength: number) {
  return `${filledLength} ${totalLength}`;
}

function formatGramValue(value: number) {
  return `${value.toFixed(0)} g`;
}

function MacroRing({ color, progress, rotation }: MacroRingProps) {
  return (
    <circle
      cx="48"
      cy="48"
      r={NUTRITION_SUMMARY_RING.outerRadius}
      fill="none"
      stroke={color}
      strokeWidth="5"
      strokeLinecap="round"
      strokeDasharray={getStrokeDasharray(
        NUTRITION_SUMMARY_RING.outerArcWindow * progress,
        NUTRITION_SUMMARY_RING.outerCircumference,
      )}
      transform={`rotate(${rotation} 48 48)`}
    />
  );
}

function MiniRing({
  color,
  progress,
  label,
  tracked = true,
}: MiniRingProps) {
  const clampedProgress = Math.min(Math.max(progress, 0), 1);

  return (
    <div className={styles['nutrition-summary-card__mini-ring']}>
      <svg
        viewBox="0 0 48 48"
        className={styles['nutrition-summary-card__mini-ring-svg']}
        aria-hidden="true"
      >
        <circle
          cx="24"
          cy="24"
          r={NUTRITION_SUMMARY_RING.miniRingRadius}
          fill="none"
          stroke={NUTRITION_SUMMARY_COLORS.miniTrack}
          strokeWidth="4"
        />
        {tracked && clampedProgress > 0 && (
          <circle
            cx="24"
            cy="24"
            r={NUTRITION_SUMMARY_RING.miniRingRadius}
            fill="none"
            stroke={color}
            strokeWidth="4"
            strokeLinecap="round"
            strokeDasharray={getStrokeDasharray(
              NUTRITION_SUMMARY_RING.miniRingCircumference * clampedProgress,
              NUTRITION_SUMMARY_RING.miniRingCircumference,
            )}
            transform="rotate(-90 24 24)"
          />
        )}
      </svg>
      <span className={styles['nutrition-summary-card__mini-ring-label']}>
        {label}
      </span>
    </div>
  );
}

function NutritionSummaryCardChart({
  summary,
}: NutritionSummaryCardChartProps) {
  const calorieProgressPercent = Math.round(summary.calorieProgressRatio * 100);
  const calorieRingStyle = CALORIE_RING_STYLES[summary.calorieStatus];

  return (
    <div className={styles['nutrition-summary-card__chart']}>
      <svg
        viewBox="0 0 96 96"
        className={styles['nutrition-summary-card__ring']}
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

      <div className={styles['nutrition-summary-card__center']}>
        <p className={styles['nutrition-summary-card__title']}>Calories</p>
        <p className={styles['nutrition-summary-card__value']}>
          {summary.consumed.calories.toFixed(0)}
        </p>
        <p className={styles['nutrition-summary-card__unit']}>kcal</p>
        <p className={styles['nutrition-summary-card__percent']}>
          {calorieProgressPercent}%
        </p>
      </div>
    </div>
  );
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
    <article className={styles['nutrition-summary-card__panel-item']}>
      <p className={styles['nutrition-summary-card__panel-item-label']}>
        {label}
      </p>
      <p className={styles['nutrition-summary-card__panel-item-value']}>
        {value}
      </p>
      <MiniRing
        color={color}
        progress={progress}
        tracked={tracked}
        label={ringLabel}
      />
      <p className={styles['nutrition-summary-card__panel-item-target']}>
        {target}
      </p>
    </article>
  );
}

function NutritionSummaryCardPanel({
  summary,
}: NutritionSummaryCardPanelProps) {
  return (
    <section
      className={styles['nutrition-summary-card__panel']}
      aria-label="Nutrients"
    >
      <div className={styles['nutrition-summary-card__panel-header']}>
        <h3 className={styles['nutrition-summary-card__panel-title']}>
          Nutrients
        </h3>
      </div>

      <div className={styles['nutrition-summary-card__panel-grid']}>
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

type NutritionSummaryCardProps = {
  summary: NutritionGoalSummary;
};

export function NutritionSummaryCard({
  summary,
}: NutritionSummaryCardProps) {
  const className = cn(
    styles['nutrition-summary-card'],
    styles[`nutrition-summary-card--${summary.calorieStatus}`],
  );

  return (
    <section className={className}>
      <div className={styles['nutrition-summary-card__header']}>
        <NutritionSummaryCardChart summary={summary} />
        <p className={styles['nutrition-summary-card__left']}>
          {summary.remaining.calories.toFixed(0)} kcal left
        </p>
      </div>

      <NutritionSummaryCardPanel summary={summary} />
    </section>
  );
}
