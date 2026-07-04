import { useMutation, useQueryClient } from '@tanstack/react-query';

import { login, logout, resendOtp, signUp, verifyOtp } from '../services';
import { useAuthStore } from '../store';

export function useLogin() {
  const queryClient = useQueryClient();
  const setSession = useAuthStore((state) => state.setSession);

  return useMutation({
    mutationKey: ['auth', 'login'],
    mutationFn: login,
    onSuccess: (session) => {
      setSession(session);
      queryClient.setQueryData(['auth', 'me'], session.user);
    },
  });
}

export function useSignUp() {
  return useMutation({ mutationKey: ['auth', 'signup'], mutationFn: signUp });
}

export function useVerifyOtp() {
  const queryClient = useQueryClient();
  const setSession = useAuthStore((state) => state.setSession);

  return useMutation({
    mutationKey: ['auth', 'verify-otp'],
    mutationFn: verifyOtp,
    onSuccess: (session) => {
      setSession(session);
      queryClient.setQueryData(['auth', 'me'], session.user);
    },
  });
}

export function useResendOtp() {
  return useMutation({ mutationKey: ['auth', 'resend-otp'], mutationFn: resendOtp });
}

export function useLogout() {
  const queryClient = useQueryClient();
  const accessToken = useAuthStore((state) => state.accessToken);
  const clearSession = useAuthStore((state) => state.clearSession);

  return useMutation({
    mutationKey: ['auth', 'logout'],
    mutationFn: async () => {
      if (accessToken) await logout(accessToken);
    },
    onSettled: () => {
      clearSession();
      queryClient.clear();
    },
  });
}
