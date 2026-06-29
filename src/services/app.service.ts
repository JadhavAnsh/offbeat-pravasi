import { Platform } from 'react-native';

import { fetchJson } from '@src/api';
import { env } from '@src/config/env';

import type { AppDiagnostic } from '@src/types/common';

export async function getAppDiagnostics(): Promise<AppDiagnostic[]> {
  await fetchJson('/health');

  return [
    { label: 'Backend', value: 'Connected' },
    { label: 'Environment', value: env.appEnv },
    { label: 'Platform', value: Platform.OS },
    { label: 'API URL', value: env.apiUrl || 'Not configured' },
    { label: 'App name', value: env.appName },
  ];
}
