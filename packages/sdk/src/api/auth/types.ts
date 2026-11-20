export type RefreshMethods = 'Game' | 'Web';

export interface RefreshRequest {
  method: RefreshMethods;
  refresh_token: string;
}

export interface RefreshResponse {
  token: string;
}

export interface LoginRequest {
  login: string;
  password: string;
}

export interface LoginResponse {
  refresh_token: string;
}

export interface RegisterRequest {
  login: string;
  email: string;
  password: string;
}

export interface RegisterResponse {
  email_verefication_token: string;
}

export interface ConfirmEmailRequest {
  email_verefication_token: string;
  code: string;
}

export interface ConfirmEmailResponse {
  refresh_token: string;
}

export interface ResendEmailRequest {
  email_verification_token: string;
}

export interface CheckRefreshTokenRequest {
  refresh_token: string;
}

export interface CreateChildTokenRequest {
  refresh_token: string;
}

export interface CreateChildTokenResponse {
  refresh_token: string;
}

export interface ClientInfoRequest {
  client_id: string;
}

export interface ClientInfoResponse {
  client_name: string;
  description: string;
  redirect_url: string;
}

export interface RefreshPasswordRequest {
  login_or_email: string;
  password: string;
}

export interface RefreshPasswordResponse {
  email_verefication_token: string;
}

export interface GetMyIntegrationsResponse {
  email: string;
}
