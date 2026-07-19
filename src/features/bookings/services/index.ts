import { fetchJson } from '@src/api/client';
import { unwrapCollection } from '@src/api/response';
import { env } from '@src/config/env';

import type { BookingStatus, BookingSummary } from '../types';

function normalizeBooking(value: unknown): BookingSummary | null {
  if (!value || typeof value !== 'object') return null;
  const booking = value as Record<string, unknown>;
  const snapshot = booking.trekSnapshot && typeof booking.trekSnapshot === 'object'
    ? booking.trekSnapshot as Record<string, unknown>
    : {};
  if (typeof booking.id !== 'string' || typeof booking.trekId !== 'string') return null;
  const status = typeof booking.status === 'string' ? booking.status as BookingStatus : 'PENDING';
  return {
    createdAt: typeof booking.createdAt === 'string' ? booking.createdAt : new Date(0).toISOString(),
    holdExpiresAt: typeof booking.holdExpiresAt === 'string' ? booking.holdExpiresAt : null,
    id: booking.id,
    quantity: Number(booking.quantity ?? 1),
    status,
    totalAmountInr: Number(booking.totalAmountInr ?? 0),
    trekId: booking.trekId,
    trekSnapshot: {
      endDate: typeof snapshot.endDate === 'string' ? snapshot.endDate : undefined,
      location: typeof snapshot.location === 'string' ? snapshot.location : undefined,
      name: typeof snapshot.name === 'string' ? snapshot.name : 'Upcoming trek',
      startDate: typeof snapshot.startDate === 'string' ? snapshot.startDate : undefined,
    },
  };
}

export async function getBookings(signal?: AbortSignal): Promise<BookingSummary[]> {
  if (env.demoData) return [];
  const payload = await fetchJson<unknown>('/bookings', { queryParams: { page: 1, limit: 10 }, signal });
  return unwrapCollection(payload).items.flatMap((item) => {
    const booking = normalizeBooking(item);
    return booking ? [booking] : [];
  });
}
