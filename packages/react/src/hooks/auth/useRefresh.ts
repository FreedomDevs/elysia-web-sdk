import { useMutation, type UseMutationOptions } from '@tanstack/react-query';
import type {
  ElysiaError,
  RefreshRequest,
  RefreshResponse,
} from '@elysiac/sdk';
import { useElysiaClient } from '../useElysiaClient';

type Options = Omit<
  UseMutationOptions<RefreshResponse, ElysiaError, RefreshRequest>,
  'mutationKey' | 'mutationFn'
>;

export const useRefresh = (options?: Options) => {
  const client = useElysiaClient();

  return useMutation({
    mutationKey: ['elysia', 'auth', 'refresh'],
    mutationFn: (data) => client.auth.refresh(data),
    ...options,
  });
};
