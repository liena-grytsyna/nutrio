import { cn } from "../lib/cn";
import type { NutritionGoalSummary, NutritionValues } from "../types/nutrition";
import styles from "./NutritionSummaryCard.module.scss";

type MacroNutrientKey = keyof Omit<NutritionValues, "calories">;

type TrackedNutrientConfig = {
  key: MacroNutrientKey;
  label: string;
};

const TRACKED_NUTRIENTS = [
  { key: "protein", label: "Protein" },
  { key: "fat", label: "Fat" },
  { key: "carbs", label: "Carbs" },
] as const satisfies ReadonlyArray<TrackedNutrientConfig>;

type NutritionSummaryCardProps = {
  summary: NutritionGoalSummary;
};

function formatGramValue(value: number) {
  return `${value.toFixed(0)} g`;
}

export function NutritionSummaryCard({ summary }: NutritionSummaryCardProps) {
  const className = cn(
    styles["nutrition-summary-card"],
    styles[`nutrition-summary-card--${summary.calorieStatus}`],
  );
  const calorieProgressPercent = Math.round(summary.calorieProgressRatio * 100);
  const calorieProgressWidth = `${Math.min(summary.progress.calories, 1) * 100}%`;

  return (
    <section className={className}>
      <div className={styles["nutrition-summary-card__header"]}>
        <div className={styles["nutrition-summary-card__chart"]}>
          <div className={styles["nutrition-summary-card__center"]}>
            <p className={styles["nutrition-summary-card__title"]}>Calories</p>
            <p className={styles["nutrition-summary-card__value"]}>
              {summary.consumed.calories.toFixed(0)}
            </p>
            <p className={styles["nutrition-summary-card__unit"]}>kcal</p>
            <p className={styles["nutrition-summary-card__percent"]}>
              {calorieProgressPercent}%
            </p>
            <div
              className={styles["nutrition-summary-card__progress"]}
              aria-hidden="true"
            >
              <span
                className={styles["nutrition-summary-card__progress-fill"]}
                style={{ width: calorieProgressWidth }}
              />
            </div>
            <p className={styles["nutrition-summary-card__left"]}>
              {summary.remaining.calories.toFixed(0)} kcal left
            </p>
          </div>
        </div>
      </div>

      <section
        className={styles["nutrition-summary-card__panel"]}
        aria-label="Nutrients"
      >
        <div className={styles["nutrition-summary-card__panel-header"]}>
          <h3 className={styles["nutrition-summary-card__panel-title"]}>
            Nutrients
          </h3>
        </div>

        <div className={styles["nutrition-summary-card__panel-grid"]}>
          {TRACKED_NUTRIENTS.map((nutrient) => (
            <article
              key={nutrient.key}
              className={styles["nutrition-summary-card__panel-item"]}
            >
              <p className={styles["nutrition-summary-card__panel-item-label"]}>
                {nutrient.label}
              </p>
              <p className={styles["nutrition-summary-card__panel-item-value"]}>
                {formatGramValue(summary.consumed[nutrient.key])}
              </p>
              <p
                className={styles["nutrition-summary-card__panel-item-target"]}
              >
                {formatGramValue(summary.target[nutrient.key])} goal
              </p>
            </article>
          ))}
        </div>
      </section>
    </section>
  );
}
