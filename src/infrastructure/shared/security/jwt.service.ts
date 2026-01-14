import { injectable } from 'tsyringe';
import jwt from 'jsonwebtoken';
import { appConfig } from '../config';

export interface JWTPayload {
  userId: string;
  email: string;
}

@injectable()
export class JWTService {
  generateToken(userId: string, email: string): string {
    const secret = appConfig.getJwtSecret();
    return jwt.sign({ userId, email }, secret, { expiresIn: '24h' });
  }

  verifyToken(token: string): JWTPayload {
    const secret = appConfig.getJwtSecret();
    return jwt.verify(token, secret) as JWTPayload;
  }
}
