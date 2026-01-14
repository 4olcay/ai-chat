import { ChatEntity, MessageEntity } from '@/domain/chat';
import { ChatResponse, MessageDto, CreateChatDto } from '../dtos/chat.dto';
import type { ChatPersistenceModel, MessagePersistenceModel } from '@/application/shared';
import { MessageRole } from '@/core/constants';

export class ChatMapper {
  static toDTO(entity: ChatEntity): ChatResponse {
    return {
      id: entity.id,
      userId: entity.userId,
      title: entity.title,
      createdAt: entity.createdAt,
      updatedAt: entity.updatedAt,
    };
  }

  static messageToDomain(dbMessage: MessagePersistenceModel): MessageEntity {
    return new MessageEntity(
      dbMessage.id,
      dbMessage.chatId,
      dbMessage.role as MessageRole,
      dbMessage.content,
      dbMessage.createdAt,
      dbMessage.metadata as Record<string, unknown> | undefined
    );
  }

  static messageToDTO(entity: MessageEntity): MessageDto {
    return {
      id: entity.id,
      chatId: entity.chatId,
      role: entity.role,
      content: entity.content,
      createdAt: entity.createdAt,
      metadata: entity.metadata,
    };
  }

  static toDomain(dbChat: ChatPersistenceModel): ChatEntity {
    return new ChatEntity(
      dbChat.id,
      dbChat.userId,
      dbChat.title,
      dbChat.createdAt,
      dbChat.updatedAt
    );
  }

  static toDomainFromCreate(id: string, userId: string, dto: CreateChatDto): ChatEntity {
    const now = new Date();
    return new ChatEntity(id, userId, dto.title, now, now);
  }

  static toPersistence(entity: ChatEntity): Partial<ChatPersistenceModel> {
    return {
      id: entity.id,
      userId: entity.userId,
      title: entity.title,
      createdAt: entity.createdAt,
      updatedAt: entity.updatedAt,
    };
  }

  static messageToPersistence(entity: MessageEntity): Partial<MessagePersistenceModel> {
    return {
      id: entity.id,
      chatId: entity.chatId,
      role: entity.role,
      content: entity.content,
      createdAt: entity.createdAt,
      metadata: entity.metadata || null,
    };
  }
}
