import { z } from 'zod';
import { Condition, AgeGroup, MealType } from '@prisma/client';

export const mealSchema = z.object({
  mealType: z.nativeEnum(MealType),
  descriptionEn: z.string().min(1, 'English description is required.'),
  descriptionBn: z.string().min(1, 'Bangla description is required.'),
  calories: z.number().int().positive().optional(),
  order: z.number().int().min(1),
});

export const createDietPlanSchema = z.object({
  titleEn: z.string().min(1, 'English title is required.'),
  titleBn: z.string().min(1, 'Bangla title is required.'),
  condition: z.nativeEnum(Condition),
  ageGroup: z.nativeEnum(AgeGroup).optional().nullable(),
  meals: z.array(mealSchema).min(1, 'At least one meal is required.'),
});

export const updateDietPlanSchema = z.object({
  titleEn: z.string().min(1, 'English title is required.').optional(),
  titleBn: z.string().min(1, 'Bangla title is required.').optional(),
  condition: z.nativeEnum(Condition).optional(),
  ageGroup: z.nativeEnum(AgeGroup).optional().nullable(),
  meals: z.array(mealSchema).min(1, 'At least one meal is required.').optional(),
});

export const listDietPlansQuerySchema = z.object({
  condition: z.nativeEnum(Condition).optional(),
  ageGroup: z.nativeEnum(AgeGroup).optional(),
  q: z.string().optional(), // Add search query parameter
});

// Ensure that if condition is CHILD, ageGroup is provided.
export const createDietPlanRefinedSchema = createDietPlanSchema.refine(
  (data) => data.condition !== 'CHILD' || (data.condition === 'CHILD' && data.ageGroup),
  {
    message: "ageGroup is required when condition is 'CHILD'",
    path: ['ageGroup'],
  }
);