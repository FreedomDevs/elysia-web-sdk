import { useMutation, type UseMutationOptions } from '@tanstack/react-query';
import type {
  ElysiaError,
  CheckRefreshTokenRequest,
  SuccessResponse,
} from '@elysiac/sdk';
import { useElysiaClient } from '../useElysiaClient';

type Options = Omit<
  UseMutationOptions<
    SuccessResponse<null>,
    ElysiaError,
    CheckRefreshTokenRequest
  >,
  'mutationKey' | 'mutationFn'
>;

export const useCheckRefreshToken = (options?: Options) => {
  const client = useElysiaClient();

  return useMutation({
    mutationKey: ['elysia', 'auth', 'check-refresh-token'],
    mutationFn: (data) => client.auth.checkRefreshToken(data),
    ...options,
  });
};
