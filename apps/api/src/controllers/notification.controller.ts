import { Request, Response, NextFunction } from 'express';
import { dispatchPendingNotifications } from '../services/notificationDispatch.js';

export const dispatchNotifications = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const count = await dispatchPendingNotifications();

    if (count === 0) {
      return res.status(200).json({ message: 'No pending notifications to dispatch.' });
    }

    res.status(200).json({ message: `Dispatched ${count} notifications.` });
  } catch (error) {
    next(error);
  }
};
