import { isAsyncGenerator } from '@/utils';
import 'reflect-metadata';
import { injectable, inject } from 'tsyringe';
import type { FastifyReply, FastifyRequest } from 'fastify';
import {
  CreateMessageDto,
  ChatListItemResponse,
  ChatWithMessagesResponse,
  ChatParamDto,
} from '@/application/chat';
import type { PaginationParams } from '@/application/shared';
import {
  GetBody,
  GetParams,
  GetUser,
  GetReply,
  GetPagination,
  GetRequest,
} from '@/infrastructure/shared/http/decorators/parameter.decorators';
import {
  Controller,
  Get,
  Post,
  Auth,
  ClientDetection,
} from '@/infrastructure/shared/http/decorators/route.decorators';
import type { UserPayload } from '@/core/types';
import {
  GetUserChatsUseCase,
  GetChatHistoryUseCase,
  CreateCompletionUseCase,
} from '@/application/chat/use-cases';

@injectable()
@Controller('/chats')
export class ChatController {
  constructor(
    @inject(GetUserChatsUseCase) private getUserChatsUseCase: GetUserChatsUseCase,
    @inject(GetChatHistoryUseCase) private getChatHistoryUseCase: GetChatHistoryUseCase,
    @inject(CreateCompletionUseCase)
    private createCompletionUseCase: CreateCompletionUseCase
  ) {}

  @Get('/')
  @Auth()
  @ClientDetection()
  async listChats(@GetUser() user: UserPayload): Promise<ChatListItemResponse[]> {
    return this.getUserChatsUseCase.execute(user.userId);
  }

  @Get('/:chatId/history')
  @Auth()
  @ClientDetection()
  async getChatHistory(
    @GetUser() user: UserPayload,
    @GetParams(ChatParamDto) params: ChatParamDto,
    @GetPagination() pagination: PaginationParams
  ): Promise<ChatWithMessagesResponse> {
    return this.getChatHistoryUseCase.execute(params.chatId, user.userId, pagination);
  }

  @Post('/completion')
  @Auth()
  @ClientDetection()
  async createCompletionInNewChat(
    @GetRequest() _request: FastifyRequest,
    @GetReply() reply: FastifyReply,
    @GetBody() body: CreateMessageDto,
    @GetUser() user: UserPayload
  ): Promise<FastifyReply> {
    return this.handleCompletion(user.userId, body, null, reply);
  }

  @Post('/:chatId/completion')
  @Auth()
  @ClientDetection()
  async createCompletionInExistingChat(
    @GetUser() user: UserPayload,
    @GetBody() body: CreateMessageDto,
    @GetParams(ChatParamDto) params: ChatParamDto,
    @GetReply() reply: FastifyReply
  ): Promise<FastifyReply> {
    return this.handleCompletion(user.userId, body, params.chatId, reply);
  }

  private async handleCompletion(
    userId: UserPayload['userId'],
    body: CreateMessageDto,
    chatId: string | null,
    reply: FastifyReply
  ): Promise<FastifyReply> {
    const { chatId: effectiveChatId, result } = await this.createCompletionUseCase.execute(userId, body, chatId);

    if (isAsyncGenerator(result)) {
      reply.raw.setHeader('Content-Type', 'text/event-stream');
      reply.raw.setHeader('Connection', 'keep-alive');
      reply.raw.setHeader('Cache-Control', 'no-cache');
      reply.raw.setHeader('X-Accel-Buffering', 'no');

      try {
        for await (const event of result) {
          reply.sse(event);
        }
        reply.sse({
          event: 'complete',
          data: JSON.stringify({ success: true, chatId: effectiveChatId }),
        });
      } catch (error) {
        reply.sse({
          event: 'error',
          data: JSON.stringify({ message: 'Stream failed on server', chatId: effectiveChatId }),
        });
      } finally {
        reply.sseContext.source.end();
      }

      return reply;
    }

    return reply.send(result);
  }
}
