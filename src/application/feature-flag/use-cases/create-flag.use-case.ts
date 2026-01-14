import { injectable, inject } from 'tsyringe';
import type { IFeatureFlagRepository } from '@/domain/feature-flag';
import { CreateFeatureFlagDto, FeatureFlagResponse } from '../dtos/feature-flag.dto';
import { FeatureFlagMapper } from '../mappers/feature-flag.mapper';
import { randomUUID } from 'crypto';

@injectable()
export class CreateFlagUseCase {
  constructor(@inject('IFeatureFlagRepository') private flagRepository: IFeatureFlagRepository) {}

  async execute(dto: CreateFeatureFlagDto): Promise<FeatureFlagResponse> {
    const flagId = randomUUID();
    const flagEntity = FeatureFlagMapper.toDomainFromCreate(flagId, dto);
    const savedEntity = await this.flagRepository.create(flagEntity);
    return FeatureFlagMapper.toDTO(savedEntity);
  }
}
