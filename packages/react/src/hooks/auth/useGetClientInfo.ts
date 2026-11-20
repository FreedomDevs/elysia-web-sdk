import { useQuery, type UseQueryOptions } from '@tanstack/react-query';
import type {
  ClientInfoResponse,
  ElysiaError,
} from '@elysiac/sdk';
import { useElysiaClient } from '../useElysiaClient';

type Options<TSelected = ClientInfoResponse> = Omit<
  UseQueryOptions<ClientInfoResponse, ElysiaError, TSelected>,
  'queryKey' | 'queryFn'
>;

export const useGetClientInfo = <TSelected = ClientInfoResponse>(
  clientId: string,
  options?: Options<TSelected>
) => {
  const client = useElysiaClient();

  return useQuery<ClientInfoResponse, ElysiaError, TSelected>({
    queryKey: ['elysia', 'auth', 'client-info', clientId],
    queryFn: () => client.auth.clientInfo({ client_id: clientId }),
    enabled: Boolean(clientId),
    ...options,
  });
};
