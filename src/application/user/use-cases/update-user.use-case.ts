import { injectable, inject } from 'tsyringe';
import type { IUserRepository } from '@/domain/user';
import { UserNotFoundError, NoValidFieldsError } from '@/core/errors';
import { UpdateUserDto, UserResponse } from '../dtos/user.dto';
import { UserMapper } from '../mappers/user.mapper';
import { UserEntity } from '@/domain/user';

@injectable()
export class UpdateUserUseCase {
  constructor(
    @inject('IUserRepository')
    private userRepository: IUserRepository
  ) {}

  async execute(userId: string, dto: UpdateUserDto): Promise<UserResponse> {
    const user = await this.userRepository.findById(userId);
    if (!user) {
      throw new UserNotFoundError(userId);
    }

    if (!dto.name && !dto.password) {
      throw new NoValidFieldsError('User');
    }

    let newPassword = user.password;
    if (dto.password) {
      newPassword = await UserEntity.hashPassword(dto.password);
    }

    const updatedUser = new UserEntity(user.id, user.email, dto.name || user.name, newPassword);

    const saved = await this.userRepository.update(userId, updatedUser);
    return UserMapper.toDTO(saved);
  }
}
