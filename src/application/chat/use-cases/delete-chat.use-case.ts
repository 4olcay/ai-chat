import { injectable, inject } from 'tsyringe';
import type { IChatRepository } from '@/domain/chat';
import { UserDoesNotOwnChatError } from '@/core/errors';

@injectable()
export class DeleteChatUseCase {
  constructor(@inject('IChatRepository') private chatRepository: IChatRepository) {}

  async execute(chatId: string, userId: string): Promise<void> {
    const owns = await this.chatRepository.userOwnsChat(chatId, userId);
    if (!owns) {
      throw new UserDoesNotOwnChatError(userId, chatId);
    }

    await this.chatRepository.softDelete(chatId);
  }
}
