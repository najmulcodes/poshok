import type { ConnectionOptions } from 'bullmq';

/**
 * Parses a Redis connection URL into a BullMQ/ioredis-compatible connection
 * object. Handles auth (username/password) and TLS — needed for Upstash and
 * most other managed Redis providers, which use `rediss://` with a password
 * in the URL. The previous version of this only extracted host+port and
 * silently dropped auth and TLS entirely, which works against a bare local
 * Redis but fails against any real hosted provider.
 */
export function parseRedisConnection(redisUrl: string): ConnectionOptions {
  const url = new URL(redisUrl);

  const connection: ConnectionOptions = {
    host: url.hostname,
    port: Number(url.port) || 6379,
  };

  if (url.password) {
    connection.password = decodeURIComponent(url.password);
  }
  if (url.username) {
    connection.username = decodeURIComponent(url.username);
  }

  // rediss:// (TLS) is what Upstash and most managed providers use.
  if (url.protocol === 'rediss:') {
    connection.tls = {};
  }

  return connection;
}
