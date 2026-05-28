import { useQuery } from '@tanstack/react-query';

import { createQueryOptions } from '@src/lib/react-query';
import { getAppDiagnostics } from '@src/services/app.service';

export const appDiagnosticsQuery = createQueryOptions({
  queryKey: () => ['app', 'diagnostics'] as const,
  queryFn: getAppDiagnostics,
});

export function useAppDiagnostics() {
  return useQuery(appDiagnosticsQuery());
}
