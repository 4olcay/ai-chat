import { injectable, inject } from 'tsyringe';
import type { IFeatureFlagRepository } from '@/domain/feature-flag';
import { FeatureFlagResponse } from '../dtos/feature-flag.dto';
import { FeatureFlagMapper } from '../mappers/feature-flag.mapper';

@injectable()
export class GetAllFlagsUseCase {
  constructor(@inject('IFeatureFlagRepository') private flagRepository: IFeatureFlagRepository) {}

  async execute(): Promise<FeatureFlagResponse[]> {
    const flags = await this.flagRepository.findAll();
    return flags.map((flag) => FeatureFlagMapper.toDTO(flag));
  }
}
