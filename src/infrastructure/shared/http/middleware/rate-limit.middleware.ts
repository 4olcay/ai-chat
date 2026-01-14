import { FastifyInstance, FastifyRequest, FastifyReply } from 'fastify';
import { logger } from '@/infrastructure/shared/logging';

export const RATE_LIMIT_CONFIG = {
  windowMs: 15 * 60 * 1000, // 15 minutes
  maxRequests: 100,
  keyGenerator: (request: FastifyRequest): string => {
    return request.ip || (request.headers['x-forwarded-for'] as string) || 'unknown';
  },
  skipSuccessfulRequests: false,
  skipFailedRequests: false,
} as const;

interface RateLimitEntry {
  count: number;
  resetTime: number;
}

class RateLimitStore {
  private store = new Map<string, RateLimitEntry>();
  private cleanupInterval: ReturnType<typeof setInterval> | null = null;

  constructor() {
    this.cleanupInterval = setInterval(() => {
      this.cleanup();
    }, 60000);
  }

  increment(key: string): number {
    const now = Date.now();
    const entry = this.store.get(key);

    if (!entry || entry.resetTime < now) {
      this.store.set(key, {
        count: 1,
        resetTime: now + RATE_LIMIT_CONFIG.windowMs,
      });
      return 1;
    }

    entry.count += 1;
    return entry.count;
  }

  getResetTime(key: string): number {
    const entry = this.store.get(key);
    return entry?.resetTime || Date.now();
  }

  cleanup(): void {
    const now = Date.now();
    for (const [key, entry] of this.store.entries()) {
      if (entry.resetTime < now) {
        this.store.delete(key);
      }
    }
  }

  destroy(): void {
    if (this.cleanupInterval) {
      clearInterval(this.cleanupInterval);
    }
    this.store.clear();
  }
}

const rateLimitStore = new RateLimitStore();

export async function registerRateLimitMiddleware(app: FastifyInstance): Promise<void> {
  app.addHook('onRequest', async (request: FastifyRequest, reply: FastifyReply) => {
    const key = RATE_LIMIT_CONFIG.keyGenerator(request);
    const count = rateLimitStore.increment(key);
    const resetTime = rateLimitStore.getResetTime(key);
    const remainingTime = Math.max(0, resetTime - Date.now());

    reply.header('X-RateLimit-Limit', String(RATE_LIMIT_CONFIG.maxRequests));
    reply.header(
      'X-RateLimit-Remaining',
      String(Math.max(0, RATE_LIMIT_CONFIG.maxRequests - count))
    );
    reply.header('X-RateLimit-Reset', String(Math.ceil(resetTime / 1000))); // Unix timestamp

    if (count > RATE_LIMIT_CONFIG.maxRequests) {
      logger.warn('Rate limit exceeded', {
        ip: key,
        count,
        window: RATE_LIMIT_CONFIG.windowMs,
      });

      reply.code(429).send({
        success: false,
        error: {
          code: 'RATE_LIMIT_EXCEEDED',
          message: `Too many requests. Please retry after ${Math.ceil(remainingTime / 1000)} seconds.`,
        },
      });
    }
  });

  app.addHook('onClose', async () => {
    rateLimitStore.destroy();
  });
}
