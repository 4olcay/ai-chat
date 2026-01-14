import { AppError } from './app.error.base';

export class DomainError extends AppError {
  constructor(
    code: string,
    statusCode: number,
    message: string,
    details?: Record<string, unknown>
  ) {
    super(code, statusCode, message, details);
    Object.setPrototypeOf(this, DomainError.prototype);
  }
}

export class EntityNotFoundError extends DomainError {
  constructor(entityName: string, identifier?: string | number) {
    const identifierStr = identifier ? ` with id: ${identifier}` : '';
    super('ENTITY_NOT_FOUND', 404, `${entityName} not found${identifierStr}`);
    Object.setPrototypeOf(this, EntityNotFoundError.prototype);
  }
}

export class UnauthorizedAccessError extends DomainError {
  constructor(message: string = 'Unauthorized access to resource') {
    super('UNAUTHORIZED_ACCESS', 403, message);
    Object.setPrototypeOf(this, UnauthorizedAccessError.prototype);
  }
}

export class BusinessRuleViolationError extends DomainError {
  constructor(ruleName: string, message: string, details?: Record<string, unknown>) {
    super('BUSINESS_RULE_VIOLATION', 422, message, details);
    Object.setPrototypeOf(this, BusinessRuleViolationError.prototype);
  }
}

export class InvalidArgumentError extends DomainError {
  constructor(argumentName: string, reason: string, details?: Record<string, unknown>) {
    super('INVALID_ARGUMENT', 400, `Invalid ${argumentName}: ${reason}`, details);
    Object.setPrototypeOf(this, InvalidArgumentError.prototype);
  }
}
