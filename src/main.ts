process.loadEnvFile();

import 'reflect-metadata';
import { container } from './infrastructure/shared/di/container';
import { createApp, DatabaseConnection, appConfig, seedFeatureFlags } from './infrastructure';
import logger from './infrastructure/shared/logging/logger';
import { GracefulShutdownManager } from './infrastructure/shared/shutdown.manager';
import { registerHealthRoutes } from './infrastructure/shared/http/routes/health.routes';

const PORT = appConfig.getPort();
const HOST = appConfig.getHost();

async function bootstrap(): Promise<void> {
  try {
    const _db = DatabaseConnection.getInstance();
    logger.info('Database connection established');

    await seedFeatureFlags();
    logger.info('Feature flags seeded');

    logger.info('Dependency Injection container initialized');

    const app = await createApp();
    logger.info('Fastify application created');

    await registerHealthRoutes(app);

    await app.listen({ port: PORT, host: HOST, ipv6Only: false });
    logger.info(`Server is running on http://${HOST}:${PORT}`);
    logger.info(`Health check available at http://${HOST}:${PORT}/health`);

    const shutdownManager = new GracefulShutdownManager(app);
    shutdownManager.register();
  } catch (error) {
    logger.error('Bootstrap error:', error);
    process.exit(1);
  }
}

bootstrap();
