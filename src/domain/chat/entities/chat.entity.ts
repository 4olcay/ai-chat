import { InvalidChatFieldError } from '@/core/errors';

export class ChatEntity {
  constructor(
    readonly id: string | undefined,
    readonly userId: string,
    readonly title: string,
    readonly createdAt: Date | undefined,
    readonly updatedAt: Date | undefined
  ) {
    this.validateInvariants();
  }

  private validateInvariants(): void {
    if (this.id && this.id.trim().length === 0) {
      throw new InvalidChatFieldError('id', 'cannot be empty');
    }
    if (!this.userId || this.userId.trim().length === 0) {
      throw new InvalidChatFieldError('userId', 'cannot be empty');
    }
    if (!this.title || this.title.trim().length === 0) {
      throw new InvalidChatFieldError('title', 'cannot be empty');
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

  updateTitle(newTitle: string): ChatEntity {
    return new ChatEntity(this.id, this.userId, newTitle, this.createdAt, new Date());
  }
}
