import type { IResponseWriter } from './response-writer.interface';
import type { FastifyReply } from 'fastify';

export interface IResponseWriterFactory {
  create(reply: FastifyReply): IResponseWriter;
}
