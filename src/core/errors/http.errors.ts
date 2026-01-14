import { AppError } from './app.error.base';

export class ValidationError extends AppError {
  constructor(message: string, details?: Record<string, unknown>) {
    super('VALIDATION_ERROR', 400, message, details);
    Object.setPrototypeOf(this, ValidationError.prototype);
  }
}

export class MissingAuthorizationHeaderError extends AppError {
  constructor() {
    super('MISSING_AUTHORIZATION_HEADER', 401, 'Missing authorization header');
    Object.setPrototypeOf(this, MissingAuthorizationHeaderError.prototype);
  }
}

export class InvalidAuthorizationSchemeError extends AppError {
  constructor() {
    super('INVALID_AUTHORIZATION_SCHEME', 401, 'Invalid authorization scheme');
    Object.setPrototypeOf(this, InvalidAuthorizationSchemeError.prototype);
  }
}

export class MissingJWTTokenError extends AppError {
  constructor() {
    super('MISSING_JWT_TOKEN', 401, 'Missing JWT token');
    Object.setPrototypeOf(this, MissingJWTTokenError.prototype);
  }
}

export class UnauthorizedError extends AppError {
  constructor(message: string = 'Unauthorized') {
    super('UNAUTHORIZED', 401, message);
    Object.setPrototypeOf(this, UnauthorizedError.prototype);
  }
}

export class ForbiddenError extends AppError {
  constructor(message: string = 'Forbidden') {
    super('FORBIDDEN', 403, message);
    Object.setPrototypeOf(this, ForbiddenError.prototype);
  }
}

export class NotFoundError extends AppError {
  constructor(resource: string, id?: string) {
    super('NOT_FOUND', 404, `${resource} not found${id ? ` with id: ${id}` : ''}`);
    Object.setPrototypeOf(this, NotFoundError.prototype);
  }
}

export class UnauthorizedChatAccessError extends AppError {
  constructor() {
    super('UNAUTHORIZED_CHAT_ACCESS', 403, 'Unauthorized access to chat');
    Object.setPrototypeOf(this, UnauthorizedChatAccessError.prototype);
  }
}

export class MissingAppCheckTokenError extends AppError {
  constructor() {
    super('MISSING_APP_CHECK_TOKEN', 401, 'Firebase App Check token is required');
    Object.setPrototypeOf(this, MissingAppCheckTokenError.prototype);
  }
}

export class InvalidAppCheckTokenError extends AppError {
  constructor() {
    super('INVALID_APP_CHECK_TOKEN', 401, 'Firebase App Check token validation failed');
    Object.setPrototypeOf(this, InvalidAppCheckTokenError.prototype);
  }
}
