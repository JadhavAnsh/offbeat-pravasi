import type { PaginatedTreks, PaginationMeta, TrekImage, TrekSource, TrekSummary } from '../types';

const DEFAULT_PAGE_SIZE = 20;

function asRecord(value: unknown): Record<string, unknown> | null {
  return value !== null && typeof value === 'object' && !Array.isArray(value)
    ? (value as Record<string, unknown>)
    : null;
}

function asNumber(value: unknown, fallback = 0) {
  const parsed = typeof value === 'number' ? value : Number(value);
  return Number.isFinite(parsed) ? parsed : fallback;
}

function asNullableNumber(value: unknown) {
  if (value === null || value === undefined || value === '') return null;
  const parsed = Number(value);
  return Number.isFinite(parsed) ? parsed : null;
}

function asNullableString(value: unknown) {
  return typeof value === 'string' && value.trim() ? value : null;
}

function normalizeImages(value: unknown): TrekImage[] {
  if (!Array.isArray(value)) return [];
  return value.flatMap((candidate) => {
    const image = asRecord(candidate);
    if (!image) return [];
    return [{
      altText: asNullableString(image.altText),
      id: asNullableString(image.id) ?? undefined,
      isPrimary: Boolean(image.isPrimary),
      key: asNullableString(image.key) ?? undefined,
      url: asNullableString(image.url),
    }];
  });
}

function normalizeTags(value: unknown): TrekSummary['tags'] {
  if (!Array.isArray(value)) return [];
  return value.flatMap((candidate) => {
    if (typeof candidate === 'string' && candidate.trim()) return [{ name: candidate }];
    const tag = asRecord(candidate);
    const name = asNullableString(tag?.name);
    return name ? [{ id: asNullableString(tag?.id) ?? undefined, name }] : [];
  });
}

export function normalizeTrek(value: unknown, source: TrekSource = 'api'): TrekSummary {
  const trek = asRecord(value);
  const id = asNullableString(trek?.id);
  const name = asNullableString(trek?.name);
  if (!trek || !id || !name) throw new Error('Trek response is missing a valid id or name');

  const difficulty = asNullableString(trek.difficulty);
  const validDifficulty = ['EASY', 'MODERATE', 'DIFFICULT', 'EXTREME'].includes(difficulty ?? '')
    ? (difficulty as TrekSummary['difficulty'])
    : null;

  return {
    avgRating: asNumber(trek.avgRating),
    costInr: asNumber(trek.costInr),
    currentParticipants: asNumber(trek.currentParticipants),
    difficulty: validDifficulty,
    endDate: asNullableString(trek.endDate),
    fullDescription: asNullableString(trek.fullDescription),
    id,
    images: normalizeImages(trek.images),
    isPublished: typeof trek.isPublished === 'boolean' ? trek.isPublished : undefined,
    latitude: asNullableNumber(trek.latitude),
    location: asNullableString(trek.location),
    longitude: asNullableNumber(trek.longitude),
    maxParticipants: asNumber(trek.maxParticipants, 1),
    name,
    popularityScore: asNumber(trek.popularityScore),
    ratingCount: asNumber(trek.ratingCount),
    shortDescription: asNullableString(trek.shortDescription),
    slug: asNullableString(trek.slug),
    source,
    startDate: asNullableString(trek.startDate),
    state: asNullableString(trek.state),
    status: asNullableString(trek.status) ?? undefined,
    tags: normalizeTags(trek.tags),
  };
}

function normalizeMeta(value: unknown, itemCount: number, requestedPage: number, requestedLimit: number): PaginationMeta {
  const meta = asRecord(value);
  const total = asNumber(meta?.total, itemCount);
  const limit = Math.max(1, asNumber(meta?.limit, requestedLimit));
  return {
    limit,
    page: Math.max(1, asNumber(meta?.page, requestedPage)),
    total,
    totalPages: Math.max(0, asNumber(meta?.totalPages, total ? Math.ceil(total / limit) : 0)),
  };
}

export function normalizeTrekCollection(
  payload: unknown,
  options: { limit?: number; page?: number; source?: TrekSource } = {}
): PaginatedTreks {
  const page = options.page ?? 1;
  const limit = options.limit ?? DEFAULT_PAGE_SIZE;
  const source = options.source ?? 'api';
  const envelope = asRecord(payload);
  const unwrapped = envelope && 'success' in envelope && 'data' in envelope ? envelope.data : payload;
  const pageRecord = asRecord(unwrapped);
  const rawItems = Array.isArray(unwrapped)
    ? unwrapped
    : Array.isArray(pageRecord?.data)
      ? pageRecord.data
      : null;

  if (!rawItems) throw new Error('Trek response was not an array or paginated collection');

  const items = rawItems.map((item) => normalizeTrek(item, source));
  return {
    items,
    meta: normalizeMeta(pageRecord?.meta, items.length, page, limit),
    validation: { compatibilityMode: false, source, state: 'validated' },
  };
}
