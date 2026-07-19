import { fetchJson } from '@src/api/client';
import { unwrapApiData, unwrapCollection } from '@src/api/response';

import type { WishlistItem } from '../types';

export async function getWishlistItems(signal?: AbortSignal): Promise<WishlistItem[]> {
  const payload = await fetchJson<unknown>('/wishlist/items', { queryParams: { page: 1, limit: 100 }, signal });
  return unwrapCollection(payload).items.flatMap((value) => {
    if (!value || typeof value !== 'object') return [];
    const item = value as Record<string, unknown>;
    return typeof item.id === 'string' && typeof item.trekId === 'string'
      ? [{ id: item.id, trekId: item.trekId }]
      : [];
  });
}

export async function toggleWishlistItem(trekId: string): Promise<{ saved: boolean }> {
  const payload = await fetchJson<unknown>(`/wishlist/treks/${trekId}/toggle`, { method: 'POST' });
  const data = unwrapApiData(payload);
  if (!data || typeof data !== 'object' || typeof (data as Record<string, unknown>).saved !== 'boolean') {
    throw new Error('Wishlist response was invalid');
  }
  return { saved: (data as Record<string, boolean>).saved };
}
