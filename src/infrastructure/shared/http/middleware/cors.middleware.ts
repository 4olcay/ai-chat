import { FastifyInstance, FastifyRequest, FastifyReply } from 'fastify';
import { logger } from '@/infrastructure/shared/logging';

export const CORS_CONFIG = {
  origin: process.env.CORS_ORIGIN || ['http://localhost:3000', 'http://localhost:3001'],
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization', 'X-Requested-With', 'X-App-Check'],
  exposedHeaders: ['X-Total-Count', 'X-Page-Count'],
  maxAge: 86400, // 24 hours
} as const;

export async function registerCORSMiddleware(app: FastifyInstance): Promise<void> {
  app.addHook('onRequest', async (request: FastifyRequest, reply: FastifyReply) => {
    const origin = request.headers.origin;

    if (origin && !isOriginAllowed(origin)) {
      logger.warn('CORS rejection', { origin });
      reply.code(403).send({
        success: false,
        error: {
          code: 'CORS_FORBIDDEN',
          message: 'Origin not allowed',
        },
      });
      return;
    }

    if (origin && isOriginAllowed(origin)) {
      reply.header('Access-Control-Allow-Origin', origin);
    }

    reply.header('Access-Control-Allow-Credentials', 'true');
    reply.header('Access-Control-Allow-Methods', CORS_CONFIG.methods.join(', '));
    reply.header('Access-Control-Allow-Headers', CORS_CONFIG.allowedHeaders.join(', '));
    reply.header('Access-Control-Expose-Headers', CORS_CONFIG.exposedHeaders.join(', '));
    reply.header('Access-Control-Max-Age', String(CORS_CONFIG.maxAge));

    if (request.method === 'OPTIONS') {
      reply.code(204).send();
    }
  });
}

function isOriginAllowed(origin: string): boolean {
  const allowedOrigins = Array.isArray(CORS_CONFIG.origin)
    ? CORS_CONFIG.origin
    : [CORS_CONFIG.origin];

  return allowedOrigins.some((allowed) => {
    if (allowed === '*') return true;
    if (allowed === origin) return true;
    if (allowed.startsWith('*.') && origin.endsWith(allowed.substring(1))) return true;
    return false;
  });
}
