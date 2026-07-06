import prisma from '../lib/prisma.js';
import { notificationQueue } from './queue.js';

/**
 * Finds due, pending notifications and enqueues them for the worker to
 * actually send. Extracted from the /internal/dispatch-notifications route
 * handler so it can also be called on an in-process interval (see
 * index.ts's RUN_WORKER_INPROCESS path) without needing an HTTP round trip
 * to itself.
 */
export async function dispatchPendingNotifications(): Promise<number> {
  const pendingNotifications = await prisma.notification.findMany({
    where: {
      status: 'PENDING',
      scheduledAt: {
        lte: new Date(),
      },
    },
  });

  for (const notification of pendingNotifications) {
    await notificationQueue.add('send-notification', { notificationId: notification.id }, { jobId: notification.id });
  }

  return pendingNotifications.length;
}
