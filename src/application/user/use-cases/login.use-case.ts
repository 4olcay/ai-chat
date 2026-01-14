import { injectable, inject, delay } from 'tsyringe';
import bcrypt from 'bcrypt';
import { IUserRepository } from '@/domain/user';
import { JWTService } from '@/infrastructure/shared';
import { InvalidCredentialsError } from '@/core/errors';
import { LoginRequest } from '../dtos/user.dto';

export interface LoginResponse {
  token: string;
}

@injectable()
export class LoginUseCase {
  constructor(
    @inject('IUserRepository') private userRepository: IUserRepository,
    @inject(delay(() => JWTService)) private jwtService: JWTService
  ) {}

  async execute(request: LoginRequest): Promise<LoginResponse> {
    const userAuth = await this.userRepository.findByEmailForAuth(request.email);
    if (!userAuth) {
      throw new InvalidCredentialsError();
    }

    const isPasswordValid = await bcrypt.compare(request.password, userAuth.password);
    if (!isPasswordValid) {
      throw new InvalidCredentialsError();
    }

    const token = this.jwtService.generateToken(userAuth.id, request.email);
    return {
      token,
    };
  }
}
