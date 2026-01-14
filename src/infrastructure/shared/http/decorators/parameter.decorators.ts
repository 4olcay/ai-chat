import 'reflect-metadata';
import { ClassConstructor } from 'class-transformer';

export enum ParameterType {
  BODY,
  QUERY,
  PARAMS,
  USER,
  REQUEST,
  REPLY,
  CLIENT,
  PAGINATION,
}

export const PARAMETER_METADATA_KEY = Symbol('parameterMetadata');

export interface ParameterMetadata {
  index: number;
  type: ParameterType;
  dto?: ClassConstructor<object>;
}

function decoratorFactory(type: ParameterType) {
  return (dto?: ClassConstructor<object>): ParameterDecorator => {
    return (target: object, propertyKey: string | symbol | undefined, parameterIndex: number) => {
      if (!propertyKey) {
        return;
      }

      const existingParameters: ParameterMetadata[] =
        Reflect.getOwnMetadata(PARAMETER_METADATA_KEY, target, propertyKey) || [];

      const paramMetadata: ParameterMetadata = {
        index: parameterIndex,
        type,
      };
      if (dto) {
        paramMetadata.dto = dto;
      }
      existingParameters.push(paramMetadata);

      Reflect.defineMetadata(PARAMETER_METADATA_KEY, existingParameters, target, propertyKey);
    };
  };
}

export const GetBody = decoratorFactory(ParameterType.BODY);
export const GetQuery = decoratorFactory(ParameterType.QUERY);
export const GetParams = decoratorFactory(ParameterType.PARAMS);
export const GetUser = decoratorFactory(ParameterType.USER);
export const GetRequest = decoratorFactory(ParameterType.REQUEST);
export const GetReply = decoratorFactory(ParameterType.REPLY);
export const GetClient = decoratorFactory(ParameterType.CLIENT);
export const GetPagination = decoratorFactory(ParameterType.PAGINATION);
