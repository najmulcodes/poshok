import { z } from 'zod';

export const RoleEnum = z.enum(['USER', 'ADMIN']);
export const ConditionEnum = z.enum(['DIABETES', 'CARDIAC', 'GENERAL', 'CHILD']);
export const AgeGroupEnum = z.enum(['TWO_TO_FIVE', 'SIX_TO_TEN']);
export const LanguageEnum = z.enum(['EN', 'BN']);
export const MealTypeEnum = z.enum(['BREAKFAST', 'LUNCH', 'DINNER', 'SNACK']);