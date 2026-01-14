import { FastifyReply } from 'fastify';
import { ClientType } from '@/core/constants';
import type { ClientDetectionData } from '@/core/types';
import type { AuthenticatedRequest } from '../types';

export async function clientDetectionMiddleware(
  req: AuthenticatedRequest,
  _reply: FastifyReply
): Promise<void> {
  const userAgent = req.headers['user-agent'] || '';

  const clientType = detectClientType(userAgent);

  const clientDetectionData: ClientDetectionData = {
    clientType,
    userAgent,
    detectedAt: new Date(),
  };

  req.clientDetection = clientDetectionData;
}

function detectClientType(userAgent: string): ClientType {
  const ua = userAgent.toLowerCase();

  if (ua.includes('mobile') || ua.includes('android') || ua.includes('iphone')) {
    return ClientType.MOBILE;
  }

  if (ua.includes('windows') || ua.includes('linux') || ua.includes('darwin')) {
    return ClientType.DESKTOP;
  }

  return ClientType.WEB;
}
