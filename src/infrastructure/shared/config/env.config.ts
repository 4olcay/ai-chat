import { plainToInstance, Type } from 'class-transformer';
import {
  IsString,
  IsNumber,
  IsEnum,
  IsOptional,
  Min,
  Max,
  MinLength,
  validateSync,
} from 'class-validator';
import { configLogger } from './config-logger';

export enum NodeEnv {
  DEVELOPMENT = 'development',
  PRODUCTION = 'production',
  TEST = 'test',
}

export enum LogLevel {
  DEBUG = 'debug',
  INFO = 'info',
  WARN = 'warn',
  ERROR = 'error',
}

export class EnvironmentConfig {
  @IsEnum(NodeEnv)
  @IsOptional()
  NODE_ENV: NodeEnv = NodeEnv.DEVELOPMENT;

  @IsOptional()
  @Type(() => Number)
  @IsNumber()
  @Min(1)
  @Max(65535)
  PORT: number = 3000;

  @IsString()
  @IsOptional()
  HOST: string = 'localhost';

  @IsString()
  DATABASE_URL!: string;

  @IsString()
  @MinLength(32, { message: 'JWT_SECRET must be at least 32 characters long' })
  JWT_SECRET!: string;

  @IsString()
  FIREBASE_APP_CHECK_SECRET!: string;

  @IsEnum(LogLevel)
  @IsOptional()
  LOG_LEVEL: LogLevel = LogLevel.INFO;

  @IsOptional()
  ENABLE_MOCK_AUTH?: boolean;
}

export function loadAndValidateEnv(): EnvironmentConfig {
  const config = plainToInstance(EnvironmentConfig, process.env, {
    enableImplicitConversion: true,
  });

  const errors = validateSync(config, {
    skipMissingProperties: false,
    whitelist: true,
  });

  if (errors.length > 0) {
    const errorMessages = errors
      .map((error) => {
        const constraints = Object.values(error.constraints || {}).join(', ');
        return `${error.property}: ${constraints}`;
      })
      .join('\n');

    configLogger.error('Configuration Validation Errors:\n' + errorMessages);
    process.exit(1);
  }

  return config;
}
