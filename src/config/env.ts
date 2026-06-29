import Constants from 'expo-constants';

type AppEnv = 'development' | 'staging' | 'production';

type ExpoExtra = {
  apiUrl?: string;
  apiKey?: string;
  apiKeyHeader?: string;
  appEnv?: AppEnv;
};

const extra = (Constants.expoConfig?.extra ?? {}) as ExpoExtra;

const apiUrl = process.env.EXPO_PUBLIC_API_URL ?? extra.apiUrl ?? '';

export const env = {
  apiUrl: apiUrl.replace(/\/+$/, ''),
  apiKey: process.env.EXPO_PUBLIC_API_KEY ?? extra.apiKey ?? '',
  apiKeyHeader:
    process.env.EXPO_PUBLIC_API_KEY_HEADER ?? extra.apiKeyHeader ?? 'x-api-key',
  appEnv:
    (process.env.EXPO_PUBLIC_APP_ENV as AppEnv | undefined) ??
    extra.appEnv ??
    (__DEV__ ? 'development' : 'production'),
  appName: Constants.expoConfig?.name ?? 'OffBeat Pravasi',
  appSlug: Constants.expoConfig?.slug ?? 'offbeat-pravasi-app',
  isDev: __DEV__,
} as const;
