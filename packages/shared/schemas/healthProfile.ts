import { z } from 'zod';
import { ConditionEnum, AgeGroupEnum, LanguageEnum } from '../enums';

// Time-of-day fields are stored as "HH:mm" or "HH:mm:ss" strings.
// These were previously missing from this schema entirely, which meant
// they were silently stripped by Zod's default "strip unknown keys"
// behavior before ever reaching the database update.
const timeField = z
  .string()
  .regex(/^([0-1]?[0-9]|2[0-3]):[0-5][0-9](:[0-5][0-9])?$/, 'Invalid time format')
  .optional()
  .nullable();

// The base object, kept separate (and extendable) from the refined version
// below so consumers that need to override individual fields (e.g. a
// stricter HH:mm-only regex for a specific form) can call `.extend()` on
// it and re-apply their own `.refine()` afterward.
export const healthProfileBaseSchema = z.object({
  condition: ConditionEnum,
  ageGroup: AgeGroupEnum.optional().nullable(),
  language: LanguageEnum.default('BN'),
  breakfastTime: timeField,
  lunchTime: timeField,
  dinnerTime: timeField,
  snackTime: timeField,
});

export const healthProfileSchema = healthProfileBaseSchema.refine(
  (data) => data.condition !== 'CHILD' || (data.condition === 'CHILD' && !!data.ageGroup),
  {
    message: "ageGroup is required when condition is 'CHILD'",
    path: ['ageGroup'],
  }
);
