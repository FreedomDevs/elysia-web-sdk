import type { ElysiaConfig } from './ElysiaConfig';
import {
  createHttpClients,
  type ElysiaHttpClients,
} from '../http/createHttpClients';
import { AuthApi } from '../api/auth';
import { UsersApi } from '../api/users';

export class ElysiaClient {
  public readonly config: Readonly<ElysiaConfig>;
  public readonly http: ElysiaHttpClients;
  public readonly auth: AuthApi;
  public readonly users: UsersApi;

  constructor(config: ElysiaConfig) {
    this.config = Object.freeze({
      timeout: 10000,
      ...config,
    });

    this.http = createHttpClients(this.config);

    this.auth = new AuthApi(this.http.ssoApi, this.http.api);
    this.users = new UsersApi(this.http.api);
  }
}
