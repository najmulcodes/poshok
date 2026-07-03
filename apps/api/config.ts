import dotenv from 'dotenv';
import path from 'path';

// Load .env file from the root of the 'api' workspace
dotenv.config({ path: path.resolve(process.cwd(), '.env') });

export const config = {
  port: process.env.PORT || 3001,
  jwt: {
    secret: process.env.JWT_SECRET!,
    refreshSecret: process.env.JWT_REFRESH_SECRET!,
    accessTokenExpiresIn: process.env.ACCESS_TOKEN_EXPIRES_IN || '15m',
    refreshTokenExpiresIn: process.env.REFRESH_TOKEN_EXPIRES_IN || '7d',
  },
  isProduction: process.env.NODE_ENV === 'production',
};

if (!config.jwt.secret || !config.jwt.refreshSecret) {
  console.error('FATAL ERROR: JWT secrets are not defined in .env file.');
  process.exit(1);
}