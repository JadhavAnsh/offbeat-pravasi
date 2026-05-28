export type ApiErrorPayload = {
  message?: string;
  [key: string]: unknown;
};

export type RequestConfig = RequestInit & {
  baseUrl?: string;
  queryParams?: Record<string, string | number | boolean | null | undefined>;
};
