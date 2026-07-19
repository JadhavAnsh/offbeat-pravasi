export function unwrapApiData(payload: unknown): unknown {
  if (payload && typeof payload === 'object' && !Array.isArray(payload)) {
    const record = payload as Record<string, unknown>;
    if ('success' in record && 'data' in record) return record.data;
  }
  return payload;
}

export function unwrapCollection(payload: unknown): { items: unknown[]; meta?: unknown } {
  const unwrapped = unwrapApiData(payload);
  if (Array.isArray(unwrapped)) return { items: unwrapped };
  if (unwrapped && typeof unwrapped === 'object') {
    const record = unwrapped as Record<string, unknown>;
    if (Array.isArray(record.data)) {
      return { items: record.data, meta: record.meta ?? record.pagination };
    }
  }
  throw new Error('API response was not a collection');
}
