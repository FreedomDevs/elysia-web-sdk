import { useMutation, type UseMutationOptions } from '@tanstack/react-query';
import type {
  ElysiaError,
  RefreshPasswordRequest,
  RefreshPasswordResponse,
} from '@elysiac/sdk';
import { useElysiaClient } from '../useElysiaClient';

type Options = Omit<
  UseMutationOptions<
    RefreshPasswordResponse,
    ElysiaError,
    RefreshPasswordRequest
  >,
  'mutationKey' | 'mutationFn'
>;

export const useRefreshPassword = (options?: Options) => {
  const client = useElysiaClient();

  return useMutation({
    mutationKey: ['elysia', 'auth', 'refresh-password'],
    mutationFn: (data) => client.auth.refreshPassword(data),
    ...options,
  });
};
