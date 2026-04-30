import type {
  CreateDayEntryInput,
  DayEntry,
  NutritionOverview,
} from "../types/nutrition";
import { readJsonResponse } from "./http";
import { getDeviceId } from "../lib/deviceId";

export async function fetchNutritionOverview(
  timezoneOffsetMinutes: number,
  signal?: AbortSignal,
): Promise<NutritionOverview> {
  const searchParams = new URLSearchParams({
    timezoneOffsetMinutes: String(timezoneOffsetMinutes),
    deviceId: getDeviceId(),
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
  const body = { ...input, deviceId: getDeviceId() };

  const response = await fetch("/api/day-entries", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(body),
  });

  return (await readJsonResponse<{ dayEntry: DayEntry }>(response)).dayEntry;
}

export async function deleteDayEntry(entryId: string): Promise<void> {
  const response = await fetch(`/api/day-entries/${entryId}`, {
    method : "DELETE",
  });
}