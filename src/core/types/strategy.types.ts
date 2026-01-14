import type { FastifyReply } from 'fastify';

export interface CompletionStrategy {
  generate(chatId: string, userId: string): Promise<string>;
}

export interface StreamingStrategy {
  stream(response: FastifyReply, data: AsyncIterable<string>): Promise<void>;
}

export interface PaginationStrategy {
  getLimit(): number;
}

export interface ChatHistoryStrategy {
  getHistory(chatId: string, userId: string): Promise<Record<string, unknown>[]>;
}

export interface AIToolsStrategy {
  executeTools(tools: string[]): Promise<Record<string, unknown>>;
}
