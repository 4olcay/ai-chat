import { EntityNotFoundError, UnauthorizedAccessError, InvalidArgumentError } from './domain.error';
import { AppError } from './app.error.base';

export class ChatNotFoundError extends EntityNotFoundError {
  constructor(chatId: string) {
    super('Chat', chatId);
    Object.setPrototypeOf(this, ChatNotFoundError.prototype);
  }
}

export class UserDoesNotOwnChatError extends UnauthorizedAccessError {
  constructor(userId: string, chatId: string) {
    super(`User ${userId} does not own chat ${chatId}`);
    Object.setPrototypeOf(this, UserDoesNotOwnChatError.prototype);
  }
}

export class InvalidChatFieldError extends InvalidArgumentError {
  constructor(fieldName: string, reason: string = 'cannot be empty') {
    super(`Chat.${fieldName}`, reason);
    Object.setPrototypeOf(this, InvalidChatFieldError.prototype);
  }
}

export class InvalidChatTitleError extends InvalidArgumentError {
  constructor(reason: string = 'Chat title is invalid') {
    super('Chat.title', reason);
    Object.setPrototypeOf(this, InvalidChatTitleError.prototype);
  }
}

export class NoValidChatFieldsError extends AppError {
  constructor() {
    super('NO_VALID_FIELDS', 400, 'No valid fields to update for Chat');
    Object.setPrototypeOf(this, NoValidChatFieldsError.prototype);
  }
}
