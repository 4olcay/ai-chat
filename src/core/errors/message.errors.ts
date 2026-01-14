import { InvalidArgumentError } from './domain.error';

export class InvalidMessageFieldError extends InvalidArgumentError {
  constructor(fieldName: string, reason: string = 'cannot be empty') {
    super(`Message.${fieldName}`, reason);
    Object.setPrototypeOf(this, InvalidMessageFieldError.prototype);
  }
}
