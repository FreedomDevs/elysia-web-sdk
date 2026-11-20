import axios from 'axios';
import MockAdapter from 'axios-mock-adapter';
import { afterEach, beforeEach, describe, expect, it } from 'vitest';

import { UsersApi } from '../users';
import type { SuccessResponse } from '../../../types';

describe('UsersApi', () => {
  let mock: MockAdapter;
  let users: UsersApi;

  const success = <T>(data: T): SuccessResponse<T> => ({
    data,
    message: 'Success',
    meta: {
      traceId: 'test-trace-id',
      timestamp: '2026-11-20T00:00:00.000Z',
    },
  });

  beforeEach(() => {
    const http = axios.create();

    mock = new MockAdapter(http);
    users = new UsersApi(http);
  });

  afterEach(() => {
    mock.restore();
  });

  it('me', async () => {
    const response = {
      id: 'user-id',
      name: 'TestUser',
      groups: ['default'],
      permissions: {
        users: ['read'],
      },
      createdAt: '2026-01-01T00:00:00.000Z',
      updatedAt: '2026-01-02T00:00:00.000Z',
    };

    mock.onGet('/users/me').reply(200, success(response));

    await expect(users.me()).resolves.toEqual(response);
  });

  it('getMyNameHistory', async () => {
    const response = {
      history: [
        {
          id: 'history-id',
          name: 'OldName',
          changedAt: '2026-01-01T00:00:00.000Z',
        },
      ],
    };

    mock
      .onGet('/users/me/name')
      .reply(200, success(response));

    await expect(users.getMyNameHistory()).resolves.toEqual(response);
  });

  it('updateMyName', async () => {
    const request = {
      name: 'NewName',
    };

    const response = {
      name: 'NewName',
    };

    mock
      .onPut('/users/me/name', request)
      .reply(200, success(response));

    await expect(users.updateMyName(request)).resolves.toEqual(response);
  });
});
