import { ChatEntity } from '../entities/chat.entity';
import { MessageEntity } from '../entities/message.entity';

export interface IChatRepository {
  findById(id: string, userId: string): Promise<ChatEntity | null>;
  findByIdWithMessages(
    id: string,
    userId: string,
    limit?: number,
    offset?: number
  ): Promise<{ chat: ChatEntity; messages: MessageEntity[]; totalCount: number } | null>;
  findAllByUserId(userId: string): Promise<ChatEntity[]>;
  userOwnsChat(chatId: string, userId: string): Promise<boolean>;
  create(chat: ChatEntity): Promise<ChatEntity>;
  update(id: string, chat: ChatEntity): Promise<ChatEntity>;
  delete(id: string): Promise<void>;
  softDelete(id: string): Promise<void>;
  restore(id: string): Promise<void>;
  messageExists(messageId: string): Promise<boolean>;
  createMessage(message: MessageEntity): Promise<MessageEntity>;
  findMessagesByChatId(chatId: string, limit?: number, offset?: number): Promise<MessageEntity[]>;
  deleteMessage(messageId: string): Promise<void>;
}
