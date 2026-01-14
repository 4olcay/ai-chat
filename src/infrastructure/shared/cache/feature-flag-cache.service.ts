import { injectable, inject } from 'tsyringe';
import { EnhancedCacheManager } from './cache-manager.enhanced';
import { GetMultipleFlagsUseCase } from '@/application/feature-flag';
import type { FeatureFlagResponse } from '@/application/feature-flag';
import { getCacheKey, CACHE_TTL, CACHE_INVALIDATION } from '@/utils/cache-key.utils';
import { logger } from '../logging';

@injectable()
export class FeatureFlagCacheService {
  constructor(
    @inject(EnhancedCacheManager) private cache: EnhancedCacheManager,
    @inject(GetMultipleFlagsUseCase) private getFlagsUseCase: GetMultipleFlagsUseCase
  ) {}

  async getMultipleFlags(flagNames: string[]): Promise<Record<string, FeatureFlagResponse>> {
    const cacheKey = getCacheKey.featureFlags.all();

    return this.cache.getOrSet(
      cacheKey,
      async () => {
        logger.debug('Fetching feature flags from database');
        const flags = await this.getFlagsUseCase.execute(flagNames);
        return flags;
      },
      CACHE_TTL.FEATURE_FLAGS
    );
  }

  async getSingleFlag(flagName: string): Promise<FeatureFlagResponse | undefined> {
    const cacheKey = getCacheKey.featureFlags.byName(flagName);

    return this.cache.getOrSet(
      cacheKey,
      async () => {
        logger.debug(`Fetching feature flag from database: ${flagName}`);
        const flags = await this.getFlagsUseCase.execute([flagName]);
        return flags[flagName];
      },
      CACHE_TTL.FEATURE_FLAGS
    );
  }

  invalidateFlag(flagName: string): void {
    const patterns = CACHE_INVALIDATION.featureFlagUpdated(flagName);
    this.cache.invalidateMultiple(patterns);
    logger.debug(`Feature flag cache invalidated: ${flagName}`, { patterns });
  }

  clearAll(): void {
    this.cache.invalidateByPattern('feature_flags:*');
    logger.debug('All feature flag cache cleared');
  }

  getFlagValue(flag: FeatureFlagResponse | undefined, defaultValue: unknown = null): unknown {
    if (!flag) return defaultValue;

    const value = flag.value;

    const numValue = parseInt(value, 10);
    if (!isNaN(numValue) && value === String(numValue)) return numValue;

    if (value === 'true') return true;
    if (value === 'false') return false;

    return value;
  }
}
