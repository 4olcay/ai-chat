import { MessageRole } from '@/core/constants';
import { InvalidMessageFieldError } from '@/core/errors';

export class MessageEntity {
  constructor(
    readonly id: string | undefined,
    readonly chatId: string,
    readonly role: MessageRole,
    readonly content: string,
    readonly createdAt: Date | undefined,
    readonly metadata?: Record<string, unknown>
  ) {
    this.validateInvariants();
  }

  private validateInvariants(): void {
    if (this.id && this.id.trim().length === 0) {
      throw new InvalidMessageFieldError('id', 'cannot be empty');
    }
    if (!this.chatId || this.chatId.trim().length === 0) {
      throw new InvalidMessageFieldError('chatId', 'cannot be empty');
    }
    if (!this.role) {
      throw new InvalidMessageFieldError('role', 'cannot be empty');
    }
    if (!this.content || this.content.trim().length === 0) {
      throw new InvalidMessageFieldError('content', 'cannot be empty');
    }
  }

  isValid(): boolean {
    try {
      this.validateInvariants();
      return true;
    } catch {
      return false;
    }
  }
}
