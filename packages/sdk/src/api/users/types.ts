export interface MeResponse {
  id: string;
  name: string;
  groups: string[];
  permissions: Record<string, string[]>;
  createdAt: string;
  updatedAt: string;
}

export interface NameHistory {
  id: string;
  name: string;
  changedAt: string;
}

export interface NameHistoryResponse {
  history: NameHistory[];
}

export interface UpdateMyNameRequest {
  name: string;
}

export interface UpdateMyNameResponse {
  name: string;
}
