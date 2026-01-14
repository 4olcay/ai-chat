import { AppError } from './app.error.base';

export class DatabaseError extends AppError {
  constructor(message: string, details?: Record<string, unknown>) {
    super('DATABASE_ERROR', 500, message, details);
    Object.setPrototypeOf(this, DatabaseError.prototype);
  }
}

export class InternalServerError extends AppError {
  constructor(message: string, details?: Record<string, unknown>) {
    super('INTERNAL_SERVER_ERROR', 500, message, details);
    Object.setPrototypeOf(this, InternalServerError.prototype);
  }
}

export class ConfigurationError extends AppError {
  constructor(message: string) {
    super('CONFIGURATION_ERROR', 500, message);
    Object.setPrototypeOf(this, ConfigurationError.prototype);
  }
}

export class NoValidFieldsError extends AppError {
  constructor(resource: string) {
    super('NO_VALID_FIELDS', 400, `No valid fields to update for ${resource}`);
    Object.setPrototypeOf(this, NoValidFieldsError.prototype);
  }
}

export class TimeoutError extends AppError {
  constructor(operation: string, timeoutMs: number) {
    super('TIMEOUT', 504, `${operation} timed out after ${timeoutMs}ms`);
    Object.setPrototypeOf(this, TimeoutError.prototype);
  }
}
