import {
  NUTRITION_SUMMARY_COLORS,
  NUTRITION_SUMMARY_RING,
} from '../NutritionSummaryCard.constants';

type MacroRingProps = {
  color: string;
  progress: number;
  rotation: number;
};

type MiniRingProps = {
  color: string;
  progress: number;
  label: string;
  tracked: boolean;
};

export function MacroRing({ color, progress, rotation }: MacroRingProps) {
  return (
    <circle
      cx="48"
      cy="48"
      r={NUTRITION_SUMMARY_RING.outerRadius}
      fill="none"
      stroke={color}
      strokeWidth="5"
      strokeLinecap="round"
      strokeDasharray={`${NUTRITION_SUMMARY_RING.outerArcWindow * progress} ${NUTRITION_SUMMARY_RING.outerCircumference}`}
      transform={`rotate(${rotation} 48 48)`}
    />
  );
}

export function MiniRing({ color, progress, label, tracked }: MiniRingProps) {
  const clampedProgress = Math.min(Math.max(progress, 0), 1);

  return (
    <div className="nutrition-summary-card__mini-ring">
      <svg
        viewBox="0 0 48 48"
        className="nutrition-summary-card__mini-ring-svg"
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
            strokeDasharray={`${NUTRITION_SUMMARY_RING.miniRingCircumference * clampedProgress} ${NUTRITION_SUMMARY_RING.miniRingCircumference}`}
            transform="rotate(-90 24 24)"
          />
        )}
      </svg>
      <span className="nutrition-summary-card__mini-ring-label">{label}</span>
    </div>
  );
}
