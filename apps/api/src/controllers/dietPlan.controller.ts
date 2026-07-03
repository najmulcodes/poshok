import { Request, Response, NextFunction } from 'express';
import { Prisma } from '@prisma/client';
import prisma from '../lib/prisma.js';
import { listDietPlansQuerySchema } from 'shared';

// === ADMIN CONTROLLERS ===

export const getAllDietPlans = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const dietPlans = await prisma.dietPlan.findMany({
      select: {
        id: true,
        condition: true,
        ageGroup: true,
        titleEn: true,
        titleBn: true,
        version: true,
        isPublished: true,
      },
      orderBy: { createdAt: 'desc' },
    });
    res.status(200).json(dietPlans);
  } catch (error) {
    next(error);
  }
};

export const getDietPlanByIdAdmin = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { id } = req.params;
    const dietPlan = await prisma.dietPlan.findUnique({
      where: { id },
      include: {
        meals: {
          orderBy: {
            order: 'asc',
          },
        },
      },
    });

    if (!dietPlan) {
      return res.status(404).json({ message: 'Diet plan not found' });
    }

    res.status(200).json(dietPlan);
  } catch (error) {
    next(error);
  }
};

export const createDietPlan = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { meals, ...planData } = req.body;
    const adminId = req.user!.userId;

    const dietPlan = await prisma.dietPlan.create({
      data: {
        ...planData,
        createdById: adminId,
        meals: {
          create: meals,
        },
      },
      include: {
        meals: true,
      },
    });

    res.status(201).json(dietPlan);
  } catch (error) {
    next(error);
  }
};

export const updateDietPlan = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { id } = req.params;
    const { meals, ...planData } = req.body;

    const existingPlan = await prisma.dietPlan.findUnique({ where: { id } });

    if (!existingPlan) {
      return res.status(404).json({ message: 'Diet plan not found' });
    }

    // IMPORTANT: Per spec, never mutate a published plan.
    if (existingPlan.isPublished) {
      return res.status(403).json({ message: 'Cannot update a published plan. Create a new version instead.' });
    }

    const updatedPlan = await prisma.$transaction(async (tx) => {
      if (meals && meals.length > 0) {
        // Delete old meals and create new ones
        await tx.meal.deleteMany({ where: { dietPlanId: id } });
      }

      return tx.dietPlan.update({
        where: { id },
        data: {
          ...planData,
          meals: meals ? { create: meals } : undefined,
        },
        include: {
          meals: true,
        },
      });
    });

    res.status(200).json(updatedPlan);
  } catch (error) {
    next(error);
  }
};

export const publishDietPlan = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { id } = req.params;
    const plan = await prisma.dietPlan.update({
      where: { id },
      data: { isPublished: true },
    });
    res.status(200).json(plan);
  } catch (error) {
    if (error instanceof Prisma.PrismaClientKnownRequestError && error.code === 'P2025') {
      return res.status(404).json({ message: 'Diet plan not found' });
    }
    next(error);
  }
};

export const toggleFavoritePlan = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { id: dietPlanId } = req.params;
    const userId = req.user!.userId;

    const existingFavorite = await prisma.favoriteDietPlan.findUnique({
      where: { userId_dietPlanId: { userId, dietPlanId } },
    });

    if (existingFavorite) {
      await prisma.favoriteDietPlan.delete({ where: { id: existingFavorite.id } });
      res.status(200).json({ favorited: false });
    } else {
      await prisma.favoriteDietPlan.create({ data: { userId, dietPlanId } });
      res.status(201).json({ favorited: true });
    }
  } catch (error) {
    next(error);
  }
};

// === PUBLIC & USER CONTROLLERS ===

export const getPublishedDietPlans = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { q, ...query } = listDietPlansQuerySchema.parse(req.query);

    const where: Prisma.DietPlanWhereInput = {
      isPublished: true,
      ...query,
    };

    // If a search query 'q' is provided, add a filter condition.
    if (q) {
      where.OR = [
        { titleEn: { contains: q, mode: 'insensitive' } },
        { titleBn: { contains: q, mode: 'insensitive' } },
      ];
    }

    const dietPlans = await prisma.dietPlan.findMany({
      where,
      select: {
        id: true,
        condition: true,
        ageGroup: true,
        titleEn: true,
        titleBn: true,
        version: true,
      },
      orderBy: {
        createdAt: 'desc',
      },
    });

    res.status(200).json(dietPlans);
  } catch (error) {
    next(error);
  }
};

export const getDietPlanById = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { id } = req.params;
    const userId = req.user?.userId;
    const dietPlan = await prisma.dietPlan.findFirst({
      where: { id, isPublished: true },
      include: {
        meals: {
          orderBy: {
            order: 'asc',
          },
        },
      },
    });

    if (!dietPlan) {
      return res.status(404).json({ message: 'Published diet plan not found' });
    }

    let isFavorited = false;
    if (userId) {
      const favorite = await prisma.favoriteDietPlan.findUnique({
        where: { userId_dietPlanId: { userId, dietPlanId: id } },
      });
      isFavorited = !!favorite;
    }

    res.status(200).json({ ...dietPlan, isFavorited });
  } catch (error) {
    next(error);
  }
};

export const subscribeToPlan = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { id: dietPlanId } = req.params;
    const userId = req.user!.userId;

    // Ensure the plan exists and is published before allowing subscription
    const plan = await prisma.dietPlan.findFirst({
      where: { id: dietPlanId, isPublished: true },
    });

    if (!plan) {
      return res.status(404).json({ message: 'Published diet plan not found' });
    }

    const subscription = await prisma.planSubscription.create({
      data: {
        userId,
        dietPlanId,
      },
    });

    // --- Create Meal Reminders for the next 7 days ---
    const userProfile = await prisma.healthProfile.findUnique({ where: { userId } });

    const defaultTimes = {
      BREAKFAST: '08:00:00',
      LUNCH: '13:00:00',
      DINNER: '20:00:00',
      SNACK: '16:00:00',
    };

    const mealTypesInPlan = await prisma.meal.findMany({
      where: { dietPlanId },
      select: { mealType: true },
      distinct: ['mealType']
    });

    const notificationsToCreate = [];
    for (let i = 0; i < 7; i++) { // For the next 7 days
      const day = new Date();
      day.setDate(day.getDate() + i);

      for (const { mealType } of mealTypesInPlan) {
        const timePref = userProfile?.[`${mealType.toLowerCase()}Time` as keyof typeof userProfile] as string | undefined;
        const time = timePref || defaultTimes[mealType];
        const [hours, minutes] = time.split(':');

        const scheduledAt = new Date(day);
        scheduledAt.setHours(parseInt(hours, 10), parseInt(minutes, 10), 0, 0);

        notificationsToCreate.push({
          userId,
          type: 'MEAL_REMINDER' as const,
          channel: 'PUSH' as const,
          mealType,
          scheduledAt,
        });
      }
    }

    if (notificationsToCreate.length > 0) {
      await prisma.notification.createMany({
        data: notificationsToCreate,
      });
    }

    res.status(201).json(subscription);
  } catch (error) {
    if (error instanceof Prisma.PrismaClientKnownRequestError && error.code === 'P2002') {
      return res.status(409).json({ message: 'User is already subscribed to this plan' });
    }
    next(error);
  }
};