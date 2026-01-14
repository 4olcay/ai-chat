import { DomainError } from './domain.error';

export class AuthenticationError extends DomainError {
  constructor(code: string, message: string, details?: Record<string, unknown>) {
    super(code, 401, message, details);
    Object.setPrototypeOf(this, AuthenticationError.prototype);
  }
}

export class InvalidTokenError extends AuthenticationError {
  constructor(reason: string = 'Token validation failed') {
    super('INVALID_TOKEN', reason);
    Object.setPrototypeOf(this, InvalidTokenError.prototype);
  }
}

export class InvalidCredentialsError extends AuthenticationError {
  constructor(message: string = 'Invalid authentication credentials') {
    super('INVALID_CREDENTIALS', message);
    Object.setPrototypeOf(this, InvalidCredentialsError.prototype);
  }
}
