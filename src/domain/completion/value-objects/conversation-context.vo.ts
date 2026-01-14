import type { MessageEntity } from '@/domain/chat/entities/message.entity';

export class ConversationContext {
  readonly chatId: string;
  readonly userId: string;
  readonly messages: MessageEntity[];
  readonly systemInstructions?: string;

  constructor(
    chatId: string,
    userId: string,
    messages: MessageEntity[],
    systemInstructions?: string
  ) {
    if (!chatId || chatId.trim().length === 0) {
      throw new Error('Chat ID cannot be empty');
    }
    if (!userId || userId.trim().length === 0) {
      throw new Error('User ID cannot be empty');
    }
    if (!messages || messages.length === 0) {
      throw new Error('Messages cannot be empty');
    }

    this.chatId = chatId;
    this.userId = userId;
    this.messages = messages;
    this.systemInstructions = systemInstructions;
  }

  getLastUserMessage(): MessageEntity | undefined {
    for (let i = this.messages.length - 1; i >= 0; i--) {
      if (this.messages[i].role === 'user') {
        return this.messages[i];
      }
    }
    return undefined;
  }

  getConversationHistory(): MessageEntity[] {
    return this.messages;
  }

  hasSystemMessages(): boolean {
    return this.messages.some((msg) => msg.role === 'system');
  }
}
