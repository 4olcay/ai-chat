import { injectable, inject } from 'tsyringe';
import type { IUserRepository } from '@/domain/user';
import { UserNotFoundError } from '@/core/errors';

@injectable()
export class DeleteUserUseCase {
  constructor(
    @inject('IUserRepository')
    private userRepository: IUserRepository
  ) {}

  async execute(userId: string): Promise<void> {
    const exists = await this.userRepository.exists(userId);
    if (!exists) {
      throw new UserNotFoundError(userId);
    }
    await this.userRepository.softDelete(userId);
  }
}
