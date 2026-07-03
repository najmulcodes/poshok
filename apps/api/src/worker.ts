import { Worker } from 'bullmq';
import { config } from './config/config.js';
import prisma from './lib/prisma.js';
import { NOTIFICATION_QUEUE_NAME } from './services/queue.js';

console.log('Worker process started.');

const sendExpoPushNotification = async (token: string, title: string, body: string) => {
  const message = {
    to: token,
    sound: 'default',
    title,
    body,
    data: { withSome: 'data' },
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

    const data = await res.json() as { errors?: any[] };
    if (data.errors) {
      console.error('Expo push failed with errors:', data.errors);
      return false;
    }
    // TODO: Check ticket status for "DeviceNotRegistered" and remove the token from DB.
    return true;
  } catch (error) {
    console.error('Error sending push notification:', error);
    return false;
  }
};

const worker = new Worker<{ notificationId: string }>(
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
      const success = await sendExpoPushNotification(
        notification.user.expoPushToken,
        `Time for your meal!`,
        `It's time to have your meal. Open Nevo to see the details.`
      );

      await prisma.notification.update({
        where: { id: notificationId },
        data: { status: success ? 'SENT' : 'FAILED', sentAt: new Date() },
      });
    }
  },
  {
    connection: {
      host: new URL(config.redis.url).hostname,
      port: Number(new URL(config.redis.url).port),
    }
  }
);

worker.on('completed', (job) => {
  console.log(`${job.id} has completed!`);
});

worker.on('failed', (job, err) => {
  console.log(`${job?.id} has failed with ${err.message}`);
});