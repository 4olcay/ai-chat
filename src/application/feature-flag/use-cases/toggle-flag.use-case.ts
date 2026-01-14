import { injectable, inject } from 'tsyringe';
import type { IFeatureFlagRepository } from '@/domain/feature-flag';
import { FeatureFlagEntity } from '@/domain/feature-flag';
import { FeatureFlagResponse } from '../dtos/feature-flag.dto';
import { FeatureFlagMapper } from '../mappers/feature-flag.mapper';
import { FeatureFlagNotFoundError } from '@/core/errors';

@injectable()
export class ToggleFlagUseCase {
  constructor(@inject('IFeatureFlagRepository') private flagRepository: IFeatureFlagRepository) {}

  async execute(flagName: string): Promise<FeatureFlagResponse> {
    const flag = await this.flagRepository.findByName(flagName);
    if (!flag) {
      throw new FeatureFlagNotFoundError(flagName);
    }

    const newValue = flag.value === 'true' ? 'false' : 'true';
    const toggled = new FeatureFlagEntity(
      flag.id,
      flag.name,
      flag.type,
      newValue,
      flag.description,
      flag.createdAt,
      new Date()
    );
    const updated = await this.flagRepository.update(flag.id, toggled);
    return FeatureFlagMapper.toDTO(updated);
  }
}
