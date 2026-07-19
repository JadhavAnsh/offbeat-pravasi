import { fetchJson } from '@src/api/client';
import { unwrapApiData } from '@src/api/response';
import { env } from '@src/config/env';

import { demoTreks } from '../fixtures';
import { normalizeTrek, normalizeTrekCollection } from './normalizers';
import { buildTrekQueryParams, isNumericTrekQueryValidationError } from './query-compat';

import type { PaginatedTreks, TrekFilters, TrekSummary } from '../types';

function paginate(items: TrekSummary[], page: number, limit: number): PaginatedTreks {
  const start = (page - 1) * limit;
  return {
    items: items.slice(start, start + limit),
    meta: { page, limit, total: items.length, totalPages: Math.ceil(items.length / limit) },
    validation: { compatibilityMode: false, source: items[0]?.source ?? 'demo', state: 'validated' },
  };
}

export function filterDemoTreks(filters: TrekFilters): TrekSummary[] {
  const query = filters.q?.trim().toLowerCase();
  const state = filters.state?.trim().toLowerCase();
  const filtered = demoTreks.filter((trek) => {
    const searchText = [trek.name, trek.location, trek.state, trek.shortDescription, ...trek.tags.map((tag) => tag.name)]
      .filter(Boolean)
      .join(' ')
      .toLowerCase();
    return (
      (!query || searchText.includes(query)) &&
      (!state || trek.state?.toLowerCase().includes(state)) &&
      (!filters.difficulty || trek.difficulty === filters.difficulty) &&
      (filters.minCost === undefined || trek.costInr >= filters.minCost) &&
      (filters.maxCost === undefined || trek.costInr <= filters.maxCost)
    );
  });

  return filtered.sort((a, b) => {
    if (filters.sort === 'newest') return Date.parse(b.startDate ?? '') - Date.parse(a.startDate ?? '');
    if (filters.sort === 'popular') return (b.popularityScore ?? 0) - (a.popularityScore ?? 0);
    if (filters.sort === 'relevance' && query) {
      return Number(b.name.toLowerCase().includes(query)) - Number(a.name.toLowerCase().includes(query));
    }
    return 0;
  });
}

export async function getTreks(filters: TrekFilters, signal?: AbortSignal): Promise<PaginatedTreks> {
  const page = filters.page ?? 1;
  const limit = filters.limit ?? 12;
  if (env.demoData) return paginate(filterDemoTreks(filters), page, limit);

  try {
    const payload = await fetchJson<unknown>('/treks', {
      queryParams: buildTrekQueryParams({ ...filters, limit, page }, { includeNumeric: true }),
      signal,
    });
    return normalizeTrekCollection(payload, { page, limit });
  } catch (error) {
    if (!isNumericTrekQueryValidationError(error)) throw error;

    // The current local API validates query-string numbers with @IsInt but does
    // not transform them first. Retry with string filters and paginate the
    // returned default page locally until the backend contract is corrected.
    const payload = await fetchJson<unknown>('/treks', {
      queryParams: buildTrekQueryParams(filters, { includeNumeric: false }),
      signal,
    });
    const normalized = normalizeTrekCollection(payload, { page: 1, limit: 20 });
    const locallyFiltered = normalized.items.filter((trek) =>
      (filters.minCost === undefined || trek.costInr >= filters.minCost) &&
      (filters.maxCost === undefined || trek.costInr <= filters.maxCost)
    );
    const compatiblePage = paginate(locallyFiltered, page, limit);
    return {
      ...compatiblePage,
      validation: { compatibilityMode: true, source: 'api', state: 'validated' },
    };
  }
}

export async function getRecommendedTreks(limit = 4, signal?: AbortSignal): Promise<TrekSummary[]> {
  if (env.demoData) return [...demoTreks].sort((a, b) => (b.popularityScore ?? 0) - (a.popularityScore ?? 0)).slice(0, limit);
  const payload = await fetchJson<unknown>('/treks/recommendations', { queryParams: { limit }, signal });
  return normalizeTrekCollection(payload, { limit }).items;
}

export async function getNearbyTreks(
  latitude: number,
  longitude: number,
  radiusMeters = 100000,
  signal?: AbortSignal
): Promise<TrekSummary[]> {
  if (env.demoData) return demoTreks.slice(0, 6);
  const payload = await fetchJson<unknown>('/treks/nearby', {
    queryParams: { latitude, longitude, radiusMeters, limit: 30 },
    signal,
  });
  return normalizeTrekCollection(payload, { limit: 30 }).items;
}

export async function getTrek(id: string, signal?: AbortSignal): Promise<TrekSummary> {
  if (env.demoData) {
    const trek = demoTreks.find((candidate) => candidate.id === id);
    if (!trek) throw new Error('Demo trek not found');
    return trek;
  }
  const payload = await fetchJson<unknown>(`/treks/${id}`, { signal });
  return normalizeTrek(unwrapApiData(payload));
}
