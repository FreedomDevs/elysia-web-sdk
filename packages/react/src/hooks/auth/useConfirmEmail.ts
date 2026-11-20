import { useMutation, type UseMutationOptions } from '@tanstack/react-query';
import type {
  ElysiaError,
  ConfirmEmailRequest,
  ConfirmEmailResponse,
} from '@elysiac/sdk';
import { useElysiaClient } from '../useElysiaClient';

type Options = Omit<
  UseMutationOptions<ConfirmEmailResponse, ElysiaError, ConfirmEmailRequest>,
  'mutationKey' | 'mutationFn'
>;

export const useConfirmEmail = (options?: Options) => {
  const client = useElysiaClient();

  return useMutation({
    mutationKey: ['elysia', 'auth', 'confirm-email'],
    mutationFn: (data) => client.auth.confirmEmail(data),
    ...options,
  });
};
