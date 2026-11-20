import axios from 'axios';
import { ElysiaError } from './ElysiaError';
import type { ErrorResponse } from '../types';

const isErrorResponse = (data: unknown): data is ErrorResponse => {
  if (typeof data !== 'object' || data === null) {
    return false;
  }

  const response = data as Record<string, unknown>;
  const error = response.error;

  if (typeof error !== 'object' || error === null) {
    return false;
  }

  const payload = error as Record<string, unknown>;

  return (
    typeof payload.message === 'string' &&
    typeof payload.code === 'string'
  );
};

export const normalizeError = (error: unknown): ElysiaError => {
  if (error instanceof ElysiaError) {
    return error;
  }

  if (axios.isAxiosError(error)) {
    const status = error.response?.status;
    const data = error.response?.data;

    if (isErrorResponse(data)) {
      return new ElysiaError(data.error.message, {
        code: data.error.code,
        status,
        traceId: data.meta?.traceId,
        details: data.error.details,
        cause: error,
      });
    }

    if (!error.response) {
      return new ElysiaError('Network request failed', {
        code: 'NETWORK_ERROR',
        cause: error,
      });
    }

    return new ElysiaError('HTTP request failed', {
      code: 'HTTP_ERROR',
      status,
      cause: error,
    });
  }

  return new ElysiaError(
    error instanceof Error ? error.message : 'Unknown error',
    {
      code: 'UNKNOWN_ERROR',
      cause: error,
    }
  );
};
