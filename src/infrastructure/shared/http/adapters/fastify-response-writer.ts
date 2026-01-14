import { FastifyReply } from 'fastify';
import { IResponseWriter } from '@/domain/shared';

export class FastifyResponseWriter implements IResponseWriter {
  constructor(private reply: FastifyReply & { sse: any }) {}

  async stream(dataGenerator: AsyncIterable<string>): Promise<void> {
    for await (const data of dataGenerator) {
      await this.reply.sse.send(JSON.parse(data));
    }
  }

  async send(data: any): Promise<void> {
    this.reply.send(data);
  }

  status(code: number): this {
    this.reply.status(code);
    return this;
  }

  getRawReply<T>(): T {
    return this.reply as T;
  }
}
