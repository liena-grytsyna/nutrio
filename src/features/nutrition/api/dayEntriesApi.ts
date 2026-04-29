import type {
  CreateDayEntryInput,
  DayEntry,
  NutritionOverview,
  NutritionValues,
  PreviewDayEntryNutritionInput,
} from '../model/types';

type NutritionOverviewResponse = {
  overview: NutritionOverview;
};

type DayEntryResponse = {
  dayEntry: DayEntry;
};

type NutritionPreviewResponse = {
  nutrition: NutritionValues;
};

type ErrorResponse = {
  error?: string;
};

function getDefaultErrorMessage(status: number) {
  if (status >= 500) {
    return 'Server is temporarily unavailable. Please try again later.';
  }

  if (status === 404) {
    return 'Requested resource was not found.';
  }

  return `Request failed with status ${status}.`;
}

async function readJsonResponse<T>(response: Response): Promise<T> {
  if (!response.ok) {
    const message = (response.headers.get('content-type') ?? '').includes(
      'application/json',
    )
      ? ((await response.json()) as ErrorResponse).error
      : null;

    throw new Error(message || getDefaultErrorMessage(response.status));
  }

  return response.json() as Promise<T>;
}

export async function fetchNutritionOverview(
  timezoneOffsetMinutes: number,
  signal?: AbortSignal,
): Promise<NutritionOverview> {
  const searchParams = new URLSearchParams({
    timezoneOffsetMinutes: String(timezoneOffsetMinutes),
  });
  const response = await fetch(`/api/nutrition-overview?${searchParams.toString()}`, {
    signal,
  });

  return (await readJsonResponse<NutritionOverviewResponse>(response)).overview;
}

export async function previewDayEntryNutrition(
  input: PreviewDayEntryNutritionInput,
  signal?: AbortSignal,
): Promise<NutritionValues> {
  const response = await fetch('/api/day-entries/preview', {
    method: 'POST',
    signal,
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(input),
  });

  return (await readJsonResponse<NutritionPreviewResponse>(response)).nutrition;
}

export async function createDayEntry(input: CreateDayEntryInput): Promise<DayEntry> {
  const response = await fetch('/api/day-entries', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(input),
  });

  return (await readJsonResponse<DayEntryResponse>(response)).dayEntry;
}
