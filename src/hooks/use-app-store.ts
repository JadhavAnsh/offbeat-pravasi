import { useAppStore } from '@src/store/app-store';

export function useAppHydrated() {
  return useAppStore((state) => state.hasHydrated);
}
