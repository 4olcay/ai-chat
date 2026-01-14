import fastify, { FastifyInstance } from 'fastify';
import { FastifySSEPlugin } from 'fastify-sse-v2';
import { bootstrapRoutes } from './bootstrap';
import { errorHandler } from './error-handler';
import { setupLoggingHook } from './middleware/index';
import { responseInterceptor } from './response-interceptor';
import { createAppCheckMiddleware, createLoggingMiddleware } from './middleware/middleware.config';
import { registerCORSMiddleware } from './middleware/cors.middleware';
import { registerRateLimitMiddleware } from './middleware/rate-limit.middleware';
import { logger } from '../logging';

export async function createApp(): Promise<FastifyInstance> {
  const app = fastify({
    logger: false,
    bodyLimit: 1048576, // 1MB
    routerOptions: {
      ignoreTrailingSlash: true,
    },
  });

  app.register(FastifySSEPlugin);

  app.addContentTypeParser(
    'application/json',
    async (_request: unknown, payload: NodeJS.ReadableStream) => {
      const chunks: Buffer[] = [];
      for await (const chunk of payload) {
        chunks.push(chunk as Buffer);
      }
      const data = Buffer.concat(chunks).toString();
      return JSON.parse(data);
    }
  );

  await registerCORSMiddleware(app);
  await registerRateLimitMiddleware(app);

  app.register(errorHandler);

  setupLoggingHook(app);

  app.addHook('onSend', responseInterceptor);
  app.addHook('onRequest', createAppCheckMiddleware());
  app.addHook('onRequest', createLoggingMiddleware());

  bootstrapRoutes(app);

  logger.info('Application middleware configured successfully');

  return app;
}
