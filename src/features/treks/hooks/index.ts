import { useInfiniteQuery, useQuery } from '@tanstack/react-query';

import { getNearbyTreks, getRecommendedTreks, getTrek, getTreks } from '../services';

import type { TrekFilters } from '../types';

export const trekQueryKeys = {
  all: ['treks'] as const,
  detail: (id: string) => ['treks', 'detail', id] as const,
  list: (filters: Omit<TrekFilters, 'page'>) => ['treks', 'list', filters] as const,
  nearby: (latitude?: number, longitude?: number) => ['treks', 'nearby', latitude, longitude] as const,
  recommendations: (limit: number) => ['treks', 'recommendations', limit] as const,
};

export function useTreks(filters: Omit<TrekFilters, 'page'>) {
  return useInfiniteQuery({
    queryKey: trekQueryKeys.list(filters),
    initialPageParam: 1,
    queryFn: ({ pageParam, signal }) => getTreks({ ...filters, page: pageParam }, signal),
    getNextPageParam: (lastPage) =>
      lastPage.meta.page < lastPage.meta.totalPages ? lastPage.meta.page + 1 : undefined,
  });
}

export function useRecommendedTreks(limit = 4) {
  return useQuery({
    queryKey: trekQueryKeys.recommendations(limit),
    queryFn: ({ signal }) => getRecommendedTreks(limit, signal),
  });
}

export function useNearbyTreks(latitude?: number, longitude?: number) {
  return useQuery({
    queryKey: trekQueryKeys.nearby(latitude, longitude),
    queryFn: ({ signal }) => getNearbyTreks(latitude!, longitude!, 100000, signal),
    enabled: latitude !== undefined && longitude !== undefined,
  });
}

export function useTrek(id?: string) {
  return useQuery({
    queryKey: trekQueryKeys.detail(id ?? ''),
    queryFn: ({ signal }) => getTrek(id!, signal),
    enabled: Boolean(id),
  });
}
