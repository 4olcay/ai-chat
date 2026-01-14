import { injectable, inject } from 'tsyringe';
import { CacheManager } from './cache.manager';
import { CACHE_TTL } from '@/utils/cache-key.utils';

@injectable()
export class EnhancedCacheManager {
  constructor(@inject(CacheManager) private baseCache: CacheManager) {}

  async getOrSet<T>(
    key: string,
    fetcher: () => Promise<T>,
    ttlMs: number = CACHE_TTL.FEATURE_FLAGS
  ): Promise<T> {
    const cached = this.baseCache.get<T>(key);
    if (cached) {
      return cached;
    }

    const value = await fetcher();
    this.baseCache.set(key, value, ttlMs);
    return value;
  }

  invalidateByPattern(pattern: string): void {
    this.baseCache.invalidate(pattern);
  }

  invalidateMultiple(patterns: string[]): void {
    for (const pattern of patterns) {
      this.invalidateByPattern(pattern);
    }
  }
}
