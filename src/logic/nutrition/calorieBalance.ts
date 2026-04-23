import type { CalorieBalanceStatus } from '../../types/nutrition';

export const IDEAL_MIN_PROGRESS = 0.95;
export const IDEAL_MAX_PROGRESS = 1.05;

export function getCalorieProgressRatio(value: number, target: number) {
  if (target <= 0) {
    return 0;
  }

  return Math.max(value / target, 0);
}

export function getClampedProgress(progress: number) {
  return Math.min(progress, 1);
}

export function getCalorieBalanceStatus(progress: number): CalorieBalanceStatus {
  if (progress > IDEAL_MAX_PROGRESS) {
    return 'over';
  }

  if (progress >= IDEAL_MIN_PROGRESS) {
    return 'ideal';
  }

  return 'under';
}
