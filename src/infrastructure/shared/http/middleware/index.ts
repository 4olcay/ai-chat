export * from './app-check.middleware';
export * from './auth.middleware';
export * from './client-detection.middleware';
export * from './logging.middleware';
export { setupLoggingHook } from './logging.middleware';
export {
  createAppCheckMiddleware,
  createAuthMiddleware,
  createClientDetectionMiddleware,
  createLoggingMiddleware,
  type FastifyMiddleware,
} from './middleware.config';
