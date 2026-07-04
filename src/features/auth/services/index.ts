import { fetchJson } from '@src/api/client';

import type { AuthSession, LoginInput, SignUpInput, VerifyOtpInput } from '../types';

type ApiResponse<T> = {
  data: T;
  message: string;
  success: true;
};

export async function login(input: LoginInput): Promise<AuthSession> {
  const response = await fetchJson<ApiResponse<AuthSession>>('/auth/login', {
    method: 'POST',
    body: JSON.stringify(input),
  });
  return response.data;
}

export function signUp(input: SignUpInput) {
  return fetchJson<{ userId: string }>('/auth/register', {
    method: 'POST',
    body: JSON.stringify(input),
  });
}

export async function verifyOtp(input: VerifyOtpInput): Promise<AuthSession> {
  const response = await fetchJson<ApiResponse<AuthSession>>('/auth/email/verify-otp', {
    method: 'POST',
    body: JSON.stringify(input),
  });
  return response.data;
}

export function resendOtp(email: string) {
  return fetchJson<ApiResponse<{ message: string }>>('/auth/email/resend-otp', {
    method: 'POST',
    body: JSON.stringify({ email }),
  });
}

export async function logout(accessToken: string) {
  await fetchJson<ApiResponse<Record<string, never>>>('/auth/logout', {
    method: 'POST',
    headers: { Authorization: `Bearer ${accessToken}` },
  });
}
