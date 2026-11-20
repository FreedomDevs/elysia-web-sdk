import type { AxiosInstance } from 'axios';
import type { SuccessResponse } from '../../types';
import type {
  LoginRequest,
  LoginResponse,
  RegisterRequest,
  RegisterResponse,
  ConfirmEmailRequest,
  ConfirmEmailResponse,
  ResendEmailRequest,
  CheckRefreshTokenRequest,
  CreateChildTokenRequest,
  CreateChildTokenResponse,
  ClientInfoRequest,
  ClientInfoResponse,
  RefreshRequest,
  RefreshResponse,
  RefreshPasswordRequest,
  RefreshPasswordResponse,
  GetMyIntegrationsResponse,
} from './types';

export class AuthApi {
  constructor(
    private readonly ssoApi: AxiosInstance,
    private readonly api: AxiosInstance
  ) { }

  private async getData<T>(
    request: Promise<{ data: SuccessResponse<T> }>
  ): Promise<T> {
    const response = await request;

    if (response.data.data === undefined) {
      throw new Error('Response data is missing');
    }

    return response.data.data;
  }

  login(data: LoginRequest): Promise<LoginResponse> {
    return this.getData(this.ssoApi.post('/auth/login', data));
  }

  register(data: RegisterRequest): Promise<RegisterResponse> {
    return this.getData(this.ssoApi.post('/auth/register', data));
  }

  confirmEmail(data: ConfirmEmailRequest): Promise<ConfirmEmailResponse> {
    return this.getData(
      this.ssoApi.post('/auth/confirm_email', data)
    );
  }

  resendEmail(data: ResendEmailRequest): Promise<SuccessResponse<null>> {
    return this.ssoApi
      .post<SuccessResponse<null>>('/auth/resend_email', data)
      .then((response) => response.data);
  }

  refresh(data: RefreshRequest): Promise<RefreshResponse> {
    return this.getData(this.ssoApi.post('/auth/refresh', data));
  }

  checkRefreshToken(
    data: CheckRefreshTokenRequest
  ): Promise<SuccessResponse<null>> {
    return this.ssoApi
      .post<SuccessResponse<null>>('/auth/check_refresh_token', data)
      .then((response) => response.data);
  }

  createChildToken(
    data: CreateChildTokenRequest
  ): Promise<CreateChildTokenResponse> {
    return this.getData(
      this.ssoApi.post('/auth/create_child_token', data)
    );
  }

  clientInfo(data: ClientInfoRequest): Promise<ClientInfoResponse> {
    return this.getData(
      this.ssoApi.get(`/auth/client_info/${data.client_id}`)
    );
  }

  refreshPassword(
    data: RefreshPasswordRequest
  ): Promise<RefreshPasswordResponse> {
    return this.getData(
      this.ssoApi.post('/auth/refresh_password', data)
    );
  }

  getMyIntegrations(): Promise<GetMyIntegrationsResponse> {
    return this.getData(
      this.api.get('/auth/get_my_integrations')
    );
  }
}
