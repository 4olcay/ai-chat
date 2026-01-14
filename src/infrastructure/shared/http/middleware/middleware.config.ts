import { FastifyRequest, FastifyReply, preHandlerAsyncHookHandler } from 'fastify';
import { appCheckMiddleware } from './app-check.middleware';
import { authMiddleware } from './auth.middleware';
import { clientDetectionMiddleware } from './client-detection.middleware';
import { loggingMiddleware } from './logging.middleware';

export type FastifyMiddleware = preHandlerAsyncHookHandler;

export function createAppCheckMiddleware(): FastifyMiddleware {
  return async (req: FastifyRequest, reply: FastifyReply) => {
    await appCheckMiddleware(req, reply);
  };
}

export function createAuthMiddleware(): FastifyMiddleware {
  return async (req: FastifyRequest, reply: FastifyReply) => {
    await authMiddleware(req, reply);
  };
}

export function createClientDetectionMiddleware(): FastifyMiddleware {
  return async (req: FastifyRequest, reply: FastifyReply) => {
    await clientDetectionMiddleware(req, reply);
  };
}

export function createLoggingMiddleware(): FastifyMiddleware {
  return async (req: FastifyRequest, reply: FastifyReply) => {
    await loggingMiddleware(req, reply);
  };
}
