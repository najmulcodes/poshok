import { Queue } from 'bullmq';
import { config } from '../config.js';

export const NOTIFICATION_QUEUE_NAME = 'notifications';

export const notificationQueue = new Queue(NOTIFICATION_QUEUE_NAME, {
  connection: {
    host: new URL(config.redis.url).hostname,
    port: Number(new URL(config.redis.url).port),
  }
});