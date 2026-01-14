import { injectable, inject } from 'tsyringe';
import type { IUserRepository } from '@/domain/user';
import { UserAlreadyExistsError } from '@/core/errors';
import { CreateUserDto, UserResponse } from '../dtos/user.dto';
import { UserMapper } from '../mappers/user.mapper';
import { UserEntity } from '@/domain/user';

@injectable()
export class CreateUserUseCase {
  constructor(
    @inject('IUserRepository')
    private userRepository: IUserRepository
  ) {}

  async execute(dto: CreateUserDto): Promise<UserResponse> {
    const existingUser = await this.userRepository.emailExists(dto.email);
    if (existingUser) {
      throw new UserAlreadyExistsError(dto.email);
    }

    const hashedPassword = await UserEntity.hashPassword(dto.password);

    const userEntity = new UserEntity(undefined, dto.email, dto.name, hashedPassword);
    const savedEntity = await this.userRepository.create(userEntity);
    return UserMapper.toDTO(savedEntity);
  }
}
