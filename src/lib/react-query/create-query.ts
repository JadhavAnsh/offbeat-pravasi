import {
  mutationOptions,
  queryOptions,
  type MutationOptions,
  type QueryKey,
} from '@tanstack/react-query';

type CreateQueryOptionsConfig<TData, TParams extends readonly unknown[]> = {
  enabled?: (...params: TParams) => boolean;
  queryFn: (...params: TParams) => Promise<TData>;
  queryKey: (...params: TParams) => QueryKey;
  staleTime?: number;
};

export function createQueryOptions<TData, TParams extends readonly unknown[]>(
  config: CreateQueryOptionsConfig<TData, TParams>
) {
  return (...params: TParams) =>
    queryOptions({
      enabled: config.enabled?.(...params) ?? true,
      queryKey: config.queryKey(...params),
      queryFn: () => config.queryFn(...params),
      staleTime: config.staleTime,
    });
}

export function createMutationOptions<TData, TVariables>(
  config: Pick<MutationOptions<TData, Error, TVariables>, 'mutationFn' | 'mutationKey'>
) {
  return mutationOptions(config);
}
