import Constants from 'expo-constants';

type AppEnv = 'development' | 'staging' | 'production';

type ExpoExtra = {
  apiUrl?: string;
  appEnv?: AppEnv;
};

const extra = (Constants.expoConfig?.extra ?? {}) as ExpoExtra;

export const env = {
  apiUrl: extra.apiUrl ?? '',
  appEnv: extra.appEnv ?? (__DEV__ ? 'development' : 'production'),
  appName: Constants.expoConfig?.name ?? 'OffBeat Pravasi',
  appSlug: Constants.expoConfig?.slug ?? 'offbeat-pravasi-app',
  isDev: __DEV__,
} as const;
