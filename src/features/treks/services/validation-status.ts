import type { AppEnv } from '@src/config/env';
import type { TrekValidationStatus } from '../types';

export function getTrekValidationCopy(
  status: 'error' | 'pending' | 'validated',
  validation: TrekValidationStatus | undefined,
  appEnv: AppEnv,
  demoDataEnabled: boolean
) {
  const environment = appEnv === 'production' ? 'LIVE' : appEnv === 'staging' ? 'PREVIEW' : 'LOCAL';
  const isDemo = validation?.source === 'demo' || demoDataEnabled;

  if (status === 'error') {
    return { accessibilityLabel: 'Trek data validation failed', label: 'VALIDATION ISSUE' };
  }
  if (status === 'pending') {
    return { accessibilityLabel: 'Trek data validation in progress', label: 'VALIDATING DATA' };
  }
  return {
    accessibilityLabel: `${isDemo ? 'Demo' : environment.toLowerCase()} trek data validated${validation?.compatibilityMode ? ' using API compatibility mode' : ''}`,
    label: `${isDemo ? 'DEMO' : environment} · VALIDATED`,
  };
}
