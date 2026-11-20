
import type { AxiosError, AxiosInstance } from 'axios';

declare module 'axios' {
  interface AxiosRequestConfig {
    _elysiaRetry?: boolean;
    _elysiaAccessToken?: string;
  }
}

interface AuthorizationStorage {
  getAccessToken(): string | null | Promise<string | null>;
}

export const installAuthorizationInterceptor = (
  instance: AxiosInstance,
  storage: AuthorizationStorage,
  refreshAccessToken: () => Promise<string>
): void => {
  instance.interceptors.request.use(async (config) => {
    let token = await storage.getAccessToken();

    if (!token) {
      token = await refreshAccessToken();
    }

    config.headers.set('Authorization', `Bearer ${token}`);
    config._elysiaAccessToken = token;

    return config;
  });

  instance.interceptors.response.use(
    (response) => response,

    async (error: AxiosError) => {
      const originalRequest = error.config;

      if (
        error.response?.status !== 401 ||
        !originalRequest ||
        originalRequest._elysiaRetry
      ) {
        return Promise.reject(error);
      }

      originalRequest._elysiaRetry = true;

      try {
        const currentToken = await storage.getAccessToken();

        const token =
          currentToken &&
            currentToken !== originalRequest._elysiaAccessToken
            ? currentToken
            : await refreshAccessToken();

        originalRequest.headers.set(
          'Authorization',
          `Bearer ${token}`
        );

        originalRequest._elysiaAccessToken = token;

        return instance(originalRequest);
      } catch (refreshError) {
        return Promise.reject(refreshError);
      }
    }
  );
};

