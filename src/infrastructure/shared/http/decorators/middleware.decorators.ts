import 'reflect-metadata';
import { METADATA_KEY } from './metadata';

export type MiddlewareType = 'auth' | 'appCheck' | 'clientDetection' | 'logging';

export const Authenticated = (): MethodDecorator => {
  return (target, propertyKey: string | symbol) => {
    Reflect.defineMetadata(METADATA_KEY.authenticated_route, true, target, propertyKey);
  };
};

export const Public = (): MethodDecorator => {
  return (target, propertyKey: string | symbol) => {
    Reflect.defineMetadata(METADATA_KEY.public_route, true, target, propertyKey);
  };
};

export const Auth = (): MethodDecorator => {
  return (target, propertyKey: string | symbol) => {
    const middlewares = Reflect.getOwnMetadata(METADATA_KEY.middleware, target, propertyKey) || [];
    if (!middlewares.includes('auth')) {
      middlewares.push('auth');
    }
    Reflect.defineMetadata(METADATA_KEY.middleware, middlewares, target, propertyKey);
  };
};

export const AppCheck = (): MethodDecorator => {
  return (target, propertyKey: string | symbol) => {
    const middlewares = Reflect.getOwnMetadata(METADATA_KEY.middleware, target, propertyKey) || [];
    if (!middlewares.includes('appCheck')) {
      middlewares.push('appCheck');
    }
    Reflect.defineMetadata(METADATA_KEY.middleware, middlewares, target, propertyKey);
  };
};

export const ClientDetection = (): MethodDecorator => {
  return (target, propertyKey: string | symbol) => {
    const middlewares = Reflect.getOwnMetadata(METADATA_KEY.middleware, target, propertyKey) || [];
    if (!middlewares.includes('clientDetection')) {
      middlewares.push('clientDetection');
    }
    Reflect.defineMetadata(METADATA_KEY.middleware, middlewares, target, propertyKey);
  };
};

export const Logging = (): MethodDecorator => {
  return (target, propertyKey: string | symbol) => {
    const middlewares = Reflect.getOwnMetadata(METADATA_KEY.middleware, target, propertyKey) || [];
    if (!middlewares.includes('logging')) {
      middlewares.push('logging');
    }
    Reflect.defineMetadata(METADATA_KEY.middleware, middlewares, target, propertyKey);
  };
};
