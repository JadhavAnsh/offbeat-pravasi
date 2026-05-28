import { env } from '@src/config/env';
import { toErrorMessage } from '@src/utils/error';

import type { ApiErrorPayload, RequestConfig } from '@src/types/api';

export class ApiError extends Error {
  readonly status: number;
  readonly payload?: ApiErrorPayload;

  constructor(message: string, status: number, payload?: ApiErrorPayload) {
    super(message);
    this.name = 'ApiError';
    this.status = status;
    this.payload = payload;
  }
}

function buildUrl(path: string, queryParams?: RequestConfig['queryParams']) {
  const base = env.apiUrl ? new URL(env.apiUrl) : new URL('https://example.invalid');
  const normalizedPath = path.startsWith('/') ? path : `/${path}`;
  const url = new URL(normalizedPath, base);

  Object.entries(queryParams ?? {}).forEach(([key, value]) => {
    if (value === undefined || value === null || value === '') {
      return;
    }

    url.searchParams.set(key, String(value));
  });

  return url.toString();
}

export async function fetchJson<TResponse>(
  path: string,
  config: RequestConfig = {}
): Promise<TResponse> {
  const { baseUrl, queryParams, headers, ...init } = config;
  const url = baseUrl ? new URL(path, baseUrl).toString() : buildUrl(path, queryParams);

  const response = await fetch(url, {
    ...init,
    headers: {
      Accept: 'application/json',
      'Content-Type': 'application/json',
      ...headers,
    },
  });

  const rawBody = await response.text();
  const parsedBody = rawBody ? tryParseJson(rawBody) : undefined;

  if (!response.ok) {
    throw new ApiError(
      parsedBody && typeof parsedBody === 'object' && 'message' in parsedBody
        ? String(parsedBody.message)
        : `Request failed with status ${response.status}`,
      response.status,
      parsedBody as ApiErrorPayload | undefined
    );
  }

  return parsedBody as TResponse;
}

function tryParseJson(value: string) {
  try {
    return JSON.parse(value);
  } catch {
    throw new Error(toErrorMessage('Response was not valid JSON'));
  }
}
