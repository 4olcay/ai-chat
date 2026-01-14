import { injectable, inject } from 'tsyringe';
import type { IChatRepository } from '@/domain/chat';
import { ChatResponse } from '../dtos/chat.dto';
import { ChatMapper } from '../mappers/chat.mapper';
import { GetMultipleFlagsUseCase } from '@/application/feature-flag';
import { validateFlagAsLimit } from '@/application/shared';
import { FEATURE_FLAGS } from '@/core/constants';

@injectable()
export class GetUserChatsUseCase {
  constructor(
    @inject('IChatRepository') private chatRepository: IChatRepository,
    @inject(GetMultipleFlagsUseCase) private getMultipleFlagsUseCase: GetMultipleFlagsUseCase
  ) {}

  async execute(userId: string): Promise<ChatResponse[]> {
    const flags = await this.getMultipleFlagsUseCase.execute([FEATURE_FLAGS.PAGINATION_LIMIT]);
    const limit = validateFlagAsLimit(flags[FEATURE_FLAGS.PAGINATION_LIMIT].value);

    const chats = await this.chatRepository.findAllByUserId(userId);
    return chats.slice(0, limit).map((chat) => ChatMapper.toDTO(chat));
  }
}
