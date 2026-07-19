import { ApiError } from '@src/api/client';

import type { TrekFilters } from '../types';
import type { RequestConfig } from '@src/types/api';

const NUMERIC_TREK_QUERY_FIELDS = new Set(['limit', 'maxCost', 'minCost', 'page']);

export function buildTrekQueryParams(
  filters: TrekFilters,
  options: { includeNumeric: boolean }
): RequestConfig['queryParams'] {
  return {
    difficulty: filters.difficulty,
    ...(options.includeNumeric
      ? {
          limit: filters.limit,
          maxCost: filters.maxCost,
          minCost: filters.minCost,
          page: filters.page,
        }
      : {}),
    q: filters.q,
    sort: filters.sort,
    state: filters.state,
  };
}

export function isNumericTrekQueryValidationError(error: unknown) {
  if (!(error instanceof ApiError) || error.status !== 400) return false;
  const details = error.payload?.details;
  if (!details || typeof details !== 'object' || Array.isArray(details)) return false;
  const rejectedFields = Object.keys(details);
  return rejectedFields.length > 0 && rejectedFields.every((field) => NUMERIC_TREK_QUERY_FIELDS.has(field));
}
