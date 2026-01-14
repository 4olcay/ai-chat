export interface IResponseWriter {
  stream(data: AsyncIterable<string>): Promise<void>;
  send(data: unknown): Promise<void>;
  status(code: number): this;
  getRawReply<T>(): T;
}
