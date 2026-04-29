import type { ReactNode } from "react";
import {
  formatCalendarMonth,
  getDateKey,
  formatWeekdayLabel,
  getWeekDays,
  isSameDay,
  startOfDay,
} from "../lib/date";
import { cn } from "../lib/cn";
import type { DayCalorieIndicator } from "../types/nutrition";
import styles from "./TopCalendar.module.scss";

type TopCalendarProps = {
  dailyCalorieIndicators: Record<string, DayCalorieIndicator>;
  defaultIndicator: DayCalorieIndicator;
  selectedDate: Date;
  onSelectDate: (date: Date) => void;
};

const RING_RADIUS = 15;
const RING_CIRCUMFERENCE = 2 * Math.PI * RING_RADIUS;

type DayProgressRingProps = {
  children: ReactNode;
  indicator: DayCalorieIndicator;
  sizeClassName: string;
};

function getWeekDayClassName(isSelected: boolean, isToday: boolean) {
  return cn(
    styles["top-calendar__day"],
    isSelected && styles["top-calendar__day--active"],
    !isSelected && isToday && styles["top-calendar__day--today"],
  );
}

function DayProgressRing({
  children,
  indicator,
  sizeClassName,
}: DayProgressRingProps) {
  const dashOffset = RING_CIRCUMFERENCE * (1 - indicator.progress);

  return (
    <span
      className={cn(
        styles["top-calendar__progress-ring"],
        sizeClassName,
        styles[`top-calendar__progress-ring--${indicator.status}`],
      )}
    >
      <svg
        viewBox="0 0 36 36"
        className={styles["top-calendar__progress-ring-svg"]}
        aria-hidden="true"
      >
        <circle
          cx="18"
          cy="18"
          r={RING_RADIUS}
          className={styles["top-calendar__progress-ring-track"]}
        />
        <circle
          cx="18"
          cy="18"
          r={RING_RADIUS}
          className={styles["top-calendar__progress-ring-fill"]}
          strokeDasharray={RING_CIRCUMFERENCE}
          strokeDashoffset={dashOffset}
        />
      </svg>
      <span className={styles["top-calendar__progress-ring-content"]}>
        {children}
      </span>
    </span>
  );
}

export function TopCalendar({
  dailyCalorieIndicators,
  defaultIndicator,
  selectedDate,
  onSelectDate,
}: TopCalendarProps) {
  const today = startOfDay(new Date());
  const weekDays = getWeekDays(selectedDate);

  function getIndicatorForDay(day: Date) {
    return dailyCalorieIndicators[getDateKey(day)] ?? defaultIndicator;
  }

  return (
    <header className={styles["top-calendar"]}>
      <div className={styles["top-calendar__header"]}>
        <p className={styles["top-calendar__month"]}>
          {formatCalendarMonth(selectedDate)}
        </p>
      </div>

      <div className={styles["top-calendar__grid"]} aria-label="Week overview">
        {weekDays.map((day) => {
          const isSelected = isSameDay(day, selectedDate);
          const isToday = isSameDay(day, today);
          const indicator = getIndicatorForDay(day);

          return (
            <button
              key={day.toISOString()}
              type="button"
              className={getWeekDayClassName(isSelected, isToday)}
              aria-pressed={isSelected}
              onClick={() => onSelectDate(day)}
            >
              <span className={styles["top-calendar__day-label"]}>
                {formatWeekdayLabel(day)}
              </span>
              <DayProgressRing
                indicator={indicator}
                sizeClassName={styles["top-calendar__progress-ring--week"]}
              >
                <span className={styles["top-calendar__day-number"]}>
                  {day.getDate()}
                </span>
              </DayProgressRing>
            </button>
          );
        })}
      </div>
    </header>
  );
}
