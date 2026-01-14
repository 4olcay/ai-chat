import { FastifyReply } from 'fastify';
import { ParameterMetadata } from '../decorators/parameter.decorators';
import { validateDto, formatValidationErrors } from '../../validation/validate';
import { ValidationError } from '@/core/errors';
import type { AuthenticatedRequest } from '../types';
import { parseLimitParam, parseOffsetParam } from '@/application/shared';

export interface IParameterStrategy {
  extract(
    request: AuthenticatedRequest,
    reply: FastifyReply,
    metadata: ParameterMetadata
  ): Promise<unknown>;
}

export class BodyParameterStrategy implements IParameterStrategy {
  async extract(
    request: AuthenticatedRequest,
    _reply: FastifyReply,
    metadata: ParameterMetadata
  ): Promise<unknown> {
    if (metadata.dto) {
      const validationResult = await validateDto(metadata.dto, request.body);
      if (!validationResult.isValid) {
        throw new ValidationError(formatValidationErrors(validationResult.errors || []));
      }
    }
    return request.body;
  }
}

export class QueryParameterStrategy implements IParameterStrategy {
  async extract(
    request: AuthenticatedRequest,
    _reply: FastifyReply,
    metadata: ParameterMetadata
  ): Promise<unknown> {
    if (metadata.dto) {
      const validationResult = await validateDto(metadata.dto, request.query);
      if (!validationResult.isValid) {
        throw new ValidationError(formatValidationErrors(validationResult.errors || []));
      }
    }
    return request.query;
  }
}

export class ParamsParameterStrategy implements IParameterStrategy {
  async extract(
    request: AuthenticatedRequest,
    _reply: FastifyReply,
    metadata: ParameterMetadata
  ): Promise<unknown> {
    if (metadata.dto) {
      const validationResult = await validateDto(metadata.dto, request.params);
      if (!validationResult.isValid) {
        throw new ValidationError(formatValidationErrors(validationResult.errors || []));
      }
    }
    return request.params;
  }
}

export class UserParameterStrategy implements IParameterStrategy {
  async extract(
    request: AuthenticatedRequest,
    _reply: FastifyReply,
    _metadata: ParameterMetadata
  ): Promise<unknown> {
    return request.user;
  }
}

export class RequestParameterStrategy implements IParameterStrategy {
  async extract(
    request: AuthenticatedRequest,
    _reply: FastifyReply,
    _metadata: ParameterMetadata
  ): Promise<unknown> {
    const res = request;
    return res;
  }
}

export class ReplyParameterStrategy implements IParameterStrategy {
  async extract(
    _request: AuthenticatedRequest,
    reply: FastifyReply,
    _metadata: ParameterMetadata
  ): Promise<unknown> {
    return reply;
  }
}

export class ClientParameterStrategy implements IParameterStrategy {
  async extract(
    request: AuthenticatedRequest,
    _reply: FastifyReply,
    _metadata: ParameterMetadata
  ): Promise<unknown> {
    return request.clientDetection;
  }
}

export class PaginationParameterStrategy implements IParameterStrategy {
  async extract(
    request: AuthenticatedRequest,
    _reply: FastifyReply,
    _metadata: ParameterMetadata
  ): Promise<unknown> {
    const query = request.query as Record<string, string | string[]>;
    const limit = parseLimitParam(query.limit);
    const offset = parseOffsetParam(query.offset);

    return {
      limit,
      offset,
    };
  }
}
