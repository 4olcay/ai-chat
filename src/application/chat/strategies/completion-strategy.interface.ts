import type { ConversationContext } from '@/domain/completion';
import type {
  CompletionResult,
  CompletionStreamEvent,
} from '../use-cases/create-completion.use-case';

export interface ICompletionStrategy {
  execute(
    chatId: string,
    conversationContext: ConversationContext,
    streamingEnabled: boolean,
    aiToolsEnabled: boolean
  ): Promise<AsyncGenerator<CompletionStreamEvent> | CompletionResult>;
}
