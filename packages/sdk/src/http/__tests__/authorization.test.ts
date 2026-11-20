import { afterEach, describe, expect, it } from 'vitest';
import AxiosMockAdapter from 'axios-mock-adapter';
import { createHttpClients } from '../createHttpClients';
import type { TokenStorage } from '../../storage/TokenStorage';

describe('Authorization interceptor', () => {
  let apiMock: AxiosMockAdapter;
  let ssoMock: AxiosMockAdapter;

  afterEach(() => {
    apiMock?.restore();
    ssoMock?.restore();
  });

  const createStorage = (
    accessToken: string | null,
    refreshToken: string | null = 'master-token'
  ): TokenStorage => ({
    getAccessToken: () => accessToken,
    setAccessToken: () => { },
    getRefreshToken: () => refreshToken,
    clearAccessToken: () => { },
  });

  it('should attach access token to request', async () => {
    const clients = createHttpClients({
      baseURL: 'https://gateway.elysiac.fun',
      tokenStorage: createStorage('access-token'),
    });

    apiMock = new AxiosMockAdapter(clients.api);
    ssoMock = new AxiosMockAdapter(clients.ssoApi);

    apiMock.onGet('/test').reply(200, { success: true });

    const response = await clients.api.get('/test');

    expect(
      response.config.headers.get('Authorization')
    ).toBe('Bearer access-token');
  });

  it('should refresh token when access token is missing', async () => {
    let accessToken: string | null = null;

    const storage: TokenStorage = {
      getAccessToken: () => accessToken,
      setAccessToken: (token) => {
        accessToken = token;
      },
      getRefreshToken: () => 'master-token',
      clearAccessToken: () => {
        accessToken = null;
      },
    };

    const clients = createHttpClients({
      baseURL: 'https://gateway.elysiac.fun',
      tokenStorage: storage,
    });

    apiMock = new AxiosMockAdapter(clients.api);
    ssoMock = new AxiosMockAdapter(clients.ssoApi);

    ssoMock.onPost('/auth/refresh').reply(200, {
      data: {
        token: 'new-access-token',
      },
    });

    apiMock.onGet('/test').reply(200, { success: true });

    const response = await clients.api.get('/test');

    expect(accessToken).toBe('new-access-token');
    expect(
      response.config.headers.get('Authorization')
    ).toBe('Bearer new-access-token');

    expect(ssoMock.history.post).toHaveLength(1);
  });

  it('should use a single refresh for concurrent 401 responses', async () => {
    let accessToken: string | null = 'expired-token';
    let requestCount = 0;

    const storage: TokenStorage = {
      getAccessToken: () => accessToken,
      setAccessToken: (token) => {
        accessToken = token;
      },
      getRefreshToken: () => 'master-token',
      clearAccessToken: () => {
        accessToken = null;
      },
    };

    const clients = createHttpClients({
      baseURL: 'https://gateway.elysiac.fun',
      tokenStorage: storage,
    });

    apiMock = new AxiosMockAdapter(clients.api, {
      delayResponse: 50,
    });

    ssoMock = new AxiosMockAdapter(clients.ssoApi, {
      delayResponse: 50,
    });

    ssoMock.onPost('/auth/refresh').reply(200, {
      data: {
        token: 'new-access-token',
      },
    });

    apiMock.onGet('/test').reply(() => {
      requestCount++;

      if (requestCount <= 3) {
        return [401, { message: 'Unauthorized' }];
      }

      return [200, { success: true }];
    });

    const responses = await Promise.all([
      clients.api.get('/test'),
      clients.api.get('/test'),
      clients.api.get('/test'),
    ]);

    expect(responses).toHaveLength(3);
    expect(accessToken).toBe('new-access-token');
    expect(ssoMock.history.post).toHaveLength(1);
    expect(requestCount).toBe(6);
  });

  it('should reuse refreshed token for a stale 401', async () => {
    let accessToken: string | null = 'expired-token';

    const storage: TokenStorage = {
      getAccessToken: () => accessToken,
      setAccessToken: (token) => {
        accessToken = token;
      },
      getRefreshToken: () => 'master-token',
      clearAccessToken: () => {
        accessToken = null;
      },
    };

    const clients = createHttpClients({
      baseURL: 'https://gateway.elysiac.fun',
      tokenStorage: storage,
    });

    apiMock = new AxiosMockAdapter(clients.api);
    ssoMock = new AxiosMockAdapter(clients.ssoApi);

    let firstRequestCount = 0;
    let secondRequestCount = 0;

    apiMock.onGet('/first').reply(() => {
      firstRequestCount++;

      return firstRequestCount === 1
        ? [401, {}]
        : [200, { success: true }];
    });

    apiMock.onGet('/second').reply(() => {
      secondRequestCount++;

      if (secondRequestCount === 1) {
        return new Promise((resolve) => {
          setTimeout(() => resolve([401, {}]), 150);
        });
      }

      return [200, { success: true }];
    });

    ssoMock.onPost('/auth/refresh').reply(200, {
      data: {
        token: 'new-access-token',
      },
    });

    const [first, second] = await Promise.all([
      clients.api.get('/first'),
      clients.api.get('/second'),
    ]);

    expect(first.status).toBe(200);
    expect(second.status).toBe(200);
    expect(accessToken).toBe('new-access-token');
    expect(ssoMock.history.post).toHaveLength(1);
    expect(firstRequestCount).toBe(2);
    expect(secondRequestCount).toBe(2);
  });
});

