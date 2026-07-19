import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';

import { env } from '@src/config/env';

import { getWishlistItems, toggleWishlistItem } from '../services';

import type { WishlistItem } from '../types';

const wishlistKey = ['wishlist', 'items'] as const;

export function useWishlistItems() {
  return useQuery({
    queryKey: wishlistKey,
    queryFn: ({ signal }) => getWishlistItems(signal),
    enabled: !env.demoData,
  });
}

export function useToggleWishlist() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: toggleWishlistItem,
    onMutate: async (trekId) => {
      await queryClient.cancelQueries({ queryKey: wishlistKey });
      const previous = queryClient.getQueryData<WishlistItem[]>(wishlistKey) ?? [];
      const wasSaved = previous.some((item) => item.trekId === trekId);
      queryClient.setQueryData<WishlistItem[]>(
        wishlistKey,
        wasSaved
          ? previous.filter((item) => item.trekId !== trekId)
          : [...previous, { id: `optimistic-${trekId}`, trekId }]
      );
      return { previous };
    },
    onError: (_error, _trekId, context) => {
      if (context?.previous) queryClient.setQueryData(wishlistKey, context.previous);
    },
    onSettled: () => queryClient.invalidateQueries({ queryKey: wishlistKey }),
  });
}
