import 'reflect-metadata';
import { METADATA_KEY } from './metadata';

export enum HttpMethod {
  GET = 'get',
  POST = 'post',
  PUT = 'put',
  DELETE = 'delete',
  PATCH = 'patch',
}

export interface RouteDefinition {
  path: string;
  requestMethod: HttpMethod;
  methodName: string | symbol;
}

const createRouteDecorator = (method: HttpMethod) => {
  return (path: string): MethodDecorator => {
    return (target, propertyKey: string | symbol, _descriptor: PropertyDescriptor) => {
      if (!Reflect.hasMetadata(METADATA_KEY.routes, target.constructor)) {
        Reflect.defineMetadata(METADATA_KEY.routes, [], target.constructor);
      }

      const routes = Reflect.getMetadata(
        METADATA_KEY.routes,
        target.constructor
      ) as RouteDefinition[];

      routes.push({
        requestMethod: method,
        path,
        methodName: propertyKey,
      });

      Reflect.defineMetadata(METADATA_KEY.routes, routes, target.constructor);
    };
  };
};

export const Get = createRouteDecorator(HttpMethod.GET);
export const Post = createRouteDecorator(HttpMethod.POST);
export const Put = createRouteDecorator(HttpMethod.PUT);
export const Delete = createRouteDecorator(HttpMethod.DELETE);
export const Patch = createRouteDecorator(HttpMethod.PATCH);
