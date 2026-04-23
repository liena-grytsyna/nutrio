const weekDays = [
  { label: 'Mon', date: 15 },
  { label: 'Tue', date: 16 },
  { label: 'Wed', date: 17, isActive: true },
  { label: 'Thu', date: 18 },
  { label: 'Fri', date: 19 },
  { label: 'Sat', date: 20 },
  { label: 'Sun', date: 21 },
];

export function TopCalendar() {
  return (
    <header className="calendar-strip">
      <div className="calendar-strip__header">
        <div>
          <p className="calendar-strip__month">August</p>
        </div>

        <button
          type="button"
          className="calendar-strip__icon-button"
          aria-label="Open calendar"
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

      <div className="calendar-strip__grid" aria-label="Week overview">
        {weekDays.map((day) => (
          <button
            key={`${day.label}-${day.date}`}
            type="button"
            className={
              day.isActive
                ? 'calendar-strip__day calendar-strip__day--active'
                : 'calendar-strip__day'
            }
            aria-pressed={day.isActive === true}
          >
            <span className="calendar-strip__day-label">{day.label}</span>
            <span className="calendar-strip__day-number">{day.date}</span>
          </button>
        ))}
      </div>
    </header>
  );
}
