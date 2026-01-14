import { injectable } from 'tsyringe';
import { eq } from 'drizzle-orm';
import { FeatureFlagEntity } from '@/domain/feature-flag';
import { IFeatureFlagRepository } from '@/domain/feature-flag';
import { featureFlagsTable } from './schema';
import { FeatureFlagMapper } from '@/application/feature-flag';
import { DatabaseConnection } from '@/infrastructure/shared';

@injectable()
export class FeatureFlagRepositoryImpl implements IFeatureFlagRepository {
  private db = DatabaseConnection.getInstance();

  async findById(id: string): Promise<FeatureFlagEntity | null> {
    const result = await this.db
      .select()
      .from(featureFlagsTable)
      .where(eq(featureFlagsTable.id, id))
      .limit(1);

    if (!result[0]) return null;
    return FeatureFlagMapper.toDomain(result[0]);
  }

  async findByName(name: string): Promise<FeatureFlagEntity | null> {
    const result = await this.db
      .select()
      .from(featureFlagsTable)
      .where(eq(featureFlagsTable.name, name))
      .limit(1);

    if (!result[0]) return null;
    return FeatureFlagMapper.toDomain(result[0]);
  }

  async findAll(): Promise<FeatureFlagEntity[]> {
    const results = await this.db
      .select()
      .from(featureFlagsTable)
      .orderBy(featureFlagsTable.createdAt);

    return results.map((flag) => FeatureFlagMapper.toDomain(flag));
  }

  async create(flag: FeatureFlagEntity): Promise<FeatureFlagEntity> {
    const persistenceModel = FeatureFlagMapper.toPersistence(flag);
    const result = await this.db
      .insert(featureFlagsTable)
      .values({
        id: persistenceModel.id!,
        name: persistenceModel.name!,
        type: persistenceModel.type!,
        value: persistenceModel.value!,
        description: persistenceModel.description,
        createdAt: persistenceModel.createdAt,
        updatedAt: persistenceModel.updatedAt,
      })
      .returning();

    return FeatureFlagMapper.toDomain(result[0]);
  }

  async update(id: string, flag: FeatureFlagEntity): Promise<FeatureFlagEntity> {
    const safeUpdates: Record<string, string | Date> = {};

    if (flag.value) safeUpdates.value = flag.value;
    if (flag.description) safeUpdates.description = flag.description;
    safeUpdates.updatedAt = new Date();

    const result = await this.db
      .update(featureFlagsTable)
      .set(safeUpdates)
      .where(eq(featureFlagsTable.id, id))
      .returning();

    return FeatureFlagMapper.toDomain(result[0]);
  }

  async delete(id: string): Promise<void> {
    await this.db.delete(featureFlagsTable).where(eq(featureFlagsTable.id, id));
  }
}
