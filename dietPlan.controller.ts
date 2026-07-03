import { Request, Response, NextFunction } from 'express';
import { Prisma } from '@prisma/client';
import prisma from '../../../lib/prisma.js';
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

// === PUBLIC & USER CONTROLLERS ===

export const getPublishedDietPlans = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const query = listDietPlansQuerySchema.parse(req.query);

    const where: Prisma.DietPlanWhereInput = {
      isPublished: true,
      ...query,
    };

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

    res.status(200).json(dietPlan);
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

    res.status(201).json(subscription);
  } catch (error) {
    if (error instanceof Prisma.PrismaClientKnownRequestError && error.code === 'P2002') {
      return res.status(409).json({ message: 'User is already subscribed to this plan' });
    }
    next(error);
  }
};