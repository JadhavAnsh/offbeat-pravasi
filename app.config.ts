import type { ExpoConfig } from 'expo/config';

import appJson from './app.json';

const baseConfig = appJson.expo as ExpoConfig;

export default (): ExpoConfig => ({
  ...baseConfig,
  extra: {
    ...baseConfig.extra,
    apiUrl: process.env.EXPO_PUBLIC_API_URL ?? '',
    apiKey: process.env.EXPO_PUBLIC_API_KEY ?? '',
    apiKeyHeader: process.env.EXPO_PUBLIC_API_KEY_HEADER ?? 'x-api-key',
    appEnv: process.env.EXPO_PUBLIC_APP_ENV ?? 'development',
  },
});
