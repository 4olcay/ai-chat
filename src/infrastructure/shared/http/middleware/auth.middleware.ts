import type { FastifyReply } from 'fastify';
import jwt from 'jsonwebtoken';
import {
  MissingAuthorizationHeaderError,
  InvalidAuthorizationSchemeError,
  MissingJWTTokenError,
  AppError,
} from '@/core/errors';
import { appConfig } from '../../config';
import type { UserPayload } from '@/core/types/request.types';
import type { AuthenticatedRequest } from '../types';

export async function authMiddleware(
  req: AuthenticatedRequest,
  reply: FastifyReply
): Promise<void> {
  try {
    const authHeader = req.headers.authorization;

    if (!authHeader) {
      throw new MissingAuthorizationHeaderError();
    }

    const [scheme, token] = authHeader.split(' ');

    if (scheme !== 'Bearer') {
      throw new InvalidAuthorizationSchemeError();
    }

    if (!token) {
      throw new MissingJWTTokenError();
    }

    const jwtSecret = appConfig.getJwtSecret();
    const decoded = jwt.verify(token, jwtSecret) as UserPayload;

    req.user = decoded;
    return;
  } catch (error) {
    if (error instanceof AppError) {
      reply.status(error.statusCode).send({
        success: false,
        error: {
          code: error.code,
          message: error.message,
        },
      });
    } else {
      reply.status(401).send({
        success: false,
        error: {
          code: 'INVALID_TOKEN',
          message: 'Token validation failed',
        },
      });
    }
    return;
  }
}

export function generateMockJWT(userId: string, email: string): string {
  const jwtSecret = appConfig.getJwtSecret();
  return jwt.sign({ userId, email }, jwtSecret, { expiresIn: '24h' });
}
