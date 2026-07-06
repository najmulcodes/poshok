import { Queue } from 'bullmq';
import { config } from '../config/config.js';
import { parseRedisConnection } from '../lib/redisConnection.js';

export const NOTIFICATION_QUEUE_NAME = 'notifications';

export const notificationQueue = new Queue(NOTIFICATION_QUEUE_NAME, {
  connection: parseRedisConnection(config.redis.url),
});
