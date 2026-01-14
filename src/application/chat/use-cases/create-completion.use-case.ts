import { injectable, inject } from 'tsyringe';
import { ConversationContext } from '@/domain/completion';
import type { IChatRepository } from '@/domain/chat';
import type { CreateMessageDto } from '../dtos/chat.dto';
import { CreateChatUseCase } from './create-chat.use-case';
import { CreateMessageUseCase } from './create-message.use-case';
import { FeatureFlagCacheService } from '@/infrastructure/shared/cache';
import { FEATURE_FLAGS, MessageRole } from '@/core/constants';
import { ChatNotFoundError } from '@/core/errors';
import { ToolsManager } from '@/infrastructure/tools';
import { ToolStreamEvent } from '@/domain/tools';
import { ICompletionStrategy } from '../strategies/completion-strategy.interface';

interface CompletionConfig {
  chatId: string;
  streamingEnabled: boolean;
  aiToolsEnabled: boolean;
}

export interface CompletionResult {
  chatId: string;
  content: string;
  toolEvents: ToolStreamEvent[];
}

export type CompletionStreamEvent = {
  event: 'tool_event' | 'llm_chunk' | 'error' | 'complete';
  data: string;
};

@injectable()
export class CreateCompletionUseCase {
  constructor(
    @inject(CreateChatUseCase) private createChatUseCase: CreateChatUseCase,
    @inject(CreateMessageUseCase) private createMessageUseCase: CreateMessageUseCase,
    @inject(FeatureFlagCacheService) private flagCache: FeatureFlagCacheService,
    @inject('IChatRepository') private chatRepository: IChatRepository,
    @inject(ToolsManager) private toolsManager: ToolsManager,
    @inject('ICompletionStrategy') private completionStrategy: ICompletionStrategy
  ) {}

  async execute(
    userId: string,
    body: CreateMessageDto,
    chatId: string | null
  ): Promise<{ chatId: string; result: AsyncGenerator<CompletionStreamEvent> | CompletionResult }> {
    const effectiveChatId = await this.resolveChatId(userId, chatId);

    await this.saveUserMessage(effectiveChatId, body.message);

    const config = await this.loadCompletionConfig(effectiveChatId);
    const conversationContext = await this.buildConversationContext(effectiveChatId, userId);

    const result = await this.completionStrategy.execute(
      effectiveChatId,
      conversationContext,
      config.streamingEnabled,
      config.aiToolsEnabled
    );

    this.toolsManager.clearCache();
    return { chatId: effectiveChatId, result };
  }

  private async resolveChatId(userId: string, chatId: string | null): Promise<string> {
    if (chatId) return chatId;
    const newChat = await this.createChatUseCase.execute(userId, {
      title: 'New Chat',
    });
    return newChat.id!;
  }

  private async saveUserMessage(chatId: string, message: string): Promise<void> {
    await this.createMessageUseCase.execute({
      chatId,
      content: message,
      role: MessageRole.USER,
    });
  }

  private async loadCompletionConfig(chatId: string): Promise<CompletionConfig> {
    const flags = await this.flagCache.getMultipleFlags([
      FEATURE_FLAGS.STREAMING_ENABLED,
      FEATURE_FLAGS.AI_TOOLS_ENABLED,
    ]);

    const streamingEnabled =
      this.flagCache.getFlagValue(flags[FEATURE_FLAGS.STREAMING_ENABLED]) === true;
    const aiToolsEnabled =
      this.flagCache.getFlagValue(flags[FEATURE_FLAGS.AI_TOOLS_ENABLED]) === true;

    if (!aiToolsEnabled) {
      this.toolsManager.clearCache();
    }

    return { chatId, streamingEnabled, aiToolsEnabled };
  }

  private async buildConversationContext(
    chatId: string,
    userId: string
  ): Promise<ConversationContext> {
    const chatData = await this.chatRepository.findByIdWithMessages(chatId, userId);
    if (!chatData) throw new ChatNotFoundError(chatId);
    return new ConversationContext(chatId, userId, chatData.messages);
  }
}
