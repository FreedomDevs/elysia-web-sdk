import type { AxiosInstance } from 'axios';
import type { SuccessResponse } from '../../types';
import type {
  MeResponse,
  NameHistoryResponse,
  UpdateMyNameRequest,
  UpdateMyNameResponse,
} from './types';

export class UsersApi {
  constructor(private readonly http: AxiosInstance) { }

  private async getData<T>(
    request: Promise<{ data: SuccessResponse<T> }>
  ): Promise<T> {
    const response = await request;

    if (response.data.data === undefined) {
      throw new Error('Response data is missing');
    }

    return response.data.data;
  }

  me(): Promise<MeResponse> {
    return this.getData(
      this.http.get('/users/me')
    );
  }

  getMyNameHistory(): Promise<NameHistoryResponse> {
    return this.getData(
      this.http.get('/users/me/name')
    );
  }

  updateMyName(
    data: UpdateMyNameRequest
  ): Promise<UpdateMyNameResponse> {
    return this.getData(
      this.http.put('/users/me/name', data)
    );
  }
}
