import {
  EntityNotFoundError,
  BusinessRuleViolationError,
  InvalidArgumentError,
} from './domain.error';
import { AppError } from './app.error.base';

export class UserNotFoundError extends EntityNotFoundError {
  constructor(identifier: string) {
    super('User', identifier);
    Object.setPrototypeOf(this, UserNotFoundError.prototype);
  }
}

export class UserAlreadyExistsError extends BusinessRuleViolationError {
  constructor(email: string) {
    super('UniqueEmailConstraint', `A user with email "${email}" already exists`, { email });
    Object.setPrototypeOf(this, UserAlreadyExistsError.prototype);
  }
}

export class InvalidEmailError extends InvalidArgumentError {
  constructor(email: string, reason: string = 'Invalid email format') {
    super('email', reason, { email });
    Object.setPrototypeOf(this, InvalidEmailError.prototype);
  }
}

export class InvalidUserFieldError extends InvalidArgumentError {
  constructor(fieldName: string, reason: string = 'cannot be empty') {
    super(`User.${fieldName}`, reason);
    Object.setPrototypeOf(this, InvalidUserFieldError.prototype);
  }
}

export class NoValidUserFieldsError extends AppError {
  constructor() {
    super('NO_VALID_FIELDS', 400, 'No valid fields to update for User');
    Object.setPrototypeOf(this, NoValidUserFieldsError.prototype);
  }
}
