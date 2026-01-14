import { FastifyRequest as FastifyRequestBase } from 'fastify';
import { ClientInfo, ClientDetectionData, UserPayload } from '@/core/types/index';

export interface AuthenticatedRequest<
  Body = unknown,
  Querystring = unknown,
  Params = unknown,
> extends FastifyRequestBase<{ Body: Body; Querystring: Querystring; Params: Params }> {
  user?: UserPayload;
  userId?: string;
  userEmail?: string;
  appCheckToken?: string;
  clientInfo?: ClientInfo;
  clientDetection?: ClientDetectionData;
  requestId?: string;
}

export interface ApiSuccessResponse<T> {
  success: true;
  data: T;
}

export interface ApiErrorResponse {
  success: false;
  error: {
    code: string;
    message: string;
  };
}

export type ApiResponse<T> = ApiSuccessResponse<T> | ApiErrorResponse;
