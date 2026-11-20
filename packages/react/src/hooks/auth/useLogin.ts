import { useMutation, type UseMutationOptions } from '@tanstack/react-query';
import type {
  ElysiaError,
  LoginRequest,
  LoginResponse,
} from '@elysiac/sdk';
import { useElysiaClient } from '../useElysiaClient';

type Options = Omit<
  UseMutationOptions<LoginResponse, ElysiaError, LoginRequest>,
  'mutationKey' | 'mutationFn'
>;

export const useLogin = (options?: Options) => {
  const client = useElysiaClient();

  return useMutation({
    mutationKey: ['elysia', 'auth', 'login'],
    mutationFn: (data) => client.auth.login(data),
    ...options,
  });
};
