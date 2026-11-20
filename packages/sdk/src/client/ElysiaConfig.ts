import type { TokenStorage } from '../storage/TokenStorage';

export interface ElysiaConfig {
  baseURL: string;
  tokenStorage: TokenStorage;
  timeout?: number;
}
