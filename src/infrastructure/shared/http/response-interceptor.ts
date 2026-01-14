import type { FastifyRequest, FastifyReply } from 'fastify';

export async function responseInterceptor(
  request: FastifyRequest,
  reply: FastifyReply,
  payload: any
): Promise<string> {
  let parsedPayload = payload;
  if (typeof payload === 'string') {
    try {
      parsedPayload = JSON.parse(payload);
    } catch {
      parsedPayload = payload;
    }
  }

  if (
    reply.sent ||
    (parsedPayload && typeof parsedPayload === 'object' && 'success' in parsedPayload)
  ) {
    return typeof parsedPayload === 'string' ? parsedPayload : JSON.stringify(parsedPayload);
  }

  if (reply.statusCode >= 200 && reply.statusCode < 300) {
    const successResponse = {
      success: true,
      data: parsedPayload,
    };
    return JSON.stringify(successResponse);
  }

  if (parsedPayload && typeof parsedPayload === 'object') {
    if (parsedPayload.error && typeof parsedPayload.error === 'object') {
      return JSON.stringify(parsedPayload);
    }
    if (parsedPayload.code && parsedPayload.message) {
      return JSON.stringify({
        success: false,
        error: {
          code: parsedPayload.code,
          message: parsedPayload.message,
        },
      });
    }
  }

  return typeof parsedPayload === 'string' ? parsedPayload : JSON.stringify(parsedPayload);
}
