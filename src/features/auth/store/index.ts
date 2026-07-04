import { create } from 'zustand';
import { createJSONStorage, persist } from 'zustand/middleware';

import { STORE_KEYS } from '@src/constants/storage';
import { appStateStorage } from '@src/services/storage.service';

import type { AuthSession, AuthUser } from '../types';

type AuthState = {
  accessToken: string | null;
  hasHydrated: boolean;
  isLoggedIn: boolean;
  refreshToken: string | null;
  user: AuthUser | null;
};

type AuthActions = {
  clearSession: () => void;
  setHasHydrated: (hasHydrated: boolean) => void;
  setSession: (session: AuthSession) => void;
};

const initialState: Omit<AuthState, 'hasHydrated'> = {
  accessToken: null,
  isLoggedIn: false,
  refreshToken: null,
  user: null,
};

export const useAuthStore = create<AuthState & AuthActions>()(
  persist(
    (set) => ({
      ...initialState,
      hasHydrated: false,
      clearSession: () => set(initialState),
      setHasHydrated: (hasHydrated) => set({ hasHydrated }),
      setSession: ({ accessToken, refreshToken, user }) =>
        set({ accessToken, refreshToken, user, isLoggedIn: true }),
    }),
    {
      name: STORE_KEYS.authStore,
      storage: createJSONStorage(() => appStateStorage),
      partialize: ({ hasHydrated: _hasHydrated, ...session }) => session,
      onRehydrateStorage: () => (state) => state?.setHasHydrated(true),
    }
  )
);
