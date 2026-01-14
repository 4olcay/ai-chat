import { FeatureFlagEntity } from '../entities/feature-flag.entity';

export interface IFeatureFlagRepository {
  findById(id: string): Promise<FeatureFlagEntity | null>;
  findByName(name: string): Promise<FeatureFlagEntity | null>;
  findAll(): Promise<FeatureFlagEntity[]>;
  create(flag: FeatureFlagEntity): Promise<FeatureFlagEntity>;
  update(id: string, flag: FeatureFlagEntity): Promise<FeatureFlagEntity>;
  delete(id: string): Promise<void>;
}
