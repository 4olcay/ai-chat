import { FastifyRequest, FastifyReply } from 'fastify';
import { PARAMETER_METADATA_KEY, ParameterMetadata, ParameterType } from './decorators';
import { ParameterStrategyFactory } from './parameter-strategies';

export function createRouteHandler(controllerInstance: any, methodName: string) {
  const originalMethod = controllerInstance[methodName];

  return async (request: FastifyRequest, reply: FastifyReply) => {
    (request as any).reply = reply;

    let parametersMetadata: ParameterMetadata[] =
      Reflect.getOwnMetadata(PARAMETER_METADATA_KEY, controllerInstance, methodName) || [];

    if (parametersMetadata.length === 0) {
      parametersMetadata =
        Reflect.getMetadata(PARAMETER_METADATA_KEY, controllerInstance, methodName) || [];
    }

    const args: any[] = [];

    const requestInjection = parametersMetadata.some((meta) => meta.type === ParameterType.REQUEST)
      ? request
      : null;
    const replyInjection =
      requestInjection !== null &&
      parametersMetadata.some((meta) => meta.type === ParameterType.REPLY)
        ? reply
        : null;

    for (const meta of parametersMetadata) {
      if (meta.type !== ParameterType.REQUEST && meta.type !== ParameterType.REPLY) {
        const strategy = ParameterStrategyFactory.getStrategy(meta.type);
        args[meta.index] = await strategy.extract(request, reply, meta);
      }

      if (meta.type === ParameterType.REQUEST && meta.index !== 0) {
        throw new Error(`Request parameter must be the first parameter (index 0)`);
      }

      if (meta.type === ParameterType.REPLY && meta.index !== 1) {
        throw new Error(`Reply parameter must be the second parameter (index 1)`);
      }
    }

    const nonEmptyArgs = args.filter((arg) => arg !== null);
    return originalMethod.apply(
      controllerInstance,
      [requestInjection, replyInjection, ...nonEmptyArgs].filter((arg) => arg !== null)
    );
  };
}
