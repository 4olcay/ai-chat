import { injectable } from 'tsyringe';
import { eq, and, isNull, count } from 'drizzle-orm';
import { applyPagination } from '@/infrastructure/shared';
import { ChatEntity, MessageEntity, IChatRepository } from '@/domain/chat';
import { chatsTable, messagesTable } from './schema';
import { ChatMapper } from '@/application/chat';
import { DatabaseConnection } from '@/infrastructure/shared';
import { NoValidChatFieldsError } from '@/core/errors';
import { MessageRole } from '@/core/constants';

@injectable()
export class ChatRepositoryImpl implements IChatRepository {
  private db = DatabaseConnection.getInstance();

  async findById(id: string, userId: string): Promise<ChatEntity | null> {
    const result = await this.db
      .select()
      .from(chatsTable)
      .where(
        and(eq(chatsTable.id, id), eq(chatsTable.userId, userId), isNull(chatsTable.deletedAt))
      )
      .limit(1);

    if (!result[0]) return null;
    return ChatMapper.toDomain(result[0]);
  }

  async findByIdWithMessages(
    id: string,
    userId: string,
    limit?: number,
    offset?: number
  ): Promise<{ chat: ChatEntity; messages: MessageEntity[]; totalCount: number } | null> {
    const chatResult = await this.db
      .select()
      .from(chatsTable)
      .where(
        and(eq(chatsTable.id, id), eq(chatsTable.userId, userId), isNull(chatsTable.deletedAt))
      )
      .limit(1);

    if (!chatResult[0]) return null;

    const chat = ChatMapper.toDomain(chatResult[0]);

    const countResult = await this.db
      .select({ count: count() })
      .from(messagesTable)
      .where(and(eq(messagesTable.chatId, id), isNull(messagesTable.deletedAt)));

    const totalCount = countResult[0]?.count || 0;

    const baseQuery = this.db
      .select()
      .from(messagesTable)
      .where(and(eq(messagesTable.chatId, id), isNull(messagesTable.deletedAt)))
      .orderBy(messagesTable.createdAt);

    const messagesResult = await applyPagination(baseQuery, limit, offset);
    const messages = messagesResult.map((msg) => ChatMapper.messageToDomain(msg));

    return { chat, messages, totalCount };
  }

  async findAllByUserId(userId: string): Promise<ChatEntity[]> {
    const results = await this.db
      .select()
      .from(chatsTable)
      .where(and(eq(chatsTable.userId, userId), isNull(chatsTable.deletedAt)))
      .orderBy(chatsTable.createdAt);

    return results.map((chat) => ChatMapper.toDomain(chat));
  }

  async userOwnsChat(chatId: string, userId: string): Promise<boolean> {
    const result = await this.db
      .select({ id: chatsTable.id })
      .from(chatsTable)
      .where(
        and(eq(chatsTable.id, chatId), eq(chatsTable.userId, userId), isNull(chatsTable.deletedAt))
      )
      .limit(1);

    return result.length > 0;
  }

  async create(chat: ChatEntity): Promise<ChatEntity> {
    const persistenceModel = ChatMapper.toPersistence(chat);
    const result = await this.db
      .insert(chatsTable)
      .values({
        id: persistenceModel.id!,
        userId: persistenceModel.userId!,
        title: persistenceModel.title!,
        createdAt: persistenceModel.createdAt,
        updatedAt: persistenceModel.updatedAt,
      })
      .returning();

    return ChatMapper.toDomain(result[0]);
  }

  async update(id: string, chat: ChatEntity): Promise<ChatEntity> {
    const safeUpdates: Record<string, string | Date> = {};

    if (chat.title) safeUpdates.title = chat.title;
    safeUpdates.updatedAt = new Date();

    if (Object.keys(safeUpdates).length === 0) {
      throw new NoValidChatFieldsError();
    }

    const result = await this.db
      .update(chatsTable)
      .set(safeUpdates)
      .where(eq(chatsTable.id, id))
      .returning();

    return ChatMapper.toDomain(result[0]);
  }

  async delete(id: string): Promise<void> {
    await this.db.delete(chatsTable).where(eq(chatsTable.id, id));
  }

  async softDelete(id: string): Promise<void> {
    await this.db.update(chatsTable).set({ deletedAt: new Date() }).where(eq(chatsTable.id, id));
  }

  async restore(id: string): Promise<void> {
    await this.db.update(chatsTable).set({ deletedAt: null }).where(eq(chatsTable.id, id));
  }

  async messageExists(messageId: string): Promise<boolean> {
    const result = await this.db
      .select({ id: messagesTable.id })
      .from(messagesTable)
      .where(and(eq(messagesTable.id, messageId), isNull(messagesTable.deletedAt)))
      .limit(1);

    return result.length > 0;
  }

  async createMessage(message: MessageEntity): Promise<MessageEntity> {
    const persistenceModel = ChatMapper.messageToPersistence(message);
    const result = await this.db
      .insert(messagesTable)
      .values({
        id: persistenceModel.id,
        chatId: persistenceModel.chatId!,
        role: persistenceModel.role! as MessageRole,
        content: persistenceModel.content!,
        metadata: persistenceModel.metadata,
      })
      .returning();

    return ChatMapper.messageToDomain(result[0]);
  }

  async findMessagesByChatId(
    chatId: string,
    limit?: number,
    offset?: number
  ): Promise<MessageEntity[]> {
    const baseQuery = this.db
      .select()
      .from(messagesTable)
      .where(and(eq(messagesTable.chatId, chatId), isNull(messagesTable.deletedAt)))
      .orderBy(messagesTable.createdAt);

    const results = await applyPagination(baseQuery, limit, offset);
    return results.map((msg) => ChatMapper.messageToDomain(msg));
  }

  async deleteMessage(messageId: string): Promise<void> {
    await this.db
      .update(messagesTable)
      .set({ deletedAt: new Date() })
      .where(eq(messagesTable.id, messageId));
  }
}
