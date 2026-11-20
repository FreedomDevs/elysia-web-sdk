export interface ElysiaErrorOptions {
  code: string;
  status?: number;
  traceId?: string;
  details?: unknown;
  cause?: unknown;
}

export class ElysiaError extends Error {
  public readonly code: string;
  public readonly status?: number;
  public readonly traceId?: string;
  public readonly details?: unknown;

  constructor(message: string, options: ElysiaErrorOptions) {
    super(message, { cause: options.cause });

    this.name = 'ElysiaError';
    this.code = options.code;
    this.status = options.status;
    this.traceId = options.traceId;
    this.details = options.details;
  }
}
