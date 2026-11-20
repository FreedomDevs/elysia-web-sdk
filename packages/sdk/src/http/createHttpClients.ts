import axios, { type AxiosInstance } from 'axios';
import type { ElysiaConfig } from '../client/ElysiaConfig';
import { createRefreshManager } from './refresh';
import { installAuthorizationInterceptor } from './interceptors/authorization';
import { installErrorInterceptor } from '../errors/errorInterceptor';

export interface ElysiaHttpClients {
  ssoApi: AxiosInstance;
  api: AxiosInstance;
}

export const createHttpClients = (
  config: ElysiaConfig
): ElysiaHttpClients => {
  const defaults = {
    baseURL: config.baseURL,
    timeout: config.timeout,
  };

  const ssoApi = axios.create(defaults);
  const api = axios.create(defaults);

  const refreshManager = createRefreshManager(
    ssoApi,
    config.tokenStorage
  );

  installAuthorizationInterceptor(
    api,
    config.tokenStorage,
    refreshManager.refreshAccessToken
  );

  installErrorInterceptor(ssoApi);
  installErrorInterceptor(api);

  return {
    ssoApi,
    api,
  };
};
