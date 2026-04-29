import { type ReactNode, useEffect, useRef, useState } from "react";
import {
  addMonths,
  formatCalendarMonth,
  formatCalendarMonthYear,
  getDateKey,
  formatWeekdayLabel,
  getMonthDays,
  getWeekDays,
  isSameDay,
  isSameMonth,
  startOfDay,
  startOfMonth,
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

const monthWeekdayLabels = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];
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

function getPickerDayClassName(
  isSelected: boolean,
  isToday: boolean,
  isOutsideMonth: boolean,
) {
  return cn(
    styles["top-calendar__picker-day"],
    isSelected && styles["top-calendar__picker-day--selected"],
    !isSelected && isToday && styles["top-calendar__picker-day--today"],
    !isSelected &&
      !isToday &&
      isOutsideMonth &&
      styles["top-calendar__picker-day--outside"],
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
  const rootRef = useRef<HTMLElement | null>(null);
  const today = startOfDay(new Date());
  const weekDays = getWeekDays(selectedDate);
  const [isDatePickerOpen, setIsDatePickerOpen] = useState(false);
  const [visibleMonth, setVisibleMonth] = useState(() =>
    startOfMonth(selectedDate),
  );

  useEffect(() => {
    setVisibleMonth(startOfMonth(selectedDate));
  }, [selectedDate]);

  useEffect(() => {
    if (!isDatePickerOpen) {
      return;
    }

    function handlePointerDown(event: PointerEvent) {
      const target = event.target;

      if (!(target instanceof Node)) {
        return;
      }

      if (!rootRef.current?.contains(target)) {
        setIsDatePickerOpen(false);
      }
    }

    function handleKeyDown(event: KeyboardEvent) {
      if (event.key === "Escape") {
        setIsDatePickerOpen(false);
      }
    }

    document.addEventListener("pointerdown", handlePointerDown);
    document.addEventListener("keydown", handleKeyDown);

    return () => {
      document.removeEventListener("pointerdown", handlePointerDown);
      document.removeEventListener("keydown", handleKeyDown);
    };
  }, [isDatePickerOpen]);

  function toggleDatePicker() {
    if (!isDatePickerOpen) {
      setVisibleMonth(startOfMonth(selectedDate));
    }

    setIsDatePickerOpen(!isDatePickerOpen);
  }

  function handleSelectDay(day: Date) {
    onSelectDate(startOfDay(day));
    setIsDatePickerOpen(false);
  }

  function handleSelectToday() {
    onSelectDate(today);
    setVisibleMonth(startOfMonth(today));
    setIsDatePickerOpen(false);
  }

  function getIndicatorForDay(day: Date) {
    return dailyCalorieIndicators[getDateKey(day)] ?? defaultIndicator;
  }

  const monthDays = getMonthDays(visibleMonth);

  return (
    <header className={styles["top-calendar"]} ref={rootRef}>
      <div className={styles["top-calendar__header"]}>
        <button
          type="button"
          className={styles["top-calendar__month-button"]}
          aria-expanded={isDatePickerOpen}
          aria-haspopup="dialog"
          onClick={toggleDatePicker}
        >
          <span className={styles["top-calendar__month"]}>
            {formatCalendarMonth(selectedDate)}
          </span>
          <span
            className={cn(
              styles["top-calendar__month-chevron"],
              isDatePickerOpen && styles["top-calendar__month-chevron--open"],
            )}
            aria-hidden="true"
          >
            ▾
          </span>
        </button>

        <button
          type="button"
          className={styles["top-calendar__icon-button"]}
          aria-label={isDatePickerOpen ? "Close calendar" : "Open calendar"}
          aria-expanded={isDatePickerOpen}
          aria-haspopup="dialog"
          onClick={toggleDatePicker}
        >
          <svg
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="1.8"
            strokeLinecap="round"
            strokeLinejoin="round"
            aria-hidden="true"
          >
            <rect x="4" y="5" width="16" height="15" rx="3" />
            <path d="M8 3.5v3" />
            <path d="M16 3.5v3" />
            <path d="M4 9.5h16" />
          </svg>
        </button>
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

      {isDatePickerOpen && (
        <div
          className={styles["top-calendar__picker"]}
          role="dialog"
          aria-label="Calendar"
        >
          <div className={styles["top-calendar__picker-header"]}>
            <button
              type="button"
              className={styles["top-calendar__picker-nav"]}
              aria-label="Previous month"
              onClick={() => setVisibleMonth(addMonths(visibleMonth, -1))}
            >
              ‹
            </button>

            <p className={styles["top-calendar__picker-title"]}>
              {formatCalendarMonthYear(visibleMonth)}
            </p>

            <button
              type="button"
              className={styles["top-calendar__picker-nav"]}
              aria-label="Next month"
              onClick={() => setVisibleMonth(addMonths(visibleMonth, 1))}
            >
              ›
            </button>
          </div>

          <div
            className={styles["top-calendar__picker-weekdays"]}
            aria-hidden="true"
          >
            {monthWeekdayLabels.map((label) => (
              <span
                key={label}
                className={styles["top-calendar__picker-weekday"]}
              >
                {label}
              </span>
            ))}
          </div>

          <div className={styles["top-calendar__picker-grid"]}>
            {monthDays.map((day) => {
              const isSelected = isSameDay(day, selectedDate);
              const isToday = isSameDay(day, today);
              const isOutsideMonth = !isSameMonth(day, visibleMonth);
              const indicator = getIndicatorForDay(day);

              return (
                <button
                  key={day.getTime()}
                  type="button"
                  className={getPickerDayClassName(
                    isSelected,
                    isToday,
                    isOutsideMonth,
                  )}
                  onClick={() => handleSelectDay(day)}
                >
                  <DayProgressRing
                    indicator={indicator}
                    sizeClassName={styles["top-calendar__progress-ring--month"]}
                  >
                    <span className={styles["top-calendar__picker-day-number"]}>
                      {day.getDate()}
                    </span>
                  </DayProgressRing>
                </button>
              );
            })}
          </div>

          <div className={styles["top-calendar__picker-footer"]}>
            <button
              type="button"
              className={styles["top-calendar__picker-today"]}
              onClick={handleSelectToday}
            >
              Today
            </button>
          </div>
        </div>
      )}
    </header>
  );
}
