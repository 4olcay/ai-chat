import type { FastifyReply } from 'fastify';
import { MissingAppCheckTokenError, InvalidAppCheckTokenError } from '@/core/errors';
import { appConfig } from '../../config';
import type { AuthenticatedRequest } from '../types';

export async function appCheckMiddleware(
  req: AuthenticatedRequest,
  _reply: FastifyReply
): Promise<void> {
  const token = req.headers['x-firebase-app-check'];

  if (!token) {
    throw new MissingAppCheckTokenError();
  }

  const isValidToken = validateAppCheckToken(token as string);

  if (!isValidToken) {
    throw new InvalidAppCheckTokenError();
  }

  req.appCheckToken = token as string;
}

function validateAppCheckToken(token: string): boolean {
  const appCheckSecret = appConfig.getFirebaseAppCheckSecret();
  return token === appCheckSecret;
}
