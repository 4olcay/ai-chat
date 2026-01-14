import { injectable, inject } from 'tsyringe';
import type { ICompletionStrategy } from './completion-strategy.interface';
import type { ICompletionService, ConversationContext } from '@/domain/completion';
import type { IAIToolsManager, ToolStreamEvent } from '@/domain/tools';
import { CreateMessageUseCase } from '../use-cases';
import { MessageRole } from '@/core/constants';
import type {
  CompletionResult,
  CompletionStreamEvent,
} from '../use-cases/create-completion.use-case';

@injectable()
export class CompletionStrategy implements ICompletionStrategy {
  constructor(
    @inject('ICompletionService') private completionService: ICompletionService,
    @inject('IAIToolsManager') private toolsManager: IAIToolsManager,
    @inject(CreateMessageUseCase) private createMessageUseCase: CreateMessageUseCase
  ) {}

  async execute(
    chatId: string,
    conversationContext: ConversationContext,
    streamingEnabled: boolean,
    aiToolsEnabled: boolean
  ): Promise<AsyncGenerator<CompletionStreamEvent> | CompletionResult> {
    if (streamingEnabled) {
      return this.executeStreaming(chatId, conversationContext, aiToolsEnabled);
    } else {
      return this.executeBuffered(chatId, conversationContext, aiToolsEnabled);
    }
  }

  private async *executeStreaming(
    chatId: string,
    conversationContext: ConversationContext,
    aiToolsEnabled: boolean
  ): AsyncGenerator<CompletionStreamEvent> {
    let fullCompletion = '';
    const toolResults: ToolStreamEvent[] = [];

    try {
      if (aiToolsEnabled) {
        const toolStream = this.toolsManager.executeAllTools();
        for await (const toolEvent of toolStream) {
          toolResults.push(toolEvent);
          yield {
            event: 'tool_event',
            data: JSON.stringify(toolEvent),
          };
        }
      }

      const completionGen = this.completionService.generateCompletion(conversationContext);
      for await (const chunk of completionGen) {
        fullCompletion += chunk;
        yield {
          event: 'llm_chunk',
          data: JSON.stringify({ chunk }),
        };
      }
    } catch (error) {
      yield {
        event: 'error',
        data: JSON.stringify({ message: 'Stream error' }),
      };
      throw error;
    } finally {
      await this.saveAssistantMessage(chatId, fullCompletion);
    }
  }

  private async executeBuffered(
    chatId: string,
    conversationContext: ConversationContext,
    aiToolsEnabled: boolean
  ): Promise<CompletionResult> {
    const toolResults: ToolStreamEvent[] = [];
    if (aiToolsEnabled) {
      const toolStream = this.toolsManager.executeAllTools();
      for await (const toolEvent of toolStream) {
        toolResults.push(toolEvent);
      }
    }

    let fullCompletion = '';
    const completionGen = this.completionService.generateCompletion(conversationContext);
    for await (const chunk of completionGen) {
      fullCompletion += chunk;
    }

    await this.saveAssistantMessage(chatId, fullCompletion);

    return {
      chatId,
      content: fullCompletion,
      toolEvents: toolResults,
    };
  }

  private async saveAssistantMessage(chatId: string, content: string): Promise<void> {
    if (content) {
      await this.createMessageUseCase.execute({
        chatId,
        content,
        role: MessageRole.ASSISTANT,
      });
    }
  }
}
