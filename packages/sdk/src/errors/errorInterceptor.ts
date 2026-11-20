import type { AxiosInstance } from 'axios';
import { normalizeError } from './normalizeError';

export const installErrorInterceptor = (
  instance: AxiosInstance
): void => {
  instance.interceptors.response.use(
    (response) => response,
    (error: unknown) => Promise.reject(normalizeError(error))
  );
};
