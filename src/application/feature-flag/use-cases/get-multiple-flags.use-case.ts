import { injectable, inject } from 'tsyringe';
import type { IFeatureFlagRepository } from '@/domain/feature-flag';
import { FeatureFlagResponse } from '../dtos/feature-flag.dto';
import { FeatureFlagMapper } from '../mappers/feature-flag.mapper';
import { FeatureFlagNotFoundError } from '@/core/errors';

@injectable()
export class GetMultipleFlagsUseCase {
  constructor(@inject('IFeatureFlagRepository') private flagRepository: IFeatureFlagRepository) {}

  async execute(flagNames: string[]): Promise<Record<string, FeatureFlagResponse>> {
    const results: Record<string, FeatureFlagResponse> = {};

    for (const flagName of flagNames) {
      const flag = await this.flagRepository.findByName(flagName);
      if (!flag) {
        throw new FeatureFlagNotFoundError(flagName);
      }
      results[flagName] = FeatureFlagMapper.toDTO(flag);
    }

    return results;
  }
}
