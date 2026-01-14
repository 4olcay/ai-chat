import { EnvironmentConfig, loadAndValidateEnv, NodeEnv, LogLevel } from './env.config';

class AppConfig {
  private static instance: AppConfig;
  private config: EnvironmentConfig;

  private constructor() {
    this.config = loadAndValidateEnv();
  }

  static getInstance(): AppConfig {
    if (!AppConfig.instance) {
      AppConfig.instance = new AppConfig();
    }
    return AppConfig.instance;
  }

  getPort(): number {
    return this.config.PORT;
  }

  getHost(): string {
    return this.config.HOST;
  }

  getNodeEnv(): NodeEnv {
    return this.config.NODE_ENV;
  }

  isDevelopment(): boolean {
    return this.config.NODE_ENV === NodeEnv.DEVELOPMENT;
  }

  isProduction(): boolean {
    return this.config.NODE_ENV === NodeEnv.PRODUCTION;
  }

  getDatabaseUrl(): string {
    return this.config.DATABASE_URL;
  }

  getJwtSecret(): string {
    return this.config.JWT_SECRET;
  }

  getFirebaseAppCheckSecret(): string {
    return this.config.FIREBASE_APP_CHECK_SECRET;
  }

  getLogLevel(): LogLevel {
    return this.config.LOG_LEVEL;
  }

  getRawConfig(): Readonly<EnvironmentConfig> {
    return Object.freeze({ ...this.config });
  }
}

export const appConfig = AppConfig.getInstance();
