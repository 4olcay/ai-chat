import 'reflect-metadata';
import { FastifyInstance } from 'fastify';
import { container } from '../di';
import { logger } from '../logging';
import { METADATA_KEY, RouteDefinition } from './decorators/route.decorators';
import { createRouteHandler } from './route-handler.factory';
import {
  createAuthMiddleware,
  createClientDetectionMiddleware,
} from './middleware/middleware.config';
import { UserController } from '../../user/http';
import { ChatController } from '../../chat/http';
import { FeatureFlagController } from '../../feature-flag/http';

const apiPrefix = '/api';

function ensureString(value: string | symbol): string {
  return String(value);
}

function createControllerInstances(): any[] {
  const userController = container.resolve(UserController);
  const chatController = container.resolve(ChatController);
  const featureFlagController = container.resolve(FeatureFlagController);

  return [userController, chatController, featureFlagController];
}

export function bootstrapRoutes(app: FastifyInstance): void {
  logger.info('Starting route registration...');

  const controllerInstances = createControllerInstances();

  controllerInstances.forEach((controllerInstance: any) => {
    const controllerClass = controllerInstance.constructor;
    const controllerPrefix = Reflect.getMetadata(METADATA_KEY.controller, controllerClass);
    if (controllerPrefix === undefined) {
      return;
    }

    const routes = Reflect.getMetadata(METADATA_KEY.routes, controllerClass) as RouteDefinition[];
    if (!routes || routes.length === 0) {
      return;
    }

    routes.forEach((route: RouteDefinition) => {
      const fullPath = `${apiPrefix}${controllerPrefix}${route.path}`.replace(/\/+/g, '/');
      const handler = createRouteHandler(controllerInstance, String(route.methodName));

      const isPublic = Reflect.getMetadata(
        METADATA_KEY.public_route,
        controllerInstance,
        route.methodName
      );
      const isAuthenticated = Reflect.getMetadata(
        METADATA_KEY.authenticated_route,
        controllerInstance,
        route.methodName
      );
      const decoratorMiddlewares =
        Reflect.getMetadata(METADATA_KEY.middleware, controllerInstance, route.methodName) || [];

      const middleware: any[] = [];

      if (decoratorMiddlewares.includes('clientDetection')) {
        middleware.push(createClientDetectionMiddleware());
      }

      if (decoratorMiddlewares.includes('auth')) {
        middleware.push(createAuthMiddleware());
      } else if (isPublic) {
      } else if (isAuthenticated) {
        middleware.push(createAuthMiddleware());
      } else {
        middleware.push(createAuthMiddleware());
      }

      const routeOptions: any = { onRequest: middleware };

      app[route.requestMethod](fullPath, routeOptions, handler);

      const httpMethod = route.requestMethod.toUpperCase();
      const methodNameForLog = ensureString(route.methodName);
      logger.info(
        `Mapped {${httpMethod}, ${fullPath}} to ${controllerClass.name}.${methodNameForLog}`
      );
    });
  });

  logger.info('Route registration completed.');
}
