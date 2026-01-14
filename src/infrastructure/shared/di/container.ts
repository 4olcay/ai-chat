import 'reflect-metadata';
import { container as tsyContainer } from 'tsyringe';
import { CacheManager, EnhancedCacheManager, FeatureFlagCacheService } from '../cache/index';
import { IUserRepository } from '@/domain/user';
import { UserRepositoryImpl } from '../../user/persistence/user.repository.impl';
import { JWTService } from '../security';
import { IChatRepository } from '@/domain/chat';
import { ChatRepositoryImpl } from '../../chat/persistence/chat.repository.impl';
import { IFeatureFlagRepository } from '@/domain/feature-flag';
import { FeatureFlagRepositoryImpl } from '../../feature-flag/persistence';
import { ICompletionService } from '@/domain/completion';
import { MockCompletionService } from '../../completion';
import { ToolsManager, WeatherTool } from '../../tools';
import type { IAIToolsManager } from '@/domain/tools';
import { FastifyResponseWriterFactory } from '../http/adapters/fastify-response-writer.factory';
import { UserController } from '../../user/http';
import { ChatController } from '../../chat/http';
import { FeatureFlagController } from '../../feature-flag/http';
import {
  CreateUserUseCase,
  GetUserUseCase,
  UpdateUserUseCase,
  DeleteUserUseCase,
  LoginUseCase,
} from '@/application/user';
import { ICompletionStrategy, CompletionStrategy } from '@/application/chat';
import {
  GetUserChatsUseCase,
  GetChatHistoryUseCase,
  CreateChatUseCase,
  CreateCompletionUseCase,
  CreateMessageUseCase,
  DeleteChatUseCase,
} from '@/application/chat';
import {
  GetFlagUseCase,
  GetAllFlagsUseCase,
  GetMultipleFlagsUseCase,
  CreateFlagUseCase,
  ToggleFlagUseCase,
  UpdateFlagUseCase,
} from '@/application/feature-flag';

tsyContainer.registerSingleton(CacheManager);
tsyContainer.registerSingleton(EnhancedCacheManager);
tsyContainer.registerSingleton(FeatureFlagCacheService);
tsyContainer.registerSingleton(JWTService);
tsyContainer.registerSingleton(ToolsManager);
tsyContainer.registerSingleton(WeatherTool);
tsyContainer.registerSingleton(FastifyResponseWriterFactory);

tsyContainer.registerSingleton<IUserRepository>('IUserRepository', UserRepositoryImpl);
tsyContainer.registerSingleton<IChatRepository>('IChatRepository', ChatRepositoryImpl);
tsyContainer.registerSingleton<IFeatureFlagRepository>(
  'IFeatureFlagRepository',
  FeatureFlagRepositoryImpl
);
tsyContainer.registerSingleton<ICompletionService>('ICompletionService', MockCompletionService);
tsyContainer.registerSingleton<IAIToolsManager>('IAIToolsManager', ToolsManager);
tsyContainer.registerSingleton<ICompletionStrategy>('ICompletionStrategy', CompletionStrategy);

tsyContainer.registerSingleton(CreateUserUseCase);
tsyContainer.registerSingleton(GetUserUseCase);
tsyContainer.registerSingleton(UpdateUserUseCase);
tsyContainer.registerSingleton(DeleteUserUseCase);
tsyContainer.registerSingleton(LoginUseCase);

tsyContainer.registerSingleton(GetUserChatsUseCase);
tsyContainer.registerSingleton(GetChatHistoryUseCase);
tsyContainer.registerSingleton(CreateChatUseCase);
tsyContainer.registerSingleton(CreateCompletionUseCase);
tsyContainer.registerSingleton(CreateMessageUseCase);
tsyContainer.registerSingleton(DeleteChatUseCase);

tsyContainer.registerSingleton(GetFlagUseCase);
tsyContainer.registerSingleton(GetAllFlagsUseCase);
tsyContainer.registerSingleton(GetMultipleFlagsUseCase);
tsyContainer.registerSingleton(CreateFlagUseCase);
tsyContainer.registerSingleton(ToggleFlagUseCase);
tsyContainer.registerSingleton(UpdateFlagUseCase);

tsyContainer.registerSingleton(UserController);
tsyContainer.registerSingleton(ChatController);
tsyContainer.registerSingleton(FeatureFlagController);

const aiToolsManager = tsyContainer.resolve<IAIToolsManager>('IAIToolsManager');
const weatherToolInstance = tsyContainer.resolve(WeatherTool);
aiToolsManager.registerTool(weatherToolInstance);

export { tsyContainer as container };

export async function disposeContainer(): Promise<void> {
  const cacheManager = tsyContainer.resolve(CacheManager);
  if (cacheManager) {
    cacheManager.destroy();
  }
}
