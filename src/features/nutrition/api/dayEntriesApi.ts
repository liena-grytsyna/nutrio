import type { CreateDayEntryInput, DayEntry } from '../model/types';

type DayEntriesResponse = {
  dayEntries: DayEntry[];
};

type DayEntryResponse = {
  dayEntry: DayEntry;
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

export async function fetchDayEntries(signal?: AbortSignal): Promise<DayEntry[]> {
  const response = await fetch('/api/day-entries', { signal });
  return (await readJsonResponse<DayEntriesResponse>(response)).dayEntries;
}

export async function createDayEntry(
  input: CreateDayEntryInput,
): Promise<DayEntry> {
  const response = await fetch('/api/day-entries', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(input),
  });

  return (await readJsonResponse<DayEntryResponse>(response)).dayEntry;
}
