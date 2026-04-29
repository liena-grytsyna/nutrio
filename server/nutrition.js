export const DAILY_TARGETS = {
  calories: 1600,
  protein: 120,
  fat: 53,
  carbs: 160,
};

const IDEAL_MIN_PROGRESS = 0.95;
const IDEAL_MAX_PROGRESS = 1.05;
const ZERO_NUTRITION = {
  calories: 0,
  protein: 0,
  fat: 0,
  carbs: 0,
};

function roundNutritionValue(value) {
  return Math.round(value * 10) / 10;
}

export function getProductNutritionForAmount(product, amount) {
  const amountRatio = amount / 100;

  return {
    calories: roundNutritionValue(product.calories * amountRatio),
    protein: roundNutritionValue(product.protein * amountRatio),
    fat: roundNutritionValue(product.fat * amountRatio),
    carbs: roundNutritionValue(product.carbs * amountRatio),
  };
}

function getCalorieProgressRatio(value, target) {
  if (target <= 0) {
    return 0;
  }

  return Math.max(value / target, 0);
}

function getClampedProgress(progress) {
  return Math.min(progress, 1);
}

function getCalorieBalanceStatus(progress) {
  if (progress > IDEAL_MAX_PROGRESS) {
    return "over";
  }

  if (progress >= IDEAL_MIN_PROGRESS) {
    return "ideal";
  }

  return "under";
}

function getRemaining(value, target) {
  return Math.max(target - value, 0);
}

export function getNutritionGoalSummary(consumed, target = DAILY_TARGETS) {
  const calorieProgressRatio = getCalorieProgressRatio(
    consumed.calories,
    target.calories,
  );

  return {
    consumed,
    target,
    remaining: {
      calories: getRemaining(consumed.calories, target.calories),
      protein: getRemaining(consumed.protein, target.protein),
      fat: getRemaining(consumed.fat, target.fat),
      carbs: getRemaining(consumed.carbs, target.carbs),
    },
    progress: {
      calories: getClampedProgress(
        getCalorieProgressRatio(consumed.calories, target.calories),
      ),
      protein: getClampedProgress(
        getCalorieProgressRatio(consumed.protein, target.protein),
      ),
      fat: getClampedProgress(
        getCalorieProgressRatio(consumed.fat, target.fat),
      ),
      carbs: getClampedProgress(
        getCalorieProgressRatio(consumed.carbs, target.carbs),
      ),
    },
    calorieStatus: getCalorieBalanceStatus(calorieProgressRatio),
    calorieProgressRatio,
  };
}

export function getDayCalorieIndicator(
  calories,
  targetCalories = DAILY_TARGETS.calories,
) {
  const rawProgress = getCalorieProgressRatio(calories, targetCalories);
  const status = getCalorieBalanceStatus(rawProgress);
  const progress = status === "under" ? getClampedProgress(rawProgress) : 1;

  return {
    calories,
    progress,
    status,
  };
}

function getDateKeyForOffset(date, timezoneOffsetMinutes) {
  const shiftedDate = new Date(
    date.getTime() - timezoneOffsetMinutes * 60 * 1000,
  );

  return shiftedDate.toISOString().slice(0, 10);
}

function createEmptyDayOverview() {
  const totals = { ...ZERO_NUTRITION };

  return {
    entries: [],
    totals,
    summary: getNutritionGoalSummary(totals, DAILY_TARGETS),
  };
}

export function buildNutritionOverview(entries, timezoneOffsetMinutes) {
  const days = {};

  entries
    .slice()
    .sort(
      (left, right) =>
        new Date(left.eatenAt).getTime() - new Date(right.eatenAt).getTime(),
    )
    .forEach((entry) => {
      const dayKey = getDateKeyForOffset(
        new Date(entry.eatenAt),
        timezoneOffsetMinutes,
      );

      if (!days[dayKey]) {
        days[dayKey] = createEmptyDayOverview();
      }

      days[dayKey].entries.push(entry);
      days[dayKey].totals = {
        calories: days[dayKey].totals.calories + entry.calories,
        protein: days[dayKey].totals.protein + entry.protein,
        fat: days[dayKey].totals.fat + entry.fat,
        carbs: days[dayKey].totals.carbs + entry.carbs,
      };
    });

  Object.values(days).forEach((dayOverview) => {
    dayOverview.summary = getNutritionGoalSummary(
      dayOverview.totals,
      DAILY_TARGETS,
    );
  });

  const dailyCalorieIndicators = Object.fromEntries(
    Object.entries(days).map(([dayKey, dayOverview]) => [
      dayKey,
      getDayCalorieIndicator(
        dayOverview.totals.calories,
        DAILY_TARGETS.calories,
      ),
    ]),
  );

  return {
    days,
    dailyCalorieIndicators,
    defaultDay: createEmptyDayOverview(),
    defaultIndicator: getDayCalorieIndicator(0, DAILY_TARGETS.calories),
  };
}
