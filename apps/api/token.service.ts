import jwt from 'jsonwebtoken';
import { JwtPayload } from 'shared';
import { config } from './config/config.js';

export const REFRESH_TOKEN_COOKIE_NAME = 'nevo_refresh_token';

export const generateTokens = (payload: JwtPayload) => {
  const accessToken = jwt.sign(payload, config.jwt.secret, {
    expiresIn: config.jwt.accessTokenExpiresIn,
  });

  const refreshToken = jwt.sign(payload, config.jwt.refreshSecret, {
    expiresIn: config.jwt.refreshTokenExpiresIn,
  });

  return { accessToken, refreshToken };
};

export const verifyAccessToken = (token: string): JwtPayload => jwt.verify(token, config.jwt.secret) as JwtPayload;

export const verifyRefreshToken = (token: string): JwtPayload => jwt.verify(token, config.jwt.refreshSecret) as JwtPayload;