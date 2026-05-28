import { QueryClient } from '@tanstack/react-query';

import { APP_QUERY_GC_TIME, APP_QUERY_STALE_TIME } from '@src/constants/query';

export const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      gcTime: APP_QUERY_GC_TIME,
      retry: 1,
      staleTime: APP_QUERY_STALE_TIME,
      refetchOnReconnect: true,
      refetchOnWindowFocus: false,
    },
    mutations: {
      retry: 0,
    },
  },
});
