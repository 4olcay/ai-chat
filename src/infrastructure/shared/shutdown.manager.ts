import { FastifyInstance } from 'fastify';
import { DatabaseConnection } from './database/connection';
import { logger } from './logging';
import { disposeContainer } from './di/container';

export class GracefulShutdownManager {
  private isShuttingDown = false;
  private shutdownTimeout = 30000; // 30 seconds

  constructor(private app: FastifyInstance) {}

  register(): void {
    process.on('SIGTERM', () => this.handleSignal('SIGTERM'));
    process.on('SIGINT', () => this.handleSignal('SIGINT'));

    process.on('exit', (code: number) => {
      logger.info(`Process exiting with code ${code}`);
    });
  }

  private async handleSignal(signal: string): Promise<void> {
    if (this.isShuttingDown) {
      logger.warn(`Shutdown already in progress, ignoring ${signal}`);
      return;
    }

    this.isShuttingDown = true;
    logger.info(`Received ${signal}, starting graceful shutdown...`);

    try {
      await this.shutdown();
      logger.info('Graceful shutdown completed successfully');
      process.exit(0);
    } catch (error) {
      logger.error('Graceful shutdown failed', { error: String(error) });
      process.exit(1);
    }
  }

  private async shutdown(): Promise<void> {
    const shutdownPromise = this.performShutdown();
    const timeoutPromise = new Promise<never>((_, reject) => {
      setTimeout(() => {
        reject(new Error(`Shutdown timeout after ${this.shutdownTimeout}ms`));
      }, this.shutdownTimeout);
    });

    await Promise.race([shutdownPromise, timeoutPromise]);
  }

  private async performShutdown(): Promise<void> {
    logger.info('Closing HTTP server...');
    await this.app.close();
    logger.info('HTTP server closed');

    logger.info('Closing database connection...');
    await DatabaseConnection.close();
    logger.info('Database connection closed');

    logger.info('Disposing DI container...');
    await disposeContainer();
    logger.info('DI container disposed');
  }
}
