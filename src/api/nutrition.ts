import type {
  CreateDayEntryInput,
  DayEntry,
  NutritionOverview,
} from "../types/nutrition";
import { readJsonResponse } from "./http";

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

  return (await readJsonResponse<{ overview: NutritionOverview }>(response))
    .overview;
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

  return (await readJsonResponse<{ dayEntry: DayEntry }>(response)).dayEntry;
}
