import { z } from 'zod';
import { Condition, AgeGroup, Language } from '@prisma/client';

export const healthProfileSchema = z.object({
  condition: z.nativeEnum(Condition),
  ageGroup: z.nativeEnum(AgeGroup).optional().nullable(),
  language: z.nativeEnum(Language).default('BN'),
}).refine(
  (data) => data.condition !== 'CHILD' || (data.condition === 'CHILD' && !!data.ageGroup),
  {
    message: "ageGroup is required when condition is 'CHILD'",
    path: ['ageGroup'],
  }
);
