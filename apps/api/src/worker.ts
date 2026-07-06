import { Worker } from 'bullmq';
import { config } from './config/config.js';
import prisma from './lib/prisma.js';
import { NOTIFICATION_QUEUE_NAME } from './services/queue.js';
import { parseRedisConnection } from './lib/redisConnection.js';

const sendExpoPushNotification = async (
  token: string,
  title: string,
  body: string,
  data: Record<string, unknown> = {}
) => {
  const message = {
    to: token,
    sound: 'default',
    title,
    body,
    data,
  };

  try {
    const res = await fetch('https://exp.host/--/api/v2/push/send', {
      method: 'POST',
      headers: {
        Accept: 'application/json',
        'Accept-encoding': 'gzip, deflate',
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(message),
    });

    const responseBody = await res.json() as { errors?: any[] };
    if (responseBody.errors) {
      console.error('Expo push failed with errors:', responseBody.errors);
      return false;
    }
    // TODO: Check ticket status for "DeviceNotRegistered" and remove the token from DB.
    return true;
  } catch (error) {
    console.error('Error sending push notification:', error);
    return false;
  }
};

let worker: Worker<{ notificationId: string }> | null = null;

/**
 * Starts the BullMQ worker that processes queued notifications and sends
 * the actual push. Safe to call once per process — can run either as its
 * own standalone process (`npm run worker`, e.g. on a paid host with a
 * separate background-worker service) or in-process alongside the Express
 * server (see index.ts, gated by RUN_WORKER_INPROCESS) for free-tier hosts
 * that don't support a second service.
 */
export function startWorker() {
  if (worker) return worker;

  worker = new Worker<{ notificationId: string }>(
    NOTIFICATION_QUEUE_NAME,
    async (job) => {
      const { notificationId } = job.data;
      console.log(`Processing notification ${notificationId}`);

      const notification = await prisma.notification.findUnique({
        where: { id: notificationId },
        include: { user: true },
      });

      if (!notification || !notification.user.expoPushToken) {
        console.log(`Skipping notification ${notificationId}: not found or no push token.`);
        await prisma.notification.update({ where: { id: notificationId }, data: { status: 'FAILED' } });
        return;
      }

      // For now, we only handle PUSH notifications.
      if (notification.channel === 'PUSH') {
        const mealLabel = (notification.mealType || 'meal').toLowerCase();

        const success = await sendExpoPushNotification(
          notification.user.expoPushToken,
          `Time for ${mealLabel}!`,
          `It's time for your ${mealLabel}. Open Nevo to see the details.`,
          { type: notification.type, mealType: notification.mealType }
        );

        await prisma.notification.update({
          where: { id: notificationId },
          data: { status: success ? 'SENT' : 'FAILED', sentAt: new Date() },
        });
      }
    },
    {
      connection: parseRedisConnection(config.redis.url),
    }
  );

  worker.on('completed', (job) => {
    console.log(`${job.id} has completed!`);
  });

  worker.on('failed', (job, err) => {
    console.log(`${job?.id} has failed with ${err.message}`);
  });

  console.log('Notification worker started.');
  return worker;
}

// Allow `npm run worker` to still run this as its own standalone process,
// for anyone deploying api and worker as separate services.
const isMainModule = process.argv[1] && import.meta.url === `file://${process.argv[1]}`;
if (isMainModule) {
  startWorker();
}
