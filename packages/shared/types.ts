import { z } from 'zod';
import { healthProfileSchema } from './schemas/healthProfile';
import { mealSchema } from './schemas/dietPlan';
import { RoleEnum, ConditionEnum, AgeGroupEnum, LanguageEnum, MealTypeEnum } from './enums';

export type Role = z.infer<typeof RoleEnum>;
export type Condition = z.infer<typeof ConditionEnum>;
export type AgeGroup = z.infer<typeof AgeGroupEnum>;
export type Language = z.infer<typeof LanguageEnum>;
export type MealType = z.infer<typeof MealTypeEnum>;

// This represents the shape of the data returned from the API
export type HealthProfile = z.infer<typeof healthProfileSchema> & { id: string; userId: string; updatedAt: string; };

export interface JwtPayload {
  userId: string;
  role: Role;
}

export type Meal = z.infer<typeof mealSchema>;