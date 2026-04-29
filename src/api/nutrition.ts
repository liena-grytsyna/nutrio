import type {
  CreateDayEntryInput,
  DayEntry,
  NutritionOverview,
  NutritionValues,
  PreviewDayEntryNutritionInput,
} from "../types/nutrition";
import { readJsonResponse } from "./http";

type NutritionOverviewResponse = {
  overview: NutritionOverview;
};

type DayEntryResponse = {
  dayEntry: DayEntry;
};

type NutritionPreviewResponse = {
  nutrition: NutritionValues;
};

export async function fetchNutritionOverview(
  timezoneOffsetMinutes: number,
  signal?: AbortSignal,
): Promise<NutritionOverview> {
  const searchParams = new URLSearchParams({
    timezoneOffsetMinutes: String(timezoneOffsetMinutes),
  });
  const response = await fetch(
    `/api/nutrition-overview?${searchParams.toString()}`,
    {
      signal,
    },
  );

  return (await readJsonResponse<NutritionOverviewResponse>(response)).overview;
}

export async function previewDayEntryNutrition(
  input: PreviewDayEntryNutritionInput,
  signal?: AbortSignal,
): Promise<NutritionValues> {
  const response = await fetch("/api/day-entries/preview", {
    method: "POST",
    signal,
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(input),
  });

  return (await readJsonResponse<NutritionPreviewResponse>(response)).nutrition;
}

export async function createDayEntry(
  input: CreateDayEntryInput,
): Promise<DayEntry> {
  const response = await fetch("/api/day-entries", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(input),
  });

  return (await readJsonResponse<DayEntryResponse>(response)).dayEntry;
}
