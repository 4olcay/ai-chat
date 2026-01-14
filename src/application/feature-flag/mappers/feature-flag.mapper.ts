import { FeatureFlagEntity } from '@/domain/feature-flag';
import { FeatureFlagResponse, CreateFeatureFlagDto } from '../dtos/feature-flag.dto';
import type { FeatureFlagPersistenceModel } from '@/application/shared';

export class FeatureFlagMapper {
  static toDTO(entity: FeatureFlagEntity): FeatureFlagResponse {
    return {
      id: entity.id,
      name: entity.name,
      type: entity.type,
      value: entity.value,
      description: entity.description,
      createdAt: entity.createdAt,
      updatedAt: entity.updatedAt,
    };
  }

  static toDomain(dbFlag: FeatureFlagPersistenceModel): FeatureFlagEntity {
    return new FeatureFlagEntity(
      dbFlag.id,
      dbFlag.name,
      dbFlag.type,
      dbFlag.value,
      dbFlag.description,
      dbFlag.createdAt,
      dbFlag.updatedAt
    );
  }

  static toDomainFromCreate(id: string, dto: CreateFeatureFlagDto): FeatureFlagEntity {
    const now = new Date();
    return new FeatureFlagEntity(id, dto.name, dto.type, dto.value, dto.description, now, now);
  }

  static toPersistence(entity: FeatureFlagEntity): Partial<FeatureFlagPersistenceModel> {
    return {
      id: entity.id,
      name: entity.name,
      type: entity.type,
      value: entity.value,
      description: entity.description,
      createdAt: entity.createdAt,
      updatedAt: entity.updatedAt,
    };
  }
}
