import { injectable } from 'tsyringe';
import type { FastifyReply } from 'fastify';
import type { IResponseWriter, IResponseWriterFactory } from '@/domain/shared';
import { FastifyResponseWriter } from './fastify-response-writer';

@injectable()
export class FastifyResponseWriterFactory implements IResponseWriterFactory {
  create(reply: FastifyReply): IResponseWriter {
    return new FastifyResponseWriter(reply as any);
  }
}
