export enum DatabaseErrorCode {
  UNIQUE_VIOLATION = '23505',
  FOREIGN_KEY_VIOLATION = '23503',
  NOT_NULL_VIOLATION = '23502',
  CHECK_VIOLATION = '23514',
  TIMEOUT = 'TIMEOUT',
  CONNECTION_ERROR = 'CONNECTION_ERROR',
  UNKNOWN = 'UNKNOWN',
}

export interface DatabaseErrorResponse {
  code: string;
  statusCode: number;
  message: string;
}

const ERROR_CODE_MAP: Record<DatabaseErrorCode, DatabaseErrorResponse> = {
  [DatabaseErrorCode.UNIQUE_VIOLATION]: {
    code: 'UNIQUE_VIOLATION',
    statusCode: 409,
    message: 'A record with this value already exists',
  },
  [DatabaseErrorCode.FOREIGN_KEY_VIOLATION]: {
    code: 'FOREIGN_KEY_VIOLATION',
    statusCode: 400,
    message: 'Invalid reference to related record',
  },
  [DatabaseErrorCode.NOT_NULL_VIOLATION]: {
    code: 'NOT_NULL_VIOLATION',
    statusCode: 400,
    message: 'Required field is missing',
  },
  [DatabaseErrorCode.CHECK_VIOLATION]: {
    code: 'CHECK_VIOLATION',
    statusCode: 400,
    message: 'Invalid value provided',
  },
  [DatabaseErrorCode.TIMEOUT]: {
    code: 'DATABASE_TIMEOUT',
    statusCode: 504,
    message: 'Database operation timed out',
  },
  [DatabaseErrorCode.CONNECTION_ERROR]: {
    code: 'DATABASE_CONNECTION_ERROR',
    statusCode: 503,
    message: 'Database connection failed',
  },
  [DatabaseErrorCode.UNKNOWN]: {
    code: 'DATABASE_ERROR',
    statusCode: 500,
    message: 'An unexpected database error occurred',
  },
};

export function mapDatabaseError(error: Error & { code?: string }): DatabaseErrorResponse {
  const errorCode = (error.code || DatabaseErrorCode.UNKNOWN) as DatabaseErrorCode;
  return ERROR_CODE_MAP[errorCode] ?? ERROR_CODE_MAP[DatabaseErrorCode.UNKNOWN];
}

export function isDatabaseTimeout(error: Error): boolean {
  return (
    error instanceof Error &&
    (error.message.includes('timeout') || error.name === 'QueryTimeoutError')
  );
}

export function isConnectionError(error: Error): boolean {
  return error instanceof Error && /connect|ECONNREFUSED|ECONNRESET/i.test(error.message);
}
