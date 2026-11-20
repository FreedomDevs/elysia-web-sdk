import { useMutation, type UseMutationOptions } from '@tanstack/react-query';
import type {
  ElysiaError,
  RegisterRequest,
  RegisterResponse,
} from '@elysiac/sdk';
import { useElysiaClient } from '../useElysiaClient';

type Options = Omit<
  UseMutationOptions<RegisterResponse, ElysiaError, RegisterRequest>,
  'mutationKey' | 'mutationFn'
>;

export const useRegister = (options?: Options) => {
  const client = useElysiaClient();

  return useMutation({
    mutationKey: ['elysia', 'auth', 'register'],
    mutationFn: (data) => client.auth.register(data),
    ...options,
  });
};
