import type { NutritionValues } from '../../types/nutrition';

type TodayScreenProps = {
  totals: NutritionValues;
};

export function TodayScreen({ totals }: TodayScreenProps) {
  return (
    <section className="screen">
      <div className="card">
        <h2>Сегодня</h2>
        <p className="hint">
          Здесь позже будет список съеденных продуктов за день и кнопка быстрого
          добавления.
        </p>
      </div>

      <div className="stats-grid">
        <article className="stat">
          <p className="stat-label">Калории</p>
          <p className="stat-value">{totals.calories.toFixed(0)} ккал</p>
        </article>

        <article className="stat">
          <p className="stat-label">Белки</p>
          <p className="stat-value">{totals.protein.toFixed(1)} г</p>
        </article>

        <article className="stat">
          <p className="stat-label">Жиры</p>
          <p className="stat-value">{totals.fat.toFixed(1)} г</p>
        </article>

        <article className="stat">
          <p className="stat-label">Углеводы</p>
          <p className="stat-value">{totals.carbs.toFixed(1)} г</p>
        </article>
      </div>
    </section>
  );
}
