import type { ConversationContext } from '../value-objects/conversation-context.vo';

export interface ICompletionService {
  generateCompletion(context: ConversationContext): AsyncGenerator<string>;
}
