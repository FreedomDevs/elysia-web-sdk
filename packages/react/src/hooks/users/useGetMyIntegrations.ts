import { useQuery, type UseQueryOptions } from '@tanstack/react-query';
import type {
  ElysiaError,
  GetMyIntegrationsResponse,
} from '@elysiac/sdk';
import { useElysiaClient } from '../useElysiaClient';

type Options<TSelected = GetMyIntegrationsResponse> = Omit<
  UseQueryOptions<GetMyIntegrationsResponse, ElysiaError, TSelected>,
  'queryKey' | 'queryFn'
>;

export const useGetMyIntegrations = <TSelected = GetMyIntegrationsResponse>(
  options?: Options<TSelected>
) => {
  const client = useElysiaClient();

  return useQuery<GetMyIntegrationsResponse, ElysiaError, TSelected>({
    queryKey: ['elysia', 'auth', 'my-integrations'],
    queryFn: () => client.auth.getMyIntegrations(),
    ...options,
  });
};
