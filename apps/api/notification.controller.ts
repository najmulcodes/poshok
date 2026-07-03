import { Request, Response, NextFunction } from 'express';
import { Prisma } from '@prisma/client';
import prisma from '../../../lib/prisma.js';
import { notificationQueue } from '../../../lib/queue.js';

export const dispatchNotifications = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const pendingNotifications = await prisma.notification.findMany({
      where: {
        status: 'PENDING',
        scheduledAt: {
          lte: new Date(),
        },
      },
    });

    if (pendingNotifications.length === 0) {
      return res.status(200).json({ message: 'No pending notifications to dispatch.' });
    }

    for (const notification of pendingNotifications) {
      await notificationQueue.add('send-notification', { notificationId: notification.id }, { jobId: notification.id });
    }

    res.status(200).json({ message: `Dispatched ${pendingNotifications.length} notifications.` });
  } catch (error) {
    next(error);
  }
};