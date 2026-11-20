import { useQuery, type UseQueryOptions } from '@tanstack/react-query';
import type { ElysiaError, MeResponse } from '@elysiac/sdk';
import { useElysiaClient } from '../useElysiaClient';

type Options<TSelected = MeResponse> = Omit<
  UseQueryOptions<MeResponse, ElysiaError, TSelected>,
  'queryKey' | 'queryFn'
>;

export const useMe = <TSelected = MeResponse>(
  options?: Options<TSelected>
) => {
  const client = useElysiaClient();

  return useQuery<MeResponse, ElysiaError, TSelected>({
    queryKey: ['elysia', 'users', 'me'],
    queryFn: () => client.users.me(),
    ...options,
  });
};
