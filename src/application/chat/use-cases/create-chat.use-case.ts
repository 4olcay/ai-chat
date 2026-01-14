import { injectable, inject } from 'tsyringe';
import type { IChatRepository } from '@/domain/chat';
import { CreateChatDto, ChatResponse } from '../dtos/chat.dto';
import { ChatMapper } from '../mappers/chat.mapper';
import { ChatEntity } from '@/domain/chat';

@injectable()
export class CreateChatUseCase {
  constructor(@inject('IChatRepository') private chatRepository: IChatRepository) {}

  async execute(userId: string, dto: CreateChatDto): Promise<ChatResponse> {
    const chatEntity = new ChatEntity(undefined, userId, dto.title, undefined, undefined);
    const savedEntity = await this.chatRepository.create(chatEntity);
    return ChatMapper.toDTO(savedEntity);
  }
}
