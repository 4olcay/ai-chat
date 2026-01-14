import { FastifyInstance } from 'fastify';
import { AppError } from '@/core/errors';
import { mapDatabaseError, isConnectionError, isDatabaseTimeout } from '../errors/database.errors';
import { logger } from '../logging/index';
import { appConfig } from '../config';
import type { AuthenticatedRequest } from './types';

export async function errorHandler(fastify: FastifyInstance): Promise<void> {
  fastify.setErrorHandler(async (error: Error | AppError, request, reply) => {
    const req = request as AuthenticatedRequest;
    const requestId = req.requestId || 'unknown';

    if ('validation' in error) {
      const validationError = error as any;
      const firstErrorMessage =
        validationError.validation[0]?.constraints &&
        Object.values(validationError.validation[0].constraints)[0];

      logger.warn('Validation error', {
        requestId,
        timestamp: new Date().toISOString(),
        code: 'VALIDATION_ERROR',
        statusCode: 400,
        message: firstErrorMessage || 'Input validation failed',
        details: validationError.validation,
      });

      reply.status(400);
      return {
        success: false,
        error: {
          code: 'VALIDATION_ERROR',
          message: firstErrorMessage || 'Input validation failed',
        },
      };
    }

    if (error instanceof AppError) {
      const errorLog = {
        requestId,
        timestamp: new Date().toISOString(),
        code: error.code,
        statusCode: error.statusCode,
        message: error.message,
        details: error.details,
      };

      logger.error('Application error', errorLog);

      reply.status(error.statusCode);
      return {
        success: false,
        error: {
          code: error.code,
          message: error.message,
        },
      };
    }

    if ('statusCode' in error && error.statusCode === 400) {
      logger.warn('Bad Request error', {
        requestId,
        timestamp: new Date().toISOString(),
        code: 'BAD_REQUEST',
        statusCode: 400,
        message: error.message,
      });

      reply.status(400);
      return {
        success: false,
        error: {
          code: 'BAD_REQUEST',
          message: 'The request body is malformed or invalid.',
        },
      };
    }

    const dbError = error as Error & { code?: string };
    if (
      dbError.code &&
      (isDatabaseTimeout(error) || isConnectionError(error) || /^\d{5}$/.test(dbError.code))
    ) {
      const mappedError = mapDatabaseError(dbError);

      const errorLog = {
        requestId,
        timestamp: new Date().toISOString(),
        code: mappedError.code,
        statusCode: mappedError.statusCode,
        message: mappedError.message,
      };

      logger.error('Database error', errorLog);

      reply.status(mappedError.statusCode);
      return {
        success: false,
        error: {
          code: mappedError.code,
          message: mappedError.message,
        },
      };
    }

    const isDevelopment = appConfig.isDevelopment();

    const errorLog = {
      requestId,
      timestamp: new Date().toISOString(),
      code: 'INTERNAL_SERVER_ERROR',
      statusCode: 500,
      message: error.message,
      stack: isDevelopment ? error.stack : undefined,
      errorName: error.name,
      errorCause: isDevelopment ? error?.cause : undefined,
    };

    logger.error('Unhandled error', errorLog);
    if (isDevelopment) {
      console.error('[DEBUG] Full error object:', error);
    }

    reply.status(500);
    return {
      success: false,
      error: {
        code: 'INTERNAL_SERVER_ERROR',
        message: isDevelopment ? error.message : 'An internal server error occurred',
      },
    };
  });
}
