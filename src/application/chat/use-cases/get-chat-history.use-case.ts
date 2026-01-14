import { injectable, inject } from 'tsyringe';
import type { IChatRepository } from '@/domain/chat';
import { ChatWithMessagesResponse } from '../dtos/chat.dto';
import { ChatMapper } from '../mappers/chat.mapper';
import { ChatNotFoundError } from '@/core/errors';
import { GetMultipleFlagsUseCase } from '@/application/feature-flag';
import { validateFlagAsLimit, constrainLimit } from '@/application/shared';
import { FEATURE_FLAGS } from '@/core/constants';
import type { PaginationParams } from '@/application/shared';

@injectable()
export class GetChatHistoryUseCase {
  constructor(
    @inject('IChatRepository') private chatRepository: IChatRepository,
    @inject(GetMultipleFlagsUseCase) private getMultipleFlagsUseCase: GetMultipleFlagsUseCase
  ) {}

  async execute(
    chatId: string,
    userId: string,
    pagination: PaginationParams
  ): Promise<ChatWithMessagesResponse> {
    const flags = await this.getMultipleFlagsUseCase.execute([
      FEATURE_FLAGS.CHAT_HISTORY_ENABLED,
      FEATURE_FLAGS.PAGINATION_LIMIT,
    ]);

    const historyEnabled = flags[FEATURE_FLAGS.CHAT_HISTORY_ENABLED].value === 'true';
    const maxLimit = validateFlagAsLimit(flags[FEATURE_FLAGS.PAGINATION_LIMIT].value);
    const limit = constrainLimit(pagination.limit, 10, maxLimit);
    const offset = pagination.offset;

    if (!historyEnabled) {
      const result = await this.chatRepository.findByIdWithMessages(chatId, userId, 10, 0);
      if (!result) {
        throw new ChatNotFoundError(chatId);
      }
      const messages = result.messages.map((message) => ChatMapper.messageToDTO(message));
      return {
        chat: ChatMapper.toDTO(result.chat),
        messages,
      };
    }

    const result = await this.chatRepository.findByIdWithMessages(chatId, userId, limit, offset);
    if (!result) {
      throw new ChatNotFoundError(chatId);
    }

    const messages = result.messages.map((message) => ChatMapper.messageToDTO(message));
    const hasMore = offset + limit < result.totalCount;

    return {
      chat: ChatMapper.toDTO(result.chat),
      messages,
      pagination: {
        limit,
        offset,
        total: result.totalCount,
        hasMore,
      },
    };
  }
}
