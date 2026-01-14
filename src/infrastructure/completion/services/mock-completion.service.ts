import { injectable } from 'tsyringe';
import type { ICompletionService, ConversationContext } from '@/domain/completion';

@injectable()
export class MockCompletionService implements ICompletionService {
  async *generateCompletion(context: ConversationContext): AsyncGenerator<string> {
    const lastMessage = context.getLastUserMessage();
    const history = context.getConversationHistory();
    const hasSystemMessages = context.hasSystemMessages();

    if (!lastMessage) {
      const errorMessage = 'No user message found in conversation.';
      for (const word of errorMessage.split(' ')) {
        yield `${word} `;
        await new Promise((resolve) => setTimeout(resolve, 50));
      }
      return;
    }

    const userContent = lastMessage.content;
    const messageCount = history.length;
    const systemContext = hasSystemMessages ? ' (with system context)' : '';

    const responses: Record<string, string> = {
      weather: `Based on your question about weather, here's a mock response. The weather information has been retrieved and shows moderate conditions. (Conversation has ${messageCount} messages${systemContext})`,
      greeting: `Hello! Thanks for reaching out. I'm a mock AI assistant ready to help. (Conversation has ${messageCount} messages${systemContext})`,
      help: `I can help you with that! Here's a detailed response to your inquiry. (Conversation has ${messageCount} messages${systemContext})`,
    };

    const lowerUserContent = userContent.toLowerCase();
    let responseToSend: string | null = null;

    for (const [keyword, response] of Object.entries(responses)) {
      if (lowerUserContent.includes(keyword)) {
        responseToSend = response;
        break;
      }
    }

    if (!responseToSend) {
      responseToSend = `Here's a mock response to your question: "${userContent.substring(
        0,
        50
      )}...". (Conversation has ${messageCount} messages${systemContext})`;
    }

    const words = responseToSend.split(' ');
    for (const word of words) {
      yield `${word} `;
      await new Promise((resolve) => setTimeout(resolve, 50));
    }
  }
}
