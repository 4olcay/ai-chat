import { UserEntity } from '@/domain/user';
import { CreateUserDto, UpdateUserDto, UserResponse } from '../dtos/user.dto';
import type { UserPersistenceModel } from '@/application/shared';

export class UserMapper {
  static toDTO(entity: UserEntity): UserResponse {
    return {
      id: entity.id,
      email: entity.email,
      name: entity.name,
    };
  }

  static toDomainFromCreate(id: string, dto: CreateUserDto, hashedPassword: string): UserEntity {
    return new UserEntity(id, dto.email, dto.name, hashedPassword);
  }

  static toDomain(dbUser: UserPersistenceModel): UserEntity {
    return new UserEntity(dbUser.id, dbUser.email, dbUser.name, dbUser.password);
  }

  static toPersistence(entity: UserEntity): Partial<UserPersistenceModel> {
    return {
      id: entity.id,
      email: entity.email,
      name: entity.name,
      password: entity.password,
    };
  }

  static toPersistenceUpdate(
    updates: UpdateUserDto,
    hashedPassword?: string
  ): Record<string, unknown> {
    const result: Record<string, unknown> = {};

    if (updates.name) {
      result.name = updates.name;
    }

    if (hashedPassword) {
      result.password = hashedPassword;
    }

    return result;
  }
}
