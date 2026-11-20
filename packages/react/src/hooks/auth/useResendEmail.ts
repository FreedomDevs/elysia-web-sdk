import { useMutation, type UseMutationOptions } from '@tanstack/react-query';
import type {
  ElysiaError,
  ResendEmailRequest,
  SuccessResponse,
} from '@elysiac/sdk';
import { useElysiaClient } from '../useElysiaClient';

type Options = Omit<
  UseMutationOptions<
    SuccessResponse<null>,
    ElysiaError,
    ResendEmailRequest
  >,
  'mutationKey' | 'mutationFn'
>;

export const useResendEmail = (options?: Options) => {
  const client = useElysiaClient();

  return useMutation({
    mutationKey: ['elysia', 'auth', 'resend-email'],
    mutationFn: (data) => client.auth.resendEmail(data),
    ...options,
  });
};
