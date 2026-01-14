import { IsUUID, IsNotEmpty } from 'class-validator';
import { MessageRole } from '@/core/constants';
import type { PaginationMeta } from '@/application/shared';
import type { ToolStreamEvent } from '@/domain/tools';

export interface CreateChatDto {
  title: string;
}

export class ChatParamDto {
  @IsUUID()
  @IsNotEmpty()
  chatId!: string;
}

export interface MessageDto {
  id?: string;
  chatId: string;
  role: MessageRole;
  content: string;
  createdAt?: Date;
  metadata?: Record<string, unknown>;
}

export interface ChatResponse {
  id?: string;
  userId: string;
  title: string;
  createdAt?: Date;
  updatedAt?: Date;
}

export interface ChatWithMessagesResponse {
  chat: ChatResponse;
  messages: MessageDto[];
  pagination?: PaginationMeta;
}

export interface CreateMessageDto {
  message: string;
}

export interface SaveMessageDto {
  chatId: string;
  role: MessageRole;
  content: string;
  metadata?: Record<string, unknown>;
}

export interface ChatListItemResponse {
  id?: string;
  userId: string;
  title: string;
  createdAt?: Date;
  updatedAt?: Date;
}

export class CompletionResponse {
  chatId!: string;
  content!: string;
  toolEvents?: ToolStreamEvent[] | null;
}
