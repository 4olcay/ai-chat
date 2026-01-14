import { FastifyInstance, FastifyRequest, FastifyReply } from 'fastify';
import { sql } from 'drizzle-orm';
import { DatabaseConnection } from '@/infrastructure/shared/database/connection';
import { logger } from '@/infrastructure/shared/logging';

export interface HealthCheckResponse {
  status: 'healthy' | 'degraded' | 'unhealthy';
  timestamp: string;
  uptime: number;
  checks: {
    database: {
      status: 'ok' | 'error';
      message?: string;
    };
  };
}

export async function registerHealthRoutes(app: FastifyInstance): Promise<void> {
  app.get<{ Reply: HealthCheckResponse }>(
    '/health',
    async (_request: FastifyRequest, reply: FastifyReply) => {
      const startTime = Date.now();

      try {
        const db = DatabaseConnection.getInstance();
        await db.execute(sql`SELECT 1`);

        const duration = Date.now() - startTime;
        logger.debug(`Health check completed: ${duration}ms`);

        const healthResponse: HealthCheckResponse = {
          status: 'healthy',
          timestamp: new Date().toISOString(),
          uptime: process.uptime(),
          checks: {
            database: { status: 'ok' },
          },
        };

        await reply.code(200).send(healthResponse);
      } catch (error) {
        logger.error('Health check failed', { error: String(error) });

        const healthResponse: HealthCheckResponse = {
          status: 'degraded',
          timestamp: new Date().toISOString(),
          uptime: process.uptime(),
          checks: {
            database: {
              status: 'error',
              message: error instanceof Error ? error.message : 'Unknown error',
            },
          },
        };

        await reply.code(503).send(healthResponse);
      }
    }
  );

  app.get('/ready', async (_request: FastifyRequest, reply: FastifyReply) => {
    try {
      const db = DatabaseConnection.getInstance();
      await db.execute(sql`SELECT 1`);

      await reply.code(200).send({ ready: true });
    } catch (error) {
      logger.error('Readiness check failed', { error: String(error) });
      await reply
        .code(503)
        .send({ ready: false, error: error instanceof Error ? error.message : 'Unknown error' });
    }
  });

  app.get('/live', async (_request: FastifyRequest, reply: FastifyReply) => {
    await reply.code(200).send({ alive: true });
  });

  logger.info('Health check routes registered');
}
