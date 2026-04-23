import { NutritionSummaryCard } from '../../components';
import { dailyTargets } from '../../data/dailyTargets';
import { formatLongDate, isSameDay } from '../../logic/date/calendar';
import type { NutritionValues } from '../../types/nutrition';
import './TodayScreen.scss';

type TodayScreenProps = {
  totals: NutritionValues;
  selectedDate: Date;
  entryCount: number;
};

function getMealLabel(count: number) {
  const normalizedCount = count % 100;

  if (normalizedCount >= 11 && normalizedCount <= 14) {
    return 'приемов пищи';
  }

  const lastDigit = count % 10;

  if (lastDigit === 1) {
    return 'прием пищи';
  }

  if (lastDigit >= 2 && lastDigit <= 4) {
    return 'приема пищи';
  }

  return 'приемов пищи';
}

export function TodayScreen({
  totals,
  selectedDate,
  entryCount,
}: TodayScreenProps) {
  const isToday = isSameDay(selectedDate, new Date());

  return (
    <section className="screen today-screen">
      <NutritionSummaryCard totals={totals} targets={dailyTargets} />

      <div className="today-screen__note">
        <h2 className="today-screen__title">
          {isToday ? 'Сегодня' : formatLongDate(selectedDate)}
        </h2>
        <p className="today-screen__hint">
          {entryCount > 0
            ? `За выбранную дату найдено ${entryCount} ${getMealLabel(entryCount)}.`
            : 'За выбранную дату пока нет добавленных продуктов.'}
        </p>
        <p className="today-screen__meta">
          Календарь сверху уже рабочий: нажми на день, и дневной итог сразу
          пересчитается для этой даты.
        </p>
      </div>
    </section>
  );
}
