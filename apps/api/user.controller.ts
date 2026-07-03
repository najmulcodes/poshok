import { Request, Response, NextFunction } from 'express';
import prisma from '../../../lib/prisma.js';

export const getMe = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const user = await prisma.user.findUnique({
      where: { id: req.user!.userId },
      select: {
        id: true,
        email: true,
        role: true,
        createdAt: true,
        healthProfile: true, // Include health profile
        subscriptions: { // Include active subscriptions
          orderBy: {
            subscribedAt: 'desc'
          },
          include: {
            dietPlan: true,
          }
        },
      }
    });

    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    res.status(200).json(user);
  } catch (error) {
    next(error);
  }
};

export const updateHealthProfile = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const userId = req.user!.userId;
    const profileData = req.body;

    const healthProfile = await prisma.healthProfile.upsert({
      where: { userId },
      update: profileData,
      create: {
        ...profileData,
        userId,
      },
    });

    res.status(200).json(healthProfile);
  } catch (error) {
    next(error);
  }
};

export const saveExpoPushToken = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const userId = req.user!.userId;
    const { token } = req.body;

    await prisma.user.update({
      where: { id: userId },
      data: { expoPushToken: token },
    });

    res.status(204).send();
  } catch (error) {
    next(error);
  }
};