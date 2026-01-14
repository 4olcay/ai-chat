import { ClientType } from '../constants/index';

export interface ClientInfo {
  type: ClientType;
  userAgent?: string;
}

export interface ClientDetectionData {
  clientType: ClientType;
  userAgent?: string;
  detectedAt: Date;
}

export interface RequestContext {
  userId: string;
  clientInfo: ClientInfo;
  requestId: string;
  timestamp: Date;
}

export interface UserPayload {
  userId: string;
  email: string;
  iat: number;
  exp: number;
}
