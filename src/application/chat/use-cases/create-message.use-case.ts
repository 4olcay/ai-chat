import { injectable, inject } from 'tsyringe';
import type { IChatRepository } from '@/domain/chat';
import { MessageEntity } from '@/domain/chat';
import type { MessageDto } from '../dtos/chat.dto';
import { ChatMapper } from '../mappers/chat.mapper';
import { MessageRole } from '@/core/constants';

export interface CreateMessageRequest {
  chatId: string;
  content: string;
  role: MessageRole;
  metadata?: Record<string, unknown>;
}

@injectable()
export class CreateMessageUseCase {
  constructor(@inject('IChatRepository') private chatRepository: IChatRepository) {}

  async execute(request: CreateMessageRequest): Promise<MessageDto> {
    const message = new MessageEntity(
      undefined,
      request.chatId,
      request.role,
      request.content,
      undefined,
      request.metadata
    );

    const savedMessage = await this.chatRepository.createMessage(message);
    return ChatMapper.messageToDTO(savedMessage);
  }
}
