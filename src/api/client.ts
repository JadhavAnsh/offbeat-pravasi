import { env } from '@src/config/env';
import { useAuthStore } from '@src/features/auth/store';
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
  if (!env.apiUrl) {
    throw new Error('EXPO_PUBLIC_API_URL is not configured');
  }

  const base = new URL(`${env.apiUrl}/`);
  const normalizedPath = path.replace(/^\/+/, '');
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
  const url = baseUrl
    ? new URL(path.replace(/^\/+/, ''), `${baseUrl.replace(/\/+$/, '')}/`).toString()
    : buildUrl(path, queryParams);
  const accessToken = useAuthStore.getState().accessToken;

  let response: Response;
  try {
    response = await fetch(url, {
      ...init,
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json',
        ...(env.apiKey ? { [env.apiKeyHeader]: env.apiKey } : {}),
        ...(accessToken ? { Authorization: `Bearer ${accessToken}` } : {}),
        ...headers,
      },
    });
  } catch {
    throw new ApiError('Unable to reach the server. Check your connection and try again.', 0);
  }

  const rawBody = await response.text();
  const parsedBody = rawBody ? tryParseJson(rawBody) : undefined;

  if (!response.ok) {
    throw new ApiError(
      parsedBody && typeof parsedBody === 'object' && 'message' in parsedBody
        ? Array.isArray(parsedBody.message)
          ? parsedBody.message.join('\n')
          : String(parsedBody.message)
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
