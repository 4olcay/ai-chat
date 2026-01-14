import { injectable, inject } from 'tsyringe';
import type { IFeatureFlagRepository } from '@/domain/feature-flag';
import { FeatureFlagResponse } from '../dtos/feature-flag.dto';
import { FeatureFlagMapper } from '../mappers/feature-flag.mapper';
import { FeatureFlagNotFoundError } from '@/core/errors';

@injectable()
export class GetFlagUseCase {
  constructor(@inject('IFeatureFlagRepository') private flagRepository: IFeatureFlagRepository) {}

  async execute(flagName: string): Promise<FeatureFlagResponse> {
    const flag = await this.flagRepository.findByName(flagName);
    if (!flag) {
      throw new FeatureFlagNotFoundError(flagName);
    }

    return FeatureFlagMapper.toDTO(flag);
  }
}
