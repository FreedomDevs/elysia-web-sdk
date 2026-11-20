export interface TokenStorage {
  getAccessToken(): string | null | Promise<string | null>;
  setAccessToken(token: string): void | Promise<void>;
  getRefreshToken(): string | null | Promise<string | null>;
  clearAccessToken(): void | Promise<void>;
}
