import 'reflect-metadata';
import { METADATA_KEY } from './metadata';

export const Controller = (prefix: string = ''): ClassDecorator => {
  return (target: Function) => {
    Reflect.defineMetadata(METADATA_KEY.controller, prefix, target);
    if (!Reflect.hasMetadata(METADATA_KEY.routes, target)) {
      Reflect.defineMetadata(METADATA_KEY.routes, [], target);
    }
  };
};
