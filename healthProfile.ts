import { z } from 'zod';
import { ConditionEnum, AgeGroupEnum, LanguageEnum } from '../enums';

export const healthProfileSchema = z.object({
  condition: ConditionEnum,
  ageGroup: AgeGroupEnum.optional().nullable(),
  language: LanguageEnum.default('BN'),
}).refine(
  (data) => data.condition !== 'CHILD' || (data.condition === 'CHILD' && !!data.ageGroup),
  {
    message: "ageGroup is required when condition is 'CHILD'",
    path: ['ageGroup'],
  }
);