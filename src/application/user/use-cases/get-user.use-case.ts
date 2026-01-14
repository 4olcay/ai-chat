import { injectable, inject } from 'tsyringe';
import type { IUserRepository } from '@/domain/user';
import { UserNotFoundError } from '@/core/errors';
import { UserResponse } from '../dtos/user.dto';
import { UserMapper } from '../mappers/user.mapper';

@injectable()
export class GetUserUseCase {
  constructor(
    @inject('IUserRepository')
    private userRepository: IUserRepository
  ) {}

  async execute(userId: string): Promise<UserResponse> {
    const user = await this.userRepository.findById(userId);
    if (!user) {
      throw new UserNotFoundError(userId);
    }
    return UserMapper.toDTO(user);
  }
}
