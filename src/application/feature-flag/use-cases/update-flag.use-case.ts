import { injectable, inject } from 'tsyringe';
import type { IFeatureFlagRepository } from '@/domain/feature-flag';
import { FeatureFlagEntity } from '@/domain/feature-flag';
import type { UpdateFeatureFlagDto } from '../dtos/feature-flag.dto';
import { FeatureFlagResponse } from '../dtos/feature-flag.dto';
import { FeatureFlagMapper } from '../mappers/feature-flag.mapper';
import { FeatureFlagNotFoundError } from '@/core/errors';

@injectable()
export class UpdateFlagUseCase {
  constructor(@inject('IFeatureFlagRepository') private flagRepository: IFeatureFlagRepository) {}

  async execute(flagName: string, dto: UpdateFeatureFlagDto): Promise<FeatureFlagResponse> {
    const flag = await this.flagRepository.findByName(flagName);
    if (!flag) {
      throw new FeatureFlagNotFoundError(flagName);
    }

    const updated = new FeatureFlagEntity(
      flag.id,
      flag.name,
      flag.type,
      dto.value !== undefined ? dto.value : flag.value,
      dto.description !== undefined ? dto.description : flag.description,
      flag.createdAt,
      new Date()
    );

    const result = await this.flagRepository.update(flag.id, updated);
    return FeatureFlagMapper.toDTO(result);
  }
}
