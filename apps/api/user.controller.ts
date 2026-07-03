import { Request, Response, NextFunction } from 'express';
import prisma from '../lib/prisma.js';

export const getMe = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const today = new Date();
    today.setUTCHours(0, 0, 0, 0);

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
            dietPlan: {
              include: {
                meals: {
                  orderBy: {
                    order: 'asc',
                  },
                },
              },
            },
          }
        },
        mealCompletions: {
          where: {
            completedOn: today,
          },
          select: { mealId: true }
        }
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

export const toggleMealCompletion = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const userId = req.user!.userId;
    const { mealId } = req.body;

    if (!mealId) {
      return res.status(400).json({ message: 'mealId is required' });
    }

    const today = new Date();
    today.setUTCHours(0, 0, 0, 0);

    const existingCompletion = await prisma.mealCompletion.findUnique({
      where: {
        userId_mealId_completedOn: {
          userId,
          mealId,
          completedOn: today,
        },
      },
    });

    if (existingCompletion) {
      await prisma.mealCompletion.delete({ where: { id: existingCompletion.id } });
      res.status(200).json({ completed: false });
    } else {
      await prisma.mealCompletion.create({
        data: { userId, mealId, completedOn: today },
      });
      res.status(201).json({ completed: true });
    }
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

export const getFavoritePlans = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const userId = req.user!.userId;
    const favorites = await prisma.favoriteDietPlan.findMany({
      where: { userId },
      include: {
        dietPlan: {
          select: {
            id: true,
            titleEn: true,
            titleBn: true,
            condition: true,
            ageGroup: true,
          },
        },
      },
      orderBy: { createdAt: 'desc' },
    });
    res.status(200).json(favorites.map(fav => fav.dietPlan));
  } catch (error) {
    next(error);
  }
};