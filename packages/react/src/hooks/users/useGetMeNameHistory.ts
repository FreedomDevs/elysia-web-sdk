import { useQuery, type UseQueryOptions } from '@tanstack/react-query';
import type {
  ElysiaError,
  NameHistoryResponse,
} from '@elysiac/sdk';
import { useElysiaClient } from '../useElysiaClient';

type Options<TSelected = NameHistoryResponse> = Omit<
  UseQueryOptions<NameHistoryResponse, ElysiaError, TSelected>,
  'queryKey' | 'queryFn'
>;

export const useGetMeNameHistory = <TSelected = NameHistoryResponse>(
  options?: Options<TSelected>
) => {
  const client = useElysiaClient();

  return useQuery<NameHistoryResponse, ElysiaError, TSelected>({
    queryKey: ['elysia', 'users', 'name-history'],
    queryFn: () => client.users.getMyNameHistory(),
    ...options,
  });
};
