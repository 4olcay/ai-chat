import 'reflect-metadata';
import { injectable, inject } from 'tsyringe';
import { CreateUserDto, UpdateUserDto, UserResponse } from '@/application/user';
import { GetBody, GetUser } from '@/infrastructure/shared/http/decorators/parameter.decorators';
import {
  Controller,
  Post,
  Get,
  Patch,
  Delete,
  Public,
  Auth,
  ClientDetection,
} from '@/infrastructure/shared/http/decorators/route.decorators';
import type { UserPayload } from '@/core';
import {
  CreateUserUseCase,
  GetUserUseCase,
  UpdateUserUseCase,
  DeleteUserUseCase,
  LoginUseCase,
  LoginRequest,
  LoginResponse,
} from '@/application/user';

@injectable()
@Controller('/users')
export class UserController {
  constructor(
    @inject(CreateUserUseCase) private createUserUseCase: CreateUserUseCase,
    @inject(GetUserUseCase) private getUserUseCase: GetUserUseCase,
    @inject(UpdateUserUseCase) private updateUserUseCase: UpdateUserUseCase,
    @inject(DeleteUserUseCase) private deleteUserUseCase: DeleteUserUseCase,
    @inject(LoginUseCase) private loginUseCase: LoginUseCase
  ) {}

  @Post('/')
  @Public()
  @ClientDetection()
  async createUser(@GetBody(CreateUserDto) body: CreateUserDto): Promise<UserResponse> {
    return this.createUserUseCase.execute(body);
  }

  @Get('/me')
  @Auth()
  @ClientDetection()
  async getCurrentUser(@GetUser() user: UserPayload): Promise<UserResponse> {
    return this.getUserUseCase.execute(user.userId);
  }

  @Patch('/me')
  @Auth()
  @ClientDetection()
  async updateUser(
    @GetUser() user: UserPayload,
    @GetBody(UpdateUserDto) updates: UpdateUserDto
  ): Promise<UserResponse> {
    return this.updateUserUseCase.execute(user.userId, updates);
  }

  @Delete('/me')
  @Auth()
  @ClientDetection()
  async deleteUser(@GetUser() user: UserPayload): Promise<{ message: string }> {
    await this.deleteUserUseCase.execute(user.userId);
    return { message: 'User deleted successfully' };
  }

  @Post('/auth')
  @Public()
  async login(@GetBody(LoginRequest) body: LoginRequest): Promise<LoginResponse> {
    return this.loginUseCase.execute(body);
  }
}
