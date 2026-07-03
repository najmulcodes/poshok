import { z } from 'zod';

export const RoleEnum = z.enum(['USER', 'ADMIN']);
export type Role = z.infer<typeof RoleEnum>;

export const ConditionEnum = z.enum(['DIABETES', 'CARDIAC', 'GENERAL', 'CHILD']);
export type Condition = z.infer<typeof ConditionEnum>;

export const AgeGroupEnum = z.enum(['TWO_TO_FIVE', 'SIX_TO_TEN']);
export type AgeGroup = z.infer<typeof AgeGroupEnum>;

export const LanguageEnum = z.enum(['EN', 'BN']);
export type Language = z.infer<typeof LanguageEnum>;

export const MealTypeEnum = z.enum(['BREAKFAST', 'LUNCH', 'DINNER', 'SNACK']);
export type MealType = z.infer<typeof MealTypeEnum>;