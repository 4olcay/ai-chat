import { FastifyReply, FastifyInstance } from 'fastify';
import logger from '../../logging/logger';
import { attachRequestContext, getRequestContext } from '../context/request-context';
import type { AuthenticatedRequest } from '../types';

export interface StructuredLog {
  requestId: string;
  timestamp: string;
  method: string;
  path: string;
  statusCode?: number;
  duration?: number;
  userId?: string;
  clientType?: string;
  error?: {
    code?: string;
    message: string;
  };
}

export function setupLoggingHook(app: FastifyInstance): void {
  app.addHook('onRequest', async (request: AuthenticatedRequest, _reply: FastifyReply) => {
    attachRequestContext(request);
    const context = getRequestContext(request);

    logger.debug('Incoming request', {
      requestId: context.requestId,
      method: request.method,
      path: request.url,
      userAgent: request.headers['user-agent'],
    });
  });

  app.addHook(
    'onSend',
    async (request: AuthenticatedRequest, reply: FastifyReply, payload: unknown) => {
      const context = getRequestContext(request);
      const duration = context.getDuration();
      const clientInfo = request.clientInfo;
      const userId = request.user?.userId;

      const log: StructuredLog = {
        requestId: context.requestId,
        timestamp: new Date().toISOString(),
        method: request.method,
        path: request.url,
        statusCode: reply.statusCode,
        duration,
        userId,
        clientType: clientInfo?.type,
      };

      if (reply.statusCode >= 400) {
        logger.error('Request completed with error', {
          ...log,
          statusCode: reply.statusCode,
        });
      } else {
        logger.info('Request completed', {
          ...log,
          duration: `${duration}ms`,
        });
      }

      return payload;
    }
  );
}

export async function loggingMiddleware(
  req: AuthenticatedRequest,
  _reply: FastifyReply
): Promise<void> {
  attachRequestContext(req);
}
