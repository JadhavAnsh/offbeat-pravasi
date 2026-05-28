import { Platform } from 'react-native';

import { env } from '@src/config/env';

import type { AppDiagnostic } from '@src/types/common';

export async function getAppDiagnostics(): Promise<AppDiagnostic[]> {
  return [
    { label: 'Environment', value: env.appEnv },
    { label: 'Platform', value: Platform.OS },
    { label: 'API URL', value: env.apiUrl || 'Not configured' },
    { label: 'App name', value: env.appName },
  ];
}
