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
  corsOrigins: (process.env.CORS_ORIGIN || '')
    .split(',')
    .map((origin) => origin.trim())
    .filter(Boolean),
  redis: {
    url: process.env.REDIS_URL!,
  },
  internalCronSecret: process.env.INTERNAL_CRON_SECRET!,
  // For free-tier hosts that don't support a separate background-worker
  // service (e.g. Render's free plan): run the BullMQ worker and the
  // notification dispatch scheduler inside this same process.
  runWorkerInProcess: process.env.RUN_WORKER_INPROCESS === 'true',
};

if (!config.jwt.secret || !config.jwt.refreshSecret || !config.redis.url || !config.internalCronSecret) {
  console.error('FATAL ERROR: One or more required environment variables are not defined: JWT_SECRET, JWT_REFRESH_SECRET, REDIS_URL, INTERNAL_CRON_SECRET');
  process.exit(1);
}