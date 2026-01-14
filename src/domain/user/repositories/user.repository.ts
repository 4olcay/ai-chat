import { UserEntity } from '../entities/user.entity';

export interface IUserRepository {
  findById(id: string): Promise<UserEntity | null>;
  findByEmail(email: string): Promise<UserEntity | null>;
  findByEmailForAuth(email: string): Promise<{ id: string; password: string } | null>;
  exists(id: string): Promise<boolean>;
  emailExists(email: string): Promise<boolean>;
  create(user: UserEntity): Promise<UserEntity>;
  update(id: string, user: UserEntity): Promise<UserEntity>;
  delete(id: string): Promise<void>;
  softDelete(id: string): Promise<void>;
  restore(id: string): Promise<void>;
}
