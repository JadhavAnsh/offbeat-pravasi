import { create } from 'zustand';
import { createJSONStorage, persist } from 'zustand/middleware';

import { STORE_KEYS } from '@src/constants/storage';
import { appStateStorage } from '@src/services/storage.service';

import type { ThemePreference } from '@src/types/common';

type AppState = {
  hasHydrated: boolean;
  lastVisitedRoute: string | null;
  onboardingCompleted: boolean;
  themePreference: ThemePreference;
};

type AppActions = {
  completeOnboarding: () => void;
  resetAppState: () => void;
  setLastVisitedRoute: (route: string | null) => void;
  setHasHydrated: (value: boolean) => void;
  setThemePreference: (value: ThemePreference) => void;
};

const initialState: AppState = {
  hasHydrated: false,
  lastVisitedRoute: null,
  onboardingCompleted: false,
  themePreference: 'system',
};

export const useAppStore = create<AppState & AppActions>()(
  persist(
    (set) => ({
      ...initialState,
      completeOnboarding: () => set({ onboardingCompleted: true }),
      resetAppState: () => set({ ...initialState, hasHydrated: true }),
      setLastVisitedRoute: (route) => set({ lastVisitedRoute: route }),
      setHasHydrated: (value) => set({ hasHydrated: value }),
      setThemePreference: (value) => set({ themePreference: value }),
    }),
    {
      name: STORE_KEYS.appStore,
      storage: createJSONStorage(() => appStateStorage),
      partialize: ({ hasHydrated, ...state }) => state,
      onRehydrateStorage: () => (state) => {
        state?.setHasHydrated(true);
      },
    }
  )
);
