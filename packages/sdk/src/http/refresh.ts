import type { AxiosInstance } from 'axios';
import type { TokenStorage } from '../storage/TokenStorage';

interface RefreshRequest {
  method: 'Web';
  refresh_token: string;
}

interface RefreshResponse {
  token: string;
}

interface SuccessResponse<T> {
  data: T;
}

export const createRefreshManager = (
  ssoApi: AxiosInstance,
  storage: TokenStorage
) => {
  let refreshPromise: Promise<string> | null = null;

  const refreshAccessToken = (): Promise<string> => {
    if (!refreshPromise) {
      refreshPromise = (async () => {
        const refreshToken = await storage.getRefreshToken();

        if (!refreshToken) {
          throw new Error('REFRESH_TOKEN_MISSING');
        }

        const request: RefreshRequest = {
          method: 'Web',
          refresh_token: refreshToken,
        };

        const response = await ssoApi.post<
          SuccessResponse<RefreshResponse>
        >('/auth/refresh', request);

        const token = response.data.data?.token;

        if (!token) {
          throw new Error('REFRESH_TOKEN_RESPONSE_INVALID');
        }

        await storage.setAccessToken(token);

        return token;
      })().finally(() => {
        refreshPromise = null;
      });
    }

    return refreshPromise;
  };

  return { refreshAccessToken };
};
