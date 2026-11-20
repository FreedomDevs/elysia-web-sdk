import { useMutation, type UseMutationOptions } from '@tanstack/react-query';
import type {
  ElysiaError,
  CreateChildTokenRequest,
  CreateChildTokenResponse,
} from '@elysiac/sdk';
import { useElysiaClient } from '../useElysiaClient';

type Options = Omit<
  UseMutationOptions<
    CreateChildTokenResponse,
    ElysiaError,
    CreateChildTokenRequest
  >,
  'mutationKey' | 'mutationFn'
>;

export const useCreateChildToken = (options?: Options) => {
  const client = useElysiaClient();

  return useMutation({
    mutationKey: ['elysia', 'auth', 'create-child-token'],
    mutationFn: (data) => client.auth.createChildToken(data),
    ...options,
  });
};
