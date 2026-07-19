export const APP_ROUTES = {
  home: '/',
  explore: '/explore',
  account: '/account',
  exploreFilters: '/explore-filters',
  modal: '/modal',
  trek: (id: string) => ({ pathname: '/treks/[id]' as const, params: { id } }),
} as const;
