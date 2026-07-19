import Constants from 'expo-constants';

export type AppEnv = 'development' | 'staging' | 'production';

type ExpoExtra = {
  apiUrl?: string;
  apiKey?: string;
  apiKeyHeader?: string;
  appEnv?: AppEnv;
  demoData?: string;
};

const extra = (Constants.expoConfig?.extra ?? {}) as ExpoExtra;

const apiUrl = process.env.EXPO_PUBLIC_API_URL ?? extra.apiUrl ?? '';
const appEnv =
  (process.env.EXPO_PUBLIC_APP_ENV as AppEnv | undefined) ??
  extra.appEnv ??
  (__DEV__ ? 'development' : 'production');

export function resolveDemoDataEnabled(environment: AppEnv, value?: string) {
  return environment !== 'production' && value?.toLowerCase() === 'true';
}

export const env = {
  apiUrl: apiUrl.replace(/\/+$/, ''),
  apiKey: process.env.EXPO_PUBLIC_API_KEY ?? extra.apiKey ?? '',
  apiKeyHeader:
    process.env.EXPO_PUBLIC_API_KEY_HEADER ?? extra.apiKeyHeader ?? 'x-api-key',
  appEnv,
  demoData: resolveDemoDataEnabled(
    appEnv,
    process.env.EXPO_PUBLIC_DEMO_DATA ?? extra.demoData
  ),
  appName: Constants.expoConfig?.name ?? 'OffBeat Pravasi',
  appSlug: Constants.expoConfig?.slug ?? 'offbeat-pravasi-app',
  isDev: __DEV__,
} as const;
