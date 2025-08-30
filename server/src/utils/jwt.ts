import jwt from 'jsonwebtoken';
import { config } from '../config';

interface TokenPayload {
  userId: string;
  role: string;
}

export function signAccessToken(payload: TokenPayload): string {
  return jwt.sign(
    payload,
    config.JWT_ACCESS_SECRET as string,
    {
      expiresIn: config.JWT_ACCESS_EXPIRES_IN as string | number,
    } as jwt.SignOptions,
  );
}

export function signRefreshToken(payload: TokenPayload): string {
  return jwt.sign(
    payload,
    config.JWT_REFRESH_SECRET as string,
    {
      expiresIn: config.JWT_REFRESH_EXPIRES_IN as string | number,
    } as jwt.SignOptions,
  );
}

export function verifyAccessToken(token: string): TokenPayload {
  return jwt.verify(token, config.JWT_ACCESS_SECRET as string) as TokenPayload;
}

export function verifyRefreshToken(token: string): TokenPayload {
  return jwt.verify(token, config.JWT_REFRESH_SECRET as string) as TokenPayload;
}
