import axios from 'axios';
import MockAdapter from 'axios-mock-adapter';
import { afterEach, beforeEach, describe, expect, it } from 'vitest';

import { AuthApi } from '../auth';
import type { SuccessResponse } from '../../../types';

describe('AuthApi', () => {
  let ssoMock: MockAdapter;
  let apiMock: MockAdapter;
  let auth: AuthApi;

  const success = <T>(data: T): SuccessResponse<T> => ({
    data,
    message: 'Success',
    meta: {
      traceId: 'test-trace-id',
      timestamp: '2026-11-20T00:00:00.000Z',
    },
  });

  beforeEach(() => {
    const ssoApi = axios.create();
    const api = axios.create();

    ssoMock = new MockAdapter(ssoApi);
    apiMock = new MockAdapter(api);

    auth = new AuthApi(ssoApi, api);
  });

  afterEach(() => {
    ssoMock.restore();
    apiMock.restore();
  });

  it('login', async () => {
    const request = {
      login: 'test',
      password: 'password',
    };

    const response = {
      refresh_token: 'refresh-token',
    };

    ssoMock.onPost('/auth/login').reply(200, success(response));

    await expect(auth.login(request)).resolves.toEqual(response);
  });

  it('register', async () => {
    const request = {
      login: 'test',
      email: 'test@example.com',
      password: 'password',
    };

    const response = {
      email_verefication_token: 'verification-token',
    };

    ssoMock.onPost('/auth/register').reply(200, success(response));

    await expect(auth.register(request)).resolves.toEqual(response);
  });

  it('confirmEmail', async () => {
    const request = {
      email_verefication_token: 'verification-token',
      code: '123456',
    };

    const response = {
      refresh_token: 'refresh-token',
    };

    ssoMock.onPost('/auth/confirm_email').reply(200, success(response));

    await expect(auth.confirmEmail(request)).resolves.toEqual(response);
  });

  it('refresh', async () => {
    const request = {
      method: 'Web' as const,
      refresh_token: 'refresh-token',
    };

    const response = {
      token: 'access-token',
    };

    ssoMock.onPost('/auth/refresh').reply(200, success(response));

    await expect(auth.refresh(request)).resolves.toEqual(response);
  });

  it('resendEmail', async () => {
    const request = {
      email_verification_token: 'verification-token',
    };

    const response = success(null);

    ssoMock.onPost('/auth/resend_email').reply(200, response);

    await expect(auth.resendEmail(request)).resolves.toEqual(response);
  });

  it('checkRefreshToken', async () => {
    const request = {
      refresh_token: 'refresh-token',
    };

    const response = success(null);

    ssoMock.onPost('/auth/check_refresh_token').reply(200, response);

    await expect(auth.checkRefreshToken(request)).resolves.toEqual(response);
  });

  it('createChildToken', async () => {
    const request = {
      refresh_token: 'refresh-token',
    };

    const response = {
      refresh_token: 'child-refresh-token',
    };

    ssoMock
      .onPost('/auth/create_child_token')
      .reply(200, success(response));

    await expect(auth.createChildToken(request)).resolves.toEqual(response);
  });

  it('clientInfo', async () => {
    const response = {
      client_name: 'Test Client',
      description: 'Test description',
      redirect_url: 'https://example.com/callback',
    };

    ssoMock
      .onGet('/auth/client_info/test-client')
      .reply(200, success(response));

    await expect(
      auth.clientInfo({ client_id: 'test-client' })
    ).resolves.toEqual(response);
  });

  it('refreshPassword', async () => {
    const request = {
      login_or_email: 'test@example.com',
      password: 'new-password',
    };

    const response = {
      email_verefication_token: 'verification-token',
    };

    ssoMock
      .onPost('/auth/refresh_password')
      .reply(200, success(response));

    await expect(auth.refreshPassword(request)).resolves.toEqual(response);
  });

  it('getMyIntegrations', async () => {
    const response = {
      email: 'test@example.com',
    };

    apiMock
      .onGet('/auth/get_my_integrations')
      .reply(200, success(response));

    await expect(auth.getMyIntegrations()).resolves.toEqual(response);
  });
});
