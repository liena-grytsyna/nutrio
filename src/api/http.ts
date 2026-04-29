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

export async function readJsonResponse<T>(response: Response): Promise<T> {
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
