import { injectable } from 'tsyringe';
import { eq } from 'drizzle-orm';
import { usersTable } from './schema';
import { DatabaseConnection } from '@/infrastructure/shared/database/connection';
import { IUserRepository } from '@/domain/user/repositories/user.repository';
import { UserEntity } from '@/domain/user/entities/user.entity';
import { UserMapper } from '@/application/user/mappers/user.mapper';
import { NoValidUserFieldsError } from '@/core/errors';

@injectable()
export class UserRepositoryImpl implements IUserRepository {
  private db = DatabaseConnection.getInstance();

  async findById(id: string): Promise<UserEntity | null> {
    const result = await this.db.select().from(usersTable).where(eq(usersTable.id, id)).limit(1);

    if (!result[0]) return null;
    return UserMapper.toDomain(result[0]);
  }

  async findByEmail(email: string): Promise<UserEntity | null> {
    const result = await this.db
      .select()
      .from(usersTable)
      .where(eq(usersTable.email, email))
      .limit(1);

    if (!result[0]) return null;
    return UserMapper.toDomain(result[0]);
  }

  async findByEmailForAuth(email: string): Promise<{ id: string; password: string } | null> {
    const result = await this.db
      .select({ id: usersTable.id, password: usersTable.password })
      .from(usersTable)
      .where(eq(usersTable.email, email))
      .limit(1);

    return result[0] || null;
  }

  async exists(id: string): Promise<boolean> {
    const result = await this.db
      .select({ id: usersTable.id })
      .from(usersTable)
      .where(eq(usersTable.id, id))
      .limit(1);

    return result.length > 0;
  }

  async emailExists(email: string): Promise<boolean> {
    const result = await this.db
      .select({ id: usersTable.id })
      .from(usersTable)
      .where(eq(usersTable.email, email))
      .limit(1);

    return result.length > 0;
  }

  async create(entity: UserEntity): Promise<UserEntity> {
    const persistenceModel = UserMapper.toPersistence(entity);
    const result = await this.db
      .insert(usersTable)
      .values({
        id: persistenceModel.id!,
        email: persistenceModel.email!,
        name: persistenceModel.name!,
        password: persistenceModel.password!,
      })
      .returning();

    return UserMapper.toDomain(result[0]);
  }

  async update(id: string, entity: UserEntity): Promise<UserEntity> {
    const persistenceModel = UserMapper.toPersistence(entity);
    const safeUpdates: Record<string, string | Date> = {};

    if (persistenceModel.name) safeUpdates.name = persistenceModel.name;
    if (persistenceModel.email) safeUpdates.email = persistenceModel.email;
    if (persistenceModel.password) safeUpdates.password = persistenceModel.password;

    if (Object.keys(safeUpdates).length === 0) {
      throw new NoValidUserFieldsError();
    }

    safeUpdates.updatedAt = new Date();

    const result = await this.db
      .update(usersTable)
      .set(safeUpdates)
      .where(eq(usersTable.id, id))
      .returning();

    return UserMapper.toDomain(result[0]);
  }

  async delete(id: string): Promise<void> {
    await this.db.update(usersTable).set({ deletedAt: new Date() }).where(eq(usersTable.id, id));
  }

  async softDelete(id: string): Promise<void> {
    await this.db.update(usersTable).set({ deletedAt: new Date() }).where(eq(usersTable.id, id));
  }

  async restore(id: string): Promise<void> {
    await this.db.update(usersTable).set({ deletedAt: null }).where(eq(usersTable.id, id));
  }
}
