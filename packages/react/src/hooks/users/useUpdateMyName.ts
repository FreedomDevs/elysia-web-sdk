import { useMutation, type UseMutationOptions } from '@tanstack/react-query';
import type {
  ElysiaError,
  UpdateMyNameRequest,
  UpdateMyNameResponse,
} from '@elysiac/sdk';
import { useElysiaClient } from '../useElysiaClient';

type Options = Omit<
  UseMutationOptions<
    UpdateMyNameResponse,
    ElysiaError,
    UpdateMyNameRequest
  >,
  'mutationKey' | 'mutationFn'
>;

export const useUpdateMyName = (options?: Options) => {
  const client = useElysiaClient();

  return useMutation({
    mutationKey: ['elysia', 'users', 'update-name'],
    mutationFn: (data) => client.users.updateMyName(data),
    ...options,
  });
};
